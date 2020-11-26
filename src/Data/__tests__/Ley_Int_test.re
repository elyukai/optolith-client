open Jest;
open Expect;
open Ley_Int;

describe("compare", () => {
  test("returns LT if the first is lower than the second", () =>
    expect(compare(1, 2)) |> toBe(Ley_Ord.LT)
  );

  test("returns GT if the first is greater than the second", () =>
    expect(compare(3, 2)) |> toBe(Ley_Ord.GT)
  );

  test("returns EQ if the first equals the second", () =>
    expect(compare(2, 2)) |> toBe(Ley_Ord.EQ)
  );
});

describe("max", () => {
  test("returns the first argument if its larger", () =>
    expect(max(6, 5)) |> toBe(6)
  );

  test("returns the second argument if its larger", () =>
    expect(max(3, 5)) |> toBe(5)
  );
});

describe("min", () => {
  test("returns the first argument if its smaller", () =>
    expect(max(3, 5)) |> toBe(5)
  );

  test("returns the second argument if its smaller", () =>
    expect(max(6, 5)) |> toBe(6)
  );
});

describe("minmax", () => {
  test("returns the smaller first argument as the first tuple element", () =>
    expect(minmax(3, 5)) |> toEqual((3, 5))
  );

  test("returns the larger first argument as the second tuple element", () =>
    expect(minmax(6, 5)) |> toEqual((5, 6))
  );
});

describe("inc", () => {
  testAll(
    "increments its argument by 1", [(3, 4), (5, 6)], ((x, expected)) =>
    expect(inc(x)) |> toBe(expected)
  )
});

describe("dec", () => {
  testAll(
    "decrements its argument by 1", [(3, 2), (5, 4)], ((x, expected)) =>
    expect(dec(x)) |> toBe(expected)
  )
});

describe("negate", () => {
  testAll("negates its argument", [(3, (-3)), ((-5), 5)], ((x, expected)) =>
    expect(negate(x)) |> toBe(expected)
  )
});

describe("abs", () => {
  testAll(
    "returns the absolute value",
    [(3, 3), (0, 0), ((-5), 5)],
    ((x, expected)) =>
    expect(abs(x)) |> toBe(expected)
  )
});

describe("even", () => {
  testAll(
    "returns if an integer is even",
    [(1, false), (2, true)],
    ((x, expected)) =>
    expect(even(x)) |> toBe(expected)
  )
});

describe("odd", () => {
  testAll(
    "returns if an integer is odd",
    [(1, true), (2, false)],
    ((x, expected)) =>
    expect(odd(x)) |> toBe(expected)
  )
});

describe("gcd", () => {
  testAll(
    "returns the greatest common divisor for an integer",
    [((-3), 6, 3), ((-3), (-6), 3), (12, 18, 6), (0, 4, 4)],
    ((x, y, expected)) =>
    expect(gcd(x, y)) |> toBe(expected)
  );

  test("throws if both arguments are 0", () =>
    expect(() =>
      gcd(0, 0)
    ) |> toThrow
  );
});

describe("lcm", () => {
  testAll(
    "returns the greatest common divisor for an integer",
    [((-3), 6, (-6)), ((-3), (-6), 6), (12, 18, 36), (0, 4, 0)],
    ((x, y, expected)) =>
    expect(lcm(x, y)) |> toBe(expected)
  );

  test("throws if both arguments are 0", () =>
    expect(() =>
      lcm(0, 0)
    ) |> toThrow
  );
});

describe("signum", () => {
  test("returns -1 for a negative integer", () =>
    expect(signum(-43)) |> toBe(-1)
  );

  test("returns 0 for a 0", () =>
    expect(signum(0)) |> toBe(0)
  );

  test("returns 1 for a positive integer", () =>
    expect(signum(61)) |> toBe(1)
  );
});

describe("show", () => {
  testAll(
    "converts an integer to a string",
    [(1, "1"), (2, "2"), ((-3), "-3")],
    ((x, expected)) =>
    expect(show(x)) |> toBe(expected)
  )
});

describe("unsafeRead", () => {
  test("parses a string as an integer", () =>
    expect(unsafeRead("-6")) |> toBe(-6)
  );

  test("throws if string representation is invalid", () =>
    expect(() =>
      unsafeRead("--6")
    ) |> toThrow
  );
});

describe("readOption", () => {
  test("parses a string as an integer", () =>
    expect(readOption("-6")) |> toEqual(Some(-6))
  );

  test("returns None if string representation is invalid", () =>
    expect(readOption("--6")) |> toEqual(None)
  );
});
