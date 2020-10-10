/**
 * Represents a disposer function that cleans up an effect.
 */
export interface Disposer {
  (): void;
}
