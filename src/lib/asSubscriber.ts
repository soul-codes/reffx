import { Disposer } from "./Disposer";

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
