import { keyedReffx, reffx } from "@lib";

test("keyedReffx", () => {
  const disposer = jest.fn((key: string): void => void 0);
  const effect = jest.fn((key: string) => () => disposer(key));

  const fx = keyedReffx(effect);

  const disposeA1 = fx("a");
  expect(effect).toHaveBeenCalledTimes(1);
  expect(effect).toHaveBeenLastCalledWith("a");

  const disposeB1 = fx("b");
  expect(effect).toHaveBeenCalledTimes(2);
  expect(effect).toHaveBeenLastCalledWith("b");

  const disposeA2 = fx("a");
  expect(effect).toHaveBeenCalledTimes(2);
  expect(effect).toHaveBeenLastCalledWith("b");

  const disposeB2 = fx("b");
  expect(effect).toHaveBeenCalledTimes(2);
  expect(effect).toHaveBeenLastCalledWith("b");

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
