`reffx` is a tiny utility for creating reference count-aware effects (`reffx`)
requiring clean-ups ("disposing").

When you create a `reffx`, the effect is automatically invoked only at "first
reference" and is cleaned up only upon the disposal of the "last reference".

## Example

```ts
import { reffx } from "reffx";

const clock = reffx(() => {
  const intervalId = setInterval(() = console.log("tick"), 1000);
  return () => clearInterval(intervalId);
})
```

Now suppose we call `clock()` the first time, this would get the console logging
`tick` every one second.

```ts
const disposeClock = clock();
```

Now we have one active reference to the effect `clock`. Later, we call `clock()`
again, this would simply leave the current interval (rather than starting
another `setInterval`) because the effect is already active with a ref count of
one.

```ts
const disposeClock2 = clock(); // nothing happens
```

In order to stop the clock, we must call both `disposeClock()` and
`disposeClock2()` to bring the active reference to the effect `clock` to zero.

## Usage

```ts
import { reffx } from "reffx";
const fx = reffx(() => {
  /* ... effectful behavior here ... */
  return () => {
    /* ... effect disposer here .. */
  }
})
```

The reference count-aware effect `fx` now will keep track of the number of
calls. Each call returns a disposer function that must be called to neutralize
that reference.

```ts
const dispose1 = fx(); // ref count = 1, effect started
const dispose2 = fx(); // ref count = 2, nothing happens
const dispose3 = fx(); // ref count = 3, nothing happens
dispose3(); // ref count = 2, nothing happens
dispose3(); // ref count still = 2 because disposers are idempotent, nothing happens
dispose1(); // ref count = 1, nothing happens
dispose2(); // ref count = 0, effect disposed.
```

## Keyed Reffx

`keyedReffx` is similar to `reffx` except it produces a map of effects that are
maintained, and the reference count is maintained for each referentially distinct
map key.

```ts
import { keyedReffx } from "reffx";
const subscribeToTopic = keyedReffx(
  (topicId: string) => /* ... some API calls here ... */);

const disposeTopicA1 = fx("topicA"); // topic A subscription starts
const disposeTopicB1 = fx("topicB"); // topic B subscription starts
const disposeTopicB2 = fx("topicB");
const disposeTopicA2 = fx("topicA");

disposeTopicA1();
disposeTopicB2();
disposeTopicB1(); // topic B subscription cleaned up
disposeTopicA2(); // topic A subscription cleaned up
```

## Reffx with Effect Object

It can be useful for the effect to expose an interface with functionality
that can be used as long as the effect is active. In this case, use
`objectReffx`, which now returns a tuple of the effect object and the
disposer.

```ts
import { objectReffx } from "reffx";
const clock = objectReffx(() => {
  let time = new Date();
  const getTime = () => time;
  const intervalId = setInterval(() => new Date(), 1000);
  return [getTime, () => clearInterval(intervalId)];
});

const [getTime, disposeClock] = clock();
getTime(); // some date object here
disposeClock(); // reduces reference count to clock effect by 1.
```

A keyed version of `objectReffx`, called `keyedObjectReffx`, is also
availble.

## Effect object decorator.

The tuple of effect object/disposer returned by `objectReffx` and
`keyedObjectReffx` is the default behavior. It is also possible to pass
another argument to these functions that customizes how the effect object
and the disposer are combined.

```ts
import { objectReffx } from "reffx";
const clock = objectReffx(() => {
  let time = new Date();
  const getTime = () => time;
  const intervalId = setInterval(() => new Date(), 1000);
  return [getTime, () => clearInterval(intervalId)];
}, (getTime, disposeClock) => ({ getTime, disposeClock }));

const clockObject = clock();
clockObject.getTime(); // some date object here
clockObject.disposeClock(); // reduces reference count to clock effect by 1.
```

## Reference-counted subscription

Using the idea of effect object, one can create a reference-counted effect that
exposes a subscriber that automatically destroys the effect is no longer used.

```ts
import { objectReffx } from "reffx";
import { atomicEvent } from "atomic-event";

const subClock = objectReffx(() => {
  let time = new Date();
  const [sub, pub] = atomicEvent();
  const intervalId = setInterval(() => pub(new Date()), 1000);
  return [sub, () => clearInterval(intervalId)];
}, (sub, disposeClock) => (callback) => {
  const unsub = sub(callback);
  return () => { unsub(); disposeClock(); }
});

const unsubClock1 = subClock(time => console.log(time));
const unsubsubClock2 = clock(time => console.log(time));
unsubClock1(); // clock still ticking
unsubClock2(); // clock disposed
```

This pattern can be quite useful, so the package provides a shortcut, namely
`subReffx` and `keyedSubReffx`, that assumes your effect function to return
a subscriber/effect disposer pair. It then automatically decorates your effect
object in the manner shown above. The decorator itself is also available
as the import named [`asSubscriber`](./src/lib/asSubscriber.ts).

```ts
import { subReffx } from "reffx";
import { atomicEvent } from "atomic-event";

const subClock = subReffx(() => {
  let time = new Date();
  const [sub, pub] = atomicEvent();
  const intervalId = setInterval(() => pub(new Date()), 1000);
  return [sub, () => clearInterval(intervalId)];
});

const unsubClock1 = subClock(time => console.log(time));
const unsubsubClock2 = clock(time => console.log(time));
unsubClock1(); // clock still ticking
unsubClock2(); // clock disposed
```

## Use Cases

Reference count-aware effects can be used to perform effectful behavior such as
subscription in a way that different consumers can simply invoke the effect without
worrying about creating the same effects. For instance, if different parts of the
UI require the same effect at different time, `reffx` can make sure that the
effect only happens once.
