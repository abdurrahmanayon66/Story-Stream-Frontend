import { gql } from "graphql-tag";

export const TOGGLE_LIKE = gql`
  mutation ToggleLike($blogId: Int!) {
    toggleLike(blogId: $blogId) {
      success
      message
      isLiked
      like {
        id
        blogId
        userId
        createdAt
      }
    }
  }
`;
