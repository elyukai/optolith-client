open Jest;
open Expect;
open Ley_Option;

describe("Functor", () => {
  describe("fmap", () => {
    test("maps a function over a value in a Some", () =>
      expect(fmap(( * )(2), Some(3))) |> toEqual(Some(6))
    );

    test("does nothing if its a None", () =>
      expect(fmap(( * )(2), None)) |> toEqual(None)
    );
  })
});

describe("Applicative", () => {
  describe("pure", () => {
    test("lifts a value into an option", () =>
      expect(pure(2)) |> toEqual(Some(2))
    )
  });

  describe("liftA2", () => {
    test("maps a function over two values in Somes", () =>
      expect(liftA2((+), Some(3), Some(2))) |> toEqual(Some(5))
    );

    testAll(
      "does nothing if at least one of the values is a None",
      [(None, Some(2)), (Some(3), None), (None, None)],
      ((x, y)) =>
      expect(liftA2((+), x, y)) |> toEqual(None)
    );
  });
});

describe("Alternative", () => {
  describe("empty", () => {
    test("is the empty option", () =>
      expect(empty) |> toEqual(None)
    )
  })
});

describe("Monad", () => {
  describe("return", () => {
    test("lifts a value into an option", () =>
      expect(pure(2)) |> toEqual(Some(2))
    )
  });

  describe("join", () => {
    test("joins two nested Somes into a single Some", () =>
      expect(join(Some(Some(3)))) |> toEqual(Some(3))
    );

    test("joins a nested None into a single None", () =>
      expect(join(Some(None))) |> toEqual(None)
    );

    test("does nothing if its a None", () =>
      expect(join(None)) |> toEqual(None)
    );
  });

  describe("liftM2", () => {
    test("maps a function over two values in Somes", () =>
      expect(liftM2((+), Some(3), Some(2))) |> toEqual(Some(5))
    );

    testAll(
      "does nothing if at least one of the values is a None",
      [(None, Some(2)), (Some(3), None), (None, None)],
      ((x, y)) =>
      expect(liftM2((+), x, y)) |> toEqual(None)
    );
  });

  describe("liftM3", () => {
    test("maps a function over three values in Somes", () =>
      expect(liftM3((a, b, c) => a + b + c, Some(1), Some(2), Some(3)))
      |> toEqual(Some(6))
    );

    testAll(
      "does nothing if at least one of the values is a None",
      [
        (None, Some(2), Some(3)),
        (Some(1), None, Some(3)),
        (Some(1), Some(2), None),
      ],
      ((a, b, c)) =>
      expect(liftM3((a, b, c) => a + b + c, a, b, c)) |> toEqual(None)
    );
  });

  describe("liftM4", () => {
    test("maps a function over three values in Somes", () =>
      expect(
        liftM4(
          (a, b, c, d) => a + b + c + d,
          Some(1),
          Some(2),
          Some(3),
          Some(4),
        ),
      )
      |> toEqual(Some(10))
    );

    testAll(
      "does nothing if at least one of the values is a None",
      [
        (None, Some(2), Some(3), Some(4)),
        (Some(1), None, Some(3), Some(4)),
        (Some(1), Some(2), None, Some(4)),
        (Some(1), Some(2), Some(3), None),
      ],
      ((a, b, c, d)) =>
      expect(liftM4((a, b, c, d) => a + b + c + d, a, b, c, d))
      |> toEqual(None)
    );
  });

  describe("liftM5", () => {
    test("maps a function over three values in Somes", () =>
      expect(
        liftM5(
          (a, b, c, d, e) => a + b + c + d + e,
          Some(1),
          Some(2),
          Some(3),
          Some(4),
          Some(5),
        ),
      )
      |> toEqual(Some(15))
    );

    testAll(
      "does nothing if at least one of the values is a None",
      [
        (None, Some(2), Some(3), Some(4), Some(5)),
        (Some(1), None, Some(3), Some(4), Some(5)),
        (Some(1), Some(2), None, Some(4), Some(5)),
        (Some(1), Some(2), Some(3), None, Some(5)),
        (Some(1), Some(2), Some(3), Some(4), None),
      ],
      ((a, b, c, d, e)) =>
      expect(liftM5((a, b, c, d, e) => a + b + c + d + e, a, b, c, d, e))
      |> toEqual(None)
    );
  });
});

describe("Foldable", () => {
  describe("foldr", () => {
    test("folds the value from a Some into the default", () =>
      expect(foldr((x, acc) => x * 2 + acc, 2, Some(3))) |> toEqual(8)
    );

    test("returns the initial value if its a None", () =>
      expect(foldr((x, acc) => x * 2 + acc, 2, None)) |> toEqual(2)
    );
  });

  describe("foldl", () => {
    test("folds the value from a Some into the default", () =>
      expect(foldl((acc, x) => x * 2 + acc, 2, Some(3))) |> toEqual(8)
    );

    test("returns the initial value if its a None", () =>
      expect(foldl((acc, x) => x * 2 + acc, 2, None)) |> toEqual(2)
    );
  });

  describe("toList", () => {
    test("returns a singleton list with the value from the Some", () =>
      expect(toList(Some(3))) |> toEqual([3])
    );

    test("returns an empty list if the value is None", () =>
      expect(toList(None)) |> toEqual([])
    );
  });

  describe("null", () => {
    test("returns true if its a Some", () =>
      expect(null(Some(3))) |> toBe(false)
    );

    test("returns false if its a None", () =>
      expect(null(None)) |> toBe(true)
    );
  });

  describe("length", () => {
    test("returns 1 if its a Some", () =>
      expect(length(Some(3))) |> toBe(1)
    );

    test("returns 0 if its a None", () =>
      expect(length(None)) |> toBe(0)
    );
  });

  describe("elem", () => {
    test("returns if the value is a None", () =>
      expect(elem(3, None)) |> toBe(false)
    );

    test(
      "returns if the search value does not equal the value in the Some", () =>
      expect(elem(3, Some(2))) |> toBe(false)
    );

    test("returns if the search value equals the value in the Some", () =>
      expect(elem(3, Some(3))) |> toBe(true)
    );
  });

  describe("sum", () => {
    test("returns the value in the Some if its a Some", () =>
      expect(sum(Some(3))) |> toBe(3)
    );

    test("returns 0 if its a None", () =>
      expect(sum(None)) |> toBe(0)
    );
  });

  describe("maximum", () => {
    test("returns the value in the Some if its a Some", () =>
      expect(maximum(Some(3))) |> toBe(3)
    );

    test("returns the minimum possible integer if its a None", () =>
      expect(maximum(None)) |> toBe(Js.Int.min)
    );
  });

  describe("minimum", () => {
    test("returns the value in the Some if its a Some", () =>
      expect(minimum(Some(3))) |> toBe(3)
    );

    test("returns the maximum possible integer if its a None", () =>
      expect(minimum(None)) |> toBe(Js.Int.max)
    );
  });

  describe("concat", () => {
    test("returns the list in the Some if its a Some", () =>
      expect(concat(Some([1, 2, 3]))) |> toEqual([1, 2, 3])
    );

    test("returns an empty list if its a None", () =>
      expect(concat(None)) |> toEqual([])
    );
  });

  describe("concatMap", () => {
    test("returns the list in the Some if its a Some", () =>
      expect(concatMap(x => [x, x * 2], Some(3))) |> toEqual([3, 6])
    );

    test("returns an empty list if its a None", () =>
      expect(concatMap(x => [x, x * 2], None)) |> toEqual([])
    );
  });

  describe("con", () => {
    testAll(
      "returns the conjunction of an option and a boolean value",
      [(Some(true), true), (Some(false), false), (None, true)],
      ((x, expected)) =>
      expect(con(x)) |> toBe(expected)
    )
  });

  describe("dis", () => {
    testAll(
      "returns the disjunction of an option and a boolean value",
      [(Some(true), true), (Some(false), false), (None, false)],
      ((x, expected)) =>
      expect(dis(x)) |> toBe(expected)
    )
  });

  describe("any", () => {
    testAll(
      "returns if the predicate matches the value in the Some",
      [(Some(5), true), (Some(3), false)],
      ((x, expected)) =>
      expect(any(e => e > 3, x)) |> toBe(expected)
    );

    test("returns false if its a None", () =>
      expect(any(e => e > 3, None)) |> toBe(false)
    );
  });

  describe("all", () => {
    testAll(
      "returns if the predicate matches the value in the Some",
      [(Some(5), true), (Some(3), false)],
      ((x, expected)) =>
      expect(all(e => e > 3, x)) |> toBe(expected)
    );

    test("returns true if its a None", () =>
      expect(all(e => e > 3, None)) |> toBe(true)
    );
  });

  describe("notElem", () => {
    test("returns if the value is a None", () =>
      expect(notElem(3, None)) |> toBe(true)
    );

    test(
      "returns if the search value does not equal the value in the Some", () =>
      expect(notElem(3, Some(2))) |> toBe(true)
    );

    test("returns if the search value equals the value in the Some", () =>
      expect(notElem(3, Some(3))) |> toBe(false)
    );
  });

  describe("find", () => {
    testAll(
      "returns the option if the predicate matches the value in the Some",
      [(Some(5), Some(5)), (Some(3), None)],
      ((x, expected)) =>
      expect(find(e => e > 3, x)) |> toEqual(expected)
    );

    test("returns None if its a None", () =>
      expect(find(e => e > 3, None)) |> toEqual(None)
    );
  });
});

//
// // MAYBE FUNCTIONS (PART 1)
//
// test ("isJust", () => {
//   expect (Maybe.isJust (Maybe (3)))
//     .toBeTruthy ()
//   expect (Maybe.isJust (Maybe (null)))
//     .toBeFalsy ()
// })
//
// test ("isNothing", () => {
//   expect (Maybe.isNothing (Maybe (3)))
//     .toBeFalsy ()
//   expect (Maybe.isNothing (Maybe (null)))
//     .toBeTruthy ()
// })
//
// test ("fromJust", () => {
//   expect (Maybe.fromJust (Maybe (3) as Just<number>))
//     .toEqual (3)
//   expect (() => Maybe.fromJust (Maybe (null) as Just<null>))
//     .toThrow ()
// })
//
// test ("fromMaybe", () => {
//   expect (Maybe.fromMaybe (0) (Maybe (3)))
//     .toEqual (3)
//   expect (Maybe.fromMaybe (0) (Maybe (null) as Maybe<number>))
//     .toEqual (0)
// })
//
// test ("fromMaybe_", () => {
//   expect (Maybe.fromMaybe_ (() => 0) (Maybe (3)))
//     .toEqual (3)
//   expect (Maybe.fromMaybe_ (() => 0) (Maybe (null) as Maybe<number>))
//     .toEqual (0)
// })
//
// // MONAD
//
// test ("bind", () => {
//   expect (Maybe.bind (Maybe (3))
//                      (x => Just (x * 2)))
//     .toEqual (Just (6))
//   expect (Maybe.bind (Maybe (null) as Maybe<number>)
//                      (x => Just (x * 2)))
//     .toEqual (Nothing)
// })
//
// test ("bindF", () => {
//   expect (Maybe.bindF ((x: number) => Just (x * 2))
//                       (Maybe (3)))
//     .toEqual (Just (6))
//   expect (Maybe.bindF ((x: number) => Just (x * 2))
//                       (Maybe (null) as Maybe<number>))
//     .toEqual (Nothing)
// })
//
// test ("then", () => {
//   expect (Maybe.then (Just (3)) (Just (2)))
//     .toEqual (Just (2))
//   expect (Maybe.then (Nothing) (Maybe.Just (2)))
//     .toEqual (Nothing)
//   expect (Maybe.then (Just (3)) (Nothing))
//     .toEqual (Nothing)
//   expect (Maybe.then (Nothing) (Nothing))
//     .toEqual (Nothing)
// })
//
// test ("kleisli", () => {
//   expect (Maybe.kleisli ((x: number) => x > 5 ? Nothing : Just (x))
//                         (x => x < 0 ? Nothing : Just (x))
//                         (2))
//     .toEqual (Just (2))
//   expect (Maybe.kleisli ((x: number) => x > 5 ? Nothing : Just (x))
//                         (x => x < 0 ? Nothing : Just (x))
//                         (6))
//     .toEqual (Nothing)
//   expect (Maybe.kleisli ((x: number) => x > 5 ? Nothing : Just (x))
//                         (x => x < 0 ? Nothing : Just (x))
//                         (-1))
//     .toEqual (Nothing)
// })
//
// test ("join", () => {
//   expect (Maybe.join (Just (Just (3))))
//     .toEqual (Just (3))
//   expect (Maybe.join (Just (Nothing)))
//     .toEqual (Nothing)
//   expect (Maybe.join (Nothing))
//     .toEqual (Nothing)
// })
//
// test ("mapM", () => {
//   expect (
//     Maybe.mapM ((x: number) => x === 2 ? Nothing : Just (x + 1))
//                 (List.empty)
//   )
//     .toEqual (Just (List.empty))
//
//   expect (
//     Maybe.mapM ((x: number) => x === 2 ? Nothing : Just (x + 1))
//                 (List (1, 3))
//   )
//     .toEqual (Just (List (2, 4)))
//
//   expect (
//     Maybe.mapM ((x: number) => x === 2 ? Nothing : Just (x + 1))
//                 (List (1, 2, 3))
//   )
//     .toEqual (Nothing)
// })
//
// test ("liftM2", () => {
//   expect (Maybe.liftM2 ((x: number) => (y: number) => x + y) (Just (1)) (Just (2)))
//     .toEqual (Just (3))
//   expect (Maybe.liftM2 ((x: number) => (y: number) => x + y) (Nothing) (Just (2)))
//     .toEqual (Nothing)
//   expect (Maybe.liftM2 ((x: number) => (y: number) => x + y) (Just (1)) (Nothing))
//     .toEqual (Nothing)
//   expect (Maybe.liftM2 ((x: number) => (y: number) => x + y) (Nothing) (Nothing))
//     .toEqual (Nothing)
// })
//
// test ("liftM3", () => {
//   expect (
//     Maybe.liftM3 ((x: number) => (y: number) => (z: number) => x + y + z)
//                   (Just (1))
//                   (Just (2))
//                   (Just (3))
//   )
//     .toEqual (Just (6))
//
//   expect (
//     Maybe.liftM3 ((x: number) => (y: number) => (z: number) => x + y + z)
//                   (Nothing)
//                   (Just (2))
//                   (Just (3))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM3 ((x: number) => (y: number) => (z: number) => x + y + z)
//                   (Just (1))
//                   (Nothing)
//                   (Just (3))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM3 ((x: number) => (y: number) => (z: number) => x + y + z)
//                   (Just (1))
//                   (Just (2))
//                   (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM3 ((x: number) => (y: number) => (z: number) => x + y + z)
//                   (Just (1))
//                   (Nothing)
//                   (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM3 ((x: number) => (y: number) => (z: number) => x + y + z)
//                   (Nothing)
//                   (Just (2))
//                   (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM3 ((x: number) => (y: number) => (z: number) => x + y + z)
//                   (Nothing)
//                   (Nothing)
//                   (Just (3))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM3 ((x: number) => (y: number) => (z: number) => x + y + z)
//                   (Nothing)
//                   (Nothing)
//                   (Nothing)
//   )
//     .toEqual (Nothing)
// })
//
// test ("liftM4", () => {
//   expect (
//     Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
//                  (Just (1)) (Just (2)) (Just (3)) (Just (4))
//   )
//     .toEqual (Just (10))
//
//   expect (
//     Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
//                  (Nothing) (Just (2)) (Just (3)) (Just (4))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
//                  (Just (1)) (Nothing) (Just (3)) (Just (4))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
//                  (Just (1)) (Just (2)) (Nothing) (Just (4))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
//                  (Just (1)) (Just (2)) (Just (3)) (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
//                  (Just (1)) (Just (2)) (Nothing) (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
//                  (Just (1)) (Nothing) (Just (3)) (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
//                  (Just (1)) (Nothing) (Nothing) (Just (4))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
//                  (Nothing) (Just (2)) (Just (3)) (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
//                  (Nothing) (Just (2)) (Nothing) (Just (4))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
//                  (Nothing) (Nothing) (Just (3)) (Just (4))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
//                  (Just (1)) (Nothing) (Nothing) (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
//                  (Nothing) (Just (2)) (Nothing) (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
//                  (Nothing) (Nothing) (Just (3)) (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
//                  (Nothing) (Nothing) (Nothing) (Just (4))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
//                  (Nothing) (Nothing) (Nothing) (Nothing)
//   )
//     .toEqual (Nothing)
// })
//
// test ("liftM5", () => {
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                  (Just (1)) (Just (2)) (Just (3)) (Just (4)) (Just (5))
//   )
//     .toEqual (Just (15))
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                  (Nothing) (Just (2)) (Just (3)) (Just (4)) (Just (5))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                  (Just (1)) (Nothing) (Just (3)) (Just (4)) (Just (5))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                  (Just (1)) (Just (2)) (Nothing) (Just (4)) (Just (5))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                  (Just (1)) (Just (2)) (Just (3)) (Nothing) (Just (5))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                  (Just (1)) (Just (2)) (Just (3)) (Just (4)) (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                  (Just (1)) (Just (2)) (Just (3)) (Nothing) (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                  (Just (1)) (Just (2)) (Nothing) (Just (4)) (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                   (Just (1)) (Nothing) (Just (3)) (Just (4)) (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                   (Nothing) (Just (2)) (Just (3)) (Just (4)) (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                   (Just (1)) (Just (2)) (Nothing) (Nothing) (Just (5))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                   (Just (1)) (Nothing) (Just (3)) (Nothing) (Just (5))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                   (Nothing) (Just (2)) (Just (3)) (Nothing) (Just (5))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                   (Just (1)) (Nothing) (Nothing) (Just (4)) (Just (5))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                   (Nothing) (Just (2)) (Nothing) (Just (4)) (Just (5))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                   (Nothing) (Nothing) (Nothing) (Just (4)) (Just (5))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                   (Nothing) (Nothing) (Just (3)) (Nothing) (Just (5))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                   (Nothing) (Nothing) (Just (3)) (Just (4)) (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                   (Just (1)) (Nothing) (Nothing) (Nothing) (Just (5))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                   (Just (1)) (Nothing) (Nothing) (Just (4)) (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                   (Just (1)) (Just (2)) (Nothing) (Nothing) (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                   (Just (1)) (Nothing) (Just (3)) (Nothing) (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                   (Nothing) (Just (2)) (Just (3)) (Nothing) (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                   (Nothing) (Just (2)) (Nothing) (Nothing) (Just (5))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                   (Just (1)) (Nothing) (Nothing) (Nothing) (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                   (Nothing) (Just (2)) (Nothing) (Nothing) (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                   (Nothing) (Nothing) (Just (3)) (Nothing) (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                   (Nothing) (Nothing) (Nothing) (Just (4)) (Nothing)
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                   (Nothing) (Nothing) (Nothing) (Nothing) (Just (5))
//   )
//     .toEqual (Nothing)
//
//   expect (
//     Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
//                     x + y + z + a + b)
//                   (Nothing) (Nothing) (Nothing) (Nothing) (Nothing)
//   )
//     .toEqual (Nothing)
// })
//
// // FOLDABLE
//
//
// // ORD
//
// test ("gt", () => {
//   expect (Maybe.gt (Just (1)) (Just (2)))
//     .toBeTruthy ()
//   expect (Maybe.gt (Just (1)) (Just (1)))
//     .toBeFalsy ()
//   expect (Maybe.gt (Just (1)) (Nothing))
//     .toBeFalsy ()
//   expect (Maybe.gt (Nothing) (Just (2)))
//     .toBeFalsy ()
//   expect (Maybe.gt (Nothing) (Nothing))
//     .toBeFalsy ()
// })
//
// test ("lt", () => {
//   expect (Maybe.lt (Just (3)) (Just (2)))
//     .toBeTruthy ()
//   expect (Maybe.lt (Just (1)) (Just (1)))
//     .toBeFalsy ()
//   expect (Maybe.lt (Just (3)) (Nothing))
//     .toBeFalsy ()
//   expect (Maybe.lt (Nothing) (Just (2)))
//     .toBeFalsy ()
//   expect (Maybe.lt (Nothing) (Nothing))
//     .toBeFalsy ()
// })
//
// test ("gte", () => {
//   expect (Maybe.gte (Just (1)) (Just (2)))
//     .toBeTruthy ()
//   expect (Maybe.gte (Just (2)) (Just (2)))
//     .toBeTruthy ()
//   expect (Maybe.gte (Just (2)) (Just (1)))
//     .toBeFalsy ()
//   expect (Maybe.gte (Just (1)) (Nothing))
//     .toBeFalsy ()
//   expect (Maybe.gte (Just (2)) (Nothing))
//     .toBeFalsy ()
//   expect (Maybe.gte (Nothing) (Just (2)))
//     .toBeFalsy ()
//   expect (Maybe.gte (Nothing) (Nothing))
//     .toBeFalsy ()
// })
//
// test ("lte", () => {
//   expect (Maybe.lte (Just (3)) (Just (2)))
//     .toBeTruthy ()
//   expect (Maybe.lte (Just (2)) (Just (2)))
//     .toBeTruthy ()
//   expect (Maybe.lte (Just (2)) (Just (3)))
//     .toBeFalsy ()
//   expect (Maybe.lte (Just (3)) (Nothing))
//     .toBeFalsy ()
//   expect (Maybe.lte (Just (2)) (Nothing))
//     .toBeFalsy ()
//   expect (Maybe.lte (Nothing) (Just (2)))
//     .toBeFalsy ()
//   expect (Maybe.lte (Nothing) (Nothing))
//     .toBeFalsy ()
// })
//
// // SEMIGROUP
//
// // test('mappend', () => {
// //   expect(Just (List(3)).mappend(Just (List(2))))
// //     .toEqual(Just (List(3, 2)))
// //   expect(Just (List(3)).mappend(Nothing))
// //     .toEqual(Just (List(3)))
// //   expect(Nothing.mappend(Just (List(2))))
// //     .toEqual(Nothing)
// //   expect(Nothing.mappend(Nothing))
// //     .toEqual(Nothing)
// // })
//
// // MAYBE FUNCTIONS (PART 2)
//
// test ("maybe", () => {
//   expect (Maybe.maybe (0) ((x: number) => x * 2) (Just (3)))
//     .toEqual (6)
//   expect (Maybe.maybe (0) ((x: number) => x * 2) (Nothing))
//     .toEqual (0)
// })
//
// test ("listToMaybe", () => {
//   expect (Maybe.listToMaybe (List (3)))
//     .toEqual (Just (3))
//   expect (Maybe.listToMaybe (List ()))
//     .toEqual (Nothing)
// })
//
// test ("maybeToList", () => {
//   expect (Maybe.maybeToList (Just (3)))
//     .toEqual (List (3))
//   expect (Maybe.maybeToList (Nothing))
//     .toEqual (List ())
// })
//
// test ("catMaybes", () => {
//   expect (Maybe.catMaybes (List<Maybe<number>> (Just (3), Just (2), Nothing, Just (1))))
//     .toEqual (List (3, 2, 1))
// })
//
// test ("mapMaybe", () => {
//   expect (Maybe.mapMaybe (Maybe.ensure ((x: number) => x > 2)) (List (1, 2, 3, 4, 5)))
//     .toEqual (List (3, 4, 5))
// })
//
// // CUSTOM MAYBE FUNCTIONS
//
// test ("isMaybe", () => {
//   expect (Maybe.isMaybe (4)) .toEqual (false)
//   expect (Maybe.isMaybe (Just (4))) .toEqual (true)
//   expect (Maybe.isMaybe (Nothing)) .toEqual (true)
// })
//
// test ("normalize", () => {
//   expect (Maybe.normalize (4)) .toEqual (Just (4))
//   expect (Maybe.normalize (Just (4))) .toEqual (Just (4))
//   expect (Maybe.normalize (Nothing)) .toEqual (Nothing)
//   expect (Maybe.normalize (undefined)) .toEqual (Nothing)
//   expect (Maybe.normalize (null)) .toEqual (Nothing)
// })
//
// test ("ensure", () => {
//   expect (Maybe.ensure ((x: number) => x > 2) (3))
//     .toEqual (Just (3))
//   expect (Maybe.ensure ((x: number) => x > 3) (3))
//     .toEqual (Nothing)
// })
//
// test ("imapMaybe", () => {
//   expect (Maybe.imapMaybe (i => (e: number) => fmap (add (i))
//                                                     (Maybe.ensure ((x: number) => x > 2) (e)))
//                           (List (1, 2, 3, 4, 5)))
//     .toEqual (List (5, 7, 9))
// })
//
// test ("maybeToNullable", () => {
//   const element = React.createElement ("div")
//   expect (Maybe.maybeToNullable (Nothing)) .toEqual (null)
//   expect (Maybe.maybeToNullable (Just (element))) .toEqual (element)
// })
//
// test ("maybeToUndefined", () => {
//   const element = React.createElement ("div")
//   expect (Maybe.maybeToUndefined (Nothing)) .toEqual (undefined)
//   expect (Maybe.maybeToUndefined (Just (element))) .toEqual (element)
// })
//
// test ("maybe_", () => {
//   expect (Maybe.maybe_ (() => 0) ((x: number) => x * 2) (Just (3)))
//     .toEqual (6)
//   expect (Maybe.maybe_ (() => 0) ((x: number) => x * 2) (Nothing))
//     .toEqual (0)
// })
//
// test ("joinMaybeList", () => {
//   expect (Maybe.joinMaybeList (Just (List (1, 2, 3))))
//     .toEqual (List (1, 2, 3))
//   expect (Maybe.joinMaybeList (Nothing))
//     .toEqual (List ())
// })
//
// test ("guardReplace", () => {
//   expect (Maybe.guardReplace (true) (3))
//     .toEqual (Just (3))
//   expect (Maybe.guardReplace (false) (3))
//     .toEqual (Nothing)
// })
//
// test ("orN", () => {
//   expect (Maybe.orN (true)) .toEqual (true)
//   expect (Maybe.orN (false)) .toEqual (false)
//   expect (Maybe.orN (undefined)) .toEqual (false)
// })
