import { gql } from "@apollo/client";
import { Comment } from "@/types/commentType";
import { User } from "@/types/userType";

// Fragment that matches your resolver structure
export const COMMENT_FRAGMENT = gql`
  fragment CommentFields on Comment {
    id
    content
    blogId
    userId
    parentCommentId
    createdAt
    likeCount
    hasLiked
    replyCount
    user {
      id
      username
      image
      profileImage
    }
    replies {
      id
      content
      blogId
      userId
      parentCommentId
      createdAt
      likeCount
      hasLiked
      user {
        id
        username
        image
        profileImage
      }
    }
  }
`;

// QUERIES
export const GET_COMMENTS_BY_BLOG_ID = gql`
  query GetCommentsByBlogId($blogId: Int!) {
    commentsByBlogId(blogId: $blogId) {
      ...CommentFields
    }
  }
  ${COMMENT_FRAGMENT}
`;

// MUTATIONS
export const CREATE_COMMENT = gql`
  mutation CreateComment(
    $blogId: Int!
    $content: String!
    $parentCommentId: Int
  ) {
    createComment(
      blogId: $blogId
      content: $content
      parentCommentId: $parentCommentId
    ) {
      id
      content
      blogId
      userId
      parentCommentId
      createdAt
      likeCount
      hasLiked
      replyCount
      user {
        id
        username
        image
        profileImage
      }
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: Int!) {
    deleteComment(commentId: $commentId)
  }
`;

export const TOGGLE_COMMENT_LIKE = gql`
  mutation ToggleCommentLike($commentId: Int!) {
    toggleCommentLike(commentId: $commentId)
  }
`;

// Query variable interfaces
export interface GetCommentsByBlogIdVariables {
  blogId: number;
}

export interface CreateCommentVariables {
  blogId: number;
  content: string;
  parentCommentId?: number;
}

export interface DeleteCommentVariables {
  commentId: number;
}

export interface ToggleCommentLikeVariables {
  commentId: number;
}

// Response interfaces
export interface GetCommentsByBlogIdResponse {
  commentsByBlogId: Comment[];
}

export interface CreateCommentResponse {
  createComment: Comment;
}

export interface DeleteCommentResponse {
  deleteComment: boolean;
}

export interface ToggleCommentLikeResponse {
  toggleCommentLike: boolean;
}