import { Disposer } from "./Disposer";
import { reffx } from "./reffx";

/**
 * Like `reffx`, but with the effect being keyed. The resulting function will
 * create as many effects as the number of referentially distinct key values
 * they are called with.
 * @param effect
 */
export function keyedReffx<T>(
  effect: (key: T) => Disposer,
  MapImpl: MapConstructor<T> = Map
) {
  const fxs = new MapImpl<() => Disposer>();

  /**
   * Adds a reference to the maintained effect at key `key`. If this is the
   * first reference, the effect will be invoked. Returns a disposer that
   * removes this reference.
   */
  return function addRef(key: T, diagnosticTag?: unknown): Disposer {
    const fx =
      fxs.get(key) ||
      reffx(() => {
        const disposeFx = effect(key);
        return () => (fxs.delete(key), disposeFx());
      });
    fxs.set(key, fx);
    return fx(diagnosticTag);
  };
}

export interface MapInterface<K, T> {
  set(key: K, value: T): void;
  delete(key: K): void;
  get(key: K): T | undefined;
}

export interface MapConstructor<K> {
  new <T>(): MapInterface<K, T>;
}

/**
 * Creates a Map implementation that serializes the key into a string so that
 * object keys can be uniquely identified by their serialized value.
 *
 * @param serializer
 * @returns
 */
export const SerMap = <K extends object>(
  serializer: (key: K) => string
): MapConstructor<K> => {
  const cache = new WeakMap<K, string>();

  function cachedSerialize(key: K) {
    let hash = cache.get(key);
    if (hash != null) return hash;

    hash = serializer(key);
    cache.set(key, hash);
    return hash;
  }

  class SerMap<T> implements MapInterface<K, T> {
    constructor() {}

    get(key: K): T | undefined {
      return this._map.get(cachedSerialize(key));
    }

    set(key: K, value: T) {
      this._map.set(cachedSerialize(key), value);
    }

    delete(key: K) {
      this._map.delete(cachedSerialize(key));
    }

    private readonly _map = new Map<string, T>();
  }

  return SerMap;
};
