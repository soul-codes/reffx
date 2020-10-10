import { reffx } from "@lib";

test("reffx", () => {
  const disposer = jest.fn((): void => void 0);
  const effect = jest.fn(() => disposer);

  const fx = reffx(effect);

  const dispose1 = fx();
  expect(effect).toHaveBeenCalledTimes(1);

  const dispose2 = fx();
  expect(effect).toHaveBeenCalledTimes(1);

  dispose1();
  expect(disposer).toHaveBeenCalledTimes(0);

  dispose2();
  expect(disposer).toHaveBeenCalledTimes(1);
});
