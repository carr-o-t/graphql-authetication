import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Signin($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      token
      expiresIn
      user {
        email
        firstName
        lastName
        phoneNumber
        username
      }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $username: String!
    $phoneNumber: String
  ) {
    signup(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      username: $username
      phoneNumber: $phoneNumber
    ) {
      user {
        email
        firstName
        lastName
        phoneNumber
        username
      }
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query Me {
    me {
      username
      phoneNumber
      lastName
      firstName
      email
      ID
      followingCount
      followerCount
    }
  }
`;

export const LIST_USERS = gql`
  query Users {
    users {
      username
      phoneNumber
      lastName
      firstName
      email
      ID
      followingCount
      followerCount
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($userId: String!) {
    followUser(userID: $userId) {
      me {
        username
        followingCount
        followerCount
        email
        ID
      }
      followedUser {
        followingCount
        username
        followerCount
        email
        ID
      }
    }
  }
`;
