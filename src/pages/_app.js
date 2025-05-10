import useAuth from "@/hooks/useAuth";
import "@/styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/ui/layout/header";
import { useEffect, useState } from "react";
import useSocket from "@/hooks/useSocket";
import { ToastContainer, toast } from "react-toastify";
export default function App({ Component, pageProps }) {
  const [notif, setNotif] = useState(null);
  const { isAuthenticated, loading } = useAuth(true);
  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch (e) {
          console.error("Invalid user JSON", e);
        }
      }
    }
  }, []);

  // Connect socket only after user is loaded
  useSocket(user?.id, user?.roles, (message) => {
    toast.info(`🔔 ${message}`, {
      position: "top-right",
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  });
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
      <ToastContainer />
      {isAuthenticated && <Header />}
      <Component {...pageProps} />
    </>
  );
}
