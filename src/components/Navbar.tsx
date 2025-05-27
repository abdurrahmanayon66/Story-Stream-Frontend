"use client";
import React, { useEffect, useState } from "react";
import { signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AiOutlineBell } from "react-icons/ai";

interface User {
  id: number;
  username: string;
  email: string;
  image: string | null;
  profileImage: string | null;
  createdAt: string;
}

interface SessionResponse {
  isAuthenticated: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

const Navbar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/check-session");
        const data: SessionResponse = await response.json(); 
        setIsAuthenticated(data.isAuthenticated);
        setUser(data.user || null);
        console.log("Auth check result:", data);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      // Destroy the NextAuth session
      await signOut({ redirect: false });
      // Navigate to /auth
      router.push("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
      // Navigate to /auth even if signOut fails to ensure user is redirected
      router.push("/auth");
    }
  };

  const profilePictureSrc = user?.image || user?.profileImage || "https://github.com/shadcn.png";

  return (
    <div className="bg-extraLightPurple flex py-4 rounded-md px-4 my-6 items-center mx-24 justify-between">
      <h1 className="text-3xl font-bold text-darkPurple">StoryStream</h1>
      <div className="flex items-center space-x-6">
        {isAuthenticated ? (
          <div className="flex space-x-4 items-center">
            <Link href="/explore">Explore</Link>
            <Link href="/post">Post</Link>
            <Link href="/analytics">Analytics</Link>
            <button>
              <AiOutlineBell size={24} />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Image
                  alt="profile picture"
                  src={profilePictureSrc}
                  className="size-10 rounded-full ring-2 ring-purple-700"
                  width={40}
                  height={40}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{user?.username || "My Account"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link href="/auth">Login</Link>
            <Link href="/auth/signup">Sign Up</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;