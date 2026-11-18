<script lang="ts">
  import { writable } from "svelte/store";
  import { resolve } from "$app/paths";
  import { setPlayer } from "../lib/stores/player-context";
  import { PlayerSession } from "../lib/stores/player-session";

  let { children } = $props();
  setPlayer(writable(new PlayerSession()));
</script>

<header>
  <nav aria-label="Main">
    <a href={resolve("/")}>Home</a>
    <a href={resolve("/game")}>Game</a>
    <a href={resolve("/results")}>Results</a>
  </nav>
</header>

<main>
  {@render children()}
</main>

<style>
  :global(:root) {
    color-scheme: light;
    --paper: #f5f2e8;
    --ink: #304f41;
    --sage: #b1c5ac;
    --lavender: #e2d5ee;
    --pink: #ebc5d8;
    --note: #f9efc5;
    --line: #dce5d7;
    --card: #fffefa;
  }

  :global(body) {
    margin: 0;
    background: var(--paper);
    color: var(--ink);
    font-family: ui-rounded, "Avenir Next", system-ui, sans-serif;
    line-height: 1.5;
  }

  :global(:focus-visible) {
    outline: 3px solid #305343;
    outline-offset: 3px;
  }

  :global(a) {
    color: #264a3b;
  }

  :global(button, input) {
    font: inherit;
    accent-color: #507452;
  }

  :global(button) {
    min-block-size: 2.75rem;
    padding: 0.45rem 1rem;
    color: var(--ink);
    background: var(--lavender);
    border: 1px solid #a78dbd;
    border-radius: 1.25rem;
    font-weight: 700;
    cursor: pointer;
  }

  :global(button.primary) {
    background: var(--sage);
    border-color: #849e81;
  }

  :global(button:disabled) {
    background: #e7e9df;
    border-color: var(--line);
    color: #546354;
    cursor: default;
  }

  :global(input:not([type="radio"], [type="range"])) {
    box-sizing: border-box;
    padding: 0.4rem 0.65rem;
    color: var(--ink);
    background: white;
    border: 1px solid #8ca18b;
    border-radius: 0.6rem;
  }

  :global(.panel) {
    padding: clamp(0.85rem, 2.5vw, 1.5rem);
    border-radius: 1.5rem;
    background: var(--card);
  }

  :global(.painting-frame) {
    border: clamp(0.45rem, 1.5vw, 0.85rem) ridge #c8a154;
    border-radius: 0.23rem;
    background: #e4c37c;
  }

  header,
  main {
    max-inline-size: 76rem;
    margin-inline: auto;
    padding: 1rem clamp(1rem, 4vw, 2rem);
  }

  header {
    display: flex;
    justify-content: flex-end;
  }

  nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1rem;
    padding: 0.5rem 1.1rem;
    border-radius: 2rem;
    background: var(--sage);
  }

  nav a {
    padding: 0.15rem;
    font-weight: 700;
    text-underline-offset: 0.2em;
  }
</style>
