import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/solved-tech/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        privacy: resolve(import.meta.dirname, "privacy/index.html"),
        "services/bug-fixing": resolve(import.meta.dirname, "services/bug-fixing/index.html"),
        "services/software-development": resolve(import.meta.dirname, "services/software-development/index.html"),
        "services/automation": resolve(import.meta.dirname, "services/automation/index.html"),
      },
    },
  },
});
