
import { ident } from "../Function"
import { Internals } from "../Internals"
import * as L from "../List"
import { Num } from "../Num"
import { OrderedMap } from "../OrderedMap"
import { fromDefault } from "../Record"
import { Pair } from "../Tuple"

const { List } = L

const { Just, Nothing } = Internals

// [Symbol.iterator]

test ("[Symbol.iterator]", () => {
  expect ([ ...List () ]) .toEqual ([])
  expect ([ ...List (1, 2, 3) ]) .toEqual ([ 1, 2, 3 ])
})

// APPLICATIVE

test ("pure", () => {
  expect (List.pure (3)) .toEqual (List (3))
})

test ("ap", () => {
  expect (List.ap (List ((x: number) => x * 3, (x: number) => x * 2))
                 (List (1, 2, 3, 4, 5)))
    .toEqual (List (3, 6, 9, 12, 15, 2, 4, 6, 8, 10))
})

// ALTERNATIVE

test ("alt", () => {
  expect (List.alt (List (3)) (List (2)))
    .toEqual (List (3))
  expect (List.alt (List (3)) (List ()))
    .toEqual (List (3))
  expect (List.alt (List ()) (List (2)))
    .toEqual (List (2))
  expect (List.alt (List ()) (List ()))
    .toEqual (List ())
})

test ("altF", () => {
  expect (List.altF (List (2)) (List (3)))
    .toEqual (List (3))
  expect (List.altF (List ()) (List (3)))
    .toEqual (List (3))
  expect (List.altF (List (2)) (List ()))
    .toEqual (List (2))
  expect (List.altF (List ()) (List ()))
    .toEqual (List ())
})

test ("empty", () => {
  expect (List.empty) .toEqual (List ())
})

test ("guard", () => {
  expect (List.guard (true))
    .toEqual (List (true))
  expect (List.guard (false))
    .toEqual (List ())
})

// MONAD

test ("bind", () => {
  expect (List.bind (List (1, 2, 3, 4, 5))
                    (e => List (e, e)))
    .toEqual (List (1, 1, 2, 2, 3, 3, 4, 4, 5, 5))
})

test ("bindF", () => {
  expect (List.bindF (e => List (e, e))
                     (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 1, 2, 2, 3, 3, 4, 4, 5, 5))
})

test ("then", () => {
  expect (List.then (List (1, 2, 3, 4, 5))
                    (List ("a", "c")))
    .toEqual (
      List ("a", "c", "a", "c", "a", "c", "a", "c", "a", "c")
    )
  expect (List.then (List ()) (List ("a", "c")))
    .toEqual (List ())
})

test ("kleisli", () => {
  expect (List.kleisli ((e: number) => List (e, e))
                       (e => List (e, e * 2))
                       (2))
    .toEqual (List (2, 4, 2, 4))
})

test ("join", () => {
  expect (List.join (
    List (
      List (3),
      List (2),
      List (1)
    )
  ))
    .toEqual (List (3, 2, 1))
})

// FOLDABLE

test ("foldr", () => {
  expect (List.foldr<string, string> (e => acc => e + acc) ("0") (List ("3", "2", "1")))
    .toEqual ("3210")
})

test ("foldl", () => {
  expect (List.foldl<string, string> (acc => e => acc + e) ("0") (List ("1", "2", "3")))
    .toEqual ("0123")
})

test ("foldr1", () => {
  expect (List.foldr1<number> (e => acc => e + acc) (List (3, 2, 1)))
    .toEqual (6)
})

test ("foldl1", () => {
  expect (List.foldl1<number> (acc => e => e + acc) (List (3, 2, 1)))
    .toEqual (6)
})

test ("toList", () => {
  expect (List.toList (List (3, 2, 1)))
    .toEqual (List (3, 2, 1))
})

test ("fnull", () => {
  expect (List.fnull (List (3, 2, 1))) .toBeFalsy ()
  expect (List.fnull (List ())) .toBeTruthy ()
})

test ("fnullStr", () => {
  expect (List.fnullStr ("List (3, 2, 1)")) .toBeFalsy ()
  expect (List.fnullStr ("")) .toBeTruthy ()
})

test ("flength", () => {
  expect (List.flength (List (3, 2, 1))) .toEqual (3)
  expect (List.flength (List ())) .toEqual (0)
})

test ("flengthStr", () => {
  expect (List.flengthStr ("List (3, 2, 1)")) .toEqual (14)
  expect (List.flengthStr ("List ()")) .toEqual (7)
})

test ("elem", () => {
  expect (List.elem (3) (List (1, 2, 3, 4, 5)))
    .toBeTruthy ()
  expect (List.elem (6) (List (1, 2, 3, 4, 5)))
    .toBeFalsy ()
})

test ("elemF", () => {
  expect (List.elemF (List (1, 2, 3, 4, 5)) (3))
    .toBeTruthy ()
  expect (List.elemF (List (1, 2, 3, 4, 5)) (6))
    .toBeFalsy ()
})

test ("sum", () => {
  expect (List.sum (List (3, 2, 1))) .toEqual (6)
})

test ("product", () => {
  expect (List.product (List (3, 2, 2))) .toEqual (12)
})

test ("maximum", () => {
  expect (List.maximum (List (3, 2, 1))) .toEqual (3)
  expect (List.maximum (List ())) .toEqual (-Infinity)
})

test ("minimum", () => {
  expect (List.minimum (List (3, 2, 1))) .toEqual (1)
  expect (List.minimum (List ())) .toEqual (Infinity)
})

test ("concat", () => {
  expect (List.concat (
    List (
      List (3),
      List (2),
      List (1)
    )
  ))
    .toEqual (List (3, 2, 1))
})

test ("concatMap", () => {
  expect (List.concatMap (e => List (e, e))
                    (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 1, 2, 2, 3, 3, 4, 4, 5, 5))
})

test ("and", () => {
  expect (List.and (List (true, true, true)))
    .toBeTruthy ()
  expect (List.and (List (true, true, false)))
    .toBeFalsy ()
  expect (List.and (List (true, false, true)))
    .toBeFalsy ()
})

test ("or", () => {
  expect (List.or (List (true, true, true)))
    .toBeTruthy ()
  expect (List.or (List (true, true, false)))
    .toBeTruthy ()
  expect (List.or (List (false, false, false)))
    .toBeFalsy ()
})

test ("any", () => {
  expect (List.any ((x: number) => x > 2) (List (3, 2, 1)))
    .toBeTruthy ()
  expect (List.any ((x: number) => x > 3) (List (3, 2, 1)))
    .toBeFalsy ()
})

test ("all", () => {
  expect (List.all ((x: number) => x >= 1) (List (3, 2, 1)))
    .toBeTruthy ()
  expect (List.all ((x: number) => x >= 2) (List (3, 2, 1)))
    .toBeFalsy ()
})

test ("notElem", () => {
  expect (List.notElem (3) (List (1, 2, 3, 4, 5)))
    .toBeFalsy ()
  expect (List.notElem (6) (List (1, 2, 3, 4, 5)))
    .toBeTruthy ()
})

test ("notElemF", () => {
  expect (List.notElemF (List (1, 2, 3, 4, 5)) (3))
    .toBeFalsy ()
  expect (List.notElemF (List (1, 2, 3, 4, 5)) (6))
    .toBeTruthy ()
})

test ("find", () => {
  expect (List.find ((e: string) => e.includes ("t"))
                    (List ("one", "two", "three")))
    .toEqual (Just ("two"))
  expect (List.find ((e: string) => e.includes ("tr"))
                    (List ("one", "two", "three")))
    .toEqual (Nothing)
})

// BASIC FUNCTIONS

test ("append", () => {
  expect (List.append (List (3, 2, 1))
                      (List (3, 2, 1)))
    .toEqual (List (3, 2, 1, 3, 2, 1))
})

test ("appendStr", () => {
  expect (List.appendStr ("abc") ("def")) .toEqual ("abcdef")
})

test ("cons", () => {
  expect (List.cons (List (3, 2, 1)) (4))
    .toEqual (List (4, 3, 2, 1))
})

test ("head", () => {
  expect (List.head (List (3, 2, 1) as L.Cons<number>)) .toEqual (3)
  expect (() => List.head (List () as L.Cons<void>)) .toThrow ()
})

test ("last", () => {
  expect (List.last (List (3, 2, 1) as L.Cons<number>)) .toEqual (1)
  expect (() => List.last (List () as L.Cons<void>)) .toThrow ()
})

test ("lastS", () => {
  expect (List.lastS (List (3, 2, 1))) .toEqual (Just (1))
  expect (List.lastS (List ())) .toEqual (Nothing)
})

test ("tail", () => {
  expect (List.tail (List (3, 2, 1) as L.Cons<number>))
    .toEqual (List (2, 1))
  expect (List.tail (List (1) as L.Cons<number>))
    .toEqual (List ())
  expect (() => List.tail (List () as L.Cons<void>)) .toThrow ()
})

test ("tailS", () => {
  expect (List.tailS (List (3, 2, 1)))
    .toEqual (Just (List (2, 1)))
  expect (List.tailS (List (1)))
    .toEqual (Just (List ()))
  expect (List.tailS (List ())) .toEqual (Nothing)
})

test ("init", () => {
  expect (List.init (List (3, 2, 1) as L.Cons<number>))
    .toEqual (List (3, 2))
  expect (List.init (List (1) as L.Cons<number>))
    .toEqual (List ())
  expect (() => List.init (List () as L.Cons<void>)) .toThrow ()
})

test ("initS", () => {
  expect (List.initS (List (3, 2, 1)))
    .toEqual (Just (List (3, 2)))
  expect (List.initS (List (1)))
    .toEqual (Just (List ()))
  expect (List.initS (List ())) .toEqual (Nothing)
})

test ("uncons", () => {
  expect (List.uncons (List (3, 2, 1)))
    .toEqual (Just (Pair (3, List (2, 1))))
  expect (List.uncons (List (1)))
    .toEqual (Just (Pair (1, List ())))
  expect (List.uncons (List ())) .toEqual (Nothing)
})

// LIST TRANSFORMATIONS

test ("map", () => {
  expect (List.map ((x: number) => x * 2) (List (3, 2, 1)))
    .toEqual (List (6, 4, 2))
})

test ("reverse", () => {
  expect (List.reverse (List (3, 2, 1)))
    .toEqual (List (1, 2, 3))

  const original = List (3, 2, 1)
  const result = List.reverse (original)
  expect (original === result) .toBeFalsy ()
})

test ("intersperse", () => {
  expect (List.intersperse (0) (List (3, 2, 1)))
    .toEqual (List (3, 0, 2, 0, 1))
})

test ("intercalate", () => {
  expect (List.intercalate (", ") (List (3, 2, 1)))
    .toEqual ("3, 2, 1")
})

describe ("permutations", () => {
  it ("returns an empty list if an empty list is given", () => {
    expect (List.permutations (List ()))
      .toEqual (List ())
  })

  it ("returns a singleton list if a singleton list is given", () => {
    expect (List.permutations (List (1)))
      .toEqual (List (List (1)))
  })

  it ("returns 2 permutations on input length 2", () => {
    expect (List.permutations (List (1, 2)))
      .toEqual (List (List (1, 2), List (2, 1)))
  })

  it ("returns 6 permutations on input length 3", () => {
    expect (List.permutations (List (1, 2, 3)))
      .toEqual (List (
        List (1, 2, 3),
        List (1, 3, 2),
        List (2, 1, 3),
        List (2, 3, 1),
        List (3, 1, 2),
        List (3, 2, 1)
      ))
  })
  it ("returns 24 permutations on input length 4", () => {
    expect (List.permutations (List (1, 2, 3, 4)))
      .toEqual (List (
        List (1, 2, 3, 4),
        List (1, 2, 4, 3),
        List (1, 3, 2, 4),
        List (1, 3, 4, 2),
        List (1, 4, 2, 3),
        List (1, 4, 3, 2),

        List (2, 1, 3, 4),
        List (2, 1, 4, 3),
        List (2, 3, 1, 4),
        List (2, 3, 4, 1),
        List (2, 4, 1, 3),
        List (2, 4, 3, 1),

        List (3, 1, 2, 4),
        List (3, 1, 4, 2),
        List (3, 2, 1, 4),
        List (3, 2, 4, 1),
        List (3, 4, 1, 2),
        List (3, 4, 2, 1),

        List (4, 1, 2, 3),
        List (4, 1, 3, 2),
        List (4, 2, 1, 3),
        List (4, 2, 3, 1),
        List (4, 3, 1, 2),
        List (4, 3, 2, 1),
      ))
  })
})

// BUILDING LISTS

// SCANS

test ("scanl", () => {
  expect (List.scanl<number, number> (acc => x => acc * x) (1) (List (2, 3, 4)))
    .toEqual (List (1, 2, 6, 24))
})

// ACCUMULATING MAPS

test ("mapAccumL", () => {
  expect (
    List.mapAccumL ((acc: string) => (current: number) =>
                     Pair (acc + current.toString (10), current * 2))
                   ("0")
                   (List (1, 2, 3))
  )
    .toEqual (Pair ("0123", List (2, 4, 6)))
})

test ("mapAccumR", () => {
  expect (
    List.mapAccumR ((acc: string) => (current: number) =>
                     Pair (acc + current.toString (10), current * 2))
                   ("0")
                   (List (1, 2, 3))
  )
    .toEqual (Pair ("0321", List (2, 4, 6)))
})

// INFINITE LISTS

describe ("replicate", () => {
  it ("creates a list with 0 elements", () => {
    expect (List.replicate (0) ("test"))
      .toEqual (List ())
  })

  it ("creates a list with 1 element", () => {
    expect (List.replicate (1) ("test"))
      .toEqual (List ("test"))
  })

  it ("creates a list with 3 elements", () => {
    expect (List.replicate (3) ("test"))
      .toEqual (List ("test", "test", "test"))
  })

  it ("creates a list with 5 elements", () => {
    expect (List.replicate (5) ("test"))
      .toEqual (List ("test", "test", "test", "test", "test"))
  })
})

describe ("replicateR", () => {
  it ("creates a list with 0 elements", () => {
    expect (List.replicateR (0) (ident))
      .toEqual (List ())
  })

  it ("creates a list with 1 element", () => {
    expect (List.replicateR (1) (ident))
      .toEqual (List (0))
  })

  it ("creates a list with 3 elements", () => {
    expect (List.replicateR (3) (ident))
      .toEqual (List (0, 1, 2))
  })

  it ("creates a list with 5 elements", () => {
    expect (List.replicateR (5) (ident))
      .toEqual (List (0, 1, 2, 3, 4))
  })
})

// UNFOLDING

test ("unfoldr", () => {
  expect (List.unfoldr ((x: number) => x < 11 ? Just (Pair (x, x + 1)) : Nothing)
                       (1))
    .toEqual (List (1, 2, 3, 4, 5, 6, 7, 8, 9, 10))
})

// EXTRACTING SUBLIST

test ("take", () => {
  expect (List.take (3) (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 2, 3))
  expect (List.take (6) (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 2, 3, 4, 5))
})

test ("drop", () => {
  expect (List.drop (3) (List (1, 2, 3, 4, 5)))
    .toEqual (List (4, 5))
  expect (List.drop (6) (List (1, 2, 3, 4, 5)))
    .toEqual (List ())
})

test ("splitAt", () => {
  expect (List.splitAt (3) (List (1, 2, 3, 4, 5)))
    .toEqual (Pair (List (1, 2, 3))
                       (List (4, 5)))
  expect (List.splitAt (6) (List (1, 2, 3, 4, 5)))
    .toEqual (Pair (List (1, 2, 3, 4, 5))
                       (List ()))
})

// PREDICATES

test ("isInfixOf", () => {
  expect (List.isInfixOf ("test") ("das asd  dsad   ad teste f as"))
    .toEqual (true)
  expect (List.isInfixOf ("test") ("das asd  dsad   ad tese f as"))
    .toEqual (false)
  expect (List.isInfixOf ("") ("das asd  dsad   ad tese f as"))
    .toEqual (true)
  expect (List.isInfixOf ("") (""))
    .toEqual (true)
})

// SEARCHING BY EQUALITY

test ("lookup", () => {
  expect (List.lookup (1)
                      (List (Pair (1) ("a")
                                         , Pair (2) ("b"))))
    .toEqual (Just ("a"))
  expect (List.lookup (3)
                      (List (Pair (1) ("a")
                                         , Pair (2) ("b"))))
    .toEqual (Nothing)
})

// SEARCHING WITH A PREDICATE

test ("filter", () => {
  expect (List.filter ((x: number) => x > 2) (List (1, 2, 3, 4, 5)))
    .toEqual (List (3, 4, 5))
})

test ("partition", () => {
  expect (List.partition ((x: number) => x > 2) (List (1, 2, 3, 4, 5)))
    .toEqual (Pair (List (3, 4, 5))
                       (List (1, 2)))
})

// INDEXING LISTS

test ("subscript", () => {
  expect (List.subscript (List (3, 2, 1)) (2))
    .toEqual (Just (1))
  expect (List.subscript (List (3, 2, 1)) (4))
    .toEqual (Nothing)
  expect (List.subscript (List (3, 2, 1)) (-1))
    .toEqual (Nothing)
})

test ("subscriptF", () => {
  expect (List.subscriptF (2) (List (3, 2, 1)))
    .toEqual (Just (1))
  expect (List.subscriptF (4) (List (3, 2, 1)))
    .toEqual (Nothing)
  expect (List.subscriptF (-1) (List (3, 2, 1)))
    .toEqual (Nothing)
})

test ("elemIndex", () => {
  expect (List.elemIndex (3) (List (1, 2, 3, 4, 5)))
    .toEqual (Just (2))
  expect (List.elemIndex (8) (List (1, 2, 3, 4, 5)))
    .toEqual (Nothing)
})

test ("elemIndices", () => {
  expect (List.elemIndices (3) (List (1, 2, 3, 4, 5, 3)))
    .toEqual (List (2, 5))
  expect (List.elemIndices (4) (List (1, 2, 3, 4, 5, 3)))
    .toEqual (List (3))
  expect (List.elemIndices (8) (List (1, 2, 3, 4, 5, 3)))
    .toEqual (List ())
})

test ("findIndex", () => {
  expect (List.findIndex ((x: number) => x > 2) (List (1, 2, 3, 4, 5)))
    .toEqual (Just (2))
  expect (List.findIndex ((x: number) => x > 8) (List (1, 2, 3, 4, 5)))
    .toEqual (Nothing)
})

test ("findIndices", () => {
  expect (List.findIndices ((x: number) => x === 3)
                           (List (1, 2, 3, 4, 5, 3)))
    .toEqual (List (2, 5))
  expect (List.findIndices ((x: number) => x > 3) (List (1, 2, 3, 4, 5, 3)))
    .toEqual (List (3, 4))
  expect (List.findIndices ((x: number) => x > 8) (List (1, 2, 3, 4, 5, 3)))
    .toEqual (List ())
})

// ZIPPING AND UNZIPPING LISTS

test ("zip", () => {
  expect (List.zip (List ("A", "B", "C"))
                   (List (1, 2, 3)))
    .toEqual (List (
      Pair ("A") (1),
      Pair ("B") (2),
      Pair ("C") (3)
    ))

  expect (List.zip (List ("A", "B", "C", "D"))
                   (List (1, 2, 3)))
    .toEqual (List (
      Pair ("A") (1),
      Pair ("B") (2),
      Pair ("C") (3)
    ))

  expect (List.zip (List ("A", "B", "C"))
                   (List (1, 2, 3, 4)))
    .toEqual (List (
      Pair ("A") (1),
      Pair ("B") (2),
      Pair ("C") (3)
    ))
})

test ("zipWith", () => {
  expect (List.zipWith (Pair)
                       (List ("A", "B", "C"))
                       (List (1, 2, 3)))
    .toEqual (List (
      Pair ("A") (1),
      Pair ("B") (2),
      Pair ("C") (3)
    ))

  expect (List.zipWith (Pair)
                       (List ("A", "B", "C", "D"))
                       (List (1, 2, 3)))
    .toEqual (List (
      Pair ("A") (1),
      Pair ("B") (2),
      Pair ("C") (3)
    ))

  expect (List.zipWith (Pair)
                       (List ("A", "B", "C"))
                       (List (1, 2, 3, 4)))
    .toEqual (List (
      Pair ("A") (1),
      Pair ("B") (2),
      Pair ("C") (3)
    ))
})

// SPECIAL LISTS

// Functions on strings

test ("lines", () => {
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

test ("sdelete", () => {
  expect (List.sdelete (3) (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 2, 4, 5))
  expect (List.sdelete (6) (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 2, 3, 4, 5))
})

test ("intersect", () => {
  expect (List.intersect (List (1, 2, 3, 4))
                         (List (2, 4, 6, 8)))
    .toEqual (List (2, 4))

  expect (List.intersect (List (1, 2, 2, 3, 4))
                         (List (6, 4, 4, 2)))
    .toEqual (List (2, 2, 4))
})

// ORDERED LISTS

test ("sortBy", () => {
  expect (List.sortBy (Num.compare) (List (2, 3, 1, 5, 4)))
    .toEqual (List (1, 2, 3, 4, 5))
})

test ("maximumBy", () => {
  expect (List.maximumBy (Num.compare) (List (2, 3, 1, 5, 4) as L.NonEmptyList<number>))
    .toEqual (5)
})

test ("minimumBy", () => {
  expect (List.minimumBy (Num.compare) (List (2, 3, 1, 5, 4) as L.NonEmptyList<number>))
    .toEqual (1)
})

// LIST.INDEX

// Original functions

test ("indexed", () => {
  expect (List.indexed (List ("a", "b")))
    .toEqual (List (
      Pair (0) ("a"),
      Pair (1) ("b")
    ))
})

test ("deleteAt", () => {
  expect (List.deleteAt (1) (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 3, 4, 5))
})

test ("setAt", () => {
  expect (List.setAt (2) (4) (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 2, 4, 4, 5))
})

test ("modifyAt", () => {
  expect (List.modifyAt (2) ((x: number) => x * 3) (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 2, 9, 4, 5))
})

test ("updateAt", () => {
  expect (List.updateAt (2) ((x: number) => Just (x * 3)) (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 2, 9, 4, 5))
  expect (List.updateAt (2) ((_: number) => Nothing) (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 2, 4, 5))
})

test ("insertAt", () => {
  expect (List.insertAt (2) (6) (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 2, 6, 3, 4, 5))
})

// Maps

test ("imap", () => {
  expect (List.imap (i => (x: number) => x * 2 + i) (List (3, 2, 1)))
    .toEqual (List (6, 5, 4))
})

// Folds

test ("ifoldr", () => {
  expect (List.ifoldr (i => (x: number) => (acc: number) => acc + x + i)
                      (0)
                      (List (3, 2, 1)))
    .toEqual (9)
})

test ("ifoldl", () => {
  expect (List.ifoldl ((acc: number) => i => (x: number) => acc + x + i)
                      (0)
                      (List (3, 2, 1)))
    .toEqual (9)
})

test ("iall", () => {
  expect (List.iall (i => (x: number) => x >= 1 && i < 5) (List (3, 2, 1)))
    .toBeTruthy ()
  expect (List.iall (i => (x: number) => x >= 2 && i < 5) (List (3, 2, 1)))
    .toBeFalsy ()
  expect (List.iall (i => (x: number) => x >= 1 && i > 0) (List (3, 2, 1)))
    .toBeFalsy ()
})

test ("iany", () => {
  expect (List.iany (i => (x: number) => x > 2 && i < 5) (List (3, 2, 1)))
    .toBeTruthy ()
  expect (List.iany (i => (x: number) => x > 3 && i < 5) (List (3, 2, 1)))
    .toBeFalsy ()
  expect (List.iany (i => (x: number) => x > 2 && i > 0) (List (3, 2, 1)))
    .toBeFalsy ()
})

test ("iconcatMap", () => {
  expect (List.iconcatMap (i => (e: number) => List (e, e + i))
                          (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 1, 2, 3, 3, 5, 4, 7, 5, 9))
})

test ("ifilter", () => {
  expect (List.ifilter (i => (x: number) => x > 2 || i === 0)
                       (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 3, 4, 5))
})

test ("ipartition", () => {
  expect (List.ipartition (i => (x: number) => x > 2 || i === 0)
                          (List (1, 2, 3, 4, 5)))
    .toEqual (Pair (List (1, 3, 4, 5))
                       (List (2)))
})

// Search

test ("ifind", () => {
  expect (List.ifind (i => (e: string) => e.includes ("t") || i === 2)
                     (List ("one", "two", "three")))
    .toEqual (Just ("two"))
  expect (List.ifind (i => (e: string) => e.includes ("tr") || i === 2)
                     (List ("one", "two", "three")))
    .toEqual (Just ("three"))
  expect (List.ifind (i => (e: string) => e.includes ("tr") || i === 5)
                     (List ("one", "two", "three")))
    .toEqual (Nothing)
})

test ("ifindIndex", () => {
  expect (List.ifindIndex (i => (x: number) => x > 2 && i > 2)
                          (List (1, 2, 3, 4, 5)))
    .toEqual (Just (3))
  expect (List.ifindIndex (i => (x: number) => x > 8 && i > 2)
                          (List (1, 2, 3, 4, 5)))
    .toEqual (Nothing)
})

test ("ifindIndices", () => {
  expect (List.ifindIndices (i => (x: number) => x === 3 && i > 2)
                            (List (1, 2, 3, 4, 5, 3)))
    .toEqual (List (5))
  expect (List.ifindIndices (i => (x: number) => x > 4 && i > 3)
                            (List (1, 2, 3, 4, 5, 3)))
    .toEqual (List (4))
  expect (List.ifindIndices (i => (x: number) => x > 8 && i > 2)
                            (List (1, 2, 3, 4, 5, 3)))
    .toEqual (List ())
})

// LIST.EXTRA

// String operations

test ("lower", () => {
  expect (List.lower ("Test")) .toEqual ("test")
  expect (List.lower ("TEst")) .toEqual ("test")
})

test ("trimStart", () => {
  expect (List.trimStart ("    test\ntest2  ")) .toEqual ("test\ntest2  ")
})

test ("trimEnd", () => {
  expect (List.trimEnd ("    test\ntest2  ")) .toEqual ("    test\ntest2")
})

// Splitting

test ("splitOn", () => {
  expect (List.splitOn (";;") ("x;;y;;z;;"))
    .toEqual (List ("x", "y", "z", ""))
})

// Basics

test ("notNull", () => {
  expect (List.notNull (List (3, 2, 1))) .toEqual (true)
  expect (List.notNull (List ())) .toEqual (false)
})

test ("notNullStr", () => {
  expect (List.notNullStr ("1")) .toEqual (true)
  expect (List.notNullStr ("")) .toEqual (false)
})

test ("list", () => {
  expect (List.list (1) ((v: number) => _ => v - 2) (List (5, 6, 7)))
    .toEqual (3)

  expect (List.list (1) ((v: number) => _ => v - 2) (List ()))
    .toEqual (1)
})

describe ("unsnoc", () => {
  it ("returns Nothing on empty list", () => {
    expect (List.unsnoc (List ())) .toEqual (Nothing)
  })

  it ("returns Just (Nil, x) on singleton list", () => {
    expect (List.unsnoc (List (1))) .toEqual (Just (Pair (List (), 1)))
  })

  it ("returns Just (init, last) on list with more than one element", () => {
    expect (List.unsnoc (List (1, 2, 3, 4))) .toEqual (Just (Pair (List (1, 2, 3), 4)))
  })
})

test ("consF", () => {
  expect (List.consF (4) (List (3, 2, 1)))
    .toEqual (List (4, 3, 2, 1))
})

test ("snoc", () => {
  expect (List.snoc (List (3, 2, 1)) (4))
    .toEqual (List (3, 2, 1, 4))
})

test ("snocF", () => {
  expect (List.snocF (4) (List (3, 2, 1)))
    .toEqual (List (3, 2, 1, 4))
})

// List operations

test ("maximumOn", () => {
  expect (List.maximumOn ((x: { a: number }) => x.a)
                         (List ({ a: 1 }, { a: 3 }, { a: 2 })))
    .toEqual (Just ({ a: 3 }))

  expect (List.maximumOn ((x: { a: number }) => x.a)
                         (List ()))
    .toEqual (Nothing)
})

test ("minimumOn", () => {
  expect (List.minimumOn ((x: { a: number }) => x.a)
                         (List ({ a: 1 }, { a: 3 }, { a: 2 })))
    .toEqual (Just ({ a: 1 }))

  expect (List.minimumOn ((x: { a: number }) => x.a)
                         (List ()))
    .toEqual (Nothing)
})

test ("firstJust", () => {
  expect (List.firstJust ((x: { a: number }) => x.a >= 2 ? Just (x.a) : Nothing)
                         (List ({ a: 1 }, { a: 3 }, { a: 2 })))
    .toEqual (Just (3))

  expect (List.firstJust ((x: { a: number }) => x.a >= 2 ? Just (x.a) : Nothing)
                         (List ()))
    .toEqual (Nothing)
})

test ("replaceStr", () => {
  expect (List.replaceStr ("{}") ("nice") ("Hello, this is a {} test! It's {}, huh?"))
    .toEqual ("Hello, this is a nice test! It's nice, huh?")
})

// OWN METHODS

test ("unsafeIndex", () => {
  expect (List.unsafeIndex (List (1, 2, 3, 4, 5)) (1))
    .toEqual (2)
  expect (() => List.unsafeIndex (List (1, 2, 3, 4, 5)) (5))
    .toThrow ()
})

test ("fromArray", () => {
  expect (List.fromArray ([ 3, 2, 1 ]))
    .toEqual (List (3, 2, 1))
})

test ("toArray", () => {
  expect (List.toArray (List (1, 2, 3, 4, 5)))
    .toEqual ([ 1, 2, 3, 4, 5 ])
})

test ("isList", () => {
  expect (List.isList (List (1, 2, 3, 4, 5)))
    .toBeTruthy ()
  expect (List.isList (4))
    .toBeFalsy ()
})

test ("countWith", () => {
  expect (List.countWith ((x: number) => x > 2) (List (1, 2, 3, 4, 5)))
    .toEqual (3)
})

test ("countWithByKey", () => {
  expect (List.countWithByKey ((x: number) => x % 2) (List (1, 2, 3, 4, 5)))
    .toEqual (
      OrderedMap.fromArray (
        [
          [ 1, 3 ],
          [ 0, 2 ],
        ]
      )
    )
})

test ("countWithByKeyMaybe", () => {
  expect (List.countWithByKeyMaybe ((x: number) => x > 3 ? Nothing : Just (x % 2))
                                   (List (1, 2, 3, 4, 5)))
    .toEqual (
      OrderedMap.fromArray (
        [
          [ 1, 2 ],
          [ 0, 1 ],
        ]
      )
    )
})

test ("maximumNonNegative", () => {
  expect (List.maximumNonNegative (List (1, 2, 3, 4, 5)))
    .toEqual (5)

  expect (List.maximumNonNegative (List (-1, -2, -3, 4, 5)))
    .toEqual (5)

  expect (List.maximumNonNegative (List (-1, -2, -3, -4, -5)))
    .toEqual (0)

  expect (List.maximumNonNegative (List.empty))
    .toEqual (0)
})

test ("groupByKey", () => {
  expect (List.groupByKey ((x: number) => x % 2) (List (1, 2, 3, 4, 5)))
    .toEqual (
      OrderedMap.fromArray (
        [
          [ 1, List (1, 3, 5) ],
          [ 0, List (2, 4) ],
        ]
      )
    )
})

test ("mapByIdKeyMap", () => {
  const R = fromDefault ("R") ({ id: "" })

  const m = OrderedMap.fromArray ([ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ], [ "d", 4 ], [ "e", 5 ] ])

  expect (List.mapByIdKeyMap (m)
                             (List (R ({ id: "d" }), R ({ id: "b" }), R ({ id: "a" }))))
    .toEqual (List (4, 2, 1))
})

test ("intersecting", () => {
  expect (List.intersecting (List (1, 2, 3)) (List (4, 5, 6))) .toEqual (false)
  expect (List.intersecting (List (1, 2, 3)) (List (3, 5, 6))) .toEqual (true)
})

test ("filterMulti", () => {
  expect (List.filterMulti (List ((a: number) => a > 2, (a: number) => a < 5))
                           (List (1, 2, 3, 4, 5)))
    .toEqual (List (3, 4))
  expect (List.filterMulti (List ((a: number) => a > 2, (a: number) => a < 5))
                           (List (2, 5, 6, 7)))
    .toEqual (List ())
})

test ("lengthAtLeast", () => {
  expect (List.lengthAtLeast (3) (List (1, 2, 3, 4, 5)))
    .toEqual (true)
  expect (List.lengthAtLeast (3) (List (1, 2, 3, 4)))
    .toEqual (true)
  expect (List.lengthAtLeast (3) (List (1, 2, 3)))
    .toEqual (true)
  expect (List.lengthAtLeast (3) (List (1, 2)))
    .toEqual (false)
  expect (() => List.lengthAtLeast (-1) (List (1, 2)))
    .toThrow ()
})

test ("lengthAtMost", () => {
  expect (List.lengthAtMost (3) (List (1)))
    .toEqual (true)
  expect (List.lengthAtMost (3) (List (1, 2)))
    .toEqual (true)
  expect (List.lengthAtMost (3) (List (1, 2, 3)))
    .toEqual (true)
  expect (List.lengthAtMost (3) (List (1, 2, 3, 4)))
    .toEqual (false)
  expect (() => List.lengthAtMost (-1) (List (1, 2)))
    .toThrow ()
})

describe ("Unique", () => {
  describe ("countElem", () => {
    it ("counts 0 if there is no matching element", () => {
      expect (L.countElem (5) (List (1, 2, 3, 4))) .toBe (0)
    })

    it ("counts 1 if there is one matching element", () => {
      expect (L.countElem (2) (List (1, 2, 3, 4))) .toBe (1)
    })

    it ("counts 2 if there are two matching element", () => {
      expect (L.countElem (2) (List (1, 2, 3, 4, 2))) .toBe (2)
    })

    it ("counts 3 if there are three matching element", () => {
      expect (L.countElem (2) (List (1, 2, 3, 2, 4, 2))) .toBe (3)
    })
  })
})
