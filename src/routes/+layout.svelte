<script lang="ts">
  import { resolve } from "$app/paths";

  let { children } = $props();
</script>

<nav aria-label="Main">
  <a href={resolve("/")}>Sign in</a>
  <a href={resolve("/game")}>Game</a>
  <a href={resolve("/results")}>Results</a>
</nav>

<main>
  {@render children()}
</main>
