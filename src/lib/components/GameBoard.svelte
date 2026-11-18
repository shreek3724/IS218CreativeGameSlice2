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
  <div class="controls">
    <section class="panel artwork" aria-label="Painting">
      <h2>{game.painting.title}</h2>
      <CellGrid
        painting={game.painting}
        layerIndex={snapshot.layerIndex}
        selected={snapshot.selectedCell}
        clearedCells={snapshot.clearedCells}
        select={selectCell}
      />
      <div class="integrity">
        <label for="painting-integrity">Painting integrity</label>
        <strong>{snapshot.integrity}%</strong>
        <progress id="painting-integrity" value={snapshot.integrity} max="100"
        ></progress>
      </div>
    </section>

    <div class="treatment">
      <section class="panel layer" aria-label="Restoration progress">
        <p class="layer-count">
          Layer {snapshot.layerIndex + 1} of {game.painting.layers.length}
        </p>
        <h3>{snapshot.activeLayer.title}</h3>
        <p>
          {snapshot.clearedCells.length} of {snapshot.activeLayer.cells.length} cells
          cleared
        </p>
      </section>
      <section class="panel notes" aria-label="Current note">
        <h3>Current note</h3>
        <ul aria-label="Layer clues">
          {#each snapshot.activeLayer.clues as clue (clue)}
            <li>{clue}</li>
          {/each}
        </ul>
      </section>
      <fieldset class="panel tools">
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

      {#if !snapshot.selectedCell || !snapshot.selectedTool}
        <p>Select a cell and a tool before applying solvent.</p>
      {/if}
      <div class="actions">
        <button
          type="button"
          class="primary"
          disabled={!snapshot.canApply ||
            !snapshot.selectedCell ||
            !snapshot.selectedTool}
          onclick={applyTreatment}
        >
          Apply Solvent
        </button>
        <button type="button" onclick={restart}>Restart Painting</button>
      </div>
      <p class="feedback" role="status" aria-label="Treatment feedback">
        {feedback}
      </p>
    </div>
  </div>
{/if}

<style>
  .controls,
  .treatment {
    display: grid;
    gap: 1rem;
    align-items: start;
  }

  @media (min-width: 55rem) {
    .controls {
      grid-template-columns: minmax(0, 1.12fr) minmax(0, 1fr);
    }
  }

  .artwork h2 {
    margin-block: 0 0.75rem;
  }

  .integrity {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.45rem;
    margin-block-start: 1.25rem;
  }

  progress {
    grid-column: 1 / -1;
    inline-size: 100%;
    accent-color: #8c64b5;
  }

  .layer :is(p, h3),
  .notes h3,
  .feedback {
    margin: 0;
  }

  .layer-count {
    font-weight: 700;
  }

  .tools {
    min-inline-size: 0;
    border: 1px solid var(--line);
    margin: 0;
  }

  legend {
    padding-inline: 0.25rem;
    font-weight: 750;
  }

  .tools label {
    display: inline-block;
    margin-inline-end: 1rem;
    padding-block: 0.25rem;
  }

  .notes {
    background: var(--note);
  }

  .notes ul {
    margin-block-end: 0;
    padding-inline-start: 1.25rem;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .actions .primary {
    flex: 1;
  }

  .feedback {
    min-block-size: 1.5em;
    font-weight: 650;
  }
</style>
