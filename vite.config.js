import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./Frontend/src"), // Ensure alias points to the correct directory
    },
  },
  server: {
    mimeTypes: {
      // Add fallback MIME type for JavaScript files
      "application/javascript": ["js", "jsx"],
    },
  },
});
