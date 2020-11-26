open Jest;
open Expect;
open Ley_Ix;

describe("range", () => {
  test(
    "returns an empty list if the upper bound is lower than the lower bound",
    () =>
    expect(range((1, (-2)))) |> toEqual([])
  );

  test("returns an singleton list if the bounds are equal", () =>
    expect(range((1, 1))) |> toEqual([1])
  );

  test(
    "returns multiple elements if the upper bound is greater than the lower bound",
    () =>
    expect(range((1, 5))) |> toEqual([1, 2, 3, 4, 5])
  );
});

describe("inRange", () => {
  test("checks if a value is between the bounds", () =>
    expect(inRange((1, 5), 3)) |> toEqual(true)
  );

  test("checks if the bounds are inclusive", () =>
    expect(inRange((1, 5), 1)) |> toEqual(true)
  );

  test("checks if a value is outside of the bounds", () =>
    expect(inRange((1, 5), -1)) |> toEqual(false)
  );
});

describe("index", () => {
  test("returns the index of a value between the bounds", () =>
    expect(index((1, 5), 3)) |> toEqual(2)
  );

  test("returns the index of a bounding value", () =>
    expect(index((1, 5), 1)) |> toEqual(0)
  );

  test("throws if a value is outside of the bounds", () =>
    expect(() =>
      index((1, 5), -1)
    ) |> toThrow
  );
});

describe("rangeSize", () => {
  test("returns 0 if the upper bound is lower than the lower bound", () =>
    expect(rangeSize((1, (-2)))) |> toEqual(0)
  );

  test("returns 1 if the bounds are equal", () =>
    expect(rangeSize((1, 1))) |> toEqual(1)
  );

  test(
    "returns the size if the upper bound is greater than the lower bound", () =>
    expect(rangeSize((1, 5))) |> toEqual(5)
  );
});
