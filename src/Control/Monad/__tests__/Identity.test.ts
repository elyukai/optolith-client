import { Identity, isIdentity, runIdentity } from "../Identity"

// CONSTRUCTORS

test ("Identity", () => {
  expect (Identity (3) .value) .toEqual (3)
  expect (Identity (3) .isIdentity) .toEqual (true)
})

test ("runIdentity", () => {
  expect (runIdentity (Identity (3))) .toEqual (3)
})

// CUSTOM IDENTITY FUNCTIONS

test ("isIdentity", () => {
  expect (isIdentity (Identity (4))) .toEqual (true)
  expect (isIdentity (4)) .toEqual (false)
})
