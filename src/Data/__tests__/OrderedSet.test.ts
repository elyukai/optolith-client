import { Internals } from "../Internals"
import { List } from "../List"
import { fromArray, fromSet, fromUniqueElements, OrderedSet } from "../OrderedSet"

const { Just, Nothing } = Internals

// CONSTRUCTOR

test ("fromUniqueElements", () => {
  expect (fromUniqueElements (1, 2, 3) .value)
    .toEqual (new Set ([ 1, 2, 3 ]))
  expect (fromUniqueElements (1, 2, 3, 1) .value)
    .toEqual (new Set ([ 1, 2, 3 ]))
  expect (fromUniqueElements () .value)
    .toEqual (new Set ())
})

test ("fromArray", () => {
  expect (fromArray ([ 1, 2, 3 ]) .value)
    .toEqual (new Set ([ 1, 2, 3 ]))
  expect (fromArray ([ 1, 2, 3, 1 ]) .value)
    .toEqual (new Set ([ 1, 2, 3 ]))
  expect (fromArray ([]) .value)
    .toEqual (new Set ())
})

test ("fromSet", () => {
  expect (fromSet (new Set ([ 1, 2, 3 ])) .value)
    .toEqual (new Set ([ 1, 2, 3 ]))
  expect (fromSet (new Set ([ 1, 2, 3, 1 ])) .value)
    .toEqual (new Set ([ 1, 2, 3 ]))
  expect (fromSet (new Set ()) .value)
    .toEqual (new Set ())
})

test ("[Symbol.iterator]", () => {
  expect ([ ...fromArray ([ "a", "b", "c" ]) ])
    .toEqual ([ "a", "b", "c" ])
})

// FOLDABLE

test ("foldr", () => {
  expect (OrderedSet.foldr ((e: number) => (acc: string) => e.toString () + acc)
                           ("0")
                           (fromArray ([ 3, 2, 1 ])))
    .toEqual ("3210")
})

test ("foldl", () => {
  expect (OrderedSet.foldl ((acc: string) => (e: number) => acc + e.toString ())
                           ("0")
                           (fromArray ([ 1, 2, 3 ])))
    .toEqual ("0123")
})

test ("foldr1", () => {
  expect (OrderedSet.foldr1 ((e: number) => (acc: number) => e + acc)
                            (fromArray ([ 3, 2, 1 ])))
    .toEqual (6)
})

test ("foldl1", () => {
  expect (OrderedSet.foldl1 ((acc: number) => (e: number) => e + acc)
                            (fromArray ([ 3, 2, 1 ])))
    .toEqual (6)
})

test ("toList", () => {
  expect (OrderedSet.toList (fromArray ([ 3, 2, 1 ])))
    .toEqual (List (3, 2, 1))
})

test ("fnull", () => {
  expect (OrderedSet.fnull (fromArray ([ 3, 2, 1 ]))) .toBeFalsy ()
  expect (OrderedSet.fnull (fromArray ([]))) .toBeTruthy ()
})

test ("flength", () => {
  expect (OrderedSet.flength (fromArray ([ 3, 2, 1 ]))) .toEqual (3)
  expect (OrderedSet.flength (fromArray ([]))) .toEqual (0)
})

test ("elem", () => {
  expect (OrderedSet.elem (3) (fromArray ([ 1, 2, 3, 4, 5 ])))
    .toBeTruthy ()
  expect (OrderedSet.elem (6) (fromArray ([ 1, 2, 3, 4, 5 ])))
    .toBeFalsy ()
})

test ("elemF", () => {
  expect (OrderedSet.elemF (fromArray ([ 1, 2, 3, 4, 5 ])) (3))
    .toBeTruthy ()
  expect (OrderedSet.elemF (fromArray ([ 1, 2, 3, 4, 5 ])) (6))
    .toBeFalsy ()
})

test ("sum", () => {
  expect (OrderedSet.sum (fromArray ([ 3, 2, 1 ]))) .toEqual (6)
})

test ("product", () => {
  expect (OrderedSet.product (fromArray ([ 3, 2, 2 ]))) .toEqual (6)
})

test ("maximum", () => {
  expect (OrderedSet.maximum (fromArray ([ 3, 2, 1 ]))) .toEqual (3)
  expect (OrderedSet.maximum (fromArray ([]))) .toEqual (-Infinity)
})

test ("minimum", () => {
  expect (OrderedSet.minimum (fromArray ([ 3, 2, 1 ]))) .toEqual (1)
  expect (OrderedSet.minimum (fromArray ([]))) .toEqual (Infinity)
})

test ("concat", () => {
  expect (OrderedSet.concat (
    fromArray ([
      List.fromArray ([ 3 ]),
      List.fromArray ([ 2 ]),
      List.fromArray ([ 1 ]),
    ])
  ))
    .toEqual (List.fromArray ([ 3, 2, 1 ]))
})

test ("concatMap", () => {
  expect (OrderedSet.concatMap (e => fromArray ([ e, e ]))
                               (fromArray ([ 1, 2, 3, 4, 5 ])))
    .toEqual (fromArray ([ 1, 1, 2, 2, 3, 3, 4, 4, 5, 5 ]))
})

test ("and", () => {
  expect (OrderedSet.and (fromArray ([ true, true, true ])))
    .toBeTruthy ()
  expect (OrderedSet.and (fromArray ([ true, true, false ])))
    .toBeFalsy ()
  expect (OrderedSet.and (fromArray ([ true, false, true ])))
    .toBeFalsy ()
})

test ("or", () => {
  expect (OrderedSet.or (fromArray ([ true, true, true ])))
    .toBeTruthy ()
  expect (OrderedSet.or (fromArray ([ true, true, false ])))
    .toBeTruthy ()
  expect (OrderedSet.or (fromArray ([ false, false, false ])))
    .toBeFalsy ()
})

test ("any", () => {
  expect (OrderedSet.any ((x: number) => x > 2) (fromArray ([ 3, 2, 1 ])))
    .toBeTruthy ()
  expect (OrderedSet.any ((x: number) => x > 3) (fromArray ([ 3, 2, 1 ])))
    .toBeFalsy ()
})

test ("all", () => {
  expect (OrderedSet.all ((x: number) => x >= 1) (fromArray ([ 3, 2, 1 ])))
    .toBeTruthy ()
  expect (OrderedSet.all ((x: number) => x >= 2) (fromArray ([ 3, 2, 1 ])))
    .toBeFalsy ()
})

test ("notElem", () => {
  expect (OrderedSet.notElem (3) (fromArray ([ 1, 2, 3, 4, 5 ])))
    .toBeFalsy ()
  expect (OrderedSet.notElem (6) (fromArray ([ 1, 2, 3, 4, 5 ])))
    .toBeTruthy ()
})

test ("find", () => {
  expect (OrderedSet.find ((e: string) => e.includes ("t"))
                          (fromArray ([ "one", "two", "three" ])))
    .toEqual (Just ("two"))
  expect (OrderedSet.find ((e: string) => e.includes ("tr"))
                          (fromArray ([ "one", "two", "three" ])))
    .toEqual (Nothing)
})

// CONSTRUCTION

test ("empty", () => {
  expect (OrderedSet.empty)
    .toEqual (fromArray ([]))
})

test ("singleton", () => {
  expect (OrderedSet.singleton ("a"))
    .toEqual (fromArray ([ "a" ]))
})

test ("fromList", () => {
  expect (OrderedSet.fromList (List (1, 2, 3)) .value)
    .toEqual (new Set ([ 1, 2, 3 ]))
})

// INSERTION

test ("insert", () => {
  expect (OrderedSet.insert ("d") (fromArray ([ "a", "b", "c" ])))
    .toEqual (fromArray ([ "a", "b", "c", "d" ]))
})

// DELETION

test ("sdelete", () => {
  expect (OrderedSet.sdelete ("c") (fromArray ([ "a", "b", "c" ])))
    .toEqual (fromArray ([ "a", "b" ]))
  expect (OrderedSet.sdelete ("d") (fromArray ([ "a", "b", "c" ])))
    .toEqual (fromArray ([ "a", "b", "c" ]))
})

// QUERY

test ("member", () => {
  expect (OrderedSet.member ("b") (fromArray ([ "a", "b", "c" ])))
    .toBeTruthy ()
  expect (OrderedSet.member ("d") (fromArray ([])))
    .toBeFalsy ()
})

test ("notMember", () => {
  expect (OrderedSet.notMember ("b") (fromArray ([ "a", "b", "c" ])))
    .toBeFalsy ()
  expect (OrderedSet.notMember ("d") (fromArray ([])))
    .toBeTruthy ()
})

test ("size", () => {
  expect (OrderedSet.size (fromArray ([ "a", "b", "c" ])))
    .toEqual (3)
  expect (OrderedSet.size (fromArray ([])))
    .toEqual (0)
})

// COMBINE

test ("union", () => {
  expect (OrderedSet.union (fromArray ([ "a", "b", "c" ]))
                           (fromArray ([ "c", "d", "e" ])))
    .toEqual (fromArray ([ "a", "b", "c", "d", "e" ]))
})

test ("difference", () => {
  expect (OrderedSet.difference (fromArray ([ 1, 2, 3, 4 ]))
                                (fromArray ([ 2, 4, 6, 8 ])))
    .toEqual (fromArray ([ 1, 3 ]))
})

test ("differenceF", () => {
  expect (OrderedSet.differenceF (fromArray ([ 2, 4, 6, 8 ]))
                                 (fromArray ([ 1, 2, 3, 4 ])))
    .toEqual (fromArray ([ 1, 3 ]))
})

// FILTER

test ("filter", () => {
  expect (OrderedSet.filter ((e: string) => e > "a") (fromArray ([ "a", "b", "c" ])))
    .toEqual (fromArray ([ "b", "c" ]))
})

// MAP

test ("map", () => {
  expect (OrderedSet.map (e => `${e}+`) (fromArray ([ "a", "b", "c" ])))
    .toEqual (fromArray ([ "a+", "b+", "c+" ]))
})

// CONVERSION LIST

test ("elems", () => {
  expect (OrderedSet.elems (fromArray ([ "a", "b", "c" ])))
    .toEqual (List ("a", "b", "c"))
})

// CUSTOM FUNCTIONS

test ("toSet", () => {
  expect (OrderedSet.toSet (fromArray ([ "a", "b", "c" ])))
    .toEqual (new Set ([ "a", "b", "c" ]))
})

test ("toArray", () => {
  expect (OrderedSet.toArray (fromArray ([ "a", "b", "c" ])))
    .toEqual ([ "a", "b", "c" ])
})

test ("toggle", () => {
  expect (OrderedSet.toggle ("c") (fromArray ([ "a", "b", "c" ])))
    .toEqual (fromArray ([ "a", "b" ]))
  expect (OrderedSet.toggle ("d") (fromArray ([ "a", "b", "c" ])))
    .toEqual (fromArray ([ "a", "b", "c", "d" ]))
})

test ("isOrderedSet", () => {
  expect (OrderedSet.isOrderedSet (fromArray ([ "a", "b", "c" ])))
    .toEqual (true)
  expect (OrderedSet.isOrderedSet (3)) .toEqual (false)
})
