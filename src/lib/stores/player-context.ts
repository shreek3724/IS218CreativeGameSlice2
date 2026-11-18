import { createContext } from "svelte";
import type { Writable } from "svelte/store";
import type { PlayerSession } from "./player-session";

export const [getPlayer, setPlayer] = createContext<Writable<PlayerSession>>();
