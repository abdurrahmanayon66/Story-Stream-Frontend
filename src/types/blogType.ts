// types/blog.ts
export interface Blog {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  genre: string[];
  createdAt: string;
  author: {
    id: number;
    username: string;
    fullName: string;
    image: string;
    profileImage: string;
  };
  likesCount: number;
  commentsCount: number;
  bookmarksCount: number;
  hasLiked: boolean;
  hasBookmarked: boolean;
}
