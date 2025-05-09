import { useState } from "react";

import styles from "../../styles/form.module.scss";
import LoginDto, { loginSchema } from "@/models/loginDto";
import { useRouter } from "next/router";
import { loginService } from "@/services/auth.service";

export default function Register() {
  const [formData, setFormData] = useState(new LoginDto());
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await loginSchema.validate(formData, { abortEarly: false });
      setErrors({});
      try {
        const response = await loginService(formData);
        console.log("Login successful", response);
        router.push("/protected/requests");
      } catch (error) {
        setErrorMessage("Login failed. Please check your credentials.");
        console.error("Login error", error);
      }
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((e) => {
        validationErrors[e.path] = e.message;
      });
      setErrors(validationErrors);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2>Sign In</h2>
      <br></br>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label>Username</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p className={styles.error}>{errors.username}</p>}
        </div>

        <div className={styles.field}>
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>
        <button type="submit">login</button>
      </form>
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
      <p>
        Don't have an account?{" "}
        <a href="/public/register" className={styles.link}>
          Register here
        </a>
      </p>
    </div>
  );
}
