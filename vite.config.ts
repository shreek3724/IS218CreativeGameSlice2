import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

const pagesBase = process.env.PAGES_BASE ?? "/IS218CreativeGameSlice2";

if (
  !pagesBase.startsWith("/") ||
  (pagesBase !== "/" && pagesBase.endsWith("/"))
) {
  throw new Error(
    "PAGES_BASE must be / or a path with a leading slash and no trailing slash.",
  );
}

export default defineConfig(({ command, isPreview }) => ({
  plugins: [
    sveltekit({
      adapter: adapter(),
      paths: {
        base:
          (command === "build" || isPreview) && pagesBase !== "/"
            ? `/${pagesBase.slice(1)}`
            : "",
      },
    }),
  ],
  test: { include: ["tests/unit/**/*.test.ts"] },
}));
