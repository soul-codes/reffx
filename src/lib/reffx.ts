import { Disposer } from "./Disposer";

/**
 * Creates an effect subscription function that maintains a certain effect
 * indicated by the `effect` argument as long as there are subscribers to the
 * effect. When all subscribing references are destroyed, the effect's disposer
 * is invoked.
 * @param effect
 */
export function reffx(effect: () => Disposer) {
  const refs = new Set<{ diagnosticTag: unknown }>();
  let disposer: Disposer = noop;

  /**
   * Adds a reference to the maintained effect. If this is the first reference,
   * the effect will be invoked. Returns a disposer that removes this reference.
   */
  return function addRef(diagnosticTag?: unknown): Disposer {
    const token = { diagnosticTag };
    refs.add(token);
    if (refs.size === 1) disposer = effect();

    /**
     * Removes the reference from the maintained effect. If this is the last
     * reference, the effect will be cleaned up.
     */
    return function removeRef() {
      const isEmptyBefore = !refs.size;
      refs.delete(token);
      const isEmptyAfter = !refs.size;
      if (!isEmptyBefore && isEmptyAfter) {
        const dispose = disposer;
        disposer = noop;
        dispose();
      }
    };
  };
}

function noop() {}
