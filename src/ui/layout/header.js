import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Header.module.scss";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    // router.replace("/public/login");
  };

  if (!user) return null;

  return (
    <div className={styles.header}>
      <div className={styles.userInfo}>
        <span>
          <FaUserCircle />
        </span>{" "}
        {user.firstName} {user.lastName}
      </div>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
