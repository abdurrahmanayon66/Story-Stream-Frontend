import { User } from "./userType";

export interface CommentLike {
  id: number;
  commentId: number;
  userId: number;
  comment: Comment;
  user: User;
  createdAt: string;
}