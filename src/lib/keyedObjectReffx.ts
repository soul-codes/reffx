import { Disposer } from "./Disposer";
import { keyedReffx } from "./keyedReffx";

/**
 * Like `keyedReffx` but the effect can return a referentially stable object that
 * exposes further functionality to be used while the effect is active.
 * @param effect
 */
export function keyedObjectReffx<K, T>(
  effect: (key: K) => readonly [T, Disposer]
) {
  let value!: T;
  const fx = keyedReffx((key: K) => {
    const [_value, disposer] = effect(key);
    value = _value;
    return disposer;
  });

  /**
   * Adds a reference to the maintained effect. If this is the first reference,
   * the effect will be invoked. Returns a tuple of the effect object and a
   * disposer that removes this reference.
   */
  return function addRef(
    key: K,
    diagnosticTag?: unknown
  ): readonly [T, Disposer] {
    const disposer = fx(key, diagnosticTag);
    return [value, disposer];
  };
}
