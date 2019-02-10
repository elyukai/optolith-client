// @ts-check
const { pipe } = require('ramda');
const { ident } = require('../Function');
const { Left, Right } = require('../Either');
const { fmap } = require('../Functor');
const { altF } = require('../../Control/Applicative');
const { List } = require('../List');
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

// TRAVERSABLE

test ('mapMEither', () => {
  expect (
    OrderedMap.mapMEither (x => x === 2 ? Left ("test") : Right (x + 1))
                          (OrderedMap.empty)
  )
    .toEqual (Right (OrderedMap.empty))

  expect (
    OrderedMap.mapMEither (x => x === 2 ? Left ("test") : Right (x + 1))
                          (OrderedMap.fromArray ([[1, 1], [2, 3]]))
  )
    .toEqual (Right (OrderedMap.fromArray ([[1, 2], [2, 4]])))

  expect (
    OrderedMap.mapMEither (x => x === 2 ? Left ("test") : Right (x + 1))
                          (OrderedMap.fromArray ([[1, 1], [2, 3], [3, 2]]))
  )
    .toEqual (Left ("test"))
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

test ('member_', () => {
  expect (OrderedMap.memberF (fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])) (2))
    .toBeTruthy ()

  expect (OrderedMap.memberF (fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])) (5))
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

test ('lookupF', () => {
  expect (OrderedMap.lookupF (fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])) (2))
    .toEqual (Just ('b'))

  expect (OrderedMap.lookupF (fromArray ([[1, 'a'], [2, 'b'], [3, 'c']])) (5))
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
  expect (OrderedMap.alter (fmap (x => x + 'd')) (3) (map))
    .toEqual (fromArray ([[1, 'a'], [2, 'b'], [3, 'cd']]))

  // Insert
  expect (OrderedMap.alter (pipe (fmap (ident), altF (Just ('d'))))
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
  const res = List ('a', 'c', 'b')

  expect (OrderedMap.elems (map)) .toEqual (res)
})

test ('keys', () => {
  const map = fromArray ([[1, 'a'], [3, 'c'], [2, 'b']])
  const res = List (1, 3, 2)

  expect (OrderedMap.keys (map)) .toEqual (res)
})

test ('assocs', () => {
  const map = fromArray ([[1, 'a'], [3, 'c'], [2, 'b']])
  const res = List(
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
  const map = List (
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

test ('filterWithKey_', () => {
  const map = fromArray ([[1, 'a'], [3, 'c'], [4, 'd'], [2, 'b']])
  const res = fromArray ([[3, 'c'], [4, 'd'], [2, 'b']])

  expect (OrderedMap.filterWithKeyF (map)
                                    (key => e => key % 2 === 0 || e === 'c'))
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
  const map = fromArray ([["1", 'a'], ["3", 'c'], ["2", 'b']])
  const res = { "1": '<a>', "2": '<b>', "3": '<c>' }

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
