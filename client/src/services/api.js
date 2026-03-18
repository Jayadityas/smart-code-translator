/*Every API call to protected routes need JWT token only then Auth middleware will allow it.
Instead of adding it manually to every request ,we create an interceptor that does it automatically */

/*After user is registered or logged in, backend gives it a JWT which is stored in local storage.
The interceptor runs before every request. It reads the JWT from localStorage and adds it to the Authorization header. */

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;