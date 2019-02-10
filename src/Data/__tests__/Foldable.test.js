// @ts-check
const { fromBoth } = require ("../Pair");
const Foldable = require ('../Foldable')
const { Left, Right } = require ('../Either')
const { List } = require ('../List')
const { Just, Nothing } = require ('../Maybe')
const { OrderedMap } = require ('../OrderedMap')
const { OrderedSet } = require ('../OrderedSet')

test ('foldr', () => {
  expect (Foldable.foldr (x => acc => x * 2 + acc) (2) (Right (3)))
    .toEqual (8)

  expect (Foldable.foldr (x => acc => x * 2 + acc) (2) (Left ('a')))
    .toEqual (2)

  expect (Foldable.foldr (e => acc => e + acc) ('0') (List (3, 2, 1)))
    .toEqual ('3210')

  expect (Foldable.foldr (x => acc => x * 2 + acc) (2) (Just (3)))
    .toEqual (8)

  expect (Foldable.foldr (x => acc => x * 2 + acc) (2) (Nothing))
    .toEqual (2)

  expect (Foldable.foldr (e => acc => e + acc)
                         ('0')
                         (OrderedMap.fromArray ([['x', 3], ['y', 2], ['z', 1]])))
    .toEqual ('3210')

  expect (Foldable.foldr (e => acc => e + acc)
                         ('0')
                         (OrderedSet.fromArray ([3, 2, 1])))
    .toEqual ('3210')
})

test ('foldl', () => {
  expect (Foldable.foldl (acc => x => x * 2 + acc) (2) (Right (3)))
    .toEqual (8)

  expect (Foldable.foldl (acc => x => x * 2 + acc) (2) (Left ('a')))
    .toEqual (2)

  expect (Foldable.foldl (acc => e => acc + e) ('0') (List (1, 2, 3)))
    .toEqual ('0123')

  expect (Foldable.foldl (acc => x => x * 2 + acc) (2) (Just (3)))
    .toEqual (8)

  expect (Foldable.foldl (acc => x => x * 2 + acc) (2) (Nothing))
    .toEqual (2)

  expect (Foldable.foldl (acc => e => acc + e)
                         ('0')
                         (OrderedMap.fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toEqual ('0123')

  expect (Foldable.foldl (acc => e => acc + e)
                         ('0')
                         (OrderedSet.fromArray ([1, 2, 3])))
    .toEqual ('0123')
})

test ('foldr1', () => {
  // @ts-ignore
  expect (Foldable.foldr1 (e => acc => e + acc) (List (3, 2, 1)))
    .toEqual (6)

  expect (Foldable.foldr1 (e => acc => e + acc)
                          (OrderedMap.fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toEqual (6)

  expect (Foldable.foldr1 (e => acc => e + acc) (OrderedSet.fromArray ([3, 2, 1])))
    .toEqual (6)
})

test ('foldl1', () => {
  // @ts-ignore
  expect (Foldable.foldl1 (acc => e => e + acc) (List (3, 2, 1)))
    .toEqual (6)

  expect (Foldable.foldl1 (acc => e => e + acc)
                          (OrderedMap.fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toEqual (6)

  expect (Foldable.foldl1 (acc => e => e + acc) (OrderedSet.fromArray ([3, 2, 1])))
    .toEqual (6)
})

test ('toList', () => {
  expect (Foldable.toList (Right (3)))
    .toEqual (List (3))

  expect (Foldable.toList (Left ('a')))
    .toEqual (List ())

  expect (Foldable.toList (List (3, 2, 1)))
    .toEqual (List (3, 2, 1))

  expect (Foldable.toList (Just (3)))
    .toEqual (List (3))

  expect (Foldable.toList (Nothing))
    .toEqual (List ())

  expect (Foldable.toList (OrderedMap.fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toEqual (
      List (
        fromBoth ('x') (1),
        fromBoth ('y') (2),
        fromBoth ('z') (3)
      )
    )

  expect (Foldable.toList (OrderedSet.fromArray ([3, 2, 1])))
    .toEqual (List (3, 2, 1))
})

test ('fnull', () => {
  expect (Foldable.fnull (Right (3)))
    .toEqual (false)

  expect (Foldable.fnull (Left ('a')))
    .toEqual (true)

  expect (Foldable.fnull (List (3, 2, 1)))
    .toBeFalsy ()

  expect (Foldable.fnull (List ()))
    .toBeTruthy ()

  expect (Foldable.fnull (Just (3)))
    .toEqual (false)

  expect (Foldable.fnull (Nothing))
    .toEqual (true)

  expect (Foldable.fnull (OrderedMap.fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toBeFalsy ()

  expect (Foldable.fnull (OrderedMap.fromArray ([])))
    .toBeTruthy ()

  expect (Foldable.fnull (OrderedSet.fromArray ([3, 2, 1])))
    .toBeFalsy ()

  expect (Foldable.fnull (OrderedSet.fromArray ([])))
    .toBeTruthy ()
})

test ('length', () => {
  expect (Foldable.length (Right (3)))
    .toEqual (1)

  expect (Foldable.length (Left ('a')))
    .toEqual (0)

  expect (Foldable.length (List (3, 2, 1)))
    .toEqual (3)

  expect (Foldable.length (List ()))
    .toEqual (0)

  expect (Foldable.length (Just (3)))
    .toEqual (1)

  expect (Foldable.length (Nothing))
    .toEqual (0)

  expect (Foldable.length (OrderedMap.fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toEqual (3)

  expect (Foldable.length (OrderedMap.fromArray ([])))
    .toEqual (0)

  expect (Foldable.length (OrderedSet.fromArray ([3, 2, 1])))
    .toEqual (3)

  expect (Foldable.length (OrderedSet.fromArray ([])))
    .toEqual (0)
})

test ('elem', () => {
  expect (Foldable.elem (3) (Left ('a')))
    .toBeFalsy ()

  expect (Foldable.elem (3) (Right (2)))
    .toBeFalsy ()

  expect (Foldable.elem (3) (Right (3)))
    .toBeTruthy ()

  expect (Foldable.elem (3) (List (1, 2, 3, 4, 5)))
    .toBeTruthy ()

  expect (Foldable.elem (6) (List (1, 2, 3, 4, 5)))
    .toBeFalsy ()

  expect (Foldable.elem (3) (Nothing))
    .toBeFalsy ()

  expect (Foldable.elem (3) (Just (2)))
    .toBeFalsy ()

  expect (Foldable.elem (3) (Just (3)))
    .toBeTruthy ()

  expect (Foldable.elem (3) (OrderedMap.fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toBeTruthy ()

  expect (Foldable.elem (6) (OrderedMap.fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toBeFalsy ()

  expect (Foldable.elem (3) (OrderedSet.fromArray ([1, 2, 3, 4, 5])))
    .toBeTruthy ()

  expect (Foldable.elem (6) (OrderedSet.fromArray ([1, 2, 3, 4, 5])))
    .toBeFalsy ()
})

test ('elemF', () => {
  expect (Foldable.elemF (Left ('a')) (3))
    .toBeFalsy ()

  expect (Foldable.elemF (Right (2)) (3))
    .toBeFalsy ()

  expect (Foldable.elemF (Right (3)) (3))
    .toBeTruthy ()

  expect (Foldable.elemF (List (1, 2, 3, 4, 5)) (3))
    .toBeTruthy ()

  expect (Foldable.elemF (List (1, 2, 3, 4, 5)) (6))
    .toBeFalsy ()

  expect (Foldable.elemF (Nothing) (3))
    .toBeFalsy ()

  expect (Foldable.elemF (Just (2)) (3))
    .toBeFalsy ()

  expect (Foldable.elemF (Just (3)) (3))
    .toBeTruthy ()

  expect (Foldable.elemF (OrderedMap.fromArray ([['x', 1], ['y', 2], ['z', 3]])) (3))
    .toBeTruthy ()

  expect (Foldable.elemF (OrderedMap.fromArray ([['x', 1], ['y', 2], ['z', 3]])) (6))
    .toBeFalsy ()

  expect (Foldable.elemF (OrderedSet.fromArray ([1, 2, 3, 4, 5])) (3))
    .toBeTruthy ()

  expect (Foldable.elemF (OrderedSet.fromArray ([1, 2, 3, 4, 5])) (6))
    .toBeFalsy ()
})

test ('sum', () => {
  expect (Foldable.sum (Right (3)))
    .toEqual (3)

  expect (Foldable.sum (Left ('a')))
    .toEqual (0)

  expect (Foldable.sum (List (3, 2, 1)))
    .toEqual (6)

  expect (Foldable.sum (Just (3)))
    .toEqual (3)

  expect (Foldable.sum (Nothing))
    .toEqual (0)

  expect (Foldable.sum (OrderedMap.fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toEqual (6)

  expect (Foldable.sum (OrderedSet.fromArray ([3, 2, 1])))
    .toEqual (6)
})

test ('product', () => {
  expect (Foldable.product (Right (3)))
    .toEqual (3)

  expect (Foldable.product (Left ('a')))
    .toEqual (1)

  expect (Foldable.product (List (3, 2, 2)))
    .toEqual (12)

  expect (Foldable.product (Just (3)))
    .toEqual (3)

  expect (Foldable.product (Nothing))
    .toEqual (1)

  expect (Foldable.product (OrderedMap.fromArray ([['x', 2], ['y', 2], ['z', 3]])))
    .toEqual (12)

  expect (Foldable.product (OrderedSet.fromArray ([3, 2, 2]))) .toEqual (6)
})

test ('maximum', () => {
  expect (Foldable.maximum (List (3, 2, 1)))
    .toEqual (3)

  expect (Foldable.maximum (List ()))
    .toEqual (-Infinity)

  expect (Foldable.maximum (OrderedMap.fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toEqual (3)

  expect (Foldable.maximum (OrderedMap.fromArray ([])))
    .toEqual (-Infinity)

  expect (Foldable.maximum (OrderedSet.fromArray ([3, 2, 1])))
    .toEqual (3)

  expect (Foldable.maximum (OrderedSet.fromArray ([])))
    .toEqual (-Infinity)
})

test ('minimum', () => {
  expect (Foldable.minimum (List (3, 2, 1)))
    .toEqual (1)

  expect (Foldable.minimum (List ()))
    .toEqual (Infinity)

  expect (Foldable.minimum (OrderedMap.fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toEqual (1)

  expect (Foldable.minimum (OrderedMap.fromArray ([])))
    .toEqual (Infinity)

  expect (Foldable.minimum (OrderedSet.fromArray ([3, 2, 1])))
    .toEqual (1)

  expect (Foldable.minimum (OrderedSet.fromArray ([])))
    .toEqual (Infinity)
})

test ('concat', () => {
  expect (Foldable.concat (Right (List (1, 2, 3))))
    .toEqual (List (1, 2, 3))

  expect (Foldable.concat (Left ('a')))
    .toEqual (List ())

  expect (Foldable.concat (List (List (3), List (2), List (1))))
    .toEqual (List (3, 2, 1))

  expect (Foldable.concat (Just (List (1, 2, 3))))
    .toEqual (List (1, 2, 3))

  expect (Foldable.concat (Nothing))
    .toEqual (List ())

  expect (Foldable.concat (
    OrderedMap.fromArray ([
      ['x', List.fromArray ([1])],
      ['y', List.fromArray ([2])],
      ['z', List.fromArray ([3])]
    ])
  ))
    .toEqual (List.fromArray ([1, 2, 3]))

  expect (Foldable.concat (
    OrderedSet.fromArray ([
      List.fromArray ([3]),
      List.fromArray ([2]),
      List.fromArray ([1])
    ])
  ))
    .toEqual (List.fromArray ([3, 2, 1]))
})

test ('concatMap', () => {
  expect (Foldable.concatMap (e => List (e, e)) (Right (3)))
    .toEqual (List (3, 3))

  expect (Foldable.concatMap (e => List (e, e)) (Left ('a')))
    .toEqual (List ())

  expect (Foldable.concatMap (e => List (e, e))
                             (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 1, 2, 2, 3, 3, 4, 4, 5, 5))

  expect (Foldable.concatMap (e => List (e, e)) (Just (3)))
    .toEqual (List (3, 3))

  expect (Foldable.concatMap (e => List (e, e)) (Nothing))
    .toEqual (List ())

  expect (Foldable.concatMap (e => List ([[e, e]]))
                             (OrderedMap.fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toEqual (OrderedMap.fromArray ([[1, 1], [2, 2], [3, 3]]))

  expect (Foldable.concatMap (e => List ([e, e]))
                             (OrderedSet.fromArray ([1, 2, 3, 4, 5])))
    .toEqual (OrderedSet.fromArray ([1, 1, 2, 2, 3, 3, 4, 4, 5, 5]))
})

test ('and', () => {
  expect (Foldable.and (Right (true)))
    .toEqual (true)

  expect (Foldable.and (Right (false)))
    .toEqual (false)

  expect (Foldable.and (Left ('a')))
    .toEqual (true)

  expect (Foldable.and (List (true, true, true)))
    .toBeTruthy ()

  expect (Foldable.and (List (true, true, false)))
    .toBeFalsy ()

  expect (Foldable.and (List (true, false, true)))
    .toBeFalsy ()

  expect (Foldable.and (Just (true)))
    .toEqual (true)

  expect (Foldable.and (Just (false)))
    .toEqual (false)

  expect (Foldable.and (Nothing))
    .toEqual (true)

  expect (Foldable.and (OrderedMap.fromArray ([['x', true], ['y', true], ['z', true]])))
    .toBeTruthy ()

  expect (Foldable.and (OrderedMap.fromArray ([['x', true], ['y', true], ['z', false]])))
    .toBeFalsy ()

  expect (Foldable.and (OrderedMap.fromArray ([['x', false], ['y', false], ['z', false]])))
    .toBeFalsy ()

  expect (Foldable.and (OrderedSet.fromArray ([true, true, true])))
    .toBeTruthy ()

  expect (Foldable.and (OrderedSet.fromArray ([true, true, false])))
    .toBeFalsy ()

  expect (Foldable.and (OrderedSet.fromArray ([true, false, true])))
    .toBeFalsy ()
})

test ('or', () => {
  expect (Foldable.or (Right (true)))
    .toEqual (true)

  expect (Foldable.or (Right (false)))
    .toEqual (false)

  expect (Foldable.or (Left ('a')))
    .toEqual (false)

  expect (Foldable.or (List (true, true, true)))
    .toBeTruthy ()

  expect (Foldable.or (List (true, true, false)))
    .toBeTruthy ()

  expect (Foldable.or (List (false, false, false)))
    .toBeFalsy ()

  expect (Foldable.or (Just (true)))
    .toEqual (true)

  expect (Foldable.or (Just (false)))
    .toEqual (false)

  expect (Foldable.or (Nothing))
    .toEqual (false)

  expect (Foldable.or (OrderedMap.fromArray ([['x', true], ['y', true], ['z', true]])))
    .toBeTruthy ()

  expect (Foldable.or (OrderedMap.fromArray ([['x', true], ['y', true], ['z', false]])))
    .toBeTruthy ()

  expect (Foldable.or (OrderedMap.fromArray ([['x', false], ['y', false], ['z', false]])))
    .toBeFalsy ()

  expect (Foldable.or (OrderedSet.fromArray ([true, true, true])))
    .toBeTruthy ()

  expect (Foldable.or (OrderedSet.fromArray ([true, true, false])))
    .toBeTruthy ()

  expect (Foldable.or (OrderedSet.fromArray ([false, false, false])))
    .toBeFalsy ()
})

test ('any', () => {
  expect (Foldable.any (e => e > 3) (Right (5)))
    .toEqual (true)

  expect (Foldable.any (e => e > 3) (Right (3)))
    .toEqual (false)

  expect (Foldable.any (e => e > 3) (Left ('a')))
    .toEqual (false)

  expect (Foldable.any (x => x > 2) (List (3, 2, 1)))
    .toBeTruthy ()

  expect (Foldable.any (x => x > 3) (List (3, 2, 1)))
    .toBeFalsy ()

  expect (Foldable.any (e => e > 3) (Just (5)))
    .toEqual (true)

  expect (Foldable.any (e => e > 3) (Just (3)))
    .toEqual (false)

  expect (Foldable.any (e => e > 3) (Nothing))
    .toEqual (false)

  expect (Foldable.any (x => x > 2)
                       (OrderedMap.fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toBeTruthy ()

  expect (Foldable.any (x => x > 3)
                       (OrderedMap.fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toBeFalsy ()

  expect (Foldable.any (x => x > 2) (OrderedSet.fromArray ([3, 2, 1])))
    .toBeTruthy ()

  expect (Foldable.any (x => x > 3) (OrderedSet.fromArray ([3, 2, 1])))
    .toBeFalsy ()
})

test ('all', () => {
  expect (Foldable.all (e => e > 3) (Right (5)))
    .toEqual (true)

  expect (Foldable.all (e => e > 3) (Right (3)))
    .toEqual (false)

  expect (Foldable.all (e => e > 3) (Left ('a')))
    .toEqual (true)

  expect (Foldable.all (x => x >= 1) (List (3, 2, 1)))
    .toBeTruthy ()

  expect (Foldable.all (x => x >= 2) (List (3, 2, 1)))
    .toBeFalsy ()

  expect (Foldable.all (e => e > 3) (Just (5)))
    .toEqual (true)

  expect (Foldable.all (e => e > 3) (Just (3)))
    .toEqual (false)

  expect (Foldable.all (e => e > 3) (Nothing))
    .toEqual (true)

  expect (Foldable.all (x => x >= 1)
                       (OrderedMap.fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toBeTruthy ()

  expect (Foldable.all (x => x >= 2)
                       (OrderedMap.fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toBeFalsy ()

  expect (Foldable.all (x => x >= 1) (OrderedSet.fromArray ([3, 2, 1])))
    .toBeTruthy ()

  expect (Foldable.all (x => x >= 2) (OrderedSet.fromArray ([3, 2, 1])))
    .toBeFalsy ()
})

test ('notElem', () => {
  expect (Foldable.notElem (3) (Left ('a')))
    .toBeTruthy ()

  expect (Foldable.notElem (3) (Right (2)))
    .toBeTruthy ()

  expect (Foldable.notElem (3) (Right (3)))
    .toBeFalsy ()

  expect (Foldable.notElem (3) (List (1, 2, 3, 4, 5)))
    .toBeFalsy ()

  expect (Foldable.notElem (6) (List (1, 2, 3, 4, 5)))
    .toBeTruthy ()

  expect (Foldable.notElem (3) (Nothing))
    .toBeTruthy ()

  expect (Foldable.notElem (3) (Just (2)))
    .toBeTruthy ()

  expect (Foldable.notElem (3) (Just (3)))
    .toBeFalsy ()

  expect (Foldable.notElem (3) (OrderedMap.fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toBeFalsy ()

  expect (Foldable.notElem (6) (OrderedMap.fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toBeTruthy ()

  expect (Foldable.notElem (3) (OrderedSet.fromArray ([1, 2, 3, 4, 5])))
    .toBeFalsy ()

  expect (Foldable.notElem (6) (OrderedSet.fromArray ([1, 2, 3, 4, 5])))
    .toBeTruthy ()
})

test ('notElemF', () => {
  expect (Foldable.notElemF (List (1, 2, 3, 4, 5)) (3))
    .toBeFalsy ()

  expect (Foldable.notElemF (List (1, 2, 3, 4, 5)) (6))
    .toBeTruthy ()
})

test ('find', () => {
  expect (Foldable.find (e => e > 3) (Right (5)))
    .toEqual (Just (5))

  expect (Foldable.find (e => e > 3) (Right (3)))
    .toEqual (Nothing)

  expect (Foldable.find (e => e > 3) (Left ('a')))
    .toEqual (Nothing)

  expect (Foldable.find (e => /t/.test (e))
                        (List ('one', 'two', 'three')))
    .toEqual (Just ('two'))

  expect (Foldable.find (e => /tr/.test (e))
                        (List ('one', 'two', 'three')))
    .toEqual (Nothing)

  expect (Foldable.find (e => e > 3) (Just (5)))
    .toEqual (Just (5))

  expect (Foldable.find (e => e > 3) (Just (3)))
    .toEqual (Nothing)

  expect (Foldable.find (e => e > 3) (Nothing))
    .toEqual (Nothing)

  expect (
    Foldable.find (e => /t/.test (e))
                  (OrderedMap.fromArray ([['x', 'one'], ['y', 'two'], ['z', 'three']]))
  )
    .toEqual (Just ('two'))

  expect (
    Foldable.find (e => /tr/.test (e))
                  (OrderedMap.fromArray ([['x', 'one'], ['y', 'two'], ['z', 'three']]))
  )
    .toEqual (Nothing)

  expect (Foldable.find (e => /t/.test(e))
                        (OrderedSet.fromArray (['one', 'two', 'three'])))
    .toEqual (Just ('two'))

  expect (Foldable.find (e => /tr/.test(e))
                        (OrderedSet.fromArray (['one', 'two', 'three'])))
    .toEqual (Nothing)
})
