<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import SessionRequired from "../../lib/components/SessionRequired.svelte";
  import SignOutButton from "../../lib/components/SignOutButton.svelte";
  import { goldenValley } from "../../lib/content/golden-valley";
  import { getPlayer } from "../../lib/stores/player-context";

  const player = getPlayer();
  let result = $derived($player.savedResult);

  function replay() {
    $player.startPainting(goldenValley);
    player.set($player);
    void goto(resolve("/game"));
  }
</script>

<svelte:head>
  <title>Results | Art Conservator</title>
</svelte:head>

<h1>Results</h1>

{#if result}
  <h2>Saved restoration</h2>
  <p>{result.paintingTitle} restored by {$player.name}.</p>
  <dl>
    <dt>Score</dt>
    <dd>{result.score} / 100</dd>
    <dt>Integrity</dt>
    <dd>{result.integrity}%</dd>
    <dt>Correct treatments</dt>
    <dd>{result.correctMoves} / {result.attempts}</dd>
  </dl>
  <p>This result is saved for this session.</p>
  <button type="button" onclick={replay}>Play again</button>
  <SignOutButton />
{:else if $player.name}
  <p>Complete the painting to save a restoration result.</p>
  <a href={resolve("/game")}>Continue restoration</a>
  <SignOutButton />
{:else}
  <SessionRequired />
{/if}
