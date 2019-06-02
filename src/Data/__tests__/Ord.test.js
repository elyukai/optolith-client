// @ts-check
const Int = require ('../Int')
const Ord = require ('../Ord')

test ('isLTorEQ', () => {
  expect (Ord.isLTorEQ (Ord.LT)) .toEqual (true)
  expect (Ord.isLTorEQ (Ord.GT)) .toEqual (false)
  expect (Ord.isLTorEQ (Ord.EQ)) .toEqual (true)
})

test ('invertOrdering', () => {
  expect (Ord.invertOrdering (Ord.LT)) .toEqual (Ord.GT)
  expect (Ord.invertOrdering (Ord.GT)) .toEqual (Ord.LT)
  expect (Ord.invertOrdering (Ord.EQ)) .toEqual (Ord.EQ)
})

test ('reverseCompare', () => {
  expect (Ord.reverseCompare (Int.compare) (1) (2)) .toEqual (Ord.GT)
  expect (Ord.reverseCompare (Int.compare) (3) (2)) .toEqual (Ord.LT)
  expect (Ord.reverseCompare (Int.compare) (2) (2)) .toEqual (Ord.EQ)
})

test ('toOrdering', () => {
  expect (Ord.toOrdering (1)) .toEqual (Ord.GT)
  expect (Ord.toOrdering (0)) .toEqual (Ord.EQ)
  expect (Ord.toOrdering (-1)) .toEqual (Ord.LT)
})
