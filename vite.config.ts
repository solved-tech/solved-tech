import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import { rewriteRomanianDevPath } from "./src/locale.ts";

const romanianDevPages = (): Plugin => ({
  name: "romanian-dev-pages",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const raw = req.url ?? "";
      const pathname = raw.split("?")[0] ?? "";
      const rewritten = rewriteRomanianDevPath(pathname);

      if (rewritten) {
        const search = raw.includes("?") ? `?${raw.slice(raw.indexOf("?") + 1)}` : "";
        req.url = `${rewritten}${search}`;
      }

      next();
    });
  },
});

export default defineConfig({
  plugins: [romanianDevPages()],
  base: "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        privacy: resolve(import.meta.dirname, "privacy/index.html"),
        "services/bug-fixing": resolve(import.meta.dirname, "services/bug-fixing/index.html"),
        "services/ai-assistants": resolve(import.meta.dirname, "services/ai-assistants/index.html"),
        "services/seo-paid-campaigns": resolve(import.meta.dirname, "services/seo-paid-campaigns/index.html"),
        "services/software-development": resolve(import.meta.dirname, "services/software-development/index.html"),
        "services/automation": resolve(import.meta.dirname, "services/automation/index.html"),
        "services/vorbio": resolve(import.meta.dirname, "services/vorbio/index.html"),
      },
    },
  },
});
