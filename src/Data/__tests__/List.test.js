// @ts-check
const { List, Nil } = require('../List')
const { Just, Nothing } = require('../Maybe')
const { Pair } = require('../Pair')
const { Int } = require('../Int')
const { OrderedMap } = require('../OrderedMap')

// BASIC FUNCTIONS

test ('append', () => {
  expect (List.append (List (3, 2, 1))
                      (List (3, 2, 1)))
    .toEqual (List (3, 2, 1, 3, 2, 1))
})

test ('appendStr', () => {
  expect (List.appendStr ("abc") ("def")) .toEqual ("abcdef")
})

test ('cons', () => {
  expect (List.cons (List (3, 2, 1)) (4))
    .toEqual (List (4, 3, 2, 1))
})

test ('head', () => {
  // @ts-ignore
  expect (List.head (List (3, 2, 1))) .toEqual (3)
  // @ts-ignore
  expect (() => List.head (List ())) .toThrow ()
})

test ('last', () => {
  // @ts-ignore
  expect (List.last (List (3, 2, 1))) .toEqual (1)
  // @ts-ignore
  expect (() => List.last (List ())) .toThrow ()
})

test ('lastS', () => {
  expect (List.lastS (List (3, 2, 1))) .toEqual (Just (1))
  expect (List.lastS (List ())) .toEqual (Nothing)
})

test ('tail', () => {
  // @ts-ignore
  expect (List.tail (List (3, 2, 1)))
    .toEqual (List (2, 1))
  // @ts-ignore
  expect (List.tail (List (1)))
    .toEqual (List ())
  // @ts-ignore
  expect (() => List.tail (List ())) .toThrow ()
})

test ('tailS', () => {
  expect (List.tailS (List (3, 2, 1)))
    .toEqual (Just (List (2, 1)))
  expect (List.tailS (List (1)))
    .toEqual (Just (List ()))
  expect (List.tailS (List ())) .toEqual (Nothing)
})

test ('init', () => {
  // @ts-ignore
  expect (List.init (List (3, 2, 1)))
    .toEqual (List (3, 2))
  // @ts-ignore
  expect (List.init (List (1)))
    .toEqual (List ())
  // @ts-ignore
  expect (() => List.init (List ())) .toThrow ()
})

test ('initS', () => {
  expect (List.initS (List (3, 2, 1)))
    .toEqual (Just (List (3, 2)))
  expect (List.initS (List (1)))
    .toEqual (Just (List ()))
  expect (List.initS (List ())) .toEqual (Nothing)
})

test ('uncons', () => {
  expect (List.uncons (List (3, 2, 1)))
    .toEqual (Just (Pair.fromBinary (3, List (2, 1))))
  expect (List.uncons (List (1)))
    .toEqual (Just (Pair.fromBinary (1, List ())))
  expect (List.uncons (List ())) .toEqual (Nothing)
})

// LIST TRANSFORMATIONS

test ('map', () => {
  expect (List.map (x => x * 2) (List (3, 2, 1)))
    .toEqual (List (6, 4, 2))
})

test ('reverse', () => {
  expect (List.reverse (List (3, 2, 1)))
    .toEqual (List (1, 2, 3))

  const original = List (3, 2, 1)
  const result = List.reverse (original)
  expect (original === result) .toBeFalsy()
})

test ('intercalate', () => {
  expect (List.intercalate (', ') (List (3, 2, 1)))
    .toEqual ('3, 2, 1')
})

// BUILDING LISTS

// SCANS

test ('scanl', () => {
  expect (List.scanl (acc => x => acc * x) (1) (List(2, 3, 4)))
    .toEqual (List (1, 2, 6, 24))
})

// ACCUMULATING MAPS

test ('mapAccumL', () => {
  expect (
    List.mapAccumL (acc => current => Pair.fromBoth (acc + current) (current * 2))
                   (0)
                   (List (1, 2, 3))
  )
    .toEqual (Pair.fromBinary (6, List (2, 4, 6)))
})

// UNFOLDING

test ('unfoldr', () => {
  expect (List.unfoldr (x => x < 11 ? Just (Pair.fromBoth (x) (x + 1)) : Nothing)
                       (1))
    .toEqual (List (1, 2, 3, 4, 5, 6, 7, 8, 9, 10))
})

// EXTRACTING SUBLIST

test ('take', () => {
  expect (List.take (3) (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 2, 3))
  expect (List.take (6) (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 2, 3, 4, 5))
})

test ('drop', () => {
  expect (List.drop (3) (List (1, 2, 3, 4, 5)))
    .toEqual (List (4, 5))
  expect (List.drop (6) (List (1, 2, 3, 4, 5)))
    .toEqual (List ())
})

test ('splitAt', () => {
  expect (List.splitAt (3) (List (1, 2, 3, 4, 5)))
    .toEqual (Pair.fromBoth (List (1, 2, 3))
                       (List (4, 5)))
  expect (List.splitAt (6) (List (1, 2, 3, 4, 5)))
    .toEqual (Pair.fromBoth (List (1, 2, 3, 4, 5))
                       (List ()))
})

// PREDICATES

test ('isInfixOf', () => {
  expect (List.isInfixOf ('test') ('das asd  dsad   ad teste f as'))
    .toEqual (true)
  expect (List.isInfixOf ('test') ('das asd  dsad   ad tese f as'))
    .toEqual (false)
})

// SEARCHING BY EQUALITY

test ('lookup', () => {
  expect (List.lookup (1)
                      (List (Pair.fromBoth (1) ('a')
                                         ,Pair.fromBoth (2) ('b'))))
    .toEqual (Just ('a'))
  expect (List.lookup (3)
                      (List (Pair.fromBoth (1) ('a')
                                         ,Pair.fromBoth (2) ('b'))))
    .toEqual (Nothing)
})

// SEARCHING WITH A PREDICATE

test ('filter', () => {
  expect (List.filter (x => x > 2) (List (1, 2, 3, 4, 5)))
    .toEqual (List (3, 4, 5))
})

test ('partition', () => {
  expect (List.partition (x => x > 2) (List (1, 2, 3, 4, 5)))
    .toEqual (Pair.fromBoth (List (3, 4, 5))
                       (List (1, 2)))
})

// INDEXING LISTS

test ('subscript', () => {
  expect (List.subscript (List (3, 2, 1)) (2))
    .toEqual (Just (1))
  expect (List.subscript (List (3, 2, 1)) (4))
    .toEqual (Nothing)
  expect (List.subscript (List (3, 2, 1)) (-1))
    .toEqual (Nothing)
})

test ('subscriptF', () => {
  expect (List.subscriptF (2) (List (3, 2, 1)))
    .toEqual (Just (1))
  expect (List.subscriptF (4) (List (3, 2, 1)))
    .toEqual (Nothing)
  expect (List.subscriptF (-1) (List (3, 2, 1)))
    .toEqual (Nothing)
})

test ('elemIndex', () => {
  expect (List.elemIndex (3) (List (1, 2, 3, 4, 5)))
    .toEqual (Just (2))
  expect (List.elemIndex (8) (List (1, 2, 3, 4, 5)))
    .toEqual (Nothing)
})

test ('elemIndices', () => {
  expect (List.elemIndices (3) (List (1, 2, 3, 4, 5, 3)))
    .toEqual (List (2, 5))
  expect (List.elemIndices (4) (List (1, 2, 3, 4, 5, 3)))
    .toEqual (List (3))
  expect (List.elemIndices (8) (List (1, 2, 3, 4, 5, 3)))
    .toEqual (List ())
})

test ('findIndex', () => {
  expect (List.findIndex (x => x > 2) (List (1, 2, 3, 4, 5)))
    .toEqual (Just (2))
  expect (List.findIndex (x => x > 8) (List (1, 2, 3, 4, 5)))
    .toEqual (Nothing)
})

test ('findIndices', () => {
  expect (List.findIndices (x => x === 3)
                           (List (1, 2, 3, 4, 5, 3)))
    .toEqual (List (2, 5))
  expect (List.findIndices (x => x > 3) (List (1, 2, 3, 4, 5, 3)))
    .toEqual (List (3, 4))
  expect (List.findIndices (x => x > 8) (List (1, 2, 3, 4, 5, 3)))
    .toEqual (List ())
})

// ZIPPING AND UNZIPPING LISTS

test ('zip', () => {
  expect (List.zip (List ('A', 'B', 'C'))
                   (List (1, 2, 3)))
    .toEqual (List (
      Pair.fromBoth ('A') (1),
      Pair.fromBoth ('B') (2),
      Pair.fromBoth ('C') (3)
    ))

  expect (List.zip (List ('A', 'B', 'C', 'D'))
                   (List (1, 2, 3)))
    .toEqual (List (
      Pair.fromBoth ('A') (1),
      Pair.fromBoth ('B') (2),
      Pair.fromBoth ('C') (3)
    ))

  expect (List.zip (List ('A', 'B', 'C'))
                   (List (1, 2, 3, 4)))
    .toEqual (List (
      Pair.fromBoth ('A') (1),
      Pair.fromBoth ('B') (2),
      Pair.fromBoth ('C') (3)
    ))
})

test ('zipWith', () => {
  expect (List.zipWith (Pair.fromBoth)
                       (List ('A', 'B', 'C'))
                       (List (1, 2, 3)))
    .toEqual (List (
      Pair.fromBoth ('A') (1),
      Pair.fromBoth ('B') (2),
      Pair.fromBoth ('C') (3)
    ))

  expect (List.zipWith (Pair.fromBoth)
                       (List ('A', 'B', 'C', 'D'))
                       (List (1, 2, 3)))
    .toEqual (List (
      Pair.fromBoth ('A') (1),
      Pair.fromBoth ('B') (2),
      Pair.fromBoth ('C') (3)
    ))

  expect (List.zipWith (Pair.fromBoth)
                       (List ('A', 'B', 'C'))
                       (List (1, 2, 3, 4)))
    .toEqual (List (
      Pair.fromBoth ('A') (1),
      Pair.fromBoth ('B') (2),
      Pair.fromBoth ('C') (3)
    ))
})

// SPECIAL LISTS

// Functions on strings

test ('lines', () => {
  expect (List.lines (""))
    .toEqual (List ())

  expect (List.lines ("\n"))
    .toEqual (List (""))

  expect (List.lines ("one"))
    .toEqual (List ("one"))

  expect (List.lines ("one\n"))
    .toEqual (List ("one"))

  expect (List.lines ("one\n\n"))
    .toEqual (List ("one", ""))

  expect (List.lines ("one\ntwo"))
    .toEqual (List ("one", "two"))

  expect (List.lines ("one\ntwo\n"))
    .toEqual (List ("one", "two"))
})

// "SET" OPERATIONS

test ('sdelete', () => {
  expect (List.sdelete (3) (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 2, 4, 5))
  expect (List.sdelete (6) (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 2, 3, 4, 5))
})

test ('intersect', () => {
  expect (List.intersect (List (1, 2, 3, 4))
                         (List (2, 4, 6, 8)))
    .toEqual (List (2, 4))

  expect (List.intersect (List (1, 2, 2, 3, 4))
                         (List (6, 4, 4, 2)))
    .toEqual (List (2, 2, 4))
})

// ORDERED LISTS

test ('sortBy', () => {
  expect (List.sortBy (Int.compare) (List (2, 3, 1, 5, 4)))
    .toEqual (List (1, 2, 3, 4, 5))
})

// LIST.INDEX

// Original functions

test ('indexed', () => {
  expect (List.indexed (List ('a', 'b')))
    .toEqual (List (
      Pair.fromBoth (0) ('a'),
      Pair.fromBoth (1) ('b')
    ))
})

test ('deleteAt', () => {
  expect (List.deleteAt (1) (List (1, 2, 3, 4, 5)))
    .toEqual(List(1, 3, 4, 5))
})

test ('setAt', () => {
  expect (List.setAt(2) (4) (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 2, 4, 4, 5))
})

test ('modifyAt', () => {
  expect(List.modifyAt (2) (x => x * 3) (List (1, 2, 3, 4, 5)))
    .toEqual(List (1, 2, 9, 4, 5))
})

test ('updateAt', () => {
  expect (List.updateAt (2) (x => Just(x * 3)) (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 2, 9, 4, 5))
  expect (List.updateAt (2) (x => Nothing) (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 2, 4, 5))
})

test ('insertAt', () => {
  expect (List.insertAt (2) (6) (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 2, 6, 3, 4, 5))
})

// Maps

test ('imap', () => {
  expect (List.imap (i => x => x * 2 + i) (List (3, 2, 1)))
    .toEqual (List (6, 5, 4))
})

// Folds

test ('ifoldr', () => {
  expect (List.ifoldr (i => x => acc => acc + x + i)
                      (0)
                      (List (3, 2, 1)))
    .toEqual (9)
})

test ('ifoldl', () => {
  expect (List.ifoldl (acc => i => x => acc + x + i)
                      (0)
                      (List (3, 2, 1)))
    .toEqual (9)
})

test ('iall', () => {
  expect (List.iall (i => x => x >= 1 && i < 5) (List (3, 2, 1)))
    .toBeTruthy ()
  expect (List.iall (i => x => x >= 2 && i < 5) (List (3, 2, 1)))
    .toBeFalsy ()
  expect (List.iall (i => x => x >= 1 && i > 0) (List (3, 2, 1)))
    .toBeFalsy ()
})

test ('iany', () => {
  expect (List.iany (i => x => x > 2 && i < 5) (List (3, 2, 1)))
    .toBeTruthy ()
  expect (List.iany (i => x => x > 3 && i < 5) (List (3, 2, 1)))
    .toBeFalsy ()
  expect (List.iany (i => x => x > 2 && i > 0) (List (3, 2, 1)))
    .toBeFalsy ()
})

test ('iconcatMap', () => {
  expect (List.iconcatMap (i => e => List (e, e + i))
                          (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 1, 2, 3, 3, 5, 4, 7, 5, 9))
})

test ('ifilter', () => {
  expect (List.ifilter (i => x => x > 2 || i === 0)
                       (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 3, 4, 5))
})

test ('ipartition', () => {
  expect (List.ipartition (i => x => x > 2 || i === 0)
                          (List (1, 2, 3, 4, 5)))
    .toEqual (Pair.fromBoth (List (1, 3, 4, 5))
                       (List (2)))
})

// Search

test ('ifind', () => {
  expect (List.ifind (i => e => /t/.test (e) || i === 2)
                     (List ('one', 'two', 'three')))
    .toEqual (Just ('two'))
  expect (List.ifind (i => e => /tr/.test (e) || i === 2)
                     (List ('one', 'two', 'three')))
    .toEqual (Just ('three'))
  expect (List.ifind (i => e => /tr/.test (e) || i === 5)
                     (List ('one', 'two', 'three')))
    .toEqual (Nothing)
})

test ('ifindIndex', () => {
  expect (List.ifindIndex (i => x => x > 2 && i > 2)
                          (List (1, 2, 3, 4, 5)))
    .toEqual (Just (3))
  expect (List.ifindIndex (i => x => x > 8 && i > 2)
                          (List (1, 2, 3, 4, 5)))
    .toEqual (Nothing)
})

test ('ifindIndices', () => {
  expect (List.ifindIndices (i => x => x === 3 && i > 2)
                            (List (1, 2, 3, 4, 5, 3)))
    .toEqual (List (5))
  expect (List.ifindIndices (i => x => x > 4 && i > 3)
                            (List (1, 2, 3, 4, 5, 3)))
    .toEqual (List (4))
  expect (List.ifindIndices (i => x => x > 8 && i > 2)
                            (List (1, 2, 3, 4, 5, 3)))
    .toEqual (List ())
})

// LIST.EXTRA

// String operations

test ('lower', () => {
  expect (List.lower ('Test')) .toEqual ('test')
  expect (List.lower ('TEst')) .toEqual ('test')
})

test ('trimStart', () => {
  expect (List.trimStart ("    test\ntest2  ")) .toEqual ("test\ntest2  ")
})

test ('trimEnd', () => {
  expect (List.trimEnd ("    test\ntest2  ")) .toEqual ("    test\ntest2")
})

// Splitting

test ('splitOn', () => {
  expect (List.splitOn (";;") ("x;;y;;z;;"))
    .toEqual (List ("x", "y", "z", ""))
})

// Basics

test ('notNull', () => {
  expect (List.notNull (List (3, 2, 1))) .toEqual (true)
  expect (List.notNull (List ())) .toEqual (false)
})

test ('notNullStr', () => {
  expect (List.notNullStr ("1")) .toEqual (true)
  expect (List.notNullStr ("")) .toEqual (false)
})

test ('list', () => {
  expect (List.list (1) (v => _ => v - 2) (List (5, 6, 7)))
    .toEqual (3)

  expect (List.list (1) (v => _ => v - 2) (List ()))
    .toEqual (1)
})

test ('consF', () => {
  expect (List.consF (4) (List (3, 2, 1)))
    .toEqual (List (4, 3, 2, 1))
})

test ('snoc', () => {
  expect (List.snoc (List (3, 2, 1)) (4))
    .toEqual (List (3, 2, 1, 4))
})

// List operations

test ('maximumOn', () => {
  expect (List.maximumOn (x => x.a)
                         (List ({ a: 1 } , { a: 3 }, { a: 2 })))
    .toEqual (Just ({ a: 3 }))

  expect (List.maximumOn (x => x.a)
                         (List ()))
    .toEqual (Nothing)
})

test ('minimumOn', () => {
  expect (List.minimumOn (x => x.a)
                         (List ({ a: 1 } , { a: 3 }, { a: 2 })))
    .toEqual (Just ({ a: 1 }))

  expect (List.minimumOn (x => x.a)
                         (List ()))
    .toEqual (Nothing)
})

test ('firstJust', () => {
  expect (List.firstJust (x => x.a >= 2 ? Just (x.a) : Nothing)
                         (List ({ a: 1 } , { a: 3 }, { a: 2 })))
    .toEqual (Just (3))

  expect (List.firstJust (x => x.a >= 2 ? Just (x.a) : Nothing)
                         (List ()))
    .toEqual (Nothing)
})

test ('replaceStr', () => {
  expect (List.replaceStr ("{}") ("nice") ("Hello, this is a {} test! It's {}, huh?"))
    .toEqual ("Hello, this is a nice test! It's nice, huh?")
})

// OWN METHODS

test ('unsafeIndex', () => {
  expect (List.unsafeIndex (List (1, 2, 3, 4, 5)) (1))
    .toEqual (2)
  expect (() => List.unsafeIndex (List (1, 2, 3, 4, 5)) (5))
    .toThrow ()
})

test ('fromArray', () => {
  expect (List.fromArray ([3, 2, 1]))
    .toEqual (List (3, 2, 1))
})

test ('toArray', () => {
  expect (List.toArray (List (1, 2, 3, 4, 5)))
    .toEqual ([1, 2, 3, 4, 5])
})

test ('isList', () => {
  expect (List.isList (List (1, 2, 3, 4, 5)))
    .toBeTruthy ()
  expect (List.isList (4))
    .toBeFalsy ()
})

test ('countWith', () => {
  expect (List.countWith (x => x > 2) (List (1, 2, 3, 4, 5)))
    .toEqual (3)
})

test ('maximumNonNegative', () => {
  expect (List.maximumNonNegative (List (1, 2, 3, 4, 5)))
    .toEqual (5)

  expect (List.maximumNonNegative (List (-1, -2, -3, 4, 5)))
    .toEqual (5)

  expect (List.maximumNonNegative (List (-1, -2, -3, -4, -5)))
    .toEqual (0)

  expect (List.maximumNonNegative (Nil))
    .toEqual (0)
})

test ('groupByKey', () => {
  expect (List.groupByKey (x => x % 2) (List (1, 2, 3, 4, 5)))
    .toEqual (
      OrderedMap.fromArray (
        [
          [1, List (1, 3, 5)],
          [0, List (2, 4)],
        ]
      )
    )
})
