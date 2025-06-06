import { gql } from "graphql-tag";

export const GET_FOLLOWER_SUGGESTIONS = gql`
  query GetFollowerSuggestions {
    followerSuggestions {
      id
      username
      fullName
      userBio
      email
      image
      profileImage
      isFollowing
      createdAt
    }
  }
`;

export const GET_USER_FOLLOWERS = gql`
  query GetUserFollowers($userId: Int!) {
    user(id: $userId) {
      followers {
        id
        username
        fullName
        userBio
        image
        profileImage
        createdAt
      }
    }
  }
`;

export const GET_USER_FOLLOWING = gql`
  query GetUserFollowing($userId: Int!) {
    user(id: $userId) {
      following {
        id
        username
        fullName
        userBio
        image
        profileImage
        createdAt
      }
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: Int!) {
    user(id: $userId) {
      id
      username
      fullName
      userBio
      image
      profileImage
      createdAt
      followers {
        id
      }
      following {
        id
      }
      isFollowing # This would need to be implemented in your User type
    }
  }
`;