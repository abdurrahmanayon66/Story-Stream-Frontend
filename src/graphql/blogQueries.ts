import { gql } from "graphql-tag";

export const GET_BLOGS = gql`
  query GetBlogs {
    blogs {
      id
      title
      slug
      description
      content
      image
      genre
      createdAt
      author {
        id
        username
        fullName
        image
        profileImage
      }
      likesCount
      commentsCount
      bookmarksCount
      hasLiked
      hasBookmarked
    }
  }
`;

export const GET_MY_BLOGS = gql`
  query GetMYBlogs {
    myBlogs {
      id
      title
      slug
      description
      content
      image
      genre
      createdAt
      author {
        id
        username
        fullName
        image
        profileImage
      }
      likesCount
      commentsCount
      bookmarksCount
      hasLiked
      hasBookmarked
    }
  }
`;

export const GET_FOR_YOU_BLOGS = gql`
  query GetForYouBlogs {
    forYouBlogs {
      id
      title
      slug
      description
      content
      image
      genre
      createdAt
      author {
        id
        username
        fullName
        image
        profileImage
      }
      likesCount
      commentsCount
      bookmarksCount
      hasLiked
      hasBookmarked
    }
  }
`;

export const GET_MOST_LIKED_BLOGS = gql`
  query GetMostLikedBlogs {
    mostLikedBlogs {
      id
      title
      slug
      description
      content
      image
      genre
      createdAt
      author {
        id
        username
        fullName
        image
        profileImage
      }
      likesCount
      commentsCount
      bookmarksCount
      hasLiked
      hasBookmarked
    }
  }
`;

export const GET_BLOG_BY_ID = gql`
  query GetBlog($id: Int!) {
    blog(id: $id) {
      id
      title
      slug
      description
      content
      image
      genre
      createdAt
      author {
        id
        username
        fullName
        image
        profileImage
      }
      likesCount
      commentsCount
      bookmarksCount
      hasLiked
      hasBookmarked
    }
  }
`;
