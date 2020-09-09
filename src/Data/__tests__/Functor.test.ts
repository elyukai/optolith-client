import { Identity } from "../../Control/Monad/Identity"
import { Either } from "../Either"
import { fmap, fmapF, mapReplace } from "../Functor"
import { Const } from "../Functor/Const"
import { Internals } from "../Internals"
import { List } from "../List"
import { Maybe } from "../Maybe"
import { add } from "../Num"
import { fromUniquePairs } from "../OrderedMap"
import { Pair } from "../Tuple"

const { Just, Nothing, Left, Right } = Internals

describe ("fmap", () => {
  it ("works on Const", () => {
    expect (fmap (add (3)) (Const (3)))
      .toEqual (Const (3))
  })

  it ("works on Either", () => {
    expect (fmap ((x: number) => x * 2) (Right (3)))
      .toEqual (Right (6))

    expect (fmap ((x: number) => x * 2) (Left ("test")))
      .toEqual (Left ("test"))
  })

  it ("works on Identity", () => {
    expect (fmap (add (3)) (Identity (3)))
      .toEqual (Identity (6))
  })

  it ("works on List", () => {
    expect (fmap ((x: number) => x * 2) (List (3, 2, 1)))
      .toEqual (List (6, 4, 2))
  })

  it ("works on Maybe", () => {
    expect (fmap ((x: number) => x * 2) (Just (3)))
      .toEqual (Just (6))

    expect (fmap ((x: number) => x * 2) (Nothing))
      .toEqual (Nothing)
  })

  it ("works on OrderedMap", () => {
    expect (fmap ((x: number) => x * 2)
                 (fromUniquePairs ([ "x", 1 ], [ "y", 2 ], [ "z", 3 ])))
      .toEqual (fromUniquePairs ([ "x", 2 ], [ "y", 4 ], [ "z", 6 ]))
  })

  it ("works on Pair", () => {
    expect (fmap ((x: number) => x * 2) (Pair (3, 1)))
      .toEqual (Pair (3, 2))
  })

  it ("works on Promise", async () => {
    expect.assertions (1)

    const io = new Promise<number> (res => res (1))

    await expect (fmap ((x: number) => x + 1)
                       (io)) .resolves .toEqual (2)
  })
})

test ("fmapF", () => {
  expect (fmapF (Const<number, number> (3)) (add (3)))
    .toEqual (Const (3))

  expect (fmapF (Right (3)) (x => x * 2))
    .toEqual (Right (6))

  expect (fmapF (Left ("test") as Either<string, number>) (x => x * 2))
    .toEqual (Left ("test"))

  expect (fmapF (Identity (3)) (add (3)))
    .toEqual (Identity (6))

  expect (fmapF (List (3, 2, 1)) (x => x * 2))
    .toEqual (List (6, 4, 2))

  expect (fmapF (Just (3)) (x => x * 2))
    .toEqual (Just (6))

  expect (fmapF (Nothing as Maybe<number>) (x => x * 2))
    .toEqual (Nothing)

  expect (fmapF (fromUniquePairs ([ "x", 1 ], [ "y", 2 ], [ "z", 3 ]))
                (x => x * 2))
    .toEqual (fromUniquePairs ([ "x", 2 ], [ "y", 4 ], [ "z", 6 ]))

  expect (fmapF (Pair (3, 1)) (x => x * 2))
    .toEqual (Pair (3, 2))
})

test ("mapReplace", () => {
  expect (mapReplace (4) (Const (3)))
    .toEqual (Const (3))

  expect (mapReplace (2) (Right (3)))
    .toEqual (Right (2))

  expect (mapReplace (2) (Left ("test")))
    .toEqual (Left ("test"))

  expect (mapReplace (4) (Identity (3)))
    .toEqual (Identity (4))

  expect (mapReplace (2) (List (3, 2, 1)))
    .toEqual (List (2, 2, 2))

  expect (mapReplace (2) (Just (3)))
    .toEqual (Just (2))

  expect (mapReplace (2) (Nothing))
    .toEqual (Nothing)

  expect (mapReplace (2)
                             (fromUniquePairs ([ "x", 1 ], [ "y", 2 ], [ "z", 3 ])))
    .toEqual (fromUniquePairs ([ "x", 2 ], [ "y", 2 ], [ "z", 2 ]))

  expect (mapReplace (4) (Pair (3, 1)))
    .toEqual (Pair (3, 4))
})
