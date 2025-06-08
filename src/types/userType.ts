// types/user.ts
export interface User {
  id: number;
  fullName: string;
  username: string;
  email: string;
  userBio: string | null;
  image: string | null;
  profileImage: string | null;
  createdAt: string;
  isFollowing: boolean;
  followerCount: number | 0;
  followingCount: number | 0;
}
