// src/utils/api.js
import axios from "axios";

// 1. Configure Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Required for cookies/sessions
});

// 2. Request Interceptor
api.interceptors.request.use(
  (config) => {
    // JWT Authentication
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Django CSRF (uncomment if using session auth)
    // const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
    // if (csrfToken) config.headers['X-CSRFToken'] = csrfToken;

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// 3. Response Interceptor
api.interceptors.response.use(
  (response) => response.data, // Directly return the data
  (error) => {
    // Network errors
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout");
      return Promise.reject({
        message: "Request timeout",
        userMessage: "Server is taking too long to respond",
      });
    }

    // HTTP errors
    if (error.response) {
      const { status } = error.response;
      const errorMap = {
        400: "Bad request",
        401: "Unauthorized - Redirecting to login...",
        403: "Forbidden",
        404: "Resource not found",
        500: "Server error",
      };

      const userMessage = errorMap[status] || "An error occurred";

      // Auto-redirect on 401
      if (status === 401) {
        localStorage.removeItem("authToken");
        window.location.href = "/login?session_expired=true";
      }

      return Promise.reject({
        ...error.response.data,
        status,
        userMessage,
      });
    }

    // Other errors
    return Promise.reject({
      message: error.message,
      userMessage: "Network connection error",
    });
  }
);

// 4. API Service Functions
export const fetchData = async (endpoint = "/", params = {}) => {
  try {
    return await api.get(endpoint, { params });
  } catch (error) {
    console.error(`API Error at ${endpoint}:`, error);
    throw error; // Re-throw for component handling
  }
};

// 5. Example usage in components:
/*
import { fetchData } from './utils/api';

const loadData = async () => {
  try {
    const data = await fetchData('/issues/');
    console.log('Data loaded:', data);
    return data;
  } catch (error) {
    alert(error.userMessage || 'Failed to load data');
  }
};
*/
