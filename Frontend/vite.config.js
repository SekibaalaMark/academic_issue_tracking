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
    port: 3000,
    proxy: {
      // Proxy all API requests to your backend
      "/api": {
        target: "http://127.0.0.1:8000", // Your backend server
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, ""), // Remove /api prefix
        secure: false, // Disable SSL verification (if needed for localhost)
      },
    },
  },
});
