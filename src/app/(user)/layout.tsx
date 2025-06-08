"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loading from "@/app/Loading";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const protectedRoutePatterns = [
    '/create-blog',
    '/my-feed',
    '/blogs',
    '/profile',
    /^\/blogs\/\d+\/[\w-]+$/,
  ];

  const isProtectedRoute = (path: string) => {
    return protectedRoutePatterns.some(pattern => {
      if (pattern instanceof RegExp) {
        return pattern.test(path);
      }
      return path.startsWith(pattern);
    });
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/check-session');
        const data = await response.json();

        if (!data.isAuthenticated && isProtectedRoute(pathname)) {
          router.push('/auth?session=invalid');
        }

        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        if (isProtectedRoute(pathname)) {
          router.push('/auth?session=error');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [pathname, router]);

  if (isLoading && !isAuthenticated) {
    return <Loading />;
  }

  return (
    <div className="bg-background">
      <Navbar />
      <main className="px-24">{children}</main>
      <Footer />
    </div>
  );
}
