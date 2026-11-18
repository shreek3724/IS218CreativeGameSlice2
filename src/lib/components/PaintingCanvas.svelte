<script lang="ts">
  import type { Painting } from "../domain/painting";
  import {
    paintingHeight,
    paintingWidth,
  } from "../rendering/golden-valley-art";
  import { renderPainting } from "../rendering/restoration";

  interface Props {
    painting: Painting;
    layerIndex?: number;
    clearedCells?: readonly string[];
    element?: HTMLCanvasElement;
  }

  let {
    painting,
    layerIndex,
    clearedCells = [],
    element = $bindable(),
  }: Props = $props();

  $effect(() => {
    const ctx = element?.getContext("2d");
    if (ctx)
      renderPainting(
        ctx,
        painting,
        layerIndex ?? painting.layers.length,
        clearedCells,
      );
  });
</script>

<canvas
  bind:this={element}
  width={paintingWidth}
  height={paintingHeight}
  aria-hidden="true"
></canvas>

<style>
  canvas {
    display: block;
    inline-size: 100%;
    block-size: auto;
    background: #f5ead6;
  }
</style>
