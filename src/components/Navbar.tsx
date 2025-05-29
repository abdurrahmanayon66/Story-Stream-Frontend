"use client";
import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
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
      await signOut({ redirect: false });
      router.push("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/auth");
    }
  };

  const isDataUrl = (src?: string | null) => {
    return !!src && src.startsWith("data:image/");
  };

  const isRawBase64 = (src?: string | null) => {
    if (!src) return false;
    return /^[A-Za-z0-9+/=]+$/.test(src);
  };

  const getProfilePictureSrc = (): string => {
    if (user?.image) {
      if (isDataUrl(user.image)) {
        return user.image;
      }
      if (isRawBase64(user.image)) {
        return `data:image/jpeg;base64,${user.image}`;
      }
      return user.image;
    }

    if (user?.profileImage) {
      return user.profileImage;
    }

    return "https://github.com/shadcn.png";
  };

  const profilePictureSrc = getProfilePictureSrc();

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
                {isDataUrl(profilePictureSrc) ? (
                  <img
                    alt="profile picture"
                    src={profilePictureSrc}
                    className="w-10 h-10 rounded-full ring-2 ring-purple-700 object-cover"
                  />
                ) : (
                  <Image
                    alt="profile picture"
                    src={profilePictureSrc}
                    className="w-10 h-10 rounded-full ring-2 ring-purple-700 object-cover"
                    width={40}
                    height={40}
                  />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {user?.username || "My Account"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
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
