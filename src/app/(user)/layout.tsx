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

  const protectedRoutes = [
    '/create-blog',
    '/my-feed',
    '/blogs',
    '/profile'
  ];

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/check-session');
        const data = await response.json();

        if (!data.isAuthenticated && protectedRoutes.includes(pathname)) {
          router.push('/auth?session=invalid');
          return;
        }

        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        if (protectedRoutes.includes(pathname)) {
          router.push('/auth?session=error');
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [pathname, router]);

  if (isLoading) {
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
