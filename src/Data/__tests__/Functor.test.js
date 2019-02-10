// @ts-check
const { fmap, mapReplace } = require ('../Functor')
const Const = require ('../Functor/Const')
const { Left, Right } = require ('../Either')
const Identity = require ('../../Control/Monad/Identity')
const { List } = require ('../List')
const { Just, Nothing } = require ('../Maybe')
const { fromUniquePairs } = require ('../OrderedMap')
const { fromBinary } = require ('../Pair')
const { add } = require ('../../App/Utils/mathUtils')

test ('fmap', () => {
  expect (fmap (add (3)) (Const.Const (3)))
    .toEqual (Const.Const (3))

  expect (fmap (x => x * 2) (Right (3)))
    .toEqual (Right (6))

  expect (fmap (x => x * 2) (Left ('test')))
    .toEqual (Left ('test'))

  expect (fmap (add (3)) (Identity.Identity (3)))
    .toEqual (Identity.Identity (6))

  expect (fmap (x => x * 2) (List (3, 2, 1)))
    .toEqual (List (6, 4, 2))

  expect (fmap (x => x * 2) (Just (3)))
    .toEqual (Just (6))

  expect (fmap (x => x * 2) (Nothing))
    .toEqual (Nothing)

  expect (fmap (x => x * 2)
                       (fromUniquePairs (['x', 1], ['y', 2], ['z', 3])))
    .toEqual (fromUniquePairs (['x', 2], ['y', 4], ['z', 6]))

  expect (fmap (x => x * 2) (fromBinary (3, 1)))
    .toEqual (fromBinary (3, 2))
})

test ('mapReplace', () => {
  expect (mapReplace (4) (Const.Const (3)))
    .toEqual (Const.Const (3))

  expect (mapReplace (2) (Right (3)))
    .toEqual (Right (2))

  expect (mapReplace (2) (Left ('test')))
    .toEqual (Left ('test'))

  expect (mapReplace (4) (Identity.Identity (3)))
    .toEqual (Identity.Identity (4))

  expect (mapReplace (2) (List (3, 2, 1)))
    .toEqual (List (2, 2, 2))

  expect (mapReplace (2) (Just (3)))
    .toEqual (Just (2))

  expect (mapReplace (2) (Nothing))
    .toEqual (Nothing)

  expect (mapReplace (2)
                             (fromUniquePairs (['x', 1], ['y', 2], ['z', 3])))
    .toEqual (fromUniquePairs (['x', 2], ['y', 2], ['z', 2]))

  expect (mapReplace (4) (fromBinary (3, 1)))
    .toEqual (fromBinary (3, 4))
})
