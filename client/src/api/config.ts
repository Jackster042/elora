import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL!;

// Validate API URL
if (!API_URL) {
  throw new Error("VITE_API_URL is not defined in environment variables");
}

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

// request interceptor
axios.interceptors.request.use((config) => {
  return config;
});

// response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    return Promise.reject(error);
  }
);

export default axios;
