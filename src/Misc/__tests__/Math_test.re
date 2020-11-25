open Jest;
open Expect;

describe("gsum", () => {
  test("returns the sum of all values between 1 and 100", () =>
    expect(Math.gsum(1, 100)) |> toBe(5050)
  );

  test("returns the sum of all values between 1 and 99", () =>
    expect(Math.gsum(1, 99)) |> toBe(4950)
  );
});
