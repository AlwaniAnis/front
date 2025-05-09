import { useEffect, useState } from "react";

export default function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("user");
      if (userString) {
        try {
          const user = JSON.parse(userString);
          setIsAdmin(user?.roles.find((r) => r === "admin") !== undefined);
        } catch (error) {
          console.error("Invalid user data in localStorage");
        }
      }
    }
  }, []);

  return isAdmin;
}
