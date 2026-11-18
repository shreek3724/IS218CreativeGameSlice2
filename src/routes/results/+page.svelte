<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import PaintingCanvas from "../../lib/components/PaintingCanvas.svelte";
  import SessionRequired from "../../lib/components/SessionRequired.svelte";
  import SignOutButton from "../../lib/components/SignOutButton.svelte";
  import { goldenValley } from "../../lib/content/golden-valley";
  import { getPlayer } from "../../lib/stores/player-context";

  const player = getPlayer();
  let result = $derived($player.savedResult);
  let canvas = $state<HTMLCanvasElement>();
  let exportError = $state("");

  function replay() {
    $player.startPainting(goldenValley);
    player.set($player);
    void goto(resolve("/game"));
  }

  function download() {
    exportError = "";
    canvas?.toBlob((png) => {
      if (!png) {
        exportError = "The PNG could not be created. Try downloading again.";
        return;
      }

      const url = URL.createObjectURL(png);
      const link = document.createElement("a");
      link.href = url;
      link.download = "golden-valley-restored.png";
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  }
</script>

<svelte:head>
  <title>Results | Art Conservator</title>
</svelte:head>

{#if result}
  <h1>Restoration complete</h1>
  <div class="results">
    <figure class="panel restored">
      <div class="painting-frame">
        <PaintingCanvas painting={goldenValley} bind:element={canvas} />
      </div>
      <figcaption>
        <strong>{result.paintingTitle}</strong>
        <p>
          A sunlit valley with a winding river, rolling hills, and a cottage.
        </p>
      </figcaption>
    </figure>
    <div class="details">
      <section class="panel score" aria-labelledby="saved-restoration">
        <h2 id="saved-restoration">Saved restoration</h2>
        <p>{result.paintingTitle} restored by {$player.name}.</p>
        <p class="score-value">
          <span>Final score</span><strong>{result.score} / 100</strong>
        </p>
        <dl>
          <dt id="integrity-label">Painting integrity</dt>
          <dd>
            <strong>{result.integrity}%</strong>
            <span
              >60% of final score · {(result.integrity * 0.6).toFixed(1)} / 60 points</span
            >
            <progress
              aria-labelledby="integrity-label"
              max="100"
              value={result.integrity}
            ></progress>
          </dd>
          <dt id="accuracy-label">Clue deduction accuracy</dt>
          <dd>
            <strong>{Math.round(result.clueAccuracy)}%</strong>
            <span
              >40% of final score · {(result.clueAccuracy * 0.4).toFixed(1)} / 40
              points</span
            >
            <progress
              aria-labelledby="accuracy-label"
              max="100"
              value={result.clueAccuracy}
            ></progress>
          </dd>
          <dt>Correct treatments</dt>
          <dd>{result.correctMoves} / {result.attempts}</dd>
        </dl>
        <p>This result is saved for this session.</p>
      </section>
      <div class="actions">
        <button type="button" onclick={download} disabled={!canvas}
          >Download PNG</button
        >
        <button type="button" class="primary" onclick={replay}
          >Play again</button
        >
        <SignOutButton />
      </div>
      {#if exportError}<p role="alert">{exportError}</p>{/if}
    </div>
  </div>
{:else}
  <h1>Results</h1>
  {#if $player.name}
    <p>Complete the painting to save a restoration result.</p>
    <a href={resolve("/game")}>Continue restoration</a>
    <SignOutButton />
  {:else}
    <SessionRequired />
  {/if}
{/if}

<style>
  h1 {
    margin-block-start: 0;
    font-size: clamp(1.9rem, 5vw, 3.3rem);
    line-height: 1.1;
  }

  .results,
  .details {
    display: grid;
    gap: 1rem;
    align-items: start;
  }

  @media (min-width: 52rem) {
    .results {
      grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
    }
  }

  figure {
    margin: 0;
    text-align: center;
  }

  figcaption {
    margin-block-start: 1rem;
  }

  figcaption p {
    margin-block-end: 0;
  }

  figcaption strong,
  dt {
    font-weight: 750;
  }

  h2 {
    margin-block-start: 0;
  }

  .score-value {
    display: grid;
    margin-block: 1rem;
  }

  .score-value strong {
    font-size: clamp(2.35rem, 7vw, 4.4rem);
    line-height: 1.1;
  }

  dl {
    border-block: 1px solid var(--line);
    padding-block: 1rem;
  }

  dd {
    margin: 0 0 0.6rem;
  }

  dd span,
  progress {
    display: block;
  }

  progress {
    inline-size: 100%;
    accent-color: #64846a;
  }

  dd:nth-of-type(2) progress {
    accent-color: #8c64b5;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
</style>
