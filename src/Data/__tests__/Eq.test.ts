import { Either } from "../Either"
import { equals } from "../Eq"
import { Internals } from "../Internals"
import { List } from "../List"
import { Maybe } from "../Maybe"
import { fromUniquePairs } from "../OrderedMap"
import { fromUniqueElements } from "../OrderedSet"
import { fromDefault, Record } from "../Record"
import { Pair } from "../Tuple"

const { Just, Nothing, Left, Right } = Internals

test ("Maybe", () => {
  expect (equals<Maybe<number>> (Just (2)) (Just (2))) .toEqual (true)
  expect (equals<Maybe<number>> (Just (2)) (Just (3))) .toEqual (false)
  expect (equals<Maybe<number>> (Just (2)) (Nothing)) .toEqual (false)
  expect (equals<Maybe<number>> (Nothing) (Just (2))) .toEqual (false)
  expect (equals<Maybe<number>> (Nothing) (Nothing)) .toEqual (true)
})

test ("Either", () => {
  expect (equals<Either<number, number>> (Right (2)) (Right (2))) .toEqual (true)
  expect (equals<Either<number, number>> (Left (2)) (Left (2))) .toEqual (true)
  expect (equals<Either<number, number>> (Left (2)) (Right (2))) .toEqual (false)
  expect (equals<Either<number, number>> (Right (2)) (Right (3))) .toEqual (false)
  expect (equals<Either<number, number>> (Left (2)) (Left (3))) .toEqual (false)
})

test ("List", () => {
  expect (equals (List (2)) (List (2))) .toEqual (true)
  expect (equals (List (2)) (List (3))) .toEqual (false)
  expect (equals (List (2)) (List (2, 3))) .toEqual (false)
  expect (equals (List (2, 3)) (List (2, 3))) .toEqual (true)
})

test ("Pair", () => {
  expect (equals (Pair (2) ("text")) (Pair (2) ("text"))) .toEqual (true)
  expect (equals (Pair (2) ("text")) (Pair (3) ("text"))) .toEqual (false)
})

test ("OrderedSet", () => {
  expect (equals (fromUniqueElements (2, 3)) (fromUniqueElements (2, 3))) .toEqual (true)
  expect (equals (fromUniqueElements (2, 3)) (fromUniqueElements (3, 2))) .toEqual (false)
})

test ("OrderedMap", () => {
  expect (equals (fromUniquePairs ([ "x", 1 ], [ "y", 2 ], [ "z", 3 ]))
                 (fromUniquePairs ([ "x", 1 ], [ "y", 2 ], [ "z", 3 ]))) .toEqual (true)

  expect (equals (fromUniquePairs ([ "x", 1 ], [ "y", 2 ], [ "z", 3 ]))
                 (fromUniquePairs ([ "x", 1 ], [ "z", 3 ], [ "y", 2 ]))) .toEqual (false)

  expect (equals (fromUniquePairs ([ "x", 1 ], [ "y", 2 ], [ "z", 3 ]))
                 (fromUniquePairs ([ "x", 1 ], [ "y", 2 ], [ "a", 3 ]))) .toEqual (false)

  expect (equals (fromUniquePairs ([ "x", 1 ], [ "y", 2 ], [ "z", 3 ]))
                 (fromUniquePairs ([ "x", 1 ], [ "y", 2 ], [ "z", 4 ]))) .toEqual (false)
})

test ("Record", () => {
  const creator1 = fromDefault ("Creator1") ({ x: 0, y: 0 })
  const creator2 = fromDefault ("Creator2") ({ x: 0, y: 0, z: 0 })
  const creator3 = fromDefault ("Creator3") ({ x: 0, y: 1 })

  expect (equals (creator1 ({ x: Nothing, y: 2 }) as Record<any>)
                 (creator2 ({ x: Nothing, y: 2, z: Nothing }) as Record<any>))
    .toEqual (false)
  expect (equals (creator1 ({ x: Nothing, y: Nothing }) as Record<any>)
                 (creator1 ({ x: Nothing, y: Nothing }) as Record<any>))
    .toEqual (true)
  expect (equals (creator1 ({ x: Nothing, y: Nothing }) as Record<any>)
                 (creator3 ({ x: Nothing, y: 0 }) as Record<any>))
    .toEqual (true)
  expect (equals (creator1 ({ x: Nothing, y: Nothing }) as Record<any>)
                 (creator3 ({ x: Nothing, y: Nothing }) as Record<any>))
    .toEqual (false)
})
