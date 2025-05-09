// authService.js

import api from "@/config/api";

// Login Service
export const loginService = async (loginDto) => {
  try {
    const response = await api.post("/auth/login", loginDto);
    const { message, token, user } = response.data;

    if (token) {
      // Store the token in localStorage or sessionStorage
      localStorage.setItem("token", token);

      // Optionally, store user data as well
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("storage"));

      return { message, token, user }; // Return the response data (token and user)
    } else {
      throw new Error("Login failed. No token received.");
    }
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};
// Register Service
export const registerService = async (registerDto) => {
  try {
    const response = await api.post("/auth/register", registerDto);
    return response.data; // Return registration response
  } catch (error) {
    console.error("Registration failed", error);
    throw error;
  }
};
