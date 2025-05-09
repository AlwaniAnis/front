// api.js
import axios from "axios";

export const baseURL = "http://localhost:5000";
const api = axios.create({
  baseURL,
});

api.interceptors.request.use(
  (config) => {
    if (window.location.href.includes("/protected/")) {
      const token = localStorage.getItem("token"); // Get the token from localStorage or any other storage method
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    console.log("Request Config:", config); // Log the request configuration
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
