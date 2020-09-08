import { pipe } from "../../App/Utilities/pipe"
import { ident } from "../Function"
import { fmap } from "../Functor"
import { Internals } from "../Internals"
import { List } from "../List"
import { Maybe } from "../Maybe"
import { add } from "../Num"
import { fromArray, fromMap, fromUniquePairs, OrderedMap } from "../OrderedMap"
import { OrderedSet } from "../OrderedSet"
import { Pair, Tuple } from "../Tuple"

const { Just, Nothing, Left, Right } = Internals

// CONSTRUCTOR

test ("fromUniquePairs", () => {
  expect (fromUniquePairs ([ "x", 1 ], [ "y", 2 ], [ "z", 3 ]) .value)
    .toEqual (new Map ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ]))

  expect (fromUniquePairs ([ "x", 1 ], [ "y", 2 ], [ "z", 3 ], [ "x", 2 ]) .value)
    .toEqual (new Map ([ [ "x", 2 ], [ "y", 2 ], [ "z", 3 ] ]))

  expect (fromUniquePairs () .value)
    .toEqual (new Map ())
})

test ("fromArray", () => {
  expect (fromArray ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ]) .value)
    .toEqual (new Map ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ]))

  expect (fromArray ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ], [ "x", 2 ] ]) .value)
    .toEqual (new Map ([ [ "x", 2 ], [ "y", 2 ], [ "z", 3 ] ]))

  expect (fromArray ([]) .value)
    .toEqual (new Map ())
})

test ("fromMap", () => {
  expect (fromMap (new Map ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ])) .value)
    .toEqual (new Map ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ]))

  expect (fromMap (new Map ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ], [ "x", 2 ] ])) .value)
    .toEqual (new Map ([ [ "x", 2 ], [ "y", 2 ], [ "z", 3 ] ]))

  expect (fromMap (new Map ()) .value)
    .toEqual (new Map ())
})

// FOLDABLE

test ("foldr", () => {
  expect (OrderedMap.foldr ((e: number) => (acc: string) => e.toString () + acc)
                           ("0")
                           (fromArray ([ [ "x", 3 ], [ "y", 2 ], [ "z", 1 ] ])))
    .toEqual ("3210")
})

test ("foldl", () => {
  expect (OrderedMap.foldl ((acc: string) => (e: number) => acc + e.toString ())
                           ("0")
                           (fromArray ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ])))
    .toEqual ("0123")
})

test ("foldr1", () => {
  expect (OrderedMap.foldr1 ((e: number) => (acc: number) => e + acc)
                            (fromArray ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ])))
    .toEqual (6)
})

test ("foldl1", () => {
  expect (OrderedMap.foldl1 ((acc: number) => (e: number) => e + acc)
                            (fromArray ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ])))
    .toEqual (6)
})

test ("toList", () => {
  expect (OrderedMap.toList (fromArray ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ])))
    .toEqual (
      List (
        Pair ("x") (1),
        Pair ("y") (2),
        Pair ("z") (3)
      )
    )
})

test ("fnull", () => {
  expect (OrderedMap.fnull (fromArray ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ])))
    .toBeFalsy ()

  expect (OrderedMap.fnull (fromArray ([]))) .toBeTruthy ()
})

test ("flength", () => {
  expect (OrderedMap.flength (fromArray ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ])))
    .toEqual (3)

  expect (OrderedMap.flength (fromArray ([]))) .toEqual (0)
})

test ("elem", () => {
  expect (OrderedMap.elem (3) (fromArray ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ])))
    .toBeTruthy ()

  expect (OrderedMap.elem (6) (fromArray ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ])))
    .toBeFalsy ()
})

test ("elem_", () => {
  expect (OrderedMap.elemF (fromArray ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ])) (3))
    .toBeTruthy ()

  expect (OrderedMap.elemF (fromArray ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ])) (6))
    .toBeFalsy ()
})

test ("sum", () => {
  expect (OrderedMap.sum (fromArray ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ])))
    .toEqual (6)
})

test ("product", () => {
  expect (OrderedMap.product (fromArray ([ [ "x", 2 ], [ "y", 2 ], [ "z", 3 ] ])))
    .toEqual (12)
})

test ("maximum", () => {
  expect (OrderedMap.maximum (fromArray ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ])))
    .toEqual (3)

  expect (OrderedMap.maximum (fromArray ([]))) .toEqual (-Infinity)
})

test ("minimum", () => {
  expect (OrderedMap.minimum (fromArray ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ])))
    .toEqual (1)

  expect (OrderedMap.minimum (fromArray ([]))) .toEqual (Infinity)
})

test ("concat", () => {
  expect (OrderedMap.concat (
    fromArray ([
      [ "x", List.fromArray ([ 1 ]) ],
      [ "y", List.fromArray ([ 2 ]) ],
      [ "z", List.fromArray ([ 3 ]) ],
    ])
  ))
    .toEqual (List.fromArray ([ 1, 2, 3 ]))
})

test ("concatMap", () => {
  expect (OrderedMap.concatMap (e => fromArray ([ [ e, e ] ]))
                               (fromArray ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ])))
    .toEqual (fromArray ([ [ 1, 1 ], [ 2, 2 ], [ 3, 3 ] ]))
})

test ("and", () => {
  expect (OrderedMap.and (fromArray ([ [ "x", true ], [ "y", true ], [ "z", true ] ])))
    .toBeTruthy ()

  expect (OrderedMap.and (fromArray ([ [ "x", true ], [ "y", true ], [ "z", false ] ])))
    .toBeFalsy ()

  expect (
    OrderedMap.or (fromArray ([ [ "x", false ], [ "y", false ], [ "z", false ] ]))
  )
    .toBeFalsy ()
})

test ("or", () => {
  expect (OrderedMap.or (fromArray ([ [ "x", true ], [ "y", true ], [ "z", true ] ])))
    .toBeTruthy ()

  expect (OrderedMap.or (fromArray ([ [ "x", true ], [ "y", true ], [ "z", false ] ])))
    .toBeTruthy ()

  expect (
    OrderedMap.or (fromArray ([ [ "x", false ], [ "y", false ], [ "z", false ] ]))
  )
    .toBeFalsy ()
})

test ("any", () => {
  expect (OrderedMap.any ((x: number) => x > 2)
                         (fromArray ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ])))
    .toBeTruthy ()

  expect (OrderedMap.any ((x: number) => x > 3)
                         (fromArray ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ])))
    .toBeFalsy ()
})

test ("all", () => {
  expect (OrderedMap.all ((x: number) => x >= 1)
                         (fromArray ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ])))
    .toBeTruthy ()

  expect (OrderedMap.all ((x: number) => x >= 2)
                         (fromArray ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ])))
    .toBeFalsy ()
})

test ("notElem", () => {
  expect (OrderedMap.notElem (3) (fromArray ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ])))
    .toBeFalsy ()

  expect (OrderedMap.notElem (6) (fromArray ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ])))
    .toBeTruthy ()
})

test ("find", () => {
  expect (
    OrderedMap.find ((e: string) => e.includes ("t"))
                    (fromArray ([ [ "x", "one" ], [ "y", "two" ], [ "z", "three" ] ]))
  )
    .toEqual (Just ("two"))

  expect (
    OrderedMap.find ((e: string) => e.includes ("tr"))
                    (fromArray ([ [ "x", "one" ], [ "y", "two" ], [ "z", "three" ] ]))
  )
    .toEqual (Nothing)
})

// TRAVERSABLE

test ("mapMEither", () => {
  expect (
    OrderedMap.mapMEither ((x: number) => x === 2 ? Left ("test") : Right (x + 1))
                          (OrderedMap.empty)
  )
    .toEqual (Right (OrderedMap.empty))

  expect (
    OrderedMap.mapMEither ((x: number) => x === 2 ? Left ("test") : Right (x + 1))
                          (OrderedMap.fromArray ([ [ 1, 1 ], [ 2, 3 ] ]))
  )
    .toEqual (Right (OrderedMap.fromArray ([ [ 1, 2 ], [ 2, 4 ] ])))

  expect (
    OrderedMap.mapMEither ((x: number) => x === 2 ? Left ("test") : Right (x + 1))
                          (OrderedMap.fromArray ([ [ 1, 1 ], [ 2, 3 ], [ 3, 2 ] ]))
  )
    .toEqual (Left ("test"))
})

// QUERY

test ("size", () => {
  expect (OrderedMap.size (fromArray ([ [ "x", 1 ], [ "y", 2 ], [ "z", 3 ] ])))
    .toEqual (3)

  expect (OrderedMap.size (fromArray ([]))) .toEqual (0)
})

test ("member", () => {
  expect (OrderedMap.member (2) (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])))
    .toBeTruthy ()

  expect (OrderedMap.member (5) (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])))
    .toBeFalsy ()
})

test ("member_", () => {
  expect (OrderedMap.memberF (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])) (2))
    .toBeTruthy ()

  expect (OrderedMap.memberF (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])) (5))
    .toBeFalsy ()
})

test ("notMember", () => {
  expect (OrderedMap.notMember (2) (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])))
    .toBeFalsy ()

  expect (OrderedMap.notMember (5) (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])))
    .toBeTruthy ()
})

test ("lookup", () => {
  expect (OrderedMap.lookup (2) (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])))
    .toEqual (Just ("b"))

  expect (OrderedMap.lookup (5) (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])))
    .toEqual (Nothing)
})

test ("lookupF", () => {
  expect (OrderedMap.lookupF (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])) (2))
    .toEqual (Just ("b"))

  expect (OrderedMap.lookupF (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])) (5))
    .toEqual (Nothing)
})

test ("findWithDefault", () => {
  expect (
    OrderedMap.findWithDefault ("...")
                               (2)
                               (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ]))
  )
    .toEqual ("b")

  expect (
    OrderedMap.findWithDefault ("...")
                               (5)
                               (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ]))
  )
    .toEqual ("...")
})

// CONSTRUCTION

test ("empty", () => {
  const map = OrderedMap.empty
  const res = fromArray ([])

  expect (map) .toEqual (res)
})

test ("singleton", () => {
  const res = fromArray ([ [ 1, "a" ] ])

  expect (OrderedMap.singleton (1) ("a")) .toEqual (res)
})

// INSERTION

test ("insert", () => {
  expect (OrderedMap.insert (4)
                            ("d")
                            (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])))
    .toEqual (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ], [ 4, "d" ] ]))

  expect (OrderedMap.insert (3)
                            ("d")
                            (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])))
    .toEqual (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "d" ] ]))
})

test ("insertF", () => {
  expect (OrderedMap.insertF ("d")
                             (4)
                             (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])))
    .toEqual (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ], [ 4, "d" ] ]))

  expect (OrderedMap.insertF ("d")
                             (3)
                             (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])))
    .toEqual (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "d" ] ]))
})

test ("insertWith", () => {
  expect (OrderedMap.insertWith <string> (x => old => old + x)
                                (4)
                                ("d")
                                (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])))
    .toEqual (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ], [ 4, "d" ] ]))

  expect (OrderedMap.insertWith <string> (x => old => old + x)
                                (3)
                                ("d")
                                (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])))
    .toEqual (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "cd" ] ]))
})

test ("insertWithKey", () => {
  expect (
    OrderedMap.insertWithKey <number, string> (key => x => old => old + x + key.toString ())
                             (4)
                             ("d")
                             (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ]))

  )
    .toEqual (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ], [ 4, "d" ] ]))

  expect (
    OrderedMap.insertWithKey <number, string> (key => x => old => old + x + key.toString ())
                             (3)
                             ("d")
                             (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ]))

  )
    .toEqual (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "cd3" ] ]))
})

test ("insertLookupWithKey", () => {
  expect (
    OrderedMap.insertLookupWithKey <number, string> (key => x => old => old + x + key.toString ())
                                   (4)
                                   ("d")
                                   (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ]))
  )
    .toEqual (
      Pair (Nothing) (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ], [ 4, "d" ] ]))
    )

  expect (
    OrderedMap.insertLookupWithKey <number, string> (key => x => old => old + x + key.toString ())
                                   (3)
                                   ("d")
                                   (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ]))
  )
    .toEqual (
      Pair (Just ("c")) (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "cd3" ] ]))
    )
})

// DELETE/UPDATE

test ("sdelete", () => {
  const map = fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])

  expect (OrderedMap.sdelete (3) (map))
    .toEqual (fromArray ([ [ 1, "a" ], [ 2, "b" ] ]))

  expect (OrderedMap.sdelete (4) (map) === map)
    .toBeTruthy ()
})

test ("adjust", () => {
  const map = fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])

  expect (OrderedMap.adjust (x => `${x}d`) (3) (map))
    .toEqual (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "cd" ] ]))

  expect (OrderedMap.adjust (x => `${x}d`) (4) (map) === map)
    .toBeTruthy ()
})

test ("adjustWithKey", () => {
  const map = fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])

  expect (OrderedMap.adjustWithKey <number, string> (key => x => x + key.toString ()) (3) (map))
    .toEqual (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c3" ] ]))

  expect (
    OrderedMap.adjustWithKey <number, string> (key => x => x + key.toString ()) (4) (map)
    === map
  )
    .toBeTruthy ()
})

test ("update", () => {
  const map = fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])

  expect (OrderedMap.update ((x: string) => Just (`${x}d`)) (3) (map))
    .toEqual (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "cd" ] ]))

  expect (OrderedMap.update ((_: string) => Nothing) (3) (map))
    .toEqual (fromArray ([ [ 1, "a" ], [ 2, "b" ] ]))

  expect (OrderedMap.update ((x: string) => Just (`${x}d`)) (4) (map) === map)
    .toBeTruthy ()

  expect (OrderedMap.update ((_: string) => Nothing) (4) (map) === map)
    .toBeTruthy ()
})

test ("updateWithKey", () => {
  const map = fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])

  expect (OrderedMap.updateWithKey <number, string> (key => x => Just (x + key.toString ()))
                                   (3)
                                   (map))
    .toEqual (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c3" ] ]))

  expect (OrderedMap.updateWithKey <number, string> (_1 => _2 => Nothing) (3) (map))
    .toEqual (fromArray ([ [ 1, "a" ], [ 2, "b" ] ]))

  expect (OrderedMap.updateWithKey <number, string> (key => x => Just (x + key.toString ()))
                                   (4)
                                   (map) === map)
    .toBeTruthy ()

  expect (OrderedMap.updateWithKey <number, string> (_1 => _2 => Nothing) (4) (map) === map)
    .toBeTruthy ()
})

test ("updateLookupWithKey", () => {
  const map = fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])

  expect (OrderedMap.updateLookupWithKey <number, string>
                                         (key => x => Just (x + key.toString ()))
                                         (3)
                                         (map))
    .toEqual (Pair (Just ("c3"))
                       (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c3" ] ])))

  expect (OrderedMap.updateLookupWithKey <number, string> (_1 => _2 => Nothing) (3) (map))
    .toEqual (Pair (Just ("c"))
                       (fromArray ([ [ 1, "a" ], [ 2, "b" ] ])))

  expect (Tuple.snd (OrderedMap.updateLookupWithKey <number, string>
                                                    (key => x => Just (x + key.toString ()))
                                                    (4)
                                                    (map)) === map)
    .toBeTruthy ()

  expect (Tuple.snd (OrderedMap.updateLookupWithKey <number, string> (_1 => _2 => Nothing)
                                                    (4)
                                                    (map)) === map)
    .toBeTruthy ()
})

test ("alter", () => {
  const map = fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])

  // Update
  expect (OrderedMap.alter (fmap (x => `${x}d`)) (3) (map))
    .toEqual (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "cd" ] ]))

  // Insert
  expect (OrderedMap.alter (pipe (
                             fmap (ident) as ident<Maybe<string>>,
                             Maybe.altF (Just ("d"))
                           ))
                           (4)
                           (map))
    .toEqual (fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ], [ 4, "d" ] ]))

  // Delete
  expect (OrderedMap.alter <string> (_ => Nothing) (3) (map))
    .toEqual (fromArray ([ [ 1, "a" ], [ 2, "b" ] ]))
})

// COMBINE

test ("union", () => {
  const map1 = fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])
  const map2 = fromArray ([ [ 3, "d" ], [ 4, "e" ], [ 5, "f" ] ])
  const res = fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ], [ 4, "e" ], [ 5, "f" ] ])

  expect (OrderedMap.union (map1) (map2)) .toEqual (res)
})

// MAP

test ("map", () => {
  const map = fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])
  const res = fromArray ([ [ 1, "a_" ], [ 2, "b_" ], [ 3, "c_" ] ])

  expect (OrderedMap.map (x => `${x}_`) (map)) .toEqual (res)
})

test ("mapWithKey", () => {
  const map = fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])
  const res = fromArray ([ [ 1, "a1" ], [ 2, "b2" ], [ 3, "c3" ] ])

  expect (OrderedMap.mapWithKey <number, string, string> (key => x => x + key.toString ()) (map))
    .toEqual (res)
})

// FOLDS

test ("foldrWithKey", () => {
  const map = fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])
  const res = "c3b2a1"

  expect (OrderedMap.foldrWithKey <number, string, string>
                                  (key => x => acc => acc + x + key.toString ())
                                  ("")
                                  (map))
    .toEqual (res)
})

test ("foldlWithKey", () => {
  const map = fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])
  const res = "a1b2c3"

  expect (OrderedMap.foldlWithKey <number, string, string>
                                  (acc => key => x => acc + x + key.toString ())
                                  ("")
                                  (map))
    .toEqual (res)
})

// CONVERSION

test ("elems", () => {
  const map = fromArray ([ [ 1, "a" ], [ 3, "c" ], [ 2, "b" ] ])
  const res = List ("a", "c", "b")

  expect (OrderedMap.elems (map)) .toEqual (res)
})

test ("keys", () => {
  const map = fromArray ([ [ 1, "a" ], [ 3, "c" ], [ 2, "b" ] ])
  const res = List (1, 3, 2)

  expect (OrderedMap.keys (map)) .toEqual (res)
})

test ("assocs", () => {
  const map = fromArray ([ [ 1, "a" ], [ 3, "c" ], [ 2, "b" ] ])
  const res = List (
    Pair (1) ("a"),
    Pair (3) ("c"),
    Pair (2) ("b")
  )

  expect (OrderedMap.assocs (map)) .toEqual (res)
})

test ("keysSet", () => {
  const map = fromArray ([ [ 1, "a" ], [ 3, "c" ], [ 2, "b" ] ])
  const res = OrderedSet.fromArray ([ 1, 3, 2 ])

  expect (OrderedMap.keysSet (map)) .toEqual (res)
})

test ("fromSet", () => {
  const set = OrderedSet.fromArray ([ 1, 3, 2 ])
  const res = fromArray ([ [ 1, 2 ], [ 3, 6 ], [ 2, 4 ] ])

  expect (OrderedMap.fromSet ((key: number) => key * 2) (set)) .toEqual (res)
})

// LISTS

test ("fromList", () => {
  const map = List (
    Pair (1) ("a"),
    Pair (3) ("c"),
    Pair (2) ("b")
  )
  const res = fromArray ([ [ 1, "a" ], [ 3, "c" ], [ 2, "b" ] ])

  expect (OrderedMap.fromList (map)) .toEqual (res)
})

// FILTER

test ("filter", () => {
  const map = fromArray ([ [ 1, "a" ], [ 3, "c" ], [ 4, "d" ], [ 2, "b" ] ])
  const res = fromArray ([ [ 4, "d" ], [ 2, "b" ] ])

  expect (OrderedMap.filter (e => e === "b" || e === "d") (map)) .toEqual (res)
})

test ("filterWithKey", () => {
  const map = fromArray ([ [ 1, "a" ], [ 3, "c" ], [ 4, "d" ], [ 2, "b" ] ])
  const res = fromArray ([ [ 3, "c" ], [ 4, "d" ], [ 2, "b" ] ])

  expect (OrderedMap.filterWithKey ((key: number) => e => key % 2 === 0 || e === "c")
                                   (map))
    .toEqual (res)
})

test ("filterWithKey_", () => {
  const map = fromArray ([ [ 1, "a" ], [ 3, "c" ], [ 4, "d" ], [ 2, "b" ] ])
  const res = fromArray ([ [ 3, "c" ], [ 4, "d" ], [ 2, "b" ] ])

  expect (OrderedMap.filterWithKeyF (map)
                                    (key => e => key % 2 === 0 || e === "c"))
    .toEqual (res)
})

test ("mapMaybe", () => {
  const map = fromArray ([ [ 1, "a" ], [ 3, "c" ], [ 4, "d" ], [ 2, "b" ] ])
  const res = fromArray ([ [ 4, "+" ], [ 2, "+" ] ])

  expect (OrderedMap.mapMaybe (e => (e === "b" || e === "d")
                                ? Just ("+")
                                : Nothing)
                              (map))
    .toEqual (res)
})

test ("mapMaybeWithKey", () => {
  const map = fromArray ([ [ 1, "a" ], [ 3, "c" ], [ 4, "d" ], [ 2, "b" ] ])
  const res = fromArray ([ [ 3, "+" ], [ 4, "+" ], [ 2, "+" ] ])

  expect (OrderedMap.mapMaybeWithKey ((key: number) => e => (key % 2 === 0 || e === "c")
                                       ? Just ("+")
                                       : Nothing)
                                     (map))
    .toEqual (res)
})

// CUSTOM FUNCTIONS

test ("toObjectWith", () => {
  const map = fromArray ([ [ "1", "a" ], [ "3", "c" ], [ "2", "b" ] ])
  const res = { 1: "<a>", 2: "<b>", 3: "<c>" }

  expect (OrderedMap.toObjectWith (e => `<${e}>`) (map)) .toEqual (res)
})

test ("toMap", () => {
  const map = fromArray ([ [ 1, "a" ], [ 3, "c" ], [ 2, "b" ] ])
  const res = new Map ([ [ 1, "a" ], [ 3, "c" ], [ 2, "b" ] ])

  expect (OrderedMap.toMap (map)) .toEqual (res)
})

test ("isOrderedMap", () => {
  expect (OrderedMap.isOrderedMap (fromArray ([ [ "x", 1 ] ]))) .toEqual (true)
  expect (OrderedMap.isOrderedMap (3)) .toEqual (false)
})

test ("deleteLookupWithKey", () => {
  const map = fromArray ([ [ 1, "a" ], [ 2, "b" ], [ 3, "c" ] ])

  expect (OrderedMap.deleteLookupWithKey (3) (map))
    .toEqual (Pair (Just ("c"))
                       (fromArray ([ [ 1, "a" ], [ 2, "b" ] ])))
})

test ("lookup2", () => {
  const map = fromArray ([ [ "t", 1 ], [ "te", 2 ], [ "tes", 3 ], [ "test", 4 ], [ "tests", 5 ] ])
  const map2 = fromArray ([ [ "t", 6 ], [ "te", 7 ], [ "tes", 8 ], [ "test", 9 ], [ "testss", 0 ] ])

  expect (OrderedMap.lookup2 (add) ("test") (map) (map2)) .toEqual (Just (13))
  expect (OrderedMap.lookup2 (add) ("tests") (map) (map2)) .toEqual (Nothing)
  expect (OrderedMap.lookup2 (add) ("testsss") (map) (map2)) .toEqual (Nothing)
})

test ("lookup2F", () => {
  const map = fromArray ([ [ "t", 1 ], [ "te", 2 ], [ "tes", 3 ], [ "test", 4 ], [ "tests", 5 ] ])
  const map2 = fromArray ([ [ "t", 6 ], [ "te", 7 ], [ "tes", 8 ], [ "test", 9 ], [ "testss", 0 ] ])

  expect (OrderedMap.lookup2F ("test") (map) (map2) (add)) .toEqual (Just (13))
  expect (OrderedMap.lookup2F ("tests") (map) (map2) (add)) .toEqual (Nothing)
  expect (OrderedMap.lookup2F ("testsss") (map) (map2) (add)) .toEqual (Nothing)
})

test ("mapMEitherWithKey", () => {
  expect (
    OrderedMap.mapMEitherWithKey (k => (x: number) => x === 2 ? Left (k) : Right (x + 1))
                                 (OrderedMap.empty)
  )
    .toEqual (Right (OrderedMap.empty))

  expect (
    OrderedMap.mapMEitherWithKey (k => (x: number) => x === 2 ? Left (k) : Right (x + 1))
                                 (OrderedMap.fromArray ([ [ 1, 1 ], [ 2, 3 ] ]))
  )
    .toEqual (Right (OrderedMap.fromArray ([ [ 1, 2 ], [ 2, 4 ] ])))

  expect (
    OrderedMap.mapMEitherWithKey (k => (x: number) => x === 2 ? Left (k) : Right (x + 1))
                                 (OrderedMap.fromArray ([ [ 1, 1 ], [ 2, 3 ], [ 4, 2 ] ]))
  )
    .toEqual (Left (4))
})
