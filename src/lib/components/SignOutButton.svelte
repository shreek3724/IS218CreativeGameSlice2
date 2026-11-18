<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { getPlayer } from "../stores/player-context";

  const player = getPlayer();

  function signOut() {
    $player.signOut();
    player.set($player);
    void goto(resolve("/"));
  }
</script>

<button type="button" onclick={signOut}>Sign out</button>
