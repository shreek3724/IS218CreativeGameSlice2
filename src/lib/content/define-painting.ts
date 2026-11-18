import { cellKey, isSolventReady, type Painting } from "../domain/painting";

export function definePainting(painting: Painting): Painting {
  const { columns, rows, layers } = painting;
  if (
    !Number.isInteger(columns) ||
    !Number.isInteger(rows) ||
    columns < 1 ||
    rows < 1 ||
    layers.length === 0
  ) {
    throw new Error(
      "A painting needs a positive grid size and at least one layer.",
    );
  }

  const layerIds = new Set<string>();
  const frozenLayers = layers.map((layer) => {
    if (!layer.id || layerIds.has(layer.id)) {
      throw new Error(`Painting ${painting.id} needs unique layer IDs.`);
    }
    layerIds.add(layer.id);

    const validCells = layer.cells.every(
      ({ x, y }) =>
        Number.isInteger(x) &&
        Number.isInteger(y) &&
        x >= 0 &&
        x < columns &&
        y >= 0 &&
        y < rows,
    );

    if (
      layer.cells.length === 0 ||
      !validCells ||
      new Set(layer.cells.map(cellKey)).size !== layer.cells.length ||
      !isSolventReady(layer.mix) ||
      !Number.isInteger(layer.integrityPenalty) ||
      layer.integrityPenalty < 0 ||
      layer.clues.length === 0 ||
      layer.clues.some((clue) => !clue.trim())
    ) {
      throw new Error(
        `Invalid layer configuration for ${painting.id}/${layer.id}.`,
      );
    }

    return Object.freeze({
      ...layer,
      cells: Object.freeze(
        layer.cells.map((cell) => Object.freeze({ ...cell })),
      ),
      mix: Object.freeze({ ...layer.mix }),
      clues: Object.freeze([...layer.clues]),
    });
  });

  return Object.freeze({ ...painting, layers: Object.freeze(frozenLayers) });
}
