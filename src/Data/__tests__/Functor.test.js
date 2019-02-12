// @ts-check
const { fmap, fmapF, mapReplace } = require ('../Functor')
const { Const } = require ('../Functor/Const')
const { Left, Right } = require ('../Either')
const { Identity } = require ('../../Control/Monad/Identity')
const { List } = require ('../List')
const { Just, Nothing } = require ('../Maybe')
const { fromUniquePairs } = require ('../OrderedMap')
const { fromBinary } = require ('../Pair')
const { add } = require ('../../App/Utils/mathUtils')

test ('fmap', () => {
  expect (fmap (add (3)) (Const (3)))
    .toEqual (Const (3))

  expect (fmap (x => x * 2) (Right (3)))
    .toEqual (Right (6))

  expect (fmap (x => x * 2) (Left ('test')))
    .toEqual (Left ('test'))

  expect (fmap (add (3)) (Identity (3)))
    .toEqual (Identity (6))

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

test ('fmapF', () => {
  expect (fmapF (Const (3)) (add (3)))
    .toEqual (Const (3))

  expect (fmapF (Right (3)) (x => x * 2))
    .toEqual (Right (6))

  expect (fmapF (Left ('test')) (x => x * 2))
    .toEqual (Left ('test'))

  expect (fmapF (Identity (3)) (add (3)))
    .toEqual (Identity (6))

  expect (fmapF (List (3, 2, 1)) (x => x * 2))
    .toEqual (List (6, 4, 2))

  expect (fmapF (Just (3)) (x => x * 2))
    .toEqual (Just (6))

  expect (fmapF (Nothing) (x => x * 2))
    .toEqual (Nothing)

  expect (fmapF (fromUniquePairs (['x', 1], ['y', 2], ['z', 3]))
                (x => x * 2))
    .toEqual (fromUniquePairs (['x', 2], ['y', 4], ['z', 6]))

  expect (fmapF (fromBinary (3, 1)) (x => x * 2))
    .toEqual (fromBinary (3, 2))
})

test ('mapReplace', () => {
  expect (mapReplace (4) (Const (3)))
    .toEqual (Const (3))

  expect (mapReplace (2) (Right (3)))
    .toEqual (Right (2))

  expect (mapReplace (2) (Left ('test')))
    .toEqual (Left ('test'))

  expect (mapReplace (4) (Identity (3)))
    .toEqual (Identity (4))

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
