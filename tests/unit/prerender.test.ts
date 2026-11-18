import { expect, test } from "vitest";
import { prerender, trailingSlash } from "../../src/routes/+layout";

test("public routes use directory indexes for static direct visits", () => {
  expect(prerender).toBe(true);
  expect(trailingSlash).toBe("always");
});
