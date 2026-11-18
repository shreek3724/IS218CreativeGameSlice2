<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import SignOutButton from "../lib/components/SignOutButton.svelte";
  import { goldenValley } from "../lib/content/golden-valley";
  import { getPlayer } from "../lib/stores/player-context";

  const player = getPlayer();
  let displayName = $state("");
  let error = $state("");

  function start(event: SubmitEvent) {
    event.preventDefault();
    if (!$player.signIn(displayName)) {
      error = "Enter a display name.";
      return;
    }
    $player.startPainting(goldenValley);
    player.set($player);
    displayName = "";
    error = "";
    void goto(resolve("/game"));
  }
</script>

<svelte:head>
  <title>Art Conservator</title>
</svelte:head>

<h1>Art Conservator</h1>

{#if $player.name}
  <p>Playing as {$player.name}.</p>
  {#if $player.game?.result}
    <a href={resolve("/results")}>View saved restoration</a>
  {:else}
    <a href={resolve("/game")}>Continue restoration</a>
  {/if}
  <SignOutButton />
{:else}
  <form onsubmit={start}>
    <label for="display-name">Display name</label>
    <input id="display-name" bind:value={displayName} maxlength="50" required />
    <button type="submit">Start restoration</button>
    {#if error}
      <p role="alert">{error}</p>
    {/if}
  </form>
  <p>Your display name and restoration result are kept for this session.</p>
{/if}

<style>
  form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
  }

  input {
    max-inline-size: 100%;
  }
</style>
