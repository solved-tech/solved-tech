import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/solved-tech/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        privacy: resolve(import.meta.dirname, "privacy/index.html"),
      },
    },
  },
});
