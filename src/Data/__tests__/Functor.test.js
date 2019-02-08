const Functor = require ('../Functor')
const Const = require ('../Functor/Const')
const { Left, Right } = require ('../Either')
const Identity = require ('../../Control/Monad/Identity')
const { fromElements } = require ('../List')
const { Just, Nothing } = require ('../Maybe')
const { fromUniquePairs } = require ('../OrderedMap')
const { add } = require ('../../App/Utils/mathUtils')

test ('fmap', () => {
  expect (Functor.fmap (add (3)) (Const.Const (3)))
    .toEqual (Const.Const (3))

  expect (Functor.fmap (x => x * 2) (Right (3)))
    .toEqual (Right (6))

  expect (Functor.fmap (x => x * 2) (Left ('test')))
    .toEqual (Left ('test'))

  expect (Functor.fmap (add (3)) (Identity.Identity (3)))
    .toEqual (Identity.Identity (6))

  expect (Functor.fmap (x => x * 2) (fromElements (3, 2, 1)))
    .toEqual (fromElements (6, 4, 2))

  expect (Functor.fmap (x => x * 2) (Just (3)))
    .toEqual (Just (6))

  expect (Functor.fmap (x => x * 2) (Nothing))
    .toEqual (Nothing)

  expect (Functor.fmap (x => x * 2)
                       (fromUniquePairs (['x', 1], ['y', 2], ['z', 3])))
    .toEqual (fromUniquePairs (['x', 2], ['y', 4], ['z', 6]))
})

test ('mapReplace', () => {
  expect (Functor.mapReplace (4) (Const.Const (3)))
    .toEqual (Const.Const (3))

  expect (Functor.mapReplace (2) (Right (3)))
    .toEqual (Right (2))

  expect (Functor.mapReplace (2) (Left ('test')))
    .toEqual (Left ('test'))

  expect (Functor.mapReplace (4) (Identity.Identity (3)))
    .toEqual (Identity.Identity (4))

  expect (Functor.mapReplace (2) (fromElements (3, 2, 1)))
    .toEqual (fromElements (2, 2, 2))

  expect (Functor.mapReplace (2) (Just (3)))
    .toEqual (Just (2))

  expect (Functor.mapReplace (2) (Nothing))
    .toEqual (Nothing)

  expect (Functor.mapReplace (2)
                             (fromUniquePairs (['x', 1], ['y', 2], ['z', 3])))
    .toEqual (fromUniquePairs (['x', 2], ['y', 2], ['z', 2]))
})
