import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// ---------------- REQUEST INTERCEPTOR ----------------
API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// ---------------- RESPONSE INTERCEPTOR ----------------
API.interceptors.response.use(
  (response) => response,

  (error) => {

    if (
      error.response &&
      (
        error.response.status === 401 ||
        error.response.status === 403
      )
    ) {

      localStorage.removeItem("token");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;