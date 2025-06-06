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

export const TOGGLE_FOLLOW = gql`
  mutation ToggleFollow($followerId: Int!) {
    toggleFollow(followerId: $followerId) {
      success
      message
      isFollowing
    }
  }
`;
