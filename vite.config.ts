import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        privacy: resolve(import.meta.dirname, "privacy/index.html"),
        "services/bug-fixing": resolve(import.meta.dirname, "services/bug-fixing/index.html"),
        "services/ai-assistants": resolve(import.meta.dirname, "services/ai-assistants/index.html"),
        "services/seo-paid-campaigns": resolve(import.meta.dirname, "services/seo-paid-campaigns/index.html"),
        "services/websites-online-shops": resolve(import.meta.dirname, "services/websites-online-shops/index.html"),
        "services/software-development": resolve(import.meta.dirname, "services/software-development/index.html"),
        "services/automation": resolve(import.meta.dirname, "services/automation/index.html"),
        "services/vorbio": resolve(import.meta.dirname, "services/vorbio/index.html"),
      },
    },
  },
});
