import { asSubscriber } from "./asSubscriber";
import { Disposer } from "./Disposer";
import { objectReffx } from "./objectReffx";

/**
 * Creates a subscription reffx, that is, a reference-counted effect that
 * in turn creates something that can be subscribed to. The effect function
 * should return a tuple of a subscriber function that returns its own disposer,
 * and a disposer that cleans up the effect itself.
 * @param effect
 */
export const subReffx = <T extends (...args: any[]) => any>(
  effect: () => readonly [subscriber: (cb: T) => Disposer, disposer: Disposer]
) => objectReffx(effect, asSubscriber);
