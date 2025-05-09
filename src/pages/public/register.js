import { useState } from "react";

import styles from "../../styles/form.module.scss";
import RegisterDto, { registerSchema } from "@/models/registerDto";
import { registerService } from "@/services/auth.service";

export default function Register() {
  const [formData, setFormData] = useState(new RegisterDto());
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerSchema.validate(formData, { abortEarly: false });
      setErrors({});
      const response = await registerService(formData);
      console.log("Register successful", response);
      if (response != "User registered successfully") {
        setErrors({ username: response });
      } else window.location.href = "/public/login"; // Redirect to login page after successful registration
      // TODO: API call
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
      <h2>Register</h2>
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
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
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

        <div className={styles.field}>
          <label>Phone Number</label>
          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label>First Name</label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <p className={styles.error}>{errors.firstName}</p>
          )}
        </div>

        <div className={styles.field}>
          <label>Last Name</label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <p className={styles.error}>{errors.lastName}</p>}
        </div>

        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{" "}
        <a href="/public/login" className={styles.link}>
          Sign in here
        </a>{" "}
      </p>
    </div>
  );
}
