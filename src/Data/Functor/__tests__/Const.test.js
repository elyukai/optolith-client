const Const = require ('../Const')
const { add } = require ('../../../App/Utils/mathUtils')

// CONSTRUCTORS

test ('Const', () => {
  expect (Const.Const (3) .value) .toEqual (3)
  expect (Const.Const (3) .isConst) .toEqual (true)
})

test ('getConst', () => {
  expect (Const.getConst (Const.Const (3))) .toEqual (3)
})

// FUNCTOR

test ('fmap', () => {
  expect (Const.fmap (add (3)) (Const.Const (3))) .toEqual (Const.Const (3))
})

test ('mapReplace', () => {
  expect (Const.mapReplace (4) (Const.Const (3))) .toEqual (Const.Const (3))
})

// APPLICATIVE

test ('pure', () => {
  expect (Const.pure (4)) .toEqual (Const.Const (4))
})

// CUSTOM CONST FUNCTIONS

test ('isConst', () => {
  expect (Const.isConst (Const.Const (4))) .toEqual (true)
  expect (Const.isConst (4)) .toEqual (false)
})
