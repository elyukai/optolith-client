import * as Ord from "../Ord"

test ("isLTorEQ", () => {
  expect (Ord.isLTorEQ (Ord.LT)) .toEqual (true)
  expect (Ord.isLTorEQ (Ord.GT)) .toEqual (false)
  expect (Ord.isLTorEQ (Ord.EQ)) .toEqual (true)
})

test ("toOrdering", () => {
  expect (Ord.toOrdering (1)) .toEqual (Ord.GT)
  expect (Ord.toOrdering (0)) .toEqual (Ord.EQ)
  expect (Ord.toOrdering (-1)) .toEqual (Ord.LT)
})
