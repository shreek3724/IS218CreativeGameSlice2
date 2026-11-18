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
  let total = $derived((mix.water || 0) + (mix.oil || 0) + (mix.acid || 0));
  let remaining = $derived(100 - total);

  function maximumFor(ingredient: keyof SolventMix) {
    return remaining + (mix[ingredient] || 0);
  }

  function update(ingredient: keyof SolventMix, input: HTMLInputElement) {
    const value = input.valueAsNumber;
    const percentage = Number.isNaN(value)
      ? value
      : Math.max(0, Math.min(maximumFor(ingredient), Math.trunc(value)));

    if (!Number.isNaN(percentage) && value !== percentage) {
      input.value = String(percentage);
    }
    change({ ...mix, [ingredient]: percentage });
  }
</script>

<fieldset class="panel" aria-describedby="solvent-total">
  <legend>Solvent mixture</legend>
  {#each ingredients as { id, label } (id)}
    <div class="ingredient">
      <label for={`${id}-slider`}>{label}</label>
      <input
        id={`${id}-slider`}
        type="range"
        aria-label={`${label} slider`}
        min="0"
        max={maximumFor(id)}
        step="1"
        value={Number.isNaN(mix[id]) ? 0 : mix[id]}
        oninput={(event) => update(id, event.currentTarget)}
      />
      <input
        id={`${id}-percentage`}
        type="number"
        aria-label={`${label} percentage`}
        min="0"
        max={maximumFor(id)}
        step="1"
        inputmode="numeric"
        value={Number.isNaN(mix[id]) ? undefined : mix[id]}
        oninput={(event) => update(id, event.currentTarget)}
      />
    </div>
  {/each}
  <div class="mixture-progress">
    <label for="mixture-progress">Mixture progress</label>
    <strong>{total}%</strong>
    <progress id="mixture-progress" value={total} max="100"></progress>
    <p id="solvent-total" role="status">
      {#if ready}
        Mixture ready.
      {:else if remaining > 0}
        Add {remaining}
        {remaining === 1 ? "percentage point" : "percentage points"}.
      {:else}
        Enter 0 for any blank solvent.
      {/if}
    </p>
  </div>
</fieldset>

<style>
  fieldset {
    min-inline-size: 0;
    border: 1px solid var(--line);
    margin: 0;
  }

  legend {
    padding-inline: 0.25rem;
    font-weight: 750;
  }

  .ingredient {
    display: grid;
    grid-template-columns: 3rem minmax(0, 1fr) 4.5rem;
    gap: 0.25rem 0.75rem;
    margin-block: 0.5rem;
    align-items: center;
  }

  input {
    min-inline-size: 0;
    max-inline-size: 100%;
  }

  .mixture-progress {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.45rem;
    margin-block-start: 1rem;
  }

  progress,
  #solvent-total {
    grid-column: 1 / -1;
    margin: 0;
  }

  progress {
    inline-size: 100%;
    accent-color: #507452;
  }
</style>
