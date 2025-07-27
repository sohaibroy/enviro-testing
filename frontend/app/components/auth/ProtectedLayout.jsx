"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const token = Cookies.get("token");

    const publicPaths = [
      "/customer-login",
      "/admin-login",
      "/customer-signup",
    ];
    const isPublic = publicPaths.some((publicPath) =>
      path?.startsWith(publicPath)
    );

    // Don't redirect if on a public path
    if (!token && !isPublic) {
      router.replace("/customer-login");
    }
  }, [path, router]);

  return <>{children}</>;
}