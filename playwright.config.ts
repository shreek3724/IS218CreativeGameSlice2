import { defineConfig } from "@playwright/test";

const base = process.env.PAGES_BASE ?? "/IS218CreativeGameSlice2";
const origin = "http://127.0.0.1:4173";
const baseURL = new URL(base === "/" ? "/" : `${base}/`, origin).href;

export default defineConfig({
  testDir: "tests/e2e",
  use: { baseURL },
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4173 --strictPort",
    url: baseURL,
  },
});
