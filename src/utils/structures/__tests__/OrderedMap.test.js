const { pipe } = require('ramda');
const List = require('../List');
const { id } = require('../combinators');
const { fromElements } = require('../List');
const { fromBoth, Pair } = require('../Pair');
const OrderedSet = require('../OrderedSet');
const { fromArray, fromUniquePairs, fromMap, OrderedMap } = require('../OrderedMap');
const { Just, Nothing, Maybe } = require('../Maybe');

// CONSTRUCTOR

test ('fromUniquePairs', () => {
  expect (fromUniquePairs (['x', 1], ['y', 2], ['z', 3]) .value)
    .toEqual (new Map ([['x', 1], ['y', 2], ['z', 3]]))

  expect (fromUniquePairs (['x', 1], ['y', 2], ['z', 3], ['x', 2]) .value)
    .toEqual (new Map ([['x', 2], ['y', 2], ['z', 3]]))

  expect (fromUniquePairs () .value)
    .toEqual (new Map ())
})

test ('fromArray', () => {
  expect (fromArray ([['x', 1], ['y', 2], ['z', 3]]) .value)
    .toEqual (new Map ([['x', 1], ['y', 2], ['z', 3]]))

  expect (fromArray ([['x', 1], ['y', 2], ['z', 3], ['x', 2]]) .value)
    .toEqual (new Map ([['x', 2], ['y', 2], ['z', 3]]))

  expect (fromArray ([]) .value)
    .toEqual (new Map ())
})

test ('fromMap', () => {
  expect (fromMap (new Map ([['x', 1], ['y', 2], ['z', 3]])) .value)
    .toEqual (new Map ([['x', 1], ['y', 2], ['z', 3]]))

  expect (fromMap (new Map ([['x', 1], ['y', 2], ['z', 3], ['x', 2]])) .value)
    .toEqual (new Map ([['x', 2], ['y', 2], ['z', 3]]))

  expect (fromMap (new Map ()) .value)
    .toEqual (new Map ())
})

// FUNCTOR

test ('fmap', () => {
  expect (OrderedMap.fmap (x => x * 2)
                          (fromUniquePairs (['x', 1], ['y', 2], ['z', 3])))
    .toEqual (fromUniquePairs (['x', 2], ['y', 4], ['z', 6]))
})

test ('mapReplace', () => {
  expect (
    OrderedMap.mapReplace (2)
                          (fromUniquePairs (['x', 1], ['y', 2], ['z', 3]))
  )
    .toEqual (fromUniquePairs (['x', 2], ['y', 2], ['z', 2]))
})

// FOLDABLE

test ('foldr', () => {
  expect (OrderedMap.foldr (e => acc => e + acc)
                           ('0')
                           (fromArray ([['x', 3], ['y', 2], ['z', 1]])))
    .toEqual ('3210')
})

test ('foldl', () => {
  expect (OrderedMap.foldl (acc => e => acc + e)
                           ('0')
                           (fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toEqual ('0123')
})

test ('foldr1', () => {
  expect (OrderedMap.foldr1 (e => acc => e + acc)
                            (fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toEqual (6)
})

test ('foldl1', () => {
  expect (OrderedMap.foldl1 (acc => e => e + acc)
                            (fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toEqual (6)
})

test ('toList', () => {
  expect (OrderedMap.toList (fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toEqual (
      List.fromElements (
        fromBoth ('x') (1),
        fromBoth ('y') (2),
        fromBoth ('z') (3)
      )
    )
})

test ('fnull', () => {
  expect (OrderedMap.fnull (fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toBeFalsy ()

  expect (OrderedMap.fnull (fromArray ([]))) .toBeTruthy ()
})

test ('length', () => {
  expect (OrderedMap.length (fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toEqual (3)

  expect (OrderedMap.length (fromArray ([]))) .toEqual (0)
})

test ('elem', () => {
  expect (OrderedMap.elem (3) (fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toBeTruthy ()

  expect (OrderedMap.elem (6) (fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toBeFalsy ()
})

test ('elem_', () => {
  expect (OrderedMap.elem_ (fromArray ([['x', 1], ['y', 2], ['z', 3]])) (3))
    .toBeTruthy ()

  expect (OrderedMap.elem_ (fromArray ([['x', 1], ['y', 2], ['z', 3]])) (6))
    .toBeFalsy ()
})

test ('sum', () => {
  expect (OrderedMap.sum (fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toEqual (6)
})

test ('product', () => {
  expect (OrderedMap.product (fromArray ([['x', 2], ['y', 2], ['z', 3]])))
    .toEqual (12)
})

test ('maximum', () => {
  expect (OrderedMap.maximum (fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toEqual (3)

  expect (OrderedMap.maximum (fromArray ([]))) .toEqual (-Infinity)
})

test ('minimum', () => {
  expect (OrderedMap.minimum (fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toEqual (1)

  expect (OrderedMap.minimum (fromArray ([]))) .toEqual (Infinity)
})

test ('concat', () => {
  expect (OrderedMap.concat (
    fromArray ([
      ['x', List.fromArray ([1])],
      ['y', List.fromArray ([2])],
      ['z', List.fromArray ([3])]
    ])
  ))
    .toEqual (List.fromArray ([1, 2, 3]))
})

test ('concatMap', () => {
  expect (OrderedMap.concatMap (e => fromArray ([[e, e]]))
                               (fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toEqual (fromArray ([[1, 1], [2, 2], [3, 3]]))
})

test ('and', () => {
  expect (OrderedMap.and (fromArray ([['x', true], ['y', true], ['z', true]])))
    .toBeTruthy ()

  expect (OrderedMap.and (fromArray ([['x', true], ['y', true], ['z', false]])))
    .toBeFalsy ()

  expect (
    OrderedMap.or (fromArray ([['x', false], ['y', false], ['z', false]]))
  )
    .toBeFalsy ()
})

test ('or', () => {
  expect (OrderedMap.or (fromArray ([['x', true], ['y', true], ['z', true]])))
    .toBeTruthy ()

  expect (OrderedMap.or (fromArray ([['x', true], ['y', true], ['z', false]])))
    .toBeTruthy ()

  expect (
    OrderedMap.or (fromArray ([['x', false], ['y', false], ['z', false]]))
  )
    .toBeFalsy ()
})

test ('any', () => {
  expect (OrderedMap.any (x => x > 2)
                         (fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toBeTruthy ()

  expect (OrderedMap.any (x => x > 3)
                         (fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toBeFalsy ()
})

test ('all', () => {
  expect (OrderedMap.all (x => x >= 1)
                         (fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toBeTruthy ()

  expect (OrderedMap.all (x => x >= 2)
                         (fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toBeFalsy ()
})

test ('notElem', () => {
  expect (OrderedMap.notElem (3) (fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toBeFalsy ()

  expect (OrderedMap.notElem (6) (fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toBeTruthy ()
})

test ('find', () => {
  expect (
    OrderedMap.find (e => /t/.test (e))
                    (fromArray ([['x', 'one'], ['y', 'two'], ['z', 'three']]))
  )
    .toEqual (Just ('two'))

  expect (
    OrderedMap.find (e => /tr/.test (e))
                    (fromArray ([['x', 'one'], ['y', 'two'], ['z', 'three']]))
  )
    .toEqual (Nothing)
})

// QUERY

test ('size', () => {
  expect (OrderedMap.size (fromArray ([['x', 1], ['y', 2], ['z', 3]])))
    .toEqual (3)

  expect (OrderedMap.size (fromArray ([]))) .toEqual (0)
})

test ('member', () => {
  expect (OrderedMap.member (2) (fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])))
    .toBeTruthy ()

  expect (OrderedMap.member (5) (fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])))
    .toBeFalsy ()
})

test ('notMember', () => {
  expect (OrderedMap.notMember (2) (fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])))
    .toBeFalsy ()

  expect (OrderedMap.notMember (5) (fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])))
    .toBeTruthy ()
})

test ('lookup', () => {
  expect (OrderedMap.lookup (2) (fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])))
    .toEqual (Just ('b'))

  expect (OrderedMap.lookup (5) (fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])))
    .toEqual (Nothing)
})

test ('lookup_', () => {
  expect (OrderedMap.lookup_ (fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])) (2))
    .toEqual (Just ('b'))

  expect (OrderedMap.lookup_ (fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])) (5))
    .toEqual (Nothing)
})

test ('findWithDefault', () => {
  expect (
    OrderedMap.findWithDefault ('...')
                               (2)
                               (fromArray ([[1, 'a'], [2, 'b'], [3, 'c']]))
  )
    .toEqual('b')

  expect (
    OrderedMap.findWithDefault ('...')
                               (5)
                               (fromArray ([[1, 'a'], [2, 'b'], [3, 'c']]))
  )
    .toEqual('...')
})

// CONSTRUCTION

test ('empty', () => {
  const map = OrderedMap.empty
  const res = fromArray ([])

  expect (map) .toEqual (res)
})

test ('singleton', () => {
  const res = fromArray ([[1, 'a']])

  expect (OrderedMap.singleton (1) ('a')) .toEqual (res)
})

// INSERTION

test ('insert', () => {
  expect (OrderedMap.insert (4)
                            ('d')
                            (fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])))
    .toEqual(fromArray ([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']]))

  expect (OrderedMap.insert (3)
                            ('d')
                            (fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])))
    .toEqual(fromArray ([[1, 'a'], [2, 'b'], [3, 'd']]))
})

test ('insertWith', () => {
  expect (OrderedMap.insertWith (x => old => old + x)
                                (4)
                                ('d')
                                (fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])))
    .toEqual(fromArray ([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']]))

  expect (OrderedMap.insertWith (x => old => old + x)
                                (3)
                                ('d')
                                (fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])))
    .toEqual(fromArray ([[1, 'a'], [2, 'b'], [3, 'cd']]))
})

test ('insertWithKey', () => {
  expect (
    OrderedMap.insertWithKey (key => x => old => old + x + key)
                             (4)
                             ('d')
                             (fromArray ([[1, 'a'], [2, 'b'], [3, 'c']]))

  )
    .toEqual (fromArray ([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']]))

  expect (
    OrderedMap.insertWithKey (key => x => old => old + x + key)
                             (3)
                             ('d')
                             (fromArray ([[1, 'a'], [2, 'b'], [3, 'c']]))

  )
    .toEqual (fromArray ([[1, 'a'], [2, 'b'], [3, 'cd3']]))
})

test ('insertLookupWithKey', () => {
  expect (
    OrderedMap.insertLookupWithKey (key => x => old => old + x + key)
                                   (4)
                                   ('d')
                                   (fromArray ([[1, 'a'], [2, 'b'], [3, 'c']]))
  )
    .toEqual (
      fromBoth (Nothing) (fromArray ([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']]))
    )

  expect (
    OrderedMap.insertLookupWithKey (key => x => old => old + x + key)
                                   (3)
                                   ('d')
                                   (fromArray ([[1, 'a'], [2, 'b'], [3, 'c']]))
  )
    .toEqual (
      fromBoth (Just ('c')) (fromArray ([[1, 'a'], [2, 'b'], [3, 'cd3']]))
    )
})

// DELETE/UPDATE

test ('sdelete', () => {
  const map = fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])

  expect (OrderedMap.sdelete (3) (map))
    .toEqual(fromArray ([[1, 'a'], [2, 'b']]))

  expect (OrderedMap.sdelete (4) (map) === map)
    .toBeTruthy()
})

test ('adjust', () => {
  const map = fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])

  expect (OrderedMap.adjust (x => x + 'd') (3) (map))
    .toEqual (fromArray ([[1, 'a'], [2, 'b'], [3, 'cd']]))

  expect (OrderedMap.adjust (x => x + 'd') (4) (map) === map)
    .toBeTruthy ()
})

test ('adjustWithKey', () => {
  const map = fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])

  expect (OrderedMap.adjustWithKey (key => x => x + key) (3) (map))
    .toEqual (fromArray ([[1, 'a'], [2, 'b'], [3, 'c3']]))

  expect (OrderedMap.adjustWithKey (key => x => x + key) (4) (map) === map)
    .toBeTruthy ()
})

test ('update', () => {
  const map = fromArray ([[1, 'a'],[2, 'b'],[3, 'c']])

  expect (OrderedMap.update (x => Just (x + 'd')) (3) (map))
    .toEqual (fromArray ([[1, 'a'], [2, 'b'], [3, 'cd']]))

  expect (OrderedMap.update (x => Nothing) (3) (map))
    .toEqual (fromArray ([[1, 'a'], [2, 'b']]))

  expect (OrderedMap.update (x => Just (x + 'd')) (4) (map) === map)
    .toBeTruthy ()

  expect (OrderedMap.update (x => Nothing) (4) (map) === map)
    .toBeTruthy ()
})

test ('updateWithKey', () => {
  const map = fromArray ([[1, 'a'],[2, 'b'],[3, 'c']])

  expect (OrderedMap.updateWithKey (key => x => Just (x + key)) (3) (map))
    .toEqual (fromArray ([[1, 'a'], [2, 'b'], [3, 'c3']]))

  expect (OrderedMap.updateWithKey (key => x => Nothing) (3) (map))
    .toEqual (fromArray ([[1, 'a'], [2, 'b']]))

  expect (OrderedMap.updateWithKey (key => x => Just (x + key))
                                   (4)
                                   (map) === map)
    .toBeTruthy ()

  expect (OrderedMap.updateWithKey (key => x => Nothing) (4) (map) === map)
    .toBeTruthy ()
})

test ('updateLookupWithKey', () => {
  const map = fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])

  expect (OrderedMap.updateLookupWithKey (key => x => Just (x + key)) (3) (map))
    .toEqual (fromBoth (Just ('c3'))
                       (fromArray ([[1, 'a'], [2, 'b'], [3, 'c3']])))

  expect (OrderedMap.updateLookupWithKey (key => x => Nothing) (3) (map))
    .toEqual (fromBoth (Just ('c'))
                       (fromArray ([[1, 'a'], [2, 'b']])))

  expect (Pair.snd (OrderedMap.updateLookupWithKey (key => x => Just (x + key))
                                                    (4)
                                                    (map)) === map)
    .toBeTruthy()

  expect (Pair.snd (OrderedMap.updateLookupWithKey (key => x => Nothing)
                                                    (4)
                                                    (map)) === map)
    .toBeTruthy()
})

test ('alter', () => {
  const map = fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])

  // Update
  expect (OrderedMap.alter (Maybe.fmap (x => x + 'd')) (3) (map))
    .toEqual (fromArray ([[1, 'a'], [2, 'b'], [3, 'cd']]))

  // Insert
  expect (OrderedMap.alter (pipe (Maybe.fmap (id), Maybe.alt_ (Just ('d'))))
                           (4)
                           (map))
    .toEqual (fromArray ([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']]))

  // Delete
  expect (OrderedMap.alter (m => Nothing) (3) (map))
    .toEqual (fromArray ([[1, 'a'], [2, 'b']]))
})

// COMBINE

test ('union', () => {
  const map1 = fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])
  const map2 = fromArray ([[3, 'd'], [4, 'e'], [5, 'f']])
  const res = fromArray ([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'e'], [5, 'f']])

  expect (OrderedMap.union (map1) (map2)) .toEqual (res)
})

// MAP

test ('map', () => {
  const map = fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])
  const res = fromArray ([[1, 'a_'], [2, 'b_'], [3, 'c_']])

  expect (OrderedMap.map (x => x + '_') (map)) .toEqual (res)
})

test ('mapWithKey', () => {
  const map = fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])
  const res = fromArray ([[1, 'a1'], [2, 'b2'], [3, 'c3']])

  expect (OrderedMap.mapWithKey (key => x => x + key) (map)) .toEqual (res)
})

// FOLDS

test ('foldrWithKey', () => {
  const map = fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])
  const res = 'c3b2a1'

  expect (OrderedMap.foldrWithKey (key => x => acc => acc + x + key) ('') (map))
    .toEqual (res)
})

test ('foldlWithKey', () => {
  const map = fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])
  const res = 'a1b2c3'

  expect (OrderedMap.foldlWithKey (acc => key => x => acc + x + key) ('') (map))
    .toEqual (res)
})

// CONVERSION

test ('elems', () => {
  const map = fromArray ([[1, 'a'], [3, 'c'], [2, 'b']])
  const res = fromElements ('a', 'c', 'b')

  expect (OrderedMap.elems (map)) .toEqual (res)
})

test ('keys', () => {
  const map = fromArray ([[1, 'a'], [3, 'c'], [2, 'b']])
  const res = fromElements (1, 3, 2)

  expect (OrderedMap.keys (map)) .toEqual (res)
})

test ('assocs', () => {
  const map = fromArray ([[1, 'a'], [3, 'c'], [2, 'b']])
  const res = fromElements(
    fromBoth (1) ('a'),
    fromBoth (3) ('c'),
    fromBoth (2) ('b')
  )

  expect (OrderedMap.assocs (map)) .toEqual (res)
})

test ('keysSet', () => {
  const map = fromArray ([[1, 'a'],[3, 'c'],[2, 'b']])
  const res = OrderedSet.fromArray ([1, 3, 2])

  expect (OrderedMap.keysSet (map)) .toEqual (res)
})

test ('fromSet', () => {
  const set = OrderedSet.fromArray ([1, 3, 2])
  const res = fromArray ([[1, 2], [3, 6], [2, 4]])

  expect (OrderedMap.fromSet (key => key * 2) (set)) .toEqual (res)
})

// LISTS

test ('fromList', () => {
  const map = fromElements (
    fromBoth (1) ('a'),
    fromBoth (3) ('c'),
    fromBoth (2) ('b')
  )
  const res = fromArray ([[1, 'a'], [3, 'c'], [2, 'b']])

  expect (OrderedMap.fromList (map)) .toEqual (res)
})

// FILTER

test ('filter', () => {
  const map = fromArray ([[1, 'a'], [3, 'c'], [4, 'd'], [2, 'b']])
  const res = fromArray ([[4, 'd'], [2, 'b']])

  expect (OrderedMap.filter (e => e === 'b' || e === 'd') (map)) .toEqual (res)
})

test ('filterWithKey', () => {
  const map = fromArray ([[1, 'a'], [3, 'c'], [4, 'd'], [2, 'b']])
  const res = fromArray ([[3, 'c'], [4, 'd'], [2, 'b']])

  expect (OrderedMap.filterWithKey (key => e => key % 2 === 0 || e === 'c')
                                   (map))
    .toEqual (res)
})

test ('mapMaybe', () => {
  const map = fromArray ([[1, 'a'], [3, 'c'], [4, 'd'], [2, 'b']])
  const res = fromArray ([[4, '+'], [2, '+']])

  expect (OrderedMap.mapMaybe (e => (e === 'b' || e === 'd')
                                ? Just ('+')
                                : Nothing)
                              (map))
    .toEqual (res)
})

test ('mapMaybeWithKey', () => {
  const map = fromArray ([[1, 'a'], [3, 'c'], [4, 'd'], [2, 'b']])
  const res = fromArray ([[3, '+'], [4, '+'], [2, '+']])

  expect (OrderedMap.mapMaybeWithKey (key => e => (key % 2 === 0 || e === 'c')
                                       ? Just ('+')
                                       : Nothing)
                                     (map))
    .toEqual (res)
})

// CUSTOM FUNCTIONS

test ('toObjectWith', () => {
  const map = fromArray ([[1, 'a'], [3, 'c'], [2, 'b']])
  const res = { 1: '<a>', 2: '<b>', 3: '<c>' }

  expect (OrderedMap.toObjectWith (e => `<${e}>`) (map)) .toEqual (res)
})

test ('toMap', () => {
  const map = fromArray ([[1, 'a'], [3, 'c'], [2, 'b']])
  const res = new Map([[1, 'a'], [3, 'c'], [2, 'b']])

  expect (OrderedMap.toMap (map)) .toEqual (res)
})

test ('isOrderedMap', () => {
  expect (OrderedMap.isOrderedMap (fromArray ([['x', 1]]))) .toEqual (true)
  expect (OrderedMap.isOrderedMap (3)) .toEqual (false)
})
