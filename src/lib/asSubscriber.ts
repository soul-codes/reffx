import { Disposer } from "./Disposer";

/**
 * Effect object decorator for the special case where the effect object is a
 * subscription function returning a disposer. This decorator returns a
 * subscription function whose disposer both calls the original subscription
 * disposer as well as reduces the reference count on the effect.
 * @param subscribe
 * @param removeRef
 */
export const asSubscriber = <T extends (...args: any[]) => any>(
  subscribe: (cb: T) => Disposer,
  removeRef: Disposer
) => (cb: T) => {
  const unsub = subscribe(cb);
  return () => {
    unsub();
    removeRef();
  };
};
