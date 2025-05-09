// hooks/useAuth.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function useAuth(redirectIfNotLoggedIn = true) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    if (
      !token &&
      redirectIfNotLoggedIn &&
      !window.location.pathname.includes("/public/")
    ) {
      router.replace("/public/login");
    }
  };

  useEffect(() => {
    checkAuth(); // initial check

    // Listen to storage events (e.g., logout in another tab)
    const onStorageChange = () => checkAuth();
    window.addEventListener("storage", onStorageChange);
    setLoading(false); // Set loading to false after the initial check
    return () => {
      window.removeEventListener("storage", onStorageChange);
    };
  }, []);

  return { isAuthenticated, loading };
}
