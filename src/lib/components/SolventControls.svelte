<script lang="ts">
  import type { SolventMix } from "../domain/painting";

  interface Props {
    mix: SolventMix;
    ready: boolean;
    change: (mix: SolventMix) => void;
  }

  let { mix, ready, change }: Props = $props();
  const ingredients = [
    { id: "water", label: "Water" },
    { id: "oil", label: "Oil" },
    { id: "acid", label: "Acid" },
  ] as const;
  let total = $derived(mix.water + mix.oil + mix.acid);

  function update(ingredient: keyof SolventMix, input: HTMLInputElement) {
    const value = input.valueAsNumber;
    const percentage = Number.isNaN(value)
      ? value
      : Math.max(0, Math.min(100, Math.trunc(value)));

    if (!Number.isNaN(percentage) && value !== percentage) {
      input.value = String(percentage);
    }
    change({ ...mix, [ingredient]: percentage });
  }
</script>

<fieldset aria-describedby="solvent-total">
  <legend>Solvent mixture</legend>
  {#each ingredients as { id, label } (id)}
    <div class="ingredient">
      <label for={`${id}-slider`}>{label} slider</label>
      <input
        id={`${id}-slider`}
        type="range"
        min="0"
        max="100"
        step="1"
        value={Number.isNaN(mix[id]) ? 0 : mix[id]}
        oninput={(event) => update(id, event.currentTarget)}
      />
      <label for={`${id}-percentage`}>{label} percentage</label>
      <input
        id={`${id}-percentage`}
        type="number"
        min="0"
        max="100"
        step="1"
        inputmode="numeric"
        value={Number.isNaN(mix[id]) ? undefined : mix[id]}
        oninput={(event) => update(id, event.currentTarget)}
      />
    </div>
  {/each}
  <p id="solvent-total">
    {#if Number.isNaN(total)}
      Enter a percentage for water, oil, and acid. The mix must total 100%.
    {:else if ready}
      Total: 100%. Mixture ready.
    {:else}
      Total: {total}%. {total < 100 ? "Add" : "Remove"}
      {Math.abs(100 - total)}
      percentage points to reach 100%.
    {/if}
  </p>
</fieldset>

<style>
  fieldset {
    min-inline-size: 0;
  }

  .ingredient {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 0.25rem 0.75rem;
    margin-block: 0.5rem;
    align-items: center;
  }

  input {
    min-inline-size: 0;
    max-inline-size: 100%;
  }
</style>
