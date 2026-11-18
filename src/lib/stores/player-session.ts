import { GameSession, type RestorationResult } from "../domain/game-session";
import type { Painting } from "../domain/painting";

export class PlayerSession {
  #name: string | null = null;
  #game: GameSession | null = null;
  #savedResult: RestorationResult | null = null;

  get name() {
    return this.#name;
  }

  get game() {
    return this.#game;
  }

  get savedResult() {
    return this.#savedResult && { ...this.#savedResult };
  }

  signIn(displayName: string): boolean {
    const name = displayName.trim();
    if (!name) return false;

    this.signOut();
    this.#name = name;
    return true;
  }

  startPainting(painting: Painting): GameSession | null {
    if (this.#name === null) return null;

    this.#game = new GameSession(painting);
    return this.#game;
  }

  saveResult(): RestorationResult | null {
    const result = this.#game?.result;
    if (!result) return null;

    this.#savedResult = result;
    return this.savedResult;
  }

  signOut() {
    this.#name = null;
    this.#game = null;
    this.#savedResult = null;
  }
}
