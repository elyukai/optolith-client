import { blackbird, blackbirdF, cnst, flip, ident, join, on, onF, thrush } from "../Function"
import { Internals } from "../Internals"
import { fromJust } from "../Maybe"
import type { Just as J } from "../Maybe"
import { add, multiply } from "../Num"

type Just<A> = J<A>
const { Just } = Internals

test ("ident", () => {
  expect (ident (5)) .toEqual (5)
})

test ("cnst", () => {
  expect (cnst (5) ("test")) .toEqual (5)
})

test ("thrush", () => {
  expect (thrush (5) (add (3))) .toEqual (8)
})

test ("join", () => {
  expect (join (add) (2)) .toEqual (4)
  expect (join (add) (4)) .toEqual (8)
})

test ("on", () => {
  expect (on (add) <Just<number>> (fromJust) (Just (1)) (Just (2))) .toEqual (3)
})

test ("onF", () => {
  expect (onF <Just<number>, number> (fromJust) (add) (Just (1)) (Just (2))) .toEqual (3)
})

test ("flip", () => {
  expect (flip ((a: string) => (b: string) => a + b) ("cde") ("ab")) .toEqual ("abcde")
})

test ("blackbird", () => {
  expect (blackbird (multiply (3)) (add) (3) (4)) .toEqual (21)
})

test ("blackbirdF", () => {
  expect (blackbirdF (add) (multiply (3)) (3) (4)) .toEqual (21)
})
