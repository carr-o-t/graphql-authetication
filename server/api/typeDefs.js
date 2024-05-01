const { gql } = require("apollo-server");
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
module.exports = gql`
  type User {
    firstName: String!
    lastName: String!
    email: String!
    username: String!
    phoneNumber: String
  }

  type SignUpReq {
    firstName: String!
    lastName: String!
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
    token: String!
    expiresIn: String!
    user: User!
  }

  type AuthPayload {
    token: String!
    expiresIn: String!
    user: User!
  }

  type Query {
    users: [User!]!
    me: User
  }

  type Mutation {
    signup(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
      username: String!
      phoneNumber: String
    ): SignRes!

    signin(email: String!, password: String!): AuthPayload!
  }
`;

// module.exports = typeDefs;
