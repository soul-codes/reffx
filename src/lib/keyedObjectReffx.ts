import { Disposer } from "./Disposer";
import { MapConstructor, keyedReffx } from "./keyedReffx";

/**
 * Like `keyedReffx` but the effect can return a referentially stable object that
 * exposes further functionality to be used while the effect is active.
 * @param effect
 */
export function keyedObjectReffx<K, T, U = readonly [T, Disposer]>(
  effect: (key: K) => readonly [T, Disposer],
  decorate: (value: T, disposer: Disposer) => U = (value, disposer) =>
    ([value, disposer] as unknown) as U,
  MapImpl: MapConstructor<K> = Map
) {
  const valueMap = new MapImpl<T>();
  const fx = keyedReffx((key: K) => {
    const [value, disposer] = effect(key);
    valueMap.set(key, value);
    return () => {
      valueMap.delete(key);
      disposer();
    };
  }, MapImpl);

  /**
   * Adds a reference to the maintained effect. If this is the first reference,
   * the effect will be invoked. Returns a tuple of the effect object and a
   * disposer that removes this reference.
   */
  return function addRef(key: K, diagnosticTag?: unknown): U {
    const disposer = fx(key, diagnosticTag);
    return decorate(valueMap.get(key)!, disposer);
  };
}
