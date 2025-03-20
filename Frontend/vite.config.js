import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src", // This allows you to use '@' as an alias for the src directory
    },
  },
  server: {
    port: 3000, // You can change this to your preferred port
  },
});
