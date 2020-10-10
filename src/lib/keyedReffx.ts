import { Disposer } from "./Disposer";
import { reffx } from "./reffx";

/**
 * Like `reffx`, but with the effect being keyed. The resulting function will
 * create as many effects as the number of referentially distinct key values
 * they are called with.
 * @param effect
 */
export function keyedReffx<T>(effect: (key: T) => Disposer) {
  const fxs = new Map<T, () => Disposer>();

  /**
   * Adds a reference to the maintained effect at key `key`. If this is the
   * first reference, the effect will be invoked. Returns a disposer that
   * removes this reference.
   */
  return function addRef(key: T, diagnosticTag?: unknown): Disposer {
    const fx =
      fxs.get(key) ||
      reffx(() => {
        const disposeFx = effect(key);
        return () => (fxs.delete(key), disposeFx());
      });
    fxs.set(key, fx);
    return fx(diagnosticTag);
  };
}
