import { gql } from "@apollo/client";

// Fragment for Comment fields
export const COMMENT_FRAGMENT = gql`
  fragment CommentFields on Comment {
    id
    content
    blogId
    userId
    parentCommentId
    createdAt
    likeCount # ✅ new
    hasLiked # ✅ new
    user {
      id
      username
      image
      profileImage
    }
    blog {
      id
    }
    parentComment {
      id
      content
      userId
      createdAt
      user {
        id
        username
        image
        profileImage
      }
    }
  }
`;

// Fragment for nested replies
export const COMMENT_WITH_REPLIES_FRAGMENT = gql`
  fragment CommentWithReplies on Comment {
    id
    content
    blogId
    userId
    parentCommentId
    createdAt
    user {
      id
      username
      email
      image
      profileImage
    }
    blog {
      id
      title
      content
      image
    }
    parentComment {
      id
      content
      userId
      createdAt
      user {
        id
        username
        image
        profileImage
      }
    }
    replies {
      id
      content
      userId
      parentCommentId
      createdAt
      user {
        id
        username
        image
        profileImage
      }
      likes {
        id
        userId
        user {
          id
          username
        }
      }
    }
    likes {
      id
      commentId
      userId
      createdAt
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
      ...CommentWithReplies
    }
  }
  ${COMMENT_WITH_REPLIES_FRAGMENT}
`;

// Simple version without nested data
export const GET_COMMENTS_BY_BLOG_ID_SIMPLE = gql`
  query GetCommentsByBlogIdSimple($blogId: Int!) {
    commentsByBlogId(blogId: $blogId) {
      id
      content
      blogId
      userId
      parentCommentId
      createdAt
    }
  }
`;

// Version with user data only
export const GET_COMMENTS_BY_BLOG_ID_WITH_USERS = gql`
  query GetCommentsByBlogIdWithUsers($blogId: Int!) {
    commentsByBlogId(blogId: $blogId) {
      id
      content
      blogId
      userId
      parentCommentId
      createdAt
      user {
        id
        username
        image
        profileImage
      }
      likes {
        id
        userId
        user {
          id
          username
        }
      }
    }
  }
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
      ...CommentFields
    }
  }
  ${COMMENT_FRAGMENT}
`;

// Simple create comment without nested data
export const CREATE_COMMENT_SIMPLE = gql`
  mutation CreateCommentSimple(
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

// QUERY VARIABLES INTERFACES
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

// RESPONSE INTERFACES
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
