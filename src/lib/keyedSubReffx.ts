import { asSubscriber } from "./asSubscriber";
import { Disposer } from "./Disposer";
import { keyedObjectReffx } from "./keyedObjectReffx";

/**
 * Like `subReffx` but partitioned by a key of choice.
 * @param effect
 */
export const keyedSubReffx = <T extends (...args: any[]) => any, K>(
  effect: (
    key: K
  ) => readonly [subscriber: (cb: T) => Disposer, disposer: Disposer]
) => keyedObjectReffx(effect, asSubscriber);
