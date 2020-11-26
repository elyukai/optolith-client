open Jest;
open Expect;

describe("not", () => {
  test("returns True if it receives False", () => {
    expect(Ley_Bool.not(false)) |> toBe(true)
  });

  test("returns False if it receives True", () => {
    expect(Ley_Bool.not(true)) |> toBe(false)
  });
});

describe("notP", () => {
  test("returns True if it returns False", () => {
    expect(Ley_Bool.notP(() => false, ())) |> toBe(true)
  });

  test("returns False if it returns True", () => {
    expect(Ley_Bool.notP(() => true, ())) |> toBe(false)
  });
});

describe("otherwise", () => {
  test("is True", () => {
    expect(Ley_Bool.otherwise) |> toBe(true)
  })
});

describe("bool", () => {
  test("is returns x if the condition is False", () => {
    expect(Ley_Bool.bool(1, 2, false)) |> toBe(1)
  });

  test("is returns y if the condition is True", () => {
    expect(Ley_Bool.bool(1, 2, true)) |> toBe(2)
  });
});

describe("bool_", () => {
  test("is returns x if the condition is False", () => {
    expect(Ley_Bool.bool_(() => 1, () => 2, false)) |> toBe(1)
  });

  test("is returns y if the condition is True", () => {
    expect(Ley_Bool.bool_(() => 1, () => 2, true)) |> toBe(2)
  });
});
