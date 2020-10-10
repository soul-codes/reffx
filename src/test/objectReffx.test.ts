import { objectReffx } from "@lib";

test("objectReffx", () => {
  const disposer = jest.fn((): void => void 0);
  const effect = jest.fn(() => [{ isTestToken: true }, disposer] as const);

  const fx = objectReffx(effect);

  const [effectObject1, dispose1] = fx();
  expect(effect).toHaveBeenCalledTimes(1);

  const [effectObject2, dispose2] = fx();
  expect(effect).toHaveBeenCalledTimes(1);
  expect(effectObject1).toBe(effectObject2);

  dispose1();
  expect(disposer).toHaveBeenCalledTimes(0);

  dispose2();
  expect(disposer).toHaveBeenCalledTimes(1);
});
