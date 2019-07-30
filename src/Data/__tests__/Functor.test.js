// @ts-check
const { Internals } = require('../Internals');
const { fmap, fmapF, mapReplace } = require ('../Functor')
const { Const } = require ('../Functor/Const')
const { Identity } = require ('../../Control/Monad/Identity')
const { List } = require ('../List')
const { fromUniquePairs } = require ('../OrderedMap')
const { Pair } = require ('../Tuple')
const { add } = require ('../Num')

const Just = Internals.Just
const Nothing = Internals.Nothing
const Left = Internals.Left
const Right = Internals.Right

describe ('fmap', () => {
  it ("works on Const", () => {
    expect (fmap (add (3)) (Const (3)))
      .toEqual (Const (3))
  })

  it ("works on Either", () => {
    expect (fmap (x => x * 2) (Right (3)))
      .toEqual (Right (6))

    expect (fmap (x => x * 2) (Left ('test')))
      .toEqual (Left ('test'))
  })

  it ("works on Identity", () => {
    expect (fmap (add (3)) (Identity (3)))
      .toEqual (Identity (6))
  })

  it ("works on List", () => {
    expect (fmap (x => x * 2) (List (3, 2, 1)))
      .toEqual (List (6, 4, 2))
  })

  it ("works on Maybe", () => {
    expect (fmap (x => x * 2) (Just (3)))
      .toEqual (Just (6))

    expect (fmap (x => x * 2) (Nothing))
      .toEqual (Nothing)
  })

  it ("works on OrderedMap", () => {
    expect (fmap (x => x * 2)
                 (fromUniquePairs (['x', 1], ['y', 2], ['z', 3])))
      .toEqual (fromUniquePairs (['x', 2], ['y', 4], ['z', 6]))
  })

  it ("works on Pair", () => {
    expect (fmap (x => x * 2) (Pair (3, 1)))
      .toEqual (Pair (3, 2))
  })

  it ("works on IO", () => {
    expect.assertions (4)

    let a

    const io = Internals.IO (() => new Promise (res => (a = 1, res (1))))

    expect (a) .toBeUndefined ()

    const mappedIO = fmap (x => {
                            expect (a) .toEqual (1)
                            a++
                            return x + 1
                          })
                          (io)
                          .f ()
                          .then (x => {
                            expect (a) .toEqual (2)
                            expect (x) .toEqual (2)
                          })
  })
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

  expect (fmapF (Pair (3, 1)) (x => x * 2))
    .toEqual (Pair (3, 2))
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

  expect (mapReplace (4) (Pair (3, 1)))
    .toEqual (Pair (3, 4))
})
