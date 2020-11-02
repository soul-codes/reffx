import { keyedObjectReffx } from "@lib";

test("keyedReffx", () => {
  const disposer = jest.fn((key: string): void => void 0);
  const effect = jest.fn(
    (key: string) => [{ key }, () => disposer(key)] as const
  );

  const fx = keyedObjectReffx(effect);

  const [effectObjectA1, disposeA1] = fx("a");
  expect(effect).toHaveBeenCalledTimes(1);
  expect(effect).toHaveBeenLastCalledWith("a");

  const [effectObjectB1, disposeB1] = fx("b");
  expect(effect).toHaveBeenCalledTimes(2);
  expect(effect).toHaveBeenLastCalledWith("b");

  const [effectObjectA2, disposeA2] = fx("a");
  expect(effect).toHaveBeenCalledTimes(2);
  expect(effect).toHaveBeenLastCalledWith("b");

  const [effectObjectB2, disposeB2] = fx("b");
  expect(effect).toHaveBeenCalledTimes(2);
  expect(effect).toHaveBeenLastCalledWith("b");

  expect(effectObjectA1).toBe(effectObjectA2);
  expect(effectObjectA1.key).toBe("a");

  expect(effectObjectB1).toBe(effectObjectB2);
  expect(effectObjectB1.key).toBe("b");

  disposeA1();
  expect(disposer).toHaveBeenCalledTimes(0);

  disposeB2();
  expect(disposer).toHaveBeenCalledTimes(0);

  disposeA2();
  expect(disposer).toHaveBeenCalledTimes(1);
  expect(disposer).toHaveBeenLastCalledWith("a");

  disposeB1();
  expect(disposer).toHaveBeenCalledTimes(2);
  expect(disposer).toHaveBeenLastCalledWith("b");
});
