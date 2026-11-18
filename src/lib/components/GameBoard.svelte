<script lang="ts">
  import type { GameSession } from "../domain/game-session";
  import type { Cell, SolventMix, Tool } from "../domain/painting";
  import CellGrid from "./CellGrid.svelte";
  import SolventControls from "./SolventControls.svelte";

  let { game, complete }: { game: GameSession; complete: () => void } =
    $props();
  let snapshot = $derived(game.state);
  let feedback = $state("");

  const tools: { id: Tool; label: string }[] = [
    { id: "swab", label: "Swab" },
    { id: "brush", label: "Brush" },
    { id: "heat_lamp", label: "Heat lamp" },
  ];

  const invalidFeedback = {
    "no-cell": "Select a cell first.",
    "wrong-cell": "That cell is outside the active layer.",
    "already-cleared": "That cell has already been cleared.",
    "wrong-tool": "Wrong tool for this layer.",
    "invalid-mixture": "The mixture must total 100%.",
    "wrong-mixture": "Wrong solvent mixture for this layer.",
  };

  function selectCell(cell: Cell) {
    game.selectCell(cell);
    snapshot = game.state;
  }

  function selectTool(tool: Tool) {
    game.selectTool(tool);
    snapshot = game.state;
  }

  function mixSolvent(mix: SolventMix) {
    game.setMix(mix);
    snapshot = game.state;
  }

  function applyTreatment() {
    const priorIntegrity = snapshot.integrity;
    const outcome = game.applyTreatment();
    snapshot = game.state;

    switch (outcome.status) {
      case "invalid": {
        const lost = priorIntegrity - snapshot.integrity;
        feedback = `${invalidFeedback[outcome.reason]} ${lost ? `Integrity decreased by ${lost}.` : "Integrity is at zero."}`;
        break;
      }
      case "cleared":
        feedback = `Cell cleared. ${snapshot.clearedCells.length} of ${snapshot.activeLayer?.cells.length} cleared.`;
        break;
      case "layer-unlocked":
        feedback = `Layer complete. ${snapshot.activeLayer?.title} unlocked.`;
        break;
      case "completed":
        complete();
        break;
    }
  }

  function restart() {
    game.restart();
    snapshot = game.state;
    feedback = "Painting restarted.";
  }
</script>

{#if snapshot.activeLayer}
  <h2>{game.painting.title}</h2>
  <h3>{snapshot.activeLayer.title}</h3>
  <p>Layer {snapshot.layerIndex + 1} of {game.painting.layers.length}</p>
  <ul aria-label="Layer clues">
    {#each snapshot.activeLayer.clues as clue (clue)}
      <li>{clue}</li>
    {/each}
  </ul>

  <p>Integrity <strong>{snapshot.integrity}%</strong></p>
  <p>
    {snapshot.clearedCells.length} of {snapshot.activeLayer.cells.length} cells cleared
  </p>

  <div class="controls">
    <CellGrid
      rows={game.painting.rows}
      columns={game.painting.columns}
      selected={snapshot.selectedCell}
      clearedCells={snapshot.clearedCells}
      select={selectCell}
    />
    <div class="treatment">
      <fieldset>
        <legend>Tool</legend>
        {#each tools as tool (tool.id)}
          <label>
            <input
              type="radio"
              name="tool"
              value={tool.id}
              checked={snapshot.selectedTool === tool.id}
              onchange={() => selectTool(tool.id)}
            />
            {tool.label}
          </label>
        {/each}
      </fieldset>
      <SolventControls
        mix={snapshot.mix}
        ready={snapshot.canApply}
        change={mixSolvent}
      />
    </div>
  </div>

  {#if !snapshot.selectedCell || !snapshot.selectedTool}
    <p>Select a cell and a tool before applying solvent.</p>
  {/if}
  <div class="actions">
    <button
      type="button"
      disabled={!snapshot.canApply ||
        !snapshot.selectedCell ||
        !snapshot.selectedTool}
      onclick={applyTreatment}
    >
      Apply Solvent
    </button>
    <button type="button" onclick={restart}>Restart Painting</button>
  </div>
{/if}
<p role="status" aria-label="Treatment feedback">{feedback}</p>

<style>
  .controls,
  .treatment {
    display: grid;
    gap: 1rem;
    align-items: start;
  }

  @media (min-width: 46rem) {
    .controls {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }
  }

  label {
    display: inline-block;
    margin-inline-end: 0.75rem;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-block-start: 1rem;
  }
</style>
