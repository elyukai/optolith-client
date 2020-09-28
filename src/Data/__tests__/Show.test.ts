import { Internals } from "../Internals"
import { List } from "../List"
import { fromUniquePairs } from "../OrderedMap"
import { fromUniqueElements } from "../OrderedSet"
import { fromDefault } from "../Record"
import { show } from "../Show"
import { Pair } from "../Tuple"

const { Just, Nothing, Left, Right } = Internals

test ("Maybe", () => {
  expect (show (Just (2))) .toEqual ("Just (2)")
  expect (show (Nothing)) .toEqual ("Nothing")
  expect (show (Just (Nothing))) .toEqual ("Just (Nothing)")
})

test ("Either", () => {
  expect (show (Left (2))) .toEqual ("Left (2)")
  expect (show (Right ("text"))) .toEqual ('Right ("text")')
  expect (show (Left (Right ("text")))) .toEqual ('Left (Right ("text"))')
})

test ("List", () => {
  expect (show (List (2))) .toEqual ("[2]")
  expect (show (List (1, 2, 3))) .toEqual ("[1, 2, 3]")
  expect (show (List ())) .toEqual ("[]")
})

test ("Pair", () => {
  expect (show (Pair (2) ("text"))) .toEqual ('(2, "text")')
  expect (show (Pair (Just (2)) (List (2)))) .toEqual ("(Just (2), [2])")
})

test ("OrderedSet", () => {
  expect (show (fromUniqueElements (2, 3, 2))) .toEqual ("Set (2, 3)")
})

test ("OrderedMap", () => {
  expect (show (fromUniquePairs ([ "x", 1 ], [ "y", 2 ], [ "z", 3 ])))
    .toEqual ('Map ("x" = 1, "y" = 2, "z" = 3)')
})

test ("Record", () => {
  const creator = fromDefault ("X") ({ x: 0, y: 0 })

  expect (show (creator ({ y: 2, x: Nothing }))) .toEqual ("X { x = 0, y = 2 }")
})
