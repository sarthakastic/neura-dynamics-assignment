import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test-utils/setup.js",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test-utils/",
        "**/*.config.js",
        "**/*.config.ts",
      ],
      // Optional: Set coverage thresholds (uncomment to enable)
      // thresholds: {
      //   lines: 80,
      //   functions: 80,
      //   branches: 75,
      //   statements: 80,
      // },
    },
  },
});
