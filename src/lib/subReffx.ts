import { asSubscriber } from "./asSubscriber";
import { Disposer } from "./Disposer";
import { objectReffx } from "./objectReffx";

export const subReffx = <T extends (...args: any[]) => any>(
  effect: () => readonly [subscriber: (cb: T) => Disposer, disposer: Disposer]
) => objectReffx(effect, asSubscriber);
