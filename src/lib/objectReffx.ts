import { Disposer } from "./Disposer";
import { reffx } from "./reffx";

/**
 * Like `reffx` but the effect can return a referentially stable object that
 * exposes further functionality to be used while the effect is active.
 * @param effect
 */
export function objectReffx<T, U = readonly [T, Disposer]>(
  effect: () => readonly [T, Disposer],
  decorate: (value: T, disposer: Disposer) => U = (value, disposer) =>
    ([value, disposer] as unknown) as U
) {
  let value!: T;
  const fx = reffx(() => {
    const [_value, disposer] = effect();
    value = _value;
    return disposer;
  });

  /**
   * Adds a reference to the maintained effect. If this is the first reference,
   * the effect will be invoked. Returns a tuple of the effect object and a
   * disposer that removes this reference.
   */
  return function addRef(diagnosticTag?: unknown): U {
    const disposer = fx(diagnosticTag);
    return decorate(value, disposer);
  };
}
