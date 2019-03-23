// @ts-check
const { range, index, inRange, rangeSize } = require('../Ix')
const { List } = require('../List')
const { Pair } = require('../Pair')

test ('range', () => {
  expect (range (Pair (1, 5))) .toEqual (List (1, 2, 3, 4, 5))
  expect (range (Pair (1, 1))) .toEqual (List (1))
  expect (range (Pair (1, -2))) .toEqual (List ())
})

test ('index', () => {
  expect (index (Pair (1, 5)) (3)) .toEqual (2)
  expect (index (Pair (1, 5)) (1)) .toEqual (0)
  expect (() => index (Pair (1, 5)) (-1)) .toThrow ()
})

test ('inRange', () => {
  expect (inRange (Pair (1, 5)) (3)) .toEqual (true)
  expect (inRange (Pair (1, 5)) (1)) .toEqual (true)
  expect (inRange (Pair (1, 5)) (-1)) .toEqual (false)
})

test ('rangeSize', () => {
  expect (rangeSize (Pair (1, 5))) .toEqual (5)
  expect (rangeSize (Pair (1, 1))) .toEqual (1)
  expect (rangeSize (Pair (1, -2))) .toEqual (0)
})
