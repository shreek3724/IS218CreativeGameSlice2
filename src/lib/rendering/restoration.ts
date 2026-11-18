import { cellKey, type LayerType, type Painting } from "../domain/painting";
import {
  drawGoldenValley,
  paintingHeight,
  paintingWidth,
} from "./golden-valley-art";

type Coating = (ctx: CanvasRenderingContext2D) => void;

const coatings: Record<LayerType, Coating> = {
  surface_dirt(ctx) {
    ctx.fillStyle = "#45372b60";
    ctx.fillRect(0, 0, paintingWidth, paintingHeight);
    for (let point = 0; point < 520; point++) {
      const x = (point * 263 + point * point * 71) % paintingWidth;
      const y = (point * 237 + point * point * 41) % paintingHeight;
      ctx.fillStyle = point % 3 ? "#48342573" : "#c8a57c80";
      ctx.beginPath();
      ctx.arc(x, y, 0.6 + (point % 7) / 4, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  overpaint(ctx) {
    ctx.fillStyle = "#705946bc";
    ctx.fillRect(0, 0, paintingWidth, paintingHeight);
    for (let index = 0; index < 10; index++) {
      ctx.fillStyle = index % 2 ? "#9a7b5b66" : "#56453548";
      ctx.beginPath();
      ctx.ellipse(
        110 + index * 45,
        260 + (index % 4) * 67,
        115,
        29,
        -0.39,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  },
  aged_varnish(ctx) {
    const amber = ctx.createLinearGradient(0, 0, paintingWidth, paintingHeight);
    amber.addColorStop(0, "#a968244d");
    amber.addColorStop(0.5, "#d7a4406b");
    amber.addColorStop(1, "#8c51134d");
    ctx.fillStyle = amber;
    ctx.fillRect(0, 0, paintingWidth, paintingHeight);
  },
};

export function renderPainting(
  ctx: CanvasRenderingContext2D,
  painting: Painting,
  layerIndex: number,
  clearedCells: readonly string[],
) {
  drawGoldenValley(ctx);
  const cellWidth = paintingWidth / painting.columns;
  const cellHeight = paintingHeight / painting.rows;
  const cleared = new Set(clearedCells);

  // Draw inner coatings first, then the outer coatings still covering them.
  for (let index = painting.layers.length - 1; index >= layerIndex; index--) {
    const layer = painting.layers[index];
    const mask = new Path2D();
    for (const cell of layer.cells) {
      if (index !== layerIndex || !cleared.has(cellKey(cell))) {
        mask.rect(
          cell.x * cellWidth,
          cell.y * cellHeight,
          cellWidth,
          cellHeight,
        );
      }
    }
    ctx.save();
    ctx.clip(mask);
    coatings[layer.type](ctx);
    ctx.restore();
  }
}
