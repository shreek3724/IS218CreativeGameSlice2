<script lang="ts">
  import { onMount } from "svelte";

  let dialog: HTMLDialogElement;
  onMount(() => dialog.showModal());
</script>

<dialog
  aria-labelledby="how-to-play"
  bind:this={dialog}
  oncancel={(event) => event.preventDefault()}
>
  <header>
    <h2 id="how-to-play">How to Play!</h2>
    <form method="dialog">
      <button aria-label="Close instructions">X</button>
    </form>
  </header>
  <ol>
    <li>Read the Note</li>
    <li>Mix the Solvent from the Note</li>
    <li>
      Click on a Square, and then Click Apply Solvent. If the solvent is
      correct, it will be cleaned, if incorrect, no visual change will occur.
    </li>
    <li>
      For every wrong move, the painting integrity degrades, as seen in the
      progress bar.
    </li>
    <li>
      After all cleaning is done per applicable cell per layer, the painting
      restoration is complete!
    </li>
  </ol>
</dialog>

<style>
  dialog {
    box-sizing: border-box;
    inline-size: min(32rem, calc(100% - 2rem));
    max-block-size: calc(100% - 2rem);
    padding: clamp(1rem, 4vw, 1.5rem);
    color: var(--ink);
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 1.5rem;
  }

  dialog::backdrop {
    background: rgb(0 0 0 / 50%);
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  h2 {
    margin: 0;
  }

  ol {
    display: grid;
    gap: 0.5rem;
    margin-block-end: 0;
    padding-inline-start: 1.5rem;
  }
</style>
