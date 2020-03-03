open Jest;
open Expect;
open IC;

describe("getAPForRange", () => {
  test("returns positive int on increase", () =>
    expect(getAPForRange(A, 4, 6)) |> toBe(2)
  );
  test("returns negative int on decrease", () =>
    expect(getAPForRange(A, 4, 2)) |> toBe(-2)
  );
  test("returns positive int on multi increase above threshold", () =>
    expect(getAPForRange(C, 14, 16)) |> toBe(27)
  );
  test("returns negative int on multi decrease above threshold", () =>
    expect(getAPForRange(C, 14, 12)) |> toBe(-15)
  );
  test("returns positive int on multi increase around threshold for E", () =>
    expect(getAPForRange(E, 13, 15)) |> toBe(45)
  );
  test("returns negative int on multi decrease for E", () =>
    expect(getAPForRange(E, 13, 11)) |> toBe(-30)
  );
  test("returns positive int on multi increase above threshold for E", () =>
    expect(getAPForRange(E, 14, 16)) |> toBe(75)
  );
});

describe("getAPForInc", () => {
  test("returns flat cost", () =>
    expect(getAPForInc(A, 4)) |> toBe(1)
  );
  test("returns multiplied cost", () =>
    expect(getAPForInc(C, 14)) |> toBe(12)
  );
  test("returns flat cost for E", () =>
    expect(getAPForInc(E, 13)) |> toBe(15)
  );
  test("returns multiplied cost for E", () =>
    expect(getAPForInc(E, 14)) |> toBe(30)
  );
});

describe("getAPForDec", () => {
  test("returns flat cost", () =>
    expect(getAPForDec(A, 4)) |> toBe(-1)
  );
  test("returns multiplied cost", () =>
    expect(getAPForDec(C, 14)) |> toBe(-9)
  );
  test("returns flat cost for E", () =>
    expect(getAPForDec(E, 14)) |> toBe(-15)
  );
  test("returns multiplied cost for E", () =>
    expect(getAPForDec(E, 15)) |> toBe(-30)
  );
});

describe("getAPForActivatation", () => {
  test("returns activation cost for A", () =>
    expect(getAPForActivatation(A)) |> toBe(1)
  );
  test("returns activation cost for C", () =>
    expect(getAPForActivatation(C)) |> toBe(3)
  );
  test("returns activation cost for E", () =>
    expect(getAPForActivatation(E)) |> toBe(15)
  );
});

describe("icToStr", () => {
  test("returns name of A", () =>
    expect(icToStr(A)) |> toBe("A")
  );
  test("returns name of E", () =>
    expect(icToStr(E)) |> toBe("E")
  );
});
