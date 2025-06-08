import { Blog } from "./blogType";
import { CommentLike } from "./commentLikeType";
import { User } from "./userType";

export interface Comment {
  id: number;
  content: string;
  blogId: number;
  userId: number;
  parentCommentId?: number;
  createdAt: string;
  likeCount?: number;
  hasLiked?: boolean;
  replyCount?: number;
  user?: User;
  blog?: Blog;
  parentComment?: Comment;
  replies: Comment[];
  likes: CommentLike[];
}