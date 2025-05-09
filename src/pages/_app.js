import useAuth from "@/hooks/useAuth";
import "@/styles/globals.scss";
import Header from "@/ui/layout/header";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  const { isAuthenticated, loading } = useAuth(true);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // User is authenticated
      console.log("User is authenticated");
    } else {
      // User is not authenticated
      console.log("User is not authenticated");
    }
  }, [loading]);
  if (loading) {
    return <div>Loading...</div>; // Show a loading state while checking authentication
  }
  return (
    <>
      {isAuthenticated && <Header />}
      <Component {...pageProps} />
    </>
  );
}
