// src/utils/api.js
import axios from "axios";

// 1. Configure Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://aits2-backend.onrender.com/api/",
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
// Add this to your existing ENDPOINTS object
export const ENDPOINTS = {
  // ... existing endpoints
  profile: `${API_BASE_URL}/api/profile/`,
};

// Add this mock handler to your setupMockAPI function
export const setupMockAPI = () => {
  // ... existing mock handlers
  
  // Mock profile endpoint
  mock.onGet(ENDPOINTS.profile).reply((config) => {
    const token = config.headers.Authorization;
    if (!token) {
      return [401, { detail: "Authentication credentials were not provided." }];
    }
    
    // Extract username from token or use default
    const username = localStorage.getItem('username') || 'registrar';
    
    // Return mock profile data
    return [200, {
      username: username,
      email: `${username}@university.edu`,
      registrar_id: 'REG-' + Math.floor(1000 + Math.random() * 9000),
      department: 'Academic Affairs',
      join_date: '2022-01-15',
      issues_handled: {
        total: 145,
        pending: 12,
        in_progress: 28,
        resolved: 105
      }
    }];
  });
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
