<script lang="ts">
  import PaintingCanvas from "./PaintingCanvas.svelte";
  import { cellKey, type Cell, type Painting } from "../domain/painting";

  interface Props {
    painting: Painting;
    layerIndex: number;
    selected: Cell | null;
    clearedCells: readonly string[];
    select: (cell: Cell) => void;
  }

  let { painting, layerIndex, selected, clearedCells, select }: Props =
    $props();
  let { rows, columns } = $derived(painting);
  const keys = new Map([
    ["ArrowUp", { x: 0, y: -1 }],
    ["ArrowDown", { x: 0, y: 1 }],
    ["ArrowLeft", { x: -1, y: 0 }],
    ["ArrowRight", { x: 1, y: 0 }],
  ]);
  let focusIndex = $state(0);
  const buttons: HTMLButtonElement[] = [];
  let cells = $derived(
    Array.from({ length: rows * columns }, (_, index) => ({
      x: index % columns,
      y: Math.floor(index / columns),
    })),
  );

  function moveFocus(event: KeyboardEvent, cell: Cell) {
    const delta = keys.get(event.key);
    if (!delta) return;

    event.preventDefault();
    const x = Math.min(columns - 1, Math.max(0, cell.x + delta.x));
    const y = Math.min(rows - 1, Math.max(0, cell.y + delta.y));
    buttons[y * columns + x]?.focus();
  }
</script>

<fieldset aria-describedby="grid-help">
  <legend>Canvas cells</legend>
  <p id="grid-help">Use the arrow keys to move and Space or Enter to select.</p>
  <div class="painting-frame">
    <div class="surface">
      <PaintingCanvas {painting} {layerIndex} {clearedCells} />
      <div class="cells" style:--columns={columns} style:--rows={rows}>
        {#each cells as cell, index (index)}
          {@const label = `Row ${cell.y + 1}, column ${cell.x + 1}`}
          {@const cleared = clearedCells.includes(cellKey(cell))}
          <button
            bind:this={buttons[index]}
            type="button"
            aria-label={cleared ? `${label}, cleared` : label}
            aria-pressed={selected?.x === cell.x && selected.y === cell.y}
            tabindex={focusIndex === index ? 0 : -1}
            onfocus={() => (focusIndex = index)}
            onkeydown={(event) => moveFocus(event, cell)}
            onclick={() => select(cell)}
          >
            {#if cleared}<span aria-hidden="true">✓</span>{/if}
          </button>
        {/each}
      </div>
    </div>
  </div>
</fieldset>

<style>
  fieldset {
    border: 0;
    min-inline-size: 0;
    padding: 0;
    margin: 0;
  }

  legend {
    padding: 0;
    font-weight: 750;
  }

  .surface {
    position: relative;
  }

  .cells {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
    grid-template-rows: repeat(var(--rows), minmax(0, 1fr));
  }

  button {
    display: grid;
    align-items: end;
    justify-items: end;
    border: 1px solid #fff8e877;
    border-radius: 0;
    background: transparent;
    color: #183a31;
    padding: 0.35rem;
  }

  button:hover {
    background: #fff8e826;
  }

  button[aria-pressed="true"],
  button:focus-visible {
    outline: 2px solid #fff8e8;
    outline-offset: -3px;
    box-shadow: inset 0 0 0 5px #25483b;
    z-index: 1;
  }

  button span {
    display: grid;
    place-items: center;
    background: #f8f5ea;
    inline-size: 1.35rem;
    block-size: 1.35rem;
    border-radius: 50%;
    font-weight: 750;
  }
</style>
