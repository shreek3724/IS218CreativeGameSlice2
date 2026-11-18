import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const views = [
  { path: "./", title: "Art Conservator" },
  { path: "game/", title: "Game" },
  { path: "results/", title: "Results" },
];

for (const { path, title } of views) {
  test(`${title} loads directly and after refresh`, async ({ page }) => {
    expect((await page.goto(path))?.status()).toBe(200);
    const heading = page.getByRole("heading", { name: title });
    await expect(heading).toBeVisible();
    expect((await page.reload())?.status()).toBe(200);
    await expect(heading).toBeVisible();
  });

  test(`${title} passes the accessibility scan @axe`, async ({ page }) => {
    await page.goto(path);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  });
}

test("navigation stays inside the configured public path", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("link", { name: "Game" }).click();
  await expect(page.getByRole("heading", { name: "Game" })).toBeVisible();
  await page.getByRole("link", { name: "Results" }).click();
  await expect(page.getByRole("heading", { name: "Results" })).toBeVisible();
  await page.getByRole("link", { name: "Sign in" }).click();
  await expect(
    page.getByRole("heading", { name: "Art Conservator" }),
  ).toBeVisible();
});
