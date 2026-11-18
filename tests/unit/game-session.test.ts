import { expect, test } from "vitest";
import { goldenValley } from "../../src/lib/content/golden-valley";
import { GameSession } from "../../src/lib/domain/game-session";
import type { PaintingLayer } from "../../src/lib/domain/painting";
import { PlayerSession } from "../../src/lib/stores/player-session";
import { fourLayerPainting } from "./fixtures/four-layer-painting";

function setTreatment(game: GameSession, layer: PaintingLayer) {
  game.selectTool(layer.tool);
  game.setMix(layer.mix);
}

function clearLayer(game: GameSession, layer: PaintingLayer) {
  setTreatment(game, layer);
  return layer.cells.map((cell) => {
    game.selectCell(cell);
    return game.applyTreatment().status;
  });
}

test("Golden Valley clears in order and completes after 36 correct treatments", () => {
  const game = new GameSession(goldenValley);
  expect(game.state.integrity).toBe(100);

  for (const [index, layer] of goldenValley.layers.entries()) {
    expect(game.state).toMatchObject({
      layerIndex: index,
      activeLayer: layer,
      clearedCells: [],
    });
    expect(game.result).toBeNull();
    const outcomes = clearLayer(game, layer);
    expect(outcomes.slice(0, -1)).toEqual(
      Array(layer.cells.length - 1).fill("cleared"),
    );
    expect(outcomes.at(-1)).toBe(index === 2 ? "completed" : "layer-unlocked");
  }

  expect(game.state).toMatchObject({ activeLayer: null, completed: true });
  expect(game.applyTreatment().status).toBe("already-complete");
  expect(game.result).toMatchObject({
    attempts: 36,
    correctMoves: 36,
    integrity: 100,
    score: 100,
  });
});

test("incorrect and repeated treatments count as attempts and never clear another cell", () => {
  const game = new GameSession(goldenValley);
  const [dirt, overpaint] = goldenValley.layers;
  game.selectCell({ x: 0, y: 0 });
  game.selectTool(overpaint.tool);
  game.setMix(overpaint.mix);
  expect(game.applyTreatment()).toEqual({
    status: "invalid",
    reason: "wrong-tool",
  });

  game.selectTool(dirt.tool);
  game.setMix({ water: 70, oil: 20, acid: 0 });
  expect(game.state.canApply).toBe(false);
  expect(game.applyTreatment()).toEqual({
    status: "invalid",
    reason: "invalid-mixture",
  });

  game.setMix(overpaint.mix);
  expect(game.state.canApply).toBe(true);
  expect(game.applyTreatment()).toEqual({
    status: "invalid",
    reason: "wrong-mixture",
  });

  game.setMix(dirt.mix);
  expect(game.applyTreatment().status).toBe("cleared");
  expect(game.applyTreatment()).toEqual({
    status: "invalid",
    reason: "already-cleared",
  });
  expect(game.state).toMatchObject({
    clearedCells: ["0,0"],
    attempts: 5,
    integrity: 60,
  });

  clearLayer(game, { ...dirt, cells: dirt.cells.slice(1) });
  setTreatment(game, overpaint);
  game.selectCell({ x: 0, y: 0 });
  expect(game.applyTreatment()).toEqual({
    status: "invalid",
    reason: "wrong-cell",
  });
  expect(game.state).toMatchObject({
    layerIndex: 1,
    clearedCells: [],
    attempts: 21,
    integrity: 50,
  });

  clearLayer(game, overpaint);
  clearLayer(game, goldenValley.layers[2]);
  expect(game.result).toMatchObject({
    attempts: 41,
    correctMoves: 36,
    integrity: 50,
    score: 65,
  });
});

test("zero integrity still allows completion and restart restores a fresh painting", () => {
  const game = new GameSession(goldenValley);
  game.selectCell({ x: 0, y: 0 });

  for (let attempt = 0; attempt < 11; attempt++) game.applyTreatment();
  expect(game.state.integrity).toBe(0);

  for (const layer of goldenValley.layers) clearLayer(game, layer);
  expect(game.result).toMatchObject({ attempts: 47, integrity: 0, score: 31 });

  game.restart();
  expect(game.result).toBeNull();
  expect(game.state).toEqual(new GameSession(goldenValley).state);
});

test("the internal four-layer fixture completes and uses its own penalties and score", () => {
  const game = new GameSession(fourLayerPainting);
  game.selectCell({ x: 1, y: 1 });
  expect(game.applyTreatment()).toEqual({
    status: "invalid",
    reason: "wrong-cell",
  });
  expect(game.state.integrity).toBe(85);

  const outcomes = fourLayerPainting.layers.flatMap((layer) =>
    clearLayer(game, layer),
  );
  expect(outcomes).toEqual([
    "layer-unlocked",
    "layer-unlocked",
    "layer-unlocked",
    "completed",
  ]);
  expect(game.result).toMatchObject({
    clueAccuracy: 80,
    integrity: 85,
    score: 83,
  });
});

test("sign-out clears the simulated player, active game, and saved record", () => {
  const player = new PlayerSession();
  expect(player.startPainting(fourLayerPainting)).toBeNull();
  expect(player.signIn("  ")).toBe(false);
  expect(player.signIn(" Ada ")).toBe(true);
  expect(player.name).toBe("Ada");

  const game = player.startPainting(fourLayerPainting)!;
  expect(player.saveResult()).toBeNull();
  for (const layer of fourLayerPainting.layers) clearLayer(game, layer);
  expect(player.saveResult()).toEqual(game.result);

  player.startPainting(goldenValley);
  expect(player.savedResult?.paintingId).toBe(fourLayerPainting.id);
  player.signOut();
  expect([player.name, player.game, player.savedResult]).toEqual([
    null,
    null,
    null,
  ]);
  expect(player.signIn("Bea")).toBe(true);
  expect(player.savedResult).toBeNull();
});
