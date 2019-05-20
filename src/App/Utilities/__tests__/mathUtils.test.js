const Math = require ('../mathUtils')
const Tuple = require ('../../../Data/Tuple')

test ('add', () => {
  expect (Math.add (1) (2)) .toEqual (3)
})

test ('subtract', () => {
  expect (Math.subtract (1) (2)) .toEqual (-1)
})

test ('subtractBy', () => {
  expect (Math.subtractBy (1) (2)) .toEqual (1)
})

test ('multiply', () => {
  expect (Math.multiply (1) (2)) .toEqual (2)
})

test ('divide', () => {
  expect (Math.divide (1) (2)) .toEqual (0.5)
})

test ('divideBy', () => {
  expect (Math.divideBy (1) (2)) .toEqual (2)
})

test ('even', () => {
  expect (Math.even (1)) .toEqual (false)
  expect (Math.even (2)) .toEqual (true)
})

test ('odd', () => {
  expect (Math.odd (1)) .toEqual (true)
  expect (Math.odd (2)) .toEqual (false)
})

test ('gt', () => {
  expect (Math.gt (3) (5)) .toEqual (true)
  expect (Math.gt (3) (3)) .toEqual (false)
  expect (Math.gt (3) (1)) .toEqual (false)
})

test ('gte', () => {
  expect (Math.gte (3) (5)) .toEqual (true)
  expect (Math.gte (3) (3)) .toEqual (true)
  expect (Math.gte (3) (1)) .toEqual (false)
})

test ('lt', () => {
  expect (Math.lt (3) (5)) .toEqual (false)
  expect (Math.lt (3) (3)) .toEqual (false)
  expect (Math.lt (3) (1)) .toEqual (true)
})

test ('lte', () => {
  expect (Math.lte (3) (5)) .toEqual (false)
  expect (Math.lte (3) (3)) .toEqual (true)
  expect (Math.lte (3) (1)) .toEqual (true)
})

test ('min', () => {
  expect (Math.min (3) (5)) .toEqual (3)
  expect (Math.min (6) (5)) .toEqual (5)
})

test ('max', () => {
  expect (Math.max (3) (5)) .toEqual (5)
  expect (Math.max (6) (5)) .toEqual (6)
})

test ('minmax', () => {
  expect (Math.minmax (3) (5)) .toEqual (Tuple.Pair (3, 5))
  expect (Math.minmax (6) (5)) .toEqual (Tuple.Pair (5, 6))
  expect (Math.minmax (5) (5)) .toEqual (Tuple.Pair (5, 5))
})

test ('inc', () => {
  expect (Math.inc (3)) .toEqual (4)
  expect (Math.inc (5)) .toEqual (6)
})

test ('dec', () => {
  expect (Math.dec (3)) .toEqual (2)
  expect (Math.dec (5)) .toEqual (4)
})

test ('negate', () => {
  expect (Math.negate (3)) .toEqual (-3)
  expect (Math.negate (-5)) .toEqual (5)
})
