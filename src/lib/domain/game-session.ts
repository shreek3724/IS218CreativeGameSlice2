import {
  cellKey,
  isSolventReady,
  type Cell,
  type Painting,
  type SolventMix,
  type Tool,
} from "./painting";

const initialMix: SolventMix = { water: 0, oil: 0, acid: 0 };
const initialIntegrity = 100;

type InvalidReason =
  | "no-cell"
  | "wrong-cell"
  | "already-cleared"
  | "wrong-tool"
  | "invalid-mixture"
  | "wrong-mixture";

export type TreatmentOutcome =
  | { status: "invalid"; reason: InvalidReason }
  | { status: "cleared" | "layer-unlocked" | "completed" | "already-complete" };

export type RestorationResult = Readonly<{
  paintingId: string;
  paintingTitle: string;
  integrity: number;
  attempts: number;
  correctMoves: number;
  clueAccuracy: number;
  score: number;
}>;

export class GameSession {
  readonly painting: Painting;
  #layerIndex = 0;
  #selectedCell: Cell | null = null;
  #selectedTool: Tool | null = null;
  #mix = initialMix;
  #clearedCells = new Set<string>();
  #integrity = initialIntegrity;
  #attempts = 0;
  #correctMoves = 0;

  constructor(painting: Painting) {
    this.painting = painting;
  }

  get activeLayer() {
    return this.painting.layers[this.#layerIndex] ?? null;
  }

  get state() {
    return {
      layerIndex: this.#layerIndex,
      activeLayer: this.activeLayer,
      selectedCell: this.#selectedCell && { ...this.#selectedCell },
      selectedTool: this.#selectedTool,
      mix: { ...this.#mix },
      canApply: isSolventReady(this.#mix),
      clearedCells: [...this.#clearedCells],
      integrity: this.#integrity,
      attempts: this.#attempts,
      correctMoves: this.#correctMoves,
      completed: this.activeLayer === null,
    };
  }

  get result(): RestorationResult | null {
    if (this.activeLayer) return null;

    const clueAccuracy = (this.#correctMoves / this.#attempts) * 100;
    return {
      paintingId: this.painting.id,
      paintingTitle: this.painting.title,
      integrity: this.#integrity,
      attempts: this.#attempts,
      correctMoves: this.#correctMoves,
      clueAccuracy,
      score: Math.round(this.#integrity * 0.6 + clueAccuracy * 0.4),
    };
  }

  selectCell(cell: Cell) {
    this.#selectedCell = { ...cell };
  }

  selectTool(tool: Tool) {
    this.#selectedTool = tool;
  }

  setMix(mix: SolventMix) {
    this.#mix = { ...mix };
  }

  applyTreatment(): TreatmentOutcome {
    const layer = this.activeLayer;
    if (!layer) return { status: "already-complete" };

    this.#attempts++;
    const cell = this.#selectedCell;
    if (!cell) return this.#reject("no-cell", layer.integrityPenalty);

    if (!layer.cells.some(({ x, y }) => x === cell.x && y === cell.y)) {
      return this.#reject("wrong-cell", layer.integrityPenalty);
    }
    const target = cellKey(cell);
    if (this.#clearedCells.has(target)) {
      return this.#reject("already-cleared", layer.integrityPenalty);
    }
    if (this.#selectedTool !== layer.tool) {
      return this.#reject("wrong-tool", layer.integrityPenalty);
    }
    if (!isSolventReady(this.#mix)) {
      return this.#reject("invalid-mixture", layer.integrityPenalty);
    }
    if (
      this.#mix.water !== layer.mix.water ||
      this.#mix.oil !== layer.mix.oil ||
      this.#mix.acid !== layer.mix.acid
    ) {
      return this.#reject("wrong-mixture", layer.integrityPenalty);
    }

    this.#clearedCells.add(target);
    this.#correctMoves++;
    if (this.#clearedCells.size < layer.cells.length)
      return { status: "cleared" };

    this.#layerIndex++;
    if (!this.activeLayer) return { status: "completed" };

    this.#clearedCells.clear();
    return { status: "layer-unlocked" };
  }

  restart() {
    this.#layerIndex = 0;
    this.#selectedCell = null;
    this.#selectedTool = null;
    this.#mix = initialMix;
    this.#clearedCells.clear();
    this.#integrity = initialIntegrity;
    this.#attempts = 0;
    this.#correctMoves = 0;
  }

  #reject(reason: InvalidReason, penalty: number): TreatmentOutcome {
    this.#integrity = Math.max(0, this.#integrity - penalty);
    return { status: "invalid", reason };
  }
}
