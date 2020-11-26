open Jest;
open Expect;
open Ley_Ord;

describe("toOrdering", () => {
  test("returns GT for a positive integer", () =>
    expect(toOrdering(2)) |> toBe(GT)
  );

  test("returns EQ for a 0", () =>
    expect(toOrdering(0)) |> toBe(EQ)
  );

  test("returns LT for a negative integer", () =>
    expect(toOrdering(-3)) |> toBe(LT)
  );
});

describe("fromOrdering", () => {
  test("returns -1 for LT", () =>
    expect(fromOrdering(LT)) |> toBe(-1)
  );

  test("returns 0 for EQ", () =>
    expect(fromOrdering(EQ)) |> toBe(0)
  );

  test("returns 1 for GT", () =>
    expect(fromOrdering(GT)) |> toBe(1)
  );
});
