import * as Num from "../Num"
import { EQ, GT, LT } from "../Ord"
import * as Tuple from "../Tuple"

test ("add", () => {
  expect (Num.add (1) (2)) .toEqual (3)
})

test ("subtract", () => {
  expect (Num.subtract (1) (2)) .toEqual (-1)
})

test ("subtractBy", () => {
  expect (Num.subtractBy (1) (2)) .toEqual (1)
})

test ("subtractAbs", () => {
  expect (Num.subtractAbs (1) (2)) .toEqual (-1)
  expect (Num.subtractAbs (-1) (2)) .toEqual (1)
  expect (Num.subtractAbs (1) (-2)) .toEqual (3)
  expect (Num.subtractAbs (-1) (-2)) .toEqual (-3)
})

test ("subtractAbsBy", () => {
  expect (Num.subtractAbsBy (1) (2)) .toEqual (1)
  expect (Num.subtractAbsBy (1) (-2)) .toEqual (-1)
  expect (Num.subtractAbsBy (-1) (2)) .toEqual (3)
  expect (Num.subtractAbsBy (-1) (-2)) .toEqual (-3)
})

test ("multiply", () => {
  expect (Num.multiply (1) (2)) .toEqual (2)
})

test ("divide", () => {
  expect (Num.divide (1) (2)) .toEqual (0.5)
})

test ("divideBy", () => {
  expect (Num.divideBy (1) (2)) .toEqual (2)
})

test ("compare", () => {
  expect (Num.compare (1) (2)) .toEqual (LT)
  expect (Num.compare (3) (2)) .toEqual (GT)
  expect (Num.compare (2) (2)) .toEqual (EQ)
})

test ("lt", () => {
  expect (Num.lt (3) (5)) .toEqual (false)
  expect (Num.lt (3) (3)) .toEqual (false)
  expect (Num.lt (3) (1)) .toEqual (true)
})

test ("lte", () => {
  expect (Num.lte (3) (5)) .toEqual (false)
  expect (Num.lte (3) (3)) .toEqual (true)
  expect (Num.lte (3) (1)) .toEqual (true)
})

test ("gt", () => {
  expect (Num.gt (3) (5)) .toEqual (true)
  expect (Num.gt (3) (3)) .toEqual (false)
  expect (Num.gt (3) (1)) .toEqual (false)
})

test ("gte", () => {
  expect (Num.gte (3) (5)) .toEqual (true)
  expect (Num.gte (3) (3)) .toEqual (true)
  expect (Num.gte (3) (1)) .toEqual (false)
})

test ("max", () => {
  expect (Num.max (3) (5)) .toEqual (5)
  expect (Num.max (6) (5)) .toEqual (6)
})

test ("min", () => {
  expect (Num.min (3) (5)) .toEqual (3)
  expect (Num.min (6) (5)) .toEqual (5)
})

test ("minmax", () => {
  expect (Num.minmax (3) (5)) .toEqual (Tuple.Pair (3, 5))
  expect (Num.minmax (6) (5)) .toEqual (Tuple.Pair (5, 6))
  expect (Num.minmax (5) (5)) .toEqual (Tuple.Pair (5, 5))
})

test ("inc", () => {
  expect (Num.inc (3)) .toEqual (4)
  expect (Num.inc (5)) .toEqual (6)
})

test ("dec", () => {
  expect (Num.dec (3)) .toEqual (2)
  expect (Num.dec (5)) .toEqual (4)
})

test ("negate", () => {
  expect (Num.negate (3)) .toEqual (-3)
  expect (Num.negate (-5)) .toEqual (5)
})

test ("abs", () => {
  expect (Num.abs (3)) .toEqual (3)
  expect (Num.abs (0)) .toEqual (0)
  expect (Num.abs (-5)) .toEqual (5)
})

test ("even", () => {
  expect (Num.even (1)) .toEqual (false)
  expect (Num.even (2)) .toEqual (true)
})

test ("odd", () => {
  expect (Num.odd (1)) .toEqual (true)
  expect (Num.odd (2)) .toEqual (false)
})

test ("gcd", () => {
  expect (Num.gcd (-3) (6)) .toEqual (3)
  expect (Num.gcd (-3) (-6)) .toEqual (3)
  expect (Num.gcd (12) (18)) .toEqual (6)
  expect (Num.gcd (0) (4)) .toEqual (4)
  expect (() => Num.gcd (0) (0)) .toThrow ()
})

test ("lcm", () => {
  expect (Num.lcm (-3) (6)) .toEqual (-6)
  expect (Num.lcm (-3) (-6)) .toEqual (6)
  expect (Num.lcm (12) (18)) .toEqual (36)
  expect (Num.lcm (0) (4)) .toEqual (0)
  expect (() => Num.lcm (0) (0)) .toThrow ()
})
