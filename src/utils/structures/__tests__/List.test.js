const List = require('../List')
const { Just, Nothing } = require('../Maybe')
const { OrderedMap } = require('../OrderedMap')
const { Pair } = require('../Pair')
const { GT, EQ, LT } = require('../Ord')

// CONSTRUCTORS

test ('fromElements', () => {
  const head = { value: 3, next: { value: 2, next: { value: 1 }}}

  expect (List.fromElements (3, 2, 1) .head) .toEqual (head)
})

test ('fromArray', () => {
  const head = { value: 3, next: { value: 2, next: { value: 1 }}}

  expect (List.fromArray ([3, 2, 1]) .head) .toEqual (head)
})

// FUNCTOR

test ('fmap', () => {
  expect (List.fmap (x => x * 2) (List.fromElements (3, 2, 1)))
    .toEqual (List.fromElements (6, 4, 2))
})

test ('mapReplace', () => {
  expect (List.mapReplace (2) (List.fromElements (3, 2, 1)))
    .toEqual (List.fromElements (2, 2, 2))
})

// APPLICATIVE

test ('pure', () => {
  expect (List.pure (3)) .toEqual (List.fromElements (3))
})

test ('ap', () => {
  expect(List.ap (List.fromElements (x => x * 3, x => x * 2))
                 (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (List.fromElements (3, 6, 9, 12, 15, 2, 4, 6, 8, 10))
})

// ALTERNATIVE

test ('alt', () => {
  expect (List.alt (List.fromElements (3)) (List.fromElements (2)))
    .toEqual (List.fromElements (3))
  expect (List.alt (List.fromElements (3)) (List.fromElements ()))
    .toEqual (List.fromElements (3))
  expect (List.alt (List.fromElements ()) (List.fromElements (2)))
    .toEqual (List.fromElements (2))
  expect (List.alt (List.fromElements ()) (List.fromElements ()))
    .toEqual (List.fromElements ())
})

test ('altF', () => {
  expect (List.altF (List.fromElements (2)) (List.fromElements (3)))
    .toEqual (List.fromElements (3))
  expect (List.altF (List.fromElements ()) (List.fromElements (3)))
    .toEqual (List.fromElements (3))
  expect (List.altF (List.fromElements (2)) (List.fromElements ()))
    .toEqual (List.fromElements (2))
  expect (List.altF (List.fromElements ()) (List.fromElements ()))
    .toEqual (List.fromElements ())
})

test ('empty', () => {
  expect (List.empty) .toEqual (List.fromElements ())
})

test ('guard', () => {
  expect (List.guard (true))
    .toEqual (List.fromElements (true))
  expect (List.guard (false))
    .toEqual (List.fromElements ())
})

// MONAD

test ('bind', () => {
  expect (List.bind (List.fromElements (1, 2, 3, 4, 5))
                    (e => List.fromElements (e, e)))
    .toEqual (List.fromElements (1, 1, 2, 2, 3, 3, 4, 4, 5, 5))
})

test ('bindF', () => {
  expect (List.bindF (e => List.fromElements (e, e))
                     (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (List.fromElements (1, 1, 2, 2, 3, 3, 4, 4, 5, 5))
})

test ('then', () => {
  expect (List.then (List.fromElements (1, 2, 3, 4, 5))
                    (List.fromElements ('a', 'c')))
    .toEqual (
      List.fromElements ('a', 'c', 'a', 'c', 'a', 'c', 'a', 'c', 'a', 'c')
    )
  expect (List.then (List.fromElements ()) (List.fromElements ('a', 'c')))
    .toEqual (List.fromElements ())
})

test ('mreturn', () => {
  expect (List.mreturn (3)) .toEqual (List.fromElements(3))
})

test ('kleisli', () => {
  expect (List.kleisli (e => List.fromElements (e, e))
                       (e => List.fromElements (e, e * 2))
                       (2))
    .toEqual (List.fromElements (2, 4, 2, 4))
})

test ('join', () => {
  expect (List.join (
    List.fromElements (
      List.fromElements (3),
      List.fromElements (2),
      List.fromElements (1)
    )
  ))
    .toEqual (List.fromElements (3, 2, 1))
})

// FOLDABLE

test ('foldr', () => {
  expect (List.foldr (e => acc => e + acc) ('0') (List.fromElements (3, 2, 1)))
    .toEqual ('3210')
})

test ('foldl', () => {
  expect (List.foldl (acc => e => acc + e) ('0') (List.fromElements (1, 2, 3)))
    .toEqual ('0123')
})

test ('foldr1', () => {
  expect (List.foldr1 (e => acc => e + acc) (List.fromElements (3, 2, 1)))
    .toEqual (6)
})

test ('foldl1', () => {
  expect (List.foldl1 (acc => e => e + acc) (List.fromElements (3, 2, 1)))
    .toEqual (6)
})

test ('toList', () => {
  expect (List.toList (List.fromElements (3, 2, 1)))
    .toEqual (List.fromElements (3, 2, 1))
})

test ('fnull', () => {
  expect (List.fnull (List.fromElements (3, 2, 1))) .toBeFalsy ()
  expect (List.fnull (List.fromElements ())) .toBeTruthy ()
})

test ('length', () => {
  expect (List.length (List.fromElements (3, 2, 1))) .toEqual (3)
  expect (List.length (List.fromElements ())) .toEqual (0)
})

test ('elem', () => {
  expect (List.elem (3) (List.fromElements (1, 2, 3, 4, 5)))
    .toBeTruthy ()
  expect (List.elem (6) (List.fromElements (1, 2, 3, 4, 5)))
    .toBeFalsy ()
})

test ('elem_', () => {
  expect (List.elem_ (List.fromElements (1, 2, 3, 4, 5)) (3))
    .toBeTruthy ()
  expect (List.elem_ (List.fromElements (1, 2, 3, 4, 5)) (6))
    .toBeFalsy ()
})

test ('sum', () => {
  expect (List.sum (List.fromElements (3, 2, 1))) .toEqual (6)
})

test ('product', () => {
  expect (List.product (List.fromElements (3, 2, 2))) .toEqual (12)
})

test ('maximum', () => {
  expect(List.maximum (List.fromElements (3, 2, 1))) .toEqual (3)
  expect(List.maximum (List.fromElements ())) .toEqual (-Infinity)
})

test ('minimum', () => {
  expect (List.minimum (List.fromElements (3, 2, 1))) .toEqual (1)
  expect (List.minimum (List.fromElements ())) .toEqual (Infinity)
})

test ('concat', () => {
  expect (List.concat (
    List.fromElements (
      List.fromElements (3),
      List.fromElements (2),
      List.fromElements (1)
    )
  ))
    .toEqual (List.fromElements (3, 2, 1))
})

test ('concatMap', () => {
  expect (List.concatMap (e => List.fromElements (e, e))
                    (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (List.fromElements (1, 1, 2, 2, 3, 3, 4, 4, 5, 5))
})

test ('and', () => {
  expect (List.and (List.fromElements (true, true, true)))
    .toBeTruthy ()
  expect (List.and (List.fromElements (true, true, false)))
    .toBeFalsy ()
  expect (List.and (List.fromElements (true, false, true)))
    .toBeFalsy ()
})

test ('or', () => {
  expect (List.or (List.fromElements (true, true, true)))
    .toBeTruthy ()
  expect (List.or (List.fromElements (true, true, false)))
    .toBeTruthy ()
  expect (List.or (List.fromElements (false, false, false)))
    .toBeFalsy ()
})

test ('any', () => {
  expect (List.any (x => x > 2) (List.fromElements (3, 2, 1)))
    .toBeTruthy ()
  expect (List.any (x => x > 3) (List.fromElements (3, 2, 1)))
    .toBeFalsy ()
})

test ('all', () => {
  expect (List.all (x => x >= 1) (List.fromElements (3, 2, 1)))
    .toBeTruthy ()
  expect (List.all (x => x >= 2) (List.fromElements (3, 2, 1)))
    .toBeFalsy ()
})

test ('notElem', () => {
  expect (List.notElem (3) (List.fromElements (1, 2, 3, 4, 5)))
    .toBeFalsy ()
  expect (List.notElem (6) (List.fromElements (1, 2, 3, 4, 5)))
    .toBeTruthy ()
})

test ('notElemF', () => {
  expect (List.notElemF (List.fromElements (1, 2, 3, 4, 5)) (3))
    .toBeFalsy ()
  expect (List.notElemF (List.fromElements (1, 2, 3, 4, 5)) (6))
    .toBeTruthy ()
})

test ('find', () => {
  expect (List.find (e => /t/.test (e))
                    (List.fromElements ('one', 'two', 'three')))
    .toEqual (Just ('two'))
  expect (List.find (e => /tr/.test (e))
                    (List.fromElements ('one', 'two', 'three')))
    .toEqual (Nothing)
})

// BASIC FUNCTIONS

test ('notNull', () => {
  expect (List.notNull (List.fromElements (3, 2, 1))) .toEqual (true)
  expect (List.notNull (List.fromElements ())) .toEqual (false)
})

test ('append', () => {
  expect (List.append (List.fromElements (3, 2, 1))
                      (List.fromElements (3, 2, 1)))
    .toEqual (List.fromElements (3, 2, 1, 3, 2, 1))
})

test ('cons', () => {
  expect (List.cons (List.fromElements (3, 2, 1)) (4))
    .toEqual (List.fromElements (4, 3, 2, 1))
})

test ('consF', () => {
  expect (List.consF (4) (List.fromElements (3, 2, 1)))
    .toEqual (List.fromElements (4, 3, 2, 1))
})

test ('snoc', () => {
  expect (List.snoc (List.fromElements (3, 2, 1)) (4))
    .toEqual (List.fromElements (3, 2, 1, 4))
})

test ('head', () => {
  expect (List.head (List.fromElements (3, 2, 1))) .toEqual (3)
  expect (() => List.head (List.fromElements ())) .toThrow ()
})

test ('last', () => {
  expect (List.last (List.fromElements (3, 2, 1))) .toEqual (1)
  expect (() => List.last (List.fromElements ())) .toThrow ()
})

test ('lastS', () => {
  expect (List.lastS (List.fromElements (3, 2, 1))) .toEqual (Just (1))
  expect (List.lastS (List.fromElements ())) .toEqual (Nothing)
})

test ('tail', () => {
  expect (List.tail (List.fromElements (3, 2, 1)))
    .toEqual (List.fromElements (2, 1))
  expect (List.tail (List.fromElements (1)))
    .toEqual (List.fromElements ())
  expect (() => List.tail (List.fromElements ())) .toThrow ()
})

test ('tailS', () => {
  expect (List.tailS (List.fromElements (3, 2, 1)))
    .toEqual (Just (List.fromElements (2, 1)))
  expect (List.tailS (List.fromElements (1)))
    .toEqual (Just (List.fromElements ()))
  expect (List.tailS (List.fromElements ())) .toEqual (Nothing)
})

test ('init', () => {
  expect (List.init (List.fromElements (3, 2, 1)))
    .toEqual (List.fromElements (3, 2))
  expect (List.init (List.fromElements (1)))
    .toEqual (List.fromElements ())
  expect (() => List.init (List.fromElements ())) .toThrow ()
})

test ('initS', () => {
  expect (List.initS (List.fromElements (3, 2, 1)))
    .toEqual (Just (List.fromElements (3, 2)))
  expect (List.initS (List.fromElements (1)))
    .toEqual (Just (List.fromElements ()))
  expect (List.initS (List.fromElements ())) .toEqual (Nothing)
})

test ('uncons', () => {
  expect (List.uncons (List.fromElements (3, 2, 1)))
    .toEqual (Just (Pair.fromBinary (3, List.fromElements (2, 1))))
  expect (List.uncons (List.fromElements (1)))
    .toEqual (Just (Pair.fromBinary (1, List.fromElements ())))
  expect (List.uncons (List.fromElements ())) .toEqual (Nothing)
})

// LIST TRANSFORMATIONS

test ('map', () => {
  expect (List.map (x => x * 2) (List.fromElements (3, 2, 1)))
    .toEqual (List.fromElements (6, 4, 2))
})

test ('reverse', () => {
  expect (List.reverse (List.fromElements (3, 2, 1)))
    .toEqual (List.fromElements (1, 2, 3))

  const original = List.fromElements (3, 2, 1)
  const result = List.reverse (original)
  expect (original === result) .toBeFalsy()
})

test ('intercalate', () => {
  expect (List.intercalate (', ') (List.fromElements (3, 2, 1)))
    .toEqual ('3, 2, 1')
})

// BUILDING LISTS

// SCANS

test ('scanl', () => {
  expect (List.scanl (acc => x => acc * x) (1) (List.fromElements(2, 3, 4)))
    .toEqual (List.fromElements (1, 2, 6, 24))
})

// ACCUMULATING MAPS

test ('mapAccumL', () => {
  expect (
    List.mapAccumL (acc => current => Pair.fromBoth (acc + current) (current * 2))
                   (0)
                   (List.fromElements (1, 2, 3))
  )
    .toEqual (Pair.fromBinary (6, List.fromElements (2, 4, 6)))
})

// UNFOLDING

test ('unfoldr', () => {
  expect (List.unfoldr (x => x < 11 ? Just (Pair.fromBoth (x) (x + 1)) : Nothing)
                       (1))
    .toEqual (List.fromElements (1, 2, 3, 4, 5, 6, 7, 8, 9, 10))
})

// EXTRACTING SUBLIST

test ('take', () => {
  expect (List.take (3) (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (List.fromElements (1, 2, 3))
  expect (List.take (6) (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (List.fromElements (1, 2, 3, 4, 5))
})

test ('drop', () => {
  expect (List.drop (3) (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (List.fromElements (4, 5))
  expect (List.drop (6) (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (List.fromElements ())
})

test ('splitAt', () => {
  expect (List.splitAt (3) (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (Pair.fromBoth (List.fromElements (1, 2, 3))
                       (List.fromElements (4, 5)))
  expect (List.splitAt (6) (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (Pair.fromBoth (List.fromElements (1, 2, 3, 4, 5))
                       (List.fromElements ()))
})

// SEARCHING BY EQUALITY

test ('lookup', () => {
  expect (List.lookup (1)
                      (List.fromElements (Pair.fromBoth (1) ('a')
                                         ,Pair.fromBoth (2) ('b'))))
    .toEqual (Just ('a'))
  expect (List.lookup (3)
                      (List.fromElements (Pair.fromBoth (1) ('a')
                                         ,Pair.fromBoth (2) ('b'))))
    .toEqual (Nothing)
})

// SEARCHING WITH A PREDICATE

test ('filter', () => {
  expect (List.filter (x => x > 2) (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (List.fromElements (3, 4, 5))
})

test ('partition', () => {
  expect (List.partition (x => x > 2) (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (Pair.fromBoth (List.fromElements (3, 4, 5))
                       (List.fromElements (1, 2)))
})

// INDEXING LISTS

test ('subscript', () => {
  expect (List.subscript (List.fromElements (3, 2, 1)) (2))
    .toEqual (Just (1))
  expect (List.subscript (List.fromElements (3, 2, 1)) (4))
    .toEqual (Nothing)
  expect (List.subscript (List.fromElements (3, 2, 1)) (-1))
    .toEqual (Nothing)
})

test ('subscriptF', () => {
  expect (List.subscriptF (2) (List.fromElements (3, 2, 1)))
    .toEqual (Just (1))
  expect (List.subscriptF (4) (List.fromElements (3, 2, 1)))
    .toEqual (Nothing)
  expect (List.subscriptF (-1) (List.fromElements (3, 2, 1)))
    .toEqual (Nothing)
})

test ('elemIndex', () => {
  expect (List.elemIndex (3) (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (Just (2))
  expect (List.elemIndex (8) (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (Nothing)
})

test ('elemIndices', () => {
  expect (List.elemIndices (3) (List.fromElements (1, 2, 3, 4, 5, 3)))
    .toEqual (List.fromElements (2, 5))
  expect (List.elemIndices (4) (List.fromElements (1, 2, 3, 4, 5, 3)))
    .toEqual (List.fromElements (3))
  expect (List.elemIndices (8) (List.fromElements (1, 2, 3, 4, 5, 3)))
    .toEqual (List.fromElements ())
})

test ('findIndex', () => {
  expect (List.findIndex (x => x > 2) (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (Just (2))
  expect (List.findIndex (x => x > 8) (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (Nothing)
})

test ('findIndices', () => {
  expect (List.findIndices (x => x === 3)
                           (List.fromElements (1, 2, 3, 4, 5, 3)))
    .toEqual (List.fromElements (2, 5))
  expect (List.findIndices (x => x > 3) (List.fromElements (1, 2, 3, 4, 5, 3)))
    .toEqual (List.fromElements (3, 4))
  expect (List.findIndices (x => x > 8) (List.fromElements (1, 2, 3, 4, 5, 3)))
    .toEqual (List.fromElements ())
})

// ZIPPING AND UNZIPPING LISTS

test ('zip', () => {
  expect (List.zip (List.fromElements ('A', 'B', 'C'))
                   (List.fromElements (1, 2, 3)))
    .toEqual (List.fromElements (
      Pair.fromBoth ('A') (1),
      Pair.fromBoth ('B') (2),
      Pair.fromBoth ('C') (3)
    ))

  expect (List.zip (List.fromElements ('A', 'B', 'C', 'D'))
                   (List.fromElements (1, 2, 3)))
    .toEqual (List.fromElements (
      Pair.fromBoth ('A') (1),
      Pair.fromBoth ('B') (2),
      Pair.fromBoth ('C') (3)
    ))

  expect (List.zip (List.fromElements ('A', 'B', 'C'))
                   (List.fromElements (1, 2, 3, 4)))
    .toEqual (List.fromElements (
      Pair.fromBoth ('A') (1),
      Pair.fromBoth ('B') (2),
      Pair.fromBoth ('C') (3)
    ))
})

test ('zipWith', () => {
  expect (List.zipWith (Pair.fromBoth)
                       (List.fromElements ('A', 'B', 'C'))
                       (List.fromElements (1, 2, 3)))
    .toEqual (List.fromElements (
      Pair.fromBoth ('A') (1),
      Pair.fromBoth ('B') (2),
      Pair.fromBoth ('C') (3)
    ))

  expect (List.zipWith (Pair.fromBoth)
                       (List.fromElements ('A', 'B', 'C', 'D'))
                       (List.fromElements (1, 2, 3)))
    .toEqual (List.fromElements (
      Pair.fromBoth ('A') (1),
      Pair.fromBoth ('B') (2),
      Pair.fromBoth ('C') (3)
    ))

  expect (List.zipWith (Pair.fromBoth)
                       (List.fromElements ('A', 'B', 'C'))
                       (List.fromElements (1, 2, 3, 4)))
    .toEqual (List.fromElements (
      Pair.fromBoth ('A') (1),
      Pair.fromBoth ('B') (2),
      Pair.fromBoth ('C') (3)
    ))
})

// "SET" OPERATIONS

test ('sdelete', () => {
  expect (List.sdelete (3) (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (List.fromElements (1, 2, 4, 5))
  expect (List.sdelete (6) (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (List.fromElements (1, 2, 3, 4, 5))
})

// ORDERED LISTS

test ('sortBy', () => {
  expect (List.sortBy (a => b => a < b ? LT : a > b ? GT : EQ) (List.fromElements (2, 3, 1, 5, 4)))
    .toEqual (List.fromElements (1, 2, 3, 4, 5))
})

// LIST.INDEX

// Original functions

test ('indexed', () => {
  expect (List.indexed (List.fromElements ('a', 'b')))
    .toEqual (List.fromElements (
      Pair.fromBoth (0) ('a'),
      Pair.fromBoth (1) ('b')
    ))
})

test ('deleteAt', () => {
  expect (List.deleteAt (1) (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual(List.fromElements(1, 3, 4, 5))
})

test ('setAt', () => {
  expect (List.setAt(2) (4) (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (List.fromElements (1, 2, 4, 4, 5))
})

test ('modifyAt', () => {
  expect(List.modifyAt (2) (x => x * 3) (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual(List.fromElements (1, 2, 9, 4, 5))
})

test ('updateAt', () => {
  expect (List.updateAt (2) (x => Just(x * 3)) (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (List.fromElements (1, 2, 9, 4, 5))
  expect (List.updateAt (2) (x => Nothing) (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (List.fromElements (1, 2, 4, 5))
})

test ('insertAt', () => {
  expect (List.insertAt (2) (6) (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (List.fromElements (1, 2, 6, 3, 4, 5))
})

// Maps

test ('imap', () => {
  expect (List.imap (i => x => x * 2 + i) (List.fromElements (3, 2, 1)))
    .toEqual (List.fromElements (6, 5, 4))
})

// Folds

test ('ifoldr', () => {
  expect (List.ifoldr (i => x => acc => acc + x + i)
                      (0)
                      (List.fromElements (3, 2, 1)))
    .toEqual (9)
})

test ('ifoldl', () => {
  expect (List.ifoldl (acc => i => x => acc + x + i)
                      (0)
                      (List.fromElements (3, 2, 1)))
    .toEqual (9)
})

test ('iall', () => {
  expect (List.iall (i => x => x >= 1 && i < 5) (List.fromElements (3, 2, 1)))
    .toBeTruthy ()
  expect (List.iall (i => x => x >= 2 && i < 5) (List.fromElements (3, 2, 1)))
    .toBeFalsy ()
  expect (List.iall (i => x => x >= 1 && i > 0) (List.fromElements (3, 2, 1)))
    .toBeFalsy ()
})

test ('iany', () => {
  expect (List.iany (i => x => x > 2 && i < 5) (List.fromElements (3, 2, 1)))
    .toBeTruthy ()
  expect (List.iany (i => x => x > 3 && i < 5) (List.fromElements (3, 2, 1)))
    .toBeFalsy ()
  expect (List.iany (i => x => x > 2 && i > 0) (List.fromElements (3, 2, 1)))
    .toBeFalsy ()
})

test ('iconcatMap', () => {
  expect (List.iconcatMap (i => e => List.fromElements (e, e + i))
                          (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (List.fromElements (1, 1, 2, 3, 3, 5, 4, 7, 5, 9))
})

test ('ifilter', () => {
  expect (List.ifilter (i => x => x > 2 || i === 0)
                       (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (List.fromElements (1, 3, 4, 5))
})

test ('ipartition', () => {
  expect (List.ipartition (i => x => x > 2 || i === 0)
                          (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (Pair.fromBoth (List.fromElements (1, 3, 4, 5))
                       (List.fromElements (2)))
})

// Search

test ('ifind', () => {
  expect (List.ifind (i => e => /t/.test (e) || i === 2)
                     (List.fromElements ('one', 'two', 'three')))
    .toEqual (Just ('two'))
  expect (List.ifind (i => e => /tr/.test (e) || i === 2)
                     (List.fromElements ('one', 'two', 'three')))
    .toEqual (Just ('three'))
  expect (List.ifind (i => e => /tr/.test (e) || i === 5)
                     (List.fromElements ('one', 'two', 'three')))
    .toEqual (Nothing)
})

test ('ifindIndex', () => {
  expect (List.ifindIndex (i => x => x > 2 && i > 2)
                          (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (Just (3))
  expect (List.ifindIndex (i => x => x > 8 && i > 2)
                          (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (Nothing)
})

test ('ifindIndices', () => {
  expect (List.ifindIndices (i => x => x === 3 && i > 2)
                            (List.fromElements (1, 2, 3, 4, 5, 3)))
    .toEqual (List.fromElements (5))
  expect (List.ifindIndices (i => x => x > 4 && i > 3)
                            (List.fromElements (1, 2, 3, 4, 5, 3)))
    .toEqual (List.fromElements (4))
  expect (List.ifindIndices (i => x => x > 8 && i > 2)
                            (List.fromElements (1, 2, 3, 4, 5, 3)))
    .toEqual (List.fromElements ())
})

// OWN METHODS

test ('unsafeIndex', () => {
  expect (List.unsafeIndex (List.fromElements (1, 2, 3, 4, 5)) (1))
    .toEqual (2)
  expect (() => List.unsafeIndex (List.fromElements (1, 2, 3, 4, 5)) (5))
    .toThrow ()
})

test ('toArray', () => {
  expect (List.toArray (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual ([1, 2, 3, 4, 5])
})

test ('isList', () => {
  expect (List.isList (List.fromElements (1, 2, 3, 4, 5)))
    .toBeTruthy ()
  expect (List.isList (4))
    .toBeFalsy ()
})

test ('countWith', () => {
  expect (List.countWith (x => x > 2) (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (3)
})

test ('maximumNonNegative', () => {
  expect (List.maximumNonNegative (List.fromElements (1, 2, 3, 4, 5)))
    .toEqual (5)

  expect (List.maximumNonNegative (List.fromElements (-1, -2, -3, 4, 5)))
    .toEqual (5)

  expect (List.maximumNonNegative (List.fromElements (-1, -2, -3, -4, -5)))
    .toEqual (0)

  expect (List.maximumNonNegative (List.empty))
    .toEqual (0)
})
