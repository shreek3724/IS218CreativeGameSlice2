import { expect, test } from "@playwright/test";

test("all public views load directly and after refresh without session data", async ({
  page,
}) => {
  for (const [path, title] of [
    ["./", "Art Conservator"],
    ["game/", "Game"],
    ["results/", "Results"],
  ]) {
    expect((await page.goto(path))?.status()).toBe(200);
    const heading = page.getByRole("heading", { name: title, exact: true });
    await expect(heading).toBeVisible();
    expect((await page.reload())?.status()).toBe(200);
    await expect(heading).toBeVisible();
    if (path !== "./") {
      await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
    }
  }
});
