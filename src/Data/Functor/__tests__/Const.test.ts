import { Const, getConst, isConst } from "../Const"

// CONSTRUCTORS

test ("Const", () => {
  expect (Const (3) .value) .toEqual (3)
  expect (Const (3) .isConst) .toEqual (true)
})

test ("getConst", () => {
  expect (getConst (Const (3))) .toEqual (3)
})

// CUSTOM CONST FUNCTIONS

test ("isConst", () => {
  expect (isConst (Const (4))) .toEqual (true)
  expect (isConst (4)) .toEqual (false)
})
