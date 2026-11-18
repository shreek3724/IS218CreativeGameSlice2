export type Tool = "swab" | "brush" | "heat_lamp";

export type LayerType = "surface_dirt" | "overpaint" | "aged_varnish";

export type Cell = Readonly<{ x: number; y: number }>;

export type SolventMix = Readonly<{
  water: number;
  oil: number;
  acid: number;
}>;

export type PaintingLayer = Readonly<{
  id: string;
  title: string;
  type: LayerType;
  cells: readonly Cell[];
  tool: Tool;
  mix: SolventMix;
  clues: readonly string[];
  overlay: string;
  integrityPenalty: number;
}>;

export type Painting = Readonly<{
  id: string;
  title: string;
  columns: number;
  rows: number;
  layers: readonly PaintingLayer[];
}>;

export function cellKey({ x, y }: Cell): string {
  return `${x},${y}`;
}

export function isSolventReady({ water, oil, acid }: SolventMix): boolean {
  return (
    [water, oil, acid].every(
      (value) => Number.isInteger(value) && value >= 0 && value <= 100,
    ) && water + oil + acid === 100
  );
}
