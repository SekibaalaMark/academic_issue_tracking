import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Path alias for src/
    },
  },
  server: {
    port: 5177, // Match your current port
    proxy: {
      // Proxy all API requests to your backend
      "/api": {
        target: "https://academic-issue-tracking-now.onrender.com", // Updated to your Heroku backend
        changeOrigin: true,
        secure: true, // Enable SSL for HTTPS targets
        rewrite: (path) => path, // Don't rewrite the path since we want to keep /api
      },
    },
  },
});
