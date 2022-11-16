import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    port: 8000,
  },
  resolve: {
    alias: [
      { find: /^~/, replacement: "" },
      {
        find: "@assets",
        replacement: path.resolve(__dirname, "./src/assets"),
      },
      {
        find: "@icons",
        replacement: path.resolve(__dirname, "./src/icons"),
      },
      {
        find: "@types",
        replacement: path.resolve(__dirname, "./src/types"),
      },
    ],
  },
});
