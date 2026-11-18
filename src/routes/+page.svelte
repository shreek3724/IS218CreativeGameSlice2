<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import PaintingCanvas from "../lib/components/PaintingCanvas.svelte";
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

<section class="home">
  <div class="preview" aria-hidden="true">
    <div class="miniature"><PaintingCanvas painting={goldenValley} /></div>
  </div>
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
      <input
        id="display-name"
        bind:value={displayName}
        maxlength="50"
        required
      />
      <button type="submit">Start restoration</button>
      {#if error}
        <p role="alert">{error}</p>
      {/if}
    </form>
    <p>Your display name and restoration result are kept for this session.</p>
  {/if}
</section>

<style>
  .home {
    text-align: center;
    padding-block: clamp(1rem, 6vw, 4rem);
  }

  .preview {
    display: grid;
    place-items: center;
    max-inline-size: 31rem;
    margin-inline: auto;
    position: relative;
    isolation: isolate;
  }

  .preview::before,
  .preview::after {
    content: "";
    position: absolute;
    inline-size: clamp(2rem, 9vw, 4.5rem);
    aspect-ratio: 1;
    background: var(--sage);
    border-radius: 100% 0 100% 0;
    z-index: -1;
  }

  .preview::before {
    inset-inline-start: 2%;
    inset-block-start: 5%;
    transform: rotate(-27deg);
  }

  .preview::after {
    inset-inline-end: 2%;
    inset-block-end: 5%;
    transform: rotate(25deg);
  }

  .miniature {
    inline-size: clamp(10rem, 36vw, 17rem);
    aspect-ratio: 1.35;
    border: 0.7rem solid var(--pink);
    border-radius: 1.2rem;
    overflow: hidden;
    display: grid;
    align-content: center;
    background: var(--card);
    box-shadow: 0 0.4rem 0 #ddc4cc;
  }

  h1 {
    font-size: clamp(2.15rem, 7vw, 4.75rem);
    line-height: 1.07;
    letter-spacing: -0.035em;
    margin-block: 1.25rem 1.75rem;
  }

  form {
    max-inline-size: 20rem;
    margin-inline: auto;
    display: grid;
    gap: 0.65rem;
  }

  label {
    font-weight: 700;
  }

  input {
    inline-size: 100%;
  }
</style>
