const User = require("../models/User");
const Follow = require("../models/Follow");
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

      if (userID === userId) {
        throw new GraphQLError("You cannot follow yourself", {
          extensions: {
            code: "SELF_FOLLOW_NOT_ALLOWED",
          },
        });
      }

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

      // if create Follow returns duplicate err then return the current state without incrementing anything
      let isNewFollow = true;
      try {
        await Follow.create({ followerId: userId, followeeId: userID });
      } catch (error) {
        if (error.code === 11000) {
          isNewFollow = false;
        } else {
          throw error;
        }
      }

      // only increment the counters when a new follow record was actually inserted
      let meUser = currentUser;
      let followedUser = userToBeFollowed;

      if (isNewFollow) {
        // $inc performs the increment atomically in the database
        // amd { new: true } will return the post-increment documents
        [meUser, followedUser] = await Promise.all([
          User.findOneAndUpdate(
            { ID: userId },
            { $inc: { followingCount: 1 } },
            { new: true }
          ).select("-password"),
          User.findOneAndUpdate(
            { ID: userID },
            { $inc: { followerCount: 1 } },
            { new: true }
          ).select("-password"),
        ]);
      }

      return {
        me: {
          email: meUser.email,
          username: meUser.username,
          ID: meUser.ID,
          followerCount: meUser.followerCount,
          followingCount: meUser.followingCount,
        },
        followedUser: {
          email: followedUser.email,
          username: followedUser.username,
          ID: followedUser.ID,
          followerCount: followedUser.followerCount,
          followingCount: followedUser.followingCount,
        },
      };
    },

    unfollowUser: async (parent, args, context) => {
      const userId = getUserFromContext(context);
      const { userID } = args;

      const userToBeUnfollowed = await User.findOne({ ID: userID }).select(
        "-password"
      );
      if (!userToBeUnfollowed) {
        throw new GraphQLError("No user found with ID", {
          extensions: {
            code: "RECORD_NOT_FOUND",
          },
        });
      }

      const currentUser = await User.findOne({ ID: userId }).select(
        "-password"
      );

      // delete the follow record first and if nothing was deleted then we were not
      // following this user, so we return the current state unchanged
      const { deletedCount } = await Follow.deleteOne({
        followerId: userId,
        followeeId: userID,
      });

      // only decrement the counters when a follow record was actually deleted
      let meUser = currentUser;
      let unfollowedUser = userToBeUnfollowed;

      if (deletedCount === 1) {
        [meUser, unfollowedUser] = await Promise.all([
          User.findOneAndUpdate(
            { ID: userId },
            { $inc: { followingCount: -1 } },
            { new: true }
          ).select("-password"),
          User.findOneAndUpdate(
            { ID: userID },
            { $inc: { followerCount: -1 } },
            { new: true }
          ).select("-password"),
        ]);
      }

      return {
        me: {
          email: meUser.email,
          username: meUser.username,
          ID: meUser.ID,
          followerCount: meUser.followerCount,
          followingCount: meUser.followingCount,
        },
        followedUser: {
          email: unfollowedUser.email,
          username: unfollowedUser.username,
          ID: unfollowedUser.ID,
          followerCount: unfollowedUser.followerCount,
          followingCount: unfollowedUser.followingCount,
        },
      };
    },
  },
};

// module.exports = resolvers;
