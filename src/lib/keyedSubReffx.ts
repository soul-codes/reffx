import { asSubscriber } from "./asSubscriber";
import { Disposer } from "./Disposer";
import { keyedObjectReffx } from "./keyedObjectReffx";

export const keyedSubReffx = <T extends (...args: any[]) => any, K>(
  effect: (
    key: K
  ) => readonly [subscriber: (cb: T) => Disposer, disposer: Disposer]
) => keyedObjectReffx(effect, asSubscriber);
