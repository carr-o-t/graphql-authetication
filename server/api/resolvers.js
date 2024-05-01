const User = require("../models/User"); // Replace with your user model path
const { hashPassword, comparePasswords } = require("../utils/bcrypt"); // Replace with your hashing/comparison functions path
const { generateToken, verifyToken } = require("../utils/jwt"); // Replace with your token generation/verification functions path
const { GraphQLError } = require("graphql");

module.exports = {
  Query: {
    users: async () => {
      const users = await User.find().select("-password"); // Exclude password from user data
      return users;
    },
    me: async (parent, args, context) => {
      console.log(context);
      const token = context.req.headers.authorization || "";
      console.log(token);
      if (!token) {
        // Return null if not authenticated
        throw new GraphQLError("Missing header in request", {
          extensions: {
            code: "MISSING_AUTH_HEADER",
          },
        });
      }
      const { userId } = verifyToken(token);
      const user = await User.findById(userId).select("-password");
      return user;
    },
  },
  Mutation: {
    signup: async (parent, args) => {
      const { email, username } = args;
      const existingUserWithEmail = await User.findOne({ email: email });
      if (existingUserWithEmail) {
        console.log("email exists");
        throw new GraphQLError("User with this email already exists", {
          extensions: {
            code: "USER_ALREADY_EXISTS",
          },
        });
      }

      const existingUserWithUsername = await User.findOne({
        username: username,
      });
      if (existingUserWithUsername) {
        console.log("username exists");
        throw new GraphQLError("User with this username already exists", {
          extensions: {
            code: "USER_ALREADY_EXISTS",
          },
        });
      }

      const hashedPassword = await hashPassword(args.password);
      try {
        const user = new User({
          ...args,
          password: hashedPassword,
          email: email,
          phoneNumber: args.phoneNumber || "",
        });
        const { token, expiresIn } = generateToken({
          userId: user._id,
          email: email,
        });

        user.token = token;

        const createdUser = await user.save(); // Wrap in try...catch

        console.log(createdUser);
        return {
          token,
          expiresIn,
          user: {
            email: createdUser.email,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            phoneNumber: createdUser.phoneNumber,
            username: createdUser.username,
          },
        };
      } catch (error) {
        console.log(error);

        throw new GraphQLError("Error creating user", {
          extensions: {
            code: "USER_CREATION_ERROR",
          },
        });
      }
    },
    signin: async (parent, args) => {
      const { email, password } = args;
      const user = await User.findOne({ email });
      if (!user) {
        throw new GraphQLError("No user found with this email", {
          extensions: {
            code: "RECORD_NOT_FOUND",
          },
        });
      }

      const validPassword = await comparePasswords(password, user.password);
      if (!validPassword) {
        throw new GraphQLError("Invalid password", {
          extensions: {
            code: "UNAUTHORISED",
          },
        });
      }

      const { token, expiresIn } = generateToken(user._id);

      return {
        token,
        expiresIn,
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          username: user.username,
        },
      };
    },
  },
};

// module.exports = resolvers;
