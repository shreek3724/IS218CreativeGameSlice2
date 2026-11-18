import { definePainting } from "./define-painting";

const columns = 4;
const rows = 4;
const wholeCanvas = Array.from({ length: columns * rows }, (_, index) => ({
  x: index % columns,
  y: Math.floor(index / columns),
}));

export const goldenValley = definePainting({
  id: "golden-valley",
  title: "Golden Valley",
  columns,
  rows,
  layers: [
    {
      id: "surface-dirt",
      title: "Surface Dirt",
      type: "surface_dirt",
      cells: wholeCanvas,
      tool: "swab",
      mix: { water: 70, oil: 30, acid: 0 },
      clues: [
        "The outer film is loose and dry. Begin with the gentlest treatment.",
        "Keep acid out of this first mixture.",
        "Use seven parts water to three parts oil.",
        "Treat the whole canvas with a soft swab.",
      ],
      overlay: "Dark dusty film",
      integrityPenalty: 10,
    },
    {
      id: "overpaint",
      title: "Overpaint",
      type: "overpaint",
      cells: [
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
      ],
      tool: "brush",
      mix: { water: 20, oil: 70, acid: 10 },
      clues: [
        "A later repair hides the heart of the landscape.",
        "The solution is oil-led, but a small acidic note is needed.",
        "Use two parts water, seven parts oil, and one part acid.",
        "Use the brush on the four centre cells.",
      ],
      overlay: "Muddy corrective paint",
      integrityPenalty: 10,
    },
    {
      id: "aged-varnish",
      title: "Aged Varnish",
      type: "aged_varnish",
      cells: wholeCanvas,
      tool: "heat_lamp",
      mix: { water: 10, oil: 20, acid: 70 },
      clues: [
        "The final amber veil covers the entire landscape.",
        "This treatment is acid-led, warmed carefully with a heat lamp.",
        "Use one part water, two parts oil, and seven parts acid.",
        "Treat every canvas cell.",
      ],
      overlay: "Amber/yellow veil",
      integrityPenalty: 10,
    },
  ],
});
