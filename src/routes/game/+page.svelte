<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import GameBoard from "../../lib/components/GameBoard.svelte";
  import HowToPlay from "../../lib/components/HowToPlay.svelte";
  import SessionRequired from "../../lib/components/SessionRequired.svelte";
  import SignOutButton from "../../lib/components/SignOutButton.svelte";
  import { getPlayer } from "../../lib/stores/player-context";

  const player = getPlayer();

  function complete() {
    $player.saveResult();
    player.set($player);
    void goto(resolve("/results"));
  }
</script>

<svelte:head>
  <title>Game | Art Conservator</title>
</svelte:head>

<h1>Game</h1>

{#if !$player.game}
  <SessionRequired />
{:else if $player.game.result}
  <p>Restoration complete.</p>
  <a href={resolve("/results")}>View saved restoration</a>
  <SignOutButton />
{:else}
  <GameBoard game={$player.game} {complete} />
  <SignOutButton />
  <HowToPlay />
{/if}
