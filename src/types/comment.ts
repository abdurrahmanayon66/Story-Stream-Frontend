import { Blog } from "./blogType";
import { CommentLike } from "./commentLike";
import { User } from "./userType";

export interface Comment {
  id: number;
  content: string;
  blogId: number;
  userId: number;
  parentCommentId?: number;
  createdAt: string;
  user?: User;
  blog?: Blog;
  parentComment?: Comment;
  replies: Comment[];
  likes: CommentLike[];
}