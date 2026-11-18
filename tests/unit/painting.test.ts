import { expect, test } from "vitest";
import { definePainting } from "../../src/lib/content/define-painting";
import { goldenValley } from "../../src/lib/content/golden-valley";
import { cellKey, isSolventReady } from "../../src/lib/domain/painting";

test("Golden Valley matches the approved 4 × 4 configuration", () => {
  const wholeCanvas = [
    "0,0",
    "1,0",
    "2,0",
    "3,0",
    "0,1",
    "1,1",
    "2,1",
    "3,1",
    "0,2",
    "1,2",
    "2,2",
    "3,2",
    "0,3",
    "1,3",
    "2,3",
    "3,3",
  ];
  expect([goldenValley.columns, goldenValley.rows]).toEqual([4, 4]);
  expect(
    goldenValley.layers.map(
      ({ title, cells, tool, mix, integrityPenalty }) => ({
        title,
        cells: cells.map(cellKey),
        tool,
        percentages: [mix.water, mix.oil, mix.acid],
        integrityPenalty,
      }),
    ),
  ).toEqual([
    {
      title: "Surface Dirt",
      cells: wholeCanvas,
      tool: "swab",
      percentages: [70, 30, 0],
      integrityPenalty: 10,
    },
    {
      title: "Overpaint",
      cells: ["1,1", "2,1", "1,2", "2,2"],
      tool: "brush",
      percentages: [20, 70, 10],
      integrityPenalty: 10,
    },
    {
      title: "Aged Varnish",
      cells: wholeCanvas,
      tool: "heat_lamp",
      percentages: [10, 20, 70],
      integrityPenalty: 10,
    },
  ]);
  expect(goldenValley.layers.map((layer) => layer.clues.join("\n"))).toEqual([
    "The outer film is loose and dry. Begin with the gentlest treatment.\nKeep acid out of this first mixture.\nUse seven parts water to three parts oil.\nTreat the whole canvas with a soft swab.",
    "A later repair hides the heart of the landscape.\nThe solution is oil-led, but a small acidic note is needed.\nUse two parts water, seven parts oil, and one part acid.\nUse the brush on the four centre cells.",
    "The final amber veil covers the entire landscape.\nThis treatment is acid-led, warmed carefully with a heat lamp.\nUse one part water, two parts oil, and seven parts acid.\nTreat every canvas cell.",
  ]);
  expect(Object.isFrozen(goldenValley.layers[0].cells[0])).toBe(true);
});

test("content validation rejects nonplayable layers and solvent input enforces whole percentages", () => {
  const [layer] = goldenValley.layers;
  for (const invalid of [
    { cells: [...layer.cells, layer.cells[0]] },
    { cells: [{ x: goldenValley.columns, y: 0 }] },
    { mix: { water: 70, oil: 20, acid: 0 } },
    { integrityPenalty: -1 },
  ]) {
    expect(() =>
      definePainting({ ...goldenValley, layers: [{ ...layer, ...invalid }] }),
    ).toThrow("Invalid layer configuration");
  }

  expect(isSolventReady({ water: 0, oil: 100, acid: 0 })).toBe(true);
  expect(isSolventReady({ water: 101, oil: -1, acid: 0 })).toBe(false);
  expect(isSolventReady({ water: 49.5, oil: 50.5, acid: 0 })).toBe(false);
});
