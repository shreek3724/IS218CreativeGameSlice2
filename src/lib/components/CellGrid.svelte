<script lang="ts">
  import { cellKey, type Cell } from "../domain/painting";

  interface Props {
    rows: number;
    columns: number;
    selected: Cell | null;
    clearedCells: readonly string[];
    select: (cell: Cell) => void;
  }

  let { rows, columns, selected, clearedCells, select }: Props = $props();
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
  <div class="cells" style:--columns={columns}>
    {#each cells as cell, index (index)}
      {@const label = `Row ${cell.y + 1}, column ${cell.x + 1}`}
      {@const cleared = clearedCells.includes(cellKey(cell))}
      <button
        bind:this={buttons[index]}
        type="button"
        aria-label={cleared ? `${label}, cleared` : undefined}
        aria-pressed={selected?.x === cell.x && selected.y === cell.y}
        tabindex={focusIndex === index ? 0 : -1}
        onfocus={() => (focusIndex = index)}
        onkeydown={(event) => moveFocus(event, cell)}
        onclick={() => select(cell)}
      >
        {label}
        {#if cleared}<span aria-hidden="true">✓</span>{/if}
      </button>
    {/each}
  </div>
</fieldset>

<style>
  fieldset {
    min-inline-size: 0;
  }

  .cells {
    display: grid;
    grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
    gap: 0.5rem;
  }

  button {
    min-block-size: 2.75rem;
    padding: 0.25rem;
    font-size: 0.875rem;
  }

  button[aria-pressed="true"] {
    font-weight: bold;
    box-shadow: inset 0 0 0 2px currentColor;
  }
</style>
