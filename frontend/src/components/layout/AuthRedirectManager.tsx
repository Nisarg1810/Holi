"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthRedirectManager() {
  const pathname = usePathname();
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    // List of protected routes that require authentication (checkout, payment, user account)
    const protectedRoutes = [
      "/checkout",
      "/payment",
      "/profile",
      "/dashboard",
      "/success"
    ];

    // Check if the current route is in the protected list
    const isProtected = protectedRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    // Read stored auth state from localStorage to prevent false redirection on page refresh
    let authenticated = isLoggedIn;
    try {
      const storageRaw = localStorage.getItem("aura-auth-storage");
      if (storageRaw) {
        const parsed = JSON.parse(storageRaw);
        if (parsed?.state?.isLoggedIn || parsed?.state?.token) {
          authenticated = true;
        }
      }
    } catch (err) {
      console.error("Error reading auth storage:", err);
    }

    if (isProtected && !authenticated) {
      // Redirect to /auth login screen and append original destination
      router.push(`/auth?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, isLoggedIn, isHydrated, router]);

  return null;
}
