const Identity = require ('../Identity')
const { add } = require ('../../../App/Utils/mathUtils')

// CONSTRUCTORS

test ('Identity', () => {
  expect (Identity.Identity (3) .value) .toEqual (3)
  expect (Identity.Identity (3) .isIdentity) .toEqual (true)
})

test ('runIdentity', () => {
  expect (Identity.runIdentity (Identity.Identity (3))) .toEqual (3)
})

// FUNCTOR

test ('fmap', () => {
  expect (Identity.fmap (add (3)) (Identity.Identity (3))) .toEqual (Identity.Identity (6))
})

test ('mapReplace', () => {
  expect (Identity.mapReplace (4) (Identity.Identity (3))) .toEqual (Identity.Identity (4))
})
