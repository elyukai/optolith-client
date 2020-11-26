open Jest;
open Expect;
open Ley_Function;

describe("id", () => {
  test("returns its argument", () =>
    expect(id(1023)) |> toBe(1023)
  )
});

describe("const", () => {
  test("returns its first argument", () =>
    expect(const(956, "test")) |> toBe(956)
  )
});

describe("flip", () => {
  test("flips the first two arguments of the function", () =>
    expect(flip(const, 956, "test")) |> toBe("test")
  )
});

describe("on", () => {
  test("applies its functions to its values", () =>
    expect(
      on(
        (+),
        fun
        | Some(x) => x
        | None => 0,
        Some(3),
        None,
      ),
    )
    |> toBe(3)
  )
});
