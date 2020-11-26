open Jest;
open Expect;
open Ley_Tuple;

describe("pair", () => {
  test("returns a pair of its arguments", () =>
    expect(pair(2, 3)) |> toEqual((2, 3))
  )
});

describe("Bifunctor", () => {
  open Bifunctor;

  describe("bimap", () => {
    test("maps over both values of the pair", () =>
      expect(bimap(a => a + 2, b => b + 3, (3, 1))) |> toEqual((5, 4))
    )
  });

  describe("first", () => {
    test("maps over the first value of the pair", () =>
      expect(first(a => a + 2, (3, 1))) |> toEqual((5, 1))
    )
  });

  describe("second", () => {
    test("maps over the second value of the pair", () =>
      expect(second(b => b + 3, (3, 1))) |> toEqual((3, 4))
    )
  });
});

describe("fst", () => {
  test("returns the first element of the pair", () =>
    expect(fst((3, 1))) |> toBe(3)
  )
});

describe("snd", () => {
  test("returns the second element of the pair", () =>
    expect(snd((3, 1))) |> toBe(1)
  )
});

describe("swap", () => {
  test("swaps the elements of the pair", () =>
    expect(swap((3, 1))) |> toEqual((1, 3))
  )
});
