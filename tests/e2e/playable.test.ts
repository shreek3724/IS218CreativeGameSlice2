import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const canvasCells = Array.from({ length: 16 }, (_, i) => [
  Math.floor(i / 4) + 1,
  (i % 4) + 1,
]);
const layers = [
  {
    title: "Surface Dirt",
    tool: "Swab",
    mix: [70, 30, 0],
    cells: canvasCells,
    clue: "Keep acid out of this first mixture.",
  },
  {
    title: "Overpaint",
    tool: "Brush",
    mix: [20, 70, 10],
    cells: [
      [2, 2],
      [2, 3],
      [3, 2],
      [3, 3],
    ],
    clue: "Use the brush on the four centre cells.",
  },
  {
    title: "Aged Varnish",
    tool: "Heat lamp",
    mix: [10, 20, 70],
    cells: canvasCells,
    clue: "Treat every canvas cell.",
  },
];

async function signIn(page: Page, name = "Ada") {
  await page.getByLabel("Display name").fill(name);
  await page.getByRole("button", { name: "Start restoration" }).click();
  await expect(page).toHaveURL(/\/game\/$/);
}

async function dismissInstructions(page: Page) {
  const instructions = page.getByRole("dialog", { name: "How to Play!" });
  await instructions
    .getByRole("button", { name: "Close instructions" })
    .click();
  await expect(instructions).toBeHidden();
}

test("instructions block play until X is clicked and the note appears above the tools", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.goto("./");
  await signIn(page);

  const instructions = page.getByRole("dialog", { name: "How to Play!" });
  const close = instructions.getByRole("button", {
    name: "Close instructions",
  });
  await expect(instructions.getByRole("listitem")).toHaveCount(5);
  await expect(close).toBeFocused();
  const cell = page.getByRole("button", { name: "Row 1, column 1" });
  await cell.evaluate((button) => button.focus());
  await expect(close).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(instructions).toBeVisible();

  await dismissInstructions(page);
  const integrity = page.getByRole("progressbar", {
    name: "Painting integrity",
  });
  const painting = page.locator("main canvas");
  expect((await integrity.boundingBox())!.y).toBeLessThan(
    (await painting.boundingBox())!.y,
  );
  const note = page.getByRole("region", { name: "Current note" });
  const hint = page.getByText(
    "Select a cell and a tool before applying solvent.",
  );
  const tools = page.getByRole("group", { name: "Tool", exact: true });
  expect((await note.boundingBox())!.y).toBeLessThan(
    (await hint.boundingBox())!.y,
  );
  expect((await hint.boundingBox())!.y).toBeLessThan(
    (await tools.boundingBox())!.y,
  );
  await cell.click();
  await expect(cell).toHaveAttribute("aria-pressed", "true");
  await tools.getByRole("radio", { name: "Swab" }).check();
  await expect(hint).toBeVisible();
});

test("mixture progress reflects both input methods and caps the combined total", async ({
  page,
}) => {
  await page.goto("./");
  await signIn(page);
  await dismissInstructions(page);

  const progress = page.getByRole("progressbar", { name: "Mixture progress" });
  const water = page.getByRole("spinbutton", { name: "Water percentage" });
  const oil = page.getByRole("spinbutton", { name: "Oil percentage" });
  const acid = page.getByRole("spinbutton", { name: "Acid percentage" });
  const oilSlider = page.getByRole("slider", { name: "Oil slider" });
  const acidSlider = page.getByRole("slider", { name: "Acid slider" });

  await expect(progress).toHaveAttribute("value", "0");
  await expect(page.getByText("Add 100 percentage points.")).toBeVisible();
  await water.fill("70");
  await expect(progress).toHaveAttribute("value", "70");
  await expect(page.getByText("Add 30 percentage points.")).toBeVisible();

  await oil.fill("80");
  await expect(oil).toHaveValue("30");
  await expect(oilSlider).toHaveValue("30");
  await expect(progress).toHaveAttribute("value", "100");
  await expect(page.getByText("Mixture ready.")).toBeVisible();
  await acidSlider.press("End");
  await expect(acid).toHaveValue("0");

  await oilSlider.press("ArrowLeft");
  await expect(oil).toHaveValue("29");
  await expect(page.getByText("Add 1 percentage point.")).toBeVisible();
  await acidSlider.press("End");
  await expect(acid).toHaveValue("1");
  await expect(progress).toHaveAttribute("value", "100");
});

async function mixSolvent(page: Page, mix: number[]) {
  for (const [index, ingredient] of ["Water", "Oil", "Acid"].entries()) {
    await page
      .getByRole("spinbutton", { name: `${ingredient} percentage` })
      .fill(String(mix[index]));
  }
}

async function sampleCells(page: Page) {
  return page.locator("main canvas").evaluate((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d")!;
    return Array.from({ length: 16 }, (_, index) => {
      const x = ((index % 4) + 0.5) * (canvas.width / 4);
      const y = (Math.floor(index / 4) + 0.5) * (canvas.height / 4);
      return Array.from(ctx.getImageData(x, y, 1, 1).data);
    });
  });
}

async function restore(page: Page, verifyReveal = false) {
  for (const layer of layers) {
    await expect(
      page.getByRole("heading", { name: layer.title }),
    ).toBeVisible();
    await expect(page.getByText(layer.clue, { exact: true })).toBeVisible();
    await page.getByRole("radio", { name: layer.tool }).check();
    await mixSolvent(page, layer.mix);
    for (const [index, [row, column]] of layer.cells.entries()) {
      const checkCell = verifyReveal && index === 0;
      const before = checkCell ? await sampleCells(page) : null;
      await page
        .getByRole("button", { name: `Row ${row}, column ${column}` })
        .click();
      await page.getByRole("button", { name: "Apply Solvent" }).click();
      if (before) {
        const after = await sampleCells(page);
        const changed = after.flatMap((pixel, i) =>
          pixel.some((channel, j) => channel !== before[i][j]) ? [i] : [],
        );
        expect(changed).toEqual([(row - 1) * 4 + column - 1]);
      }
    }
    if (layer.title === "Surface Dirt") {
      await expect(
        page.getByRole("status", { name: "Treatment feedback" }),
      ).toContainText("Overpaint unlocked");
    }
  }
  await expect(page).toHaveURL(/\/results\/$/);
  await expect(
    page.getByRole("heading", { name: "Saved restoration" }),
  ).toBeVisible();
}

test("restoration reveals each coating, exports the clean PNG, and supports replay and sign-out", async ({
  page,
}) => {
  await page.goto("./");
  await signIn(page);
  await dismissInstructions(page);
  const original = await sampleCells(page);
  await restore(page, true);
  await expect(page.getByText("100 / 100", { exact: true })).toBeVisible();
  await expect(page.getByText("36 / 36", { exact: true })).toBeVisible();
  expect(await sampleCells(page)).not.toEqual(original);

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PNG" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("golden-valley-restored.png");
  const exported = await readFile((await download.path())!);
  const dataUrl = await page
    .locator("main canvas")
    .evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL("image/png"));
  expect(exported.equals(Buffer.from(dataUrl.split(",")[1], "base64"))).toBe(
    true,
  );

  await page.getByRole("button", { name: "Play again" }).click();
  await dismissInstructions(page);
  await expect(
    page.getByRole("heading", { name: "Surface Dirt" }),
  ).toBeVisible();
  await expect(page.getByText("0 of 16 cells cleared")).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.getByLabel("Display name")).toHaveValue("");
  await page.getByRole("link", { name: "Results" }).click();
  await expect(page.getByText("Sign in to start a restoration.")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Saved restoration" }),
  ).toHaveCount(0);
});

test("keyboard selection and synchronized inputs support recovery after a wrong move", async ({
  page,
}) => {
  await page.goto("./");
  await signIn(page);
  await dismissInstructions(page);
  const apply = page.getByRole("button", { name: "Apply Solvent" });
  const waterSlider = page.getByRole("slider", { name: "Water slider" });
  const waterInput = page.getByRole("spinbutton", { name: "Water percentage" });
  await page.getByRole("radio", { name: "Brush" }).check();
  await page.getByRole("button", { name: "Row 1, column 1" }).focus();
  await page.keyboard.press("ArrowRight");
  const cell = page.getByRole("button", { name: "Row 1, column 2" });
  await expect(cell).toBeFocused();
  await page.keyboard.press("Space");
  await expect(cell).toHaveAttribute("aria-pressed", "true");
  await expect(apply).toBeDisabled();

  await waterSlider.press("ArrowRight");
  await expect(waterInput).toHaveValue("1");
  await mixSolvent(page, [70, 30, 0]);
  await expect(waterSlider).toHaveValue("70");
  await expect(apply).toBeEnabled();
  const beforeMistake = await sampleCells(page);
  await apply.click();
  expect(await sampleCells(page)).toEqual(beforeMistake);
  const feedback = page.getByRole("status", { name: "Treatment feedback" });
  await expect(feedback).toContainText("Wrong tool");
  await expect(page.getByText("90%", { exact: true })).toBeVisible();

  await page.getByRole("radio", { name: "Swab" }).check();
  await apply.click();
  await expect(feedback).toContainText("Cell cleared");
  await expect(page.getByText("1 of 16 cells cleared")).toBeVisible();
  await page.getByRole("button", { name: "Restart Painting" }).click();
  await expect(page.getByText("0 of 16 cells cleared")).toBeVisible();
  await expect(page.getByText("100%", { exact: true })).toBeVisible();

  await page.getByRole("radio", { name: "Brush" }).check();
  await cell.click();
  await mixSolvent(page, [70, 30, 0]);
  await apply.click();
  await restore(page);
  await expect(page.getByText("93 / 100", { exact: true })).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Saved restoration" }),
  ).toHaveCount(0);
  await expect(page.getByText("Sign in to start a restoration.")).toBeVisible();
});

test("actual sign-in, game, and completed results pass axe @axe", async ({
  page,
}) => {
  async function scan() {
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }

  await page.goto("./");
  await scan();
  await signIn(page);
  await scan();
  await dismissInstructions(page);
  await scan();
  await restore(page);
  await scan();
});
