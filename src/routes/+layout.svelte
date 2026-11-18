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
  :global(body) {
    margin: 0;
    font-family: system-ui, sans-serif;
    line-height: 1.5;
  }

  :global(:focus-visible) {
    outline: 3px solid currentColor;
    outline-offset: 3px;
  }

  :global(button, input) {
    font: inherit;
  }

  header,
  main {
    max-inline-size: 64rem;
    margin-inline: auto;
    padding: 1rem;
  }

  nav {
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem;
  }
</style>
