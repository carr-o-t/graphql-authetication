const User = require("../models/User");
const { hashPassword, comparePasswords } = require("../utils/bcrypt");
const { generateToken, verifyToken } = require("../utils/jwt");
const { GraphQLError } = require("graphql");
const { v4: uuidv4 } = require("uuid");
const { getUserFromContext } = require("../utils/auth");

module.exports = {
  Query: {
    users: async (parent, args, context) => {
      const userId = getUserFromContext(context);
      // exclude the current user in the query, so mongoDb does the
      // filtering instead of loading every user into memory first
      return User.find({ ID: { $ne: userId } }).select("-password");
    },
    me: async (parent, args, context) => {
      const userId = getUserFromContext(context);
      return User.findOne({ ID: userId }).select("-password");
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
        const user_id = uuidv4();
        const { token } = generateToken({
          userId: user_id,
          email: email,
        });

        user.token = token;
        user.ID = user_id;

        const createdUser = await user.save(); // Wrap in try...catch

        return {
          user: {
            email: createdUser.email,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            phoneNumber: createdUser.phoneNumber,
            username: createdUser.username,
            ID: createdUser.ID,
          },
        };
      } catch (error) {
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

      const { token } = generateToken(user.ID, email);
      const isVerified = verifyToken(token);

      return {
        token,
        expiresIn: isVerified.exp,
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          username: user.username,
          ID: user.ID,
        },
      };
    },
    followUser: async (parent, args, context) => {
      const userId = getUserFromContext(context);
      const { userID } = args;

      const userToBeFollowed = await User.findOne({ ID: userID }).select(
        "-password"
      );
      if (!userToBeFollowed) {
        throw new GraphQLError("No user found with ID", {
          extensions: {
            code: "RECORD_NOT_FOUND",
          },
        });
      }

      const currentUser = await User.findOne({ ID: userId }).select(
        "-password"
      );

      currentUser.followingCount += 1;
      userToBeFollowed.followerCount += 1;

      const currentUpdatedUser = await User.findOneAndUpdate(
        { ID: userId },
        { followingCount: currentUser.followingCount }
      ).select("-password");
      const followedUpdatedUser = await User.findOneAndUpdate(
        { ID: userID },
        { followerCount: userToBeFollowed.followerCount }
      ).select("-password");

      console.log(currentUser, currentUpdatedUser);

      return {
        me: {
          email: currentUser.email,
          username: currentUser.username,
          ID: currentUser.ID,
          followerCount: currentUser.followerCount,
          followingCount: currentUser.followingCount,
        },
        followedUser: {
          email: userToBeFollowed.email,
          username: userToBeFollowed.username,
          ID: userToBeFollowed.ID,
          followerCount: userToBeFollowed.followerCount,
          followingCount: userToBeFollowed.followingCount,
        },
      };
    },
  },
};

// module.exports = resolvers;
