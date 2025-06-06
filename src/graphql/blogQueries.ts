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
      comments {
        id
        content
        createdAt
        user {
          id
          username
          fullName
          image
          profileImage
        }
      }
      likes {
        id
        user {
          id
          username
          fullName
          image
          profileImage
        }
      }
      bookmarks {
        id
        user {
          id
          username
          fullName
          image
          profileImage
        }
      }
      likesCount
      commentsCount
      bookmarksCount
    }
  }
`;

export const GET_FOR_YOU_BLOGS = gql`
  query GetForYouBlogs {
    forYouBlogs {
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
        comments {
          id
          content
          createdAt
          user {
            id
            username
            fullName
            image
            profileImage
          }
        }
        likes {
          id
          user {
            id
            username
            fullName
            image
            profileImage
          }
        }
        bookmarks {
          id
          user {
            id
            username
            fullName
            image
            profileImage
          }
        }
        likesCount
        commentsCount
        bookmarksCount
      }
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
      comments {
        id
        content
        createdAt
        user {
          id
          username
          fullName
          image
          profileImage
        }
      }
      likes {
        id
        user {
          id
          username
          fullName
          image
          profileImage
        }
      }
      bookmarks {
        id
        user {
          id
          username
          fullName
          image
          profileImage
        }
      }
      likesCount
      commentsCount
      bookmarksCount
    }
  }
`;