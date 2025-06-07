import { gql } from "graphql-tag";

export const GET_FOLLOWER_SUGGESTIONS = gql`
  query GetFollowerSuggestions($cursor: Int, $limit: Int) {
    followerSuggestions(cursor: $cursor, limit: $limit) {
      users {
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
      nextCursor
      hasMore
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