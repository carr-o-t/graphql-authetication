const { gql } = require("apollo-server");
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
module.exports = gql`
  type User {
    ID: String!
    firstName: String!
    lastName: String
    email: String!
    username: String!
    phoneNumber: String
    followerCount: Int
    followingCount: Int
    isFollowing: Boolean!
  }

  type SignUpReq {
    firstName: String!
    lastName: String
    email: String!
    password: String!
    username: String!
    phoneNumber: String
  }

  type LoginReq {
    email: String!
    password: String!
  }

  type SignRes {
    user: User!
  }

  type AuthPayload {
    token: String!
    expiresIn: String!
    user: User!
  }

  type FollowRes {
    me: User!
    followedUser: User!
  }

  type Query {
    users: [User!]!
    me: User
  }

  type Mutation {
    signup(
      firstName: String!
      lastName: String
      email: String!
      password: String!
      username: String!
      phoneNumber: String
    ): SignRes!

    signin(email: String!, password: String!): AuthPayload!
    followUser(userID: String!): FollowRes!
    unfollowUser(userID: String!): FollowRes!
  }
`;

// module.exports = typeDefs;
