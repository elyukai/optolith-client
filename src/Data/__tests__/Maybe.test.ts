import React from "react"
import { fmap } from "../Functor"
import { Internals } from "../Internals"
import { List } from "../List"
import { Just, Maybe } from "../Maybe"
import { add } from "../Num"

const { Nothing } = Internals

// CONSTRUCTORS

test ("Just", () => {
  expect (Just (3) .value) .toEqual (3)
  expect (Just (3) .isJust) .toEqual (true)
  expect (Just (3) .isNothing) .toEqual (false)
})

test ("Nothing", () => {
  expect (Nothing .isJust) .toEqual (false)
  expect (Nothing .isNothing) .toEqual (true)
})

test ("Maybe", () => {
  expect (Maybe (3)) .toEqual (Just (3))
  expect (Maybe (undefined)) .toEqual (Nothing)
  expect (Maybe (null)) .toEqual (Nothing)
})

// MAYBE FUNCTIONS (PART 1)

test ("isJust", () => {
  expect (Maybe.isJust (Maybe (3)))
    .toBeTruthy ()
  expect (Maybe.isJust (Maybe (null)))
    .toBeFalsy ()
})

test ("isNothing", () => {
  expect (Maybe.isNothing (Maybe (3)))
    .toBeFalsy ()
  expect (Maybe.isNothing (Maybe (null)))
    .toBeTruthy ()
})

test ("fromJust", () => {
  expect (Maybe.fromJust (Maybe (3) as Just<number>))
    .toEqual (3)
  expect (() => Maybe.fromJust (Maybe (null) as Just<null>))
    .toThrow ()
})

test ("fromMaybe", () => {
  expect (Maybe.fromMaybe (0) (Maybe (3)))
    .toEqual (3)
  expect (Maybe.fromMaybe (0) (Maybe (null) as Maybe<number>))
    .toEqual (0)
})

test ("fromMaybe_", () => {
  expect (Maybe.fromMaybe_ (() => 0) (Maybe (3)))
    .toEqual (3)
  expect (Maybe.fromMaybe_ (() => 0) (Maybe (null) as Maybe<number>))
    .toEqual (0)
})

// APPLICATIVE

test ("pure", () => {
  expect (Maybe.pure (2)) .toEqual (Just (2))
})

test ("ap", () => {
  expect (Maybe.ap (Just ((x: number) => x * 2)) (Just (3)))
    .toEqual (Just (6))
  expect (Maybe.ap (Just ((x: number) => x * 2)) (Nothing))
    .toEqual (Nothing)
  expect (Maybe.ap (Nothing) (Just (3)))
    .toEqual (Nothing)
  expect (Maybe.ap (Nothing) (Nothing))
    .toEqual (Nothing)
})

// ALTERNATIVE

test ("alt", () => {
  expect (Maybe.alt (Just (3)) (Just (2)))
    .toEqual (Just (3))
  expect (Maybe.alt (Just (3)) (Nothing))
    .toEqual (Just (3))
  expect (Maybe.alt (Nothing) (Just (2)))
    .toEqual (Just (2))
  expect (Maybe.alt (Nothing) (Nothing))
    .toEqual (Nothing)
})

test ("alt_", () => {
  expect (Maybe.alt_ (Just (3)) (() => Just (2)))
    .toEqual (Just (3))
  expect (Maybe.alt_ (Just (3)) (() => Nothing))
    .toEqual (Just (3))
  expect (Maybe.alt_ (Nothing) (() => Just (2)))
    .toEqual (Just (2))
  expect (Maybe.alt_ (Nothing) (() => Nothing))
    .toEqual (Nothing)
})

test ("altF", () => {
  expect (Maybe.altF (Just (2)) (Just (3)))
    .toEqual (Just (3))
  expect (Maybe.altF (Nothing) (Just (3)))
    .toEqual (Just (3))
  expect (Maybe.altF (Just (2)) (Nothing))
    .toEqual (Just (2))
  expect (Maybe.altF (Nothing) (Nothing))
    .toEqual (Nothing)
})

test ("altF_", () => {
  expect (Maybe.altF_ (() => Just (2)) (Just (3)))
    .toEqual (Just (3))
  expect (Maybe.altF_ (() => Nothing) (Just (3)))
    .toEqual (Just (3))
  expect (Maybe.altF_ (() => Just (2)) (Nothing))
    .toEqual (Just (2))
  expect (Maybe.altF_ (() => Nothing) (Nothing))
    .toEqual (Nothing)
})

test ("empty", () => {
  expect (Maybe.empty) .toEqual (Nothing)
})

test ("guard", () => {
  expect (Maybe.guard (true))
    .toEqual (Just (undefined))
  expect (Maybe.guard (false))
    .toEqual (Nothing)
})

// MONAD

test ("bind", () => {
  expect (Maybe.bind (Maybe (3))
                     (x => Just (x * 2)))
    .toEqual (Just (6))
  expect (Maybe.bind (Maybe (null) as Maybe<number>)
                     (x => Just (x * 2)))
    .toEqual (Nothing)
})

test ("bindF", () => {
  expect (Maybe.bindF ((x: number) => Just (x * 2))
                      (Maybe (3)))
    .toEqual (Just (6))
  expect (Maybe.bindF ((x: number) => Just (x * 2))
                      (Maybe (null) as Maybe<number>))
    .toEqual (Nothing)
})

test ("then", () => {
  expect (Maybe.then (Just (3)) (Just (2)))
    .toEqual (Just (2))
  expect (Maybe.then (Nothing) (Maybe.Just (2)))
    .toEqual (Nothing)
  expect (Maybe.then (Just (3)) (Nothing))
    .toEqual (Nothing)
  expect (Maybe.then (Nothing) (Nothing))
    .toEqual (Nothing)
})

test ("kleisli", () => {
  expect (Maybe.kleisli ((x: number) => x > 5 ? Nothing : Just (x))
                        (x => x < 0 ? Nothing : Just (x))
                        (2))
    .toEqual (Just (2))
  expect (Maybe.kleisli ((x: number) => x > 5 ? Nothing : Just (x))
                        (x => x < 0 ? Nothing : Just (x))
                        (6))
    .toEqual (Nothing)
  expect (Maybe.kleisli ((x: number) => x > 5 ? Nothing : Just (x))
                        (x => x < 0 ? Nothing : Just (x))
                        (-1))
    .toEqual (Nothing)
})

test ("join", () => {
  expect (Maybe.join (Just (Just (3))))
    .toEqual (Just (3))
  expect (Maybe.join (Just (Nothing)))
    .toEqual (Nothing)
  expect (Maybe.join (Nothing))
    .toEqual (Nothing)
})

test ("mapM", () => {
  expect (
    Maybe.mapM ((x: number) => x === 2 ? Nothing : Just (x + 1))
                (List.empty)
  )
    .toEqual (Just (List.empty))

  expect (
    Maybe.mapM ((x: number) => x === 2 ? Nothing : Just (x + 1))
                (List (1, 3))
  )
    .toEqual (Just (List (2, 4)))

  expect (
    Maybe.mapM ((x: number) => x === 2 ? Nothing : Just (x + 1))
                (List (1, 2, 3))
  )
    .toEqual (Nothing)
})

test ("liftM2", () => {
  expect (Maybe.liftM2 ((x: number) => (y: number) => x + y) (Just (1)) (Just (2)))
    .toEqual (Just (3))
  expect (Maybe.liftM2 ((x: number) => (y: number) => x + y) (Nothing) (Just (2)))
    .toEqual (Nothing)
  expect (Maybe.liftM2 ((x: number) => (y: number) => x + y) (Just (1)) (Nothing))
    .toEqual (Nothing)
  expect (Maybe.liftM2 ((x: number) => (y: number) => x + y) (Nothing) (Nothing))
    .toEqual (Nothing)
})

test ("liftM3", () => {
  expect (
    Maybe.liftM3 ((x: number) => (y: number) => (z: number) => x + y + z)
                  (Just (1))
                  (Just (2))
                  (Just (3))
  )
    .toEqual (Just (6))

  expect (
    Maybe.liftM3 ((x: number) => (y: number) => (z: number) => x + y + z)
                  (Nothing)
                  (Just (2))
                  (Just (3))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM3 ((x: number) => (y: number) => (z: number) => x + y + z)
                  (Just (1))
                  (Nothing)
                  (Just (3))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM3 ((x: number) => (y: number) => (z: number) => x + y + z)
                  (Just (1))
                  (Just (2))
                  (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM3 ((x: number) => (y: number) => (z: number) => x + y + z)
                  (Just (1))
                  (Nothing)
                  (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM3 ((x: number) => (y: number) => (z: number) => x + y + z)
                  (Nothing)
                  (Just (2))
                  (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM3 ((x: number) => (y: number) => (z: number) => x + y + z)
                  (Nothing)
                  (Nothing)
                  (Just (3))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM3 ((x: number) => (y: number) => (z: number) => x + y + z)
                  (Nothing)
                  (Nothing)
                  (Nothing)
  )
    .toEqual (Nothing)
})

test ("liftM4", () => {
  expect (
    Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
                 (Just (1)) (Just (2)) (Just (3)) (Just (4))
  )
    .toEqual (Just (10))

  expect (
    Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
                 (Nothing) (Just (2)) (Just (3)) (Just (4))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
                 (Just (1)) (Nothing) (Just (3)) (Just (4))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
                 (Just (1)) (Just (2)) (Nothing) (Just (4))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
                 (Just (1)) (Just (2)) (Just (3)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
                 (Just (1)) (Just (2)) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
                 (Just (1)) (Nothing) (Just (3)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
                 (Just (1)) (Nothing) (Nothing) (Just (4))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
                 (Nothing) (Just (2)) (Just (3)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
                 (Nothing) (Just (2)) (Nothing) (Just (4))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
                 (Nothing) (Nothing) (Just (3)) (Just (4))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
                 (Just (1)) (Nothing) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
                 (Nothing) (Just (2)) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
                 (Nothing) (Nothing) (Just (3)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
                 (Nothing) (Nothing) (Nothing) (Just (4))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 ((x: number) => (y: number) => (z: number) => (a: number) => x + y + z + a)
                 (Nothing) (Nothing) (Nothing) (Nothing)
  )
    .toEqual (Nothing)
})

test ("liftM5", () => {
  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                 (Just (1)) (Just (2)) (Just (3)) (Just (4)) (Just (5))
  )
    .toEqual (Just (15))

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                 (Nothing) (Just (2)) (Just (3)) (Just (4)) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                 (Just (1)) (Nothing) (Just (3)) (Just (4)) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                 (Just (1)) (Just (2)) (Nothing) (Just (4)) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                 (Just (1)) (Just (2)) (Just (3)) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                 (Just (1)) (Just (2)) (Just (3)) (Just (4)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                 (Just (1)) (Just (2)) (Just (3)) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                 (Just (1)) (Just (2)) (Nothing) (Just (4)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                  (Just (1)) (Nothing) (Just (3)) (Just (4)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                  (Nothing) (Just (2)) (Just (3)) (Just (4)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                  (Just (1)) (Just (2)) (Nothing) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                  (Just (1)) (Nothing) (Just (3)) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                  (Nothing) (Just (2)) (Just (3)) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                  (Just (1)) (Nothing) (Nothing) (Just (4)) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                  (Nothing) (Just (2)) (Nothing) (Just (4)) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                  (Nothing) (Nothing) (Nothing) (Just (4)) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                  (Nothing) (Nothing) (Just (3)) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                  (Nothing) (Nothing) (Just (3)) (Just (4)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                  (Just (1)) (Nothing) (Nothing) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                  (Just (1)) (Nothing) (Nothing) (Just (4)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                  (Just (1)) (Just (2)) (Nothing) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                  (Just (1)) (Nothing) (Just (3)) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                  (Nothing) (Just (2)) (Just (3)) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                  (Nothing) (Just (2)) (Nothing) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                  (Just (1)) (Nothing) (Nothing) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                  (Nothing) (Just (2)) (Nothing) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                  (Nothing) (Nothing) (Just (3)) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                  (Nothing) (Nothing) (Nothing) (Just (4)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                  (Nothing) (Nothing) (Nothing) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 ((x: number) => (y: number) => (z: number) => (a: number) => (b: number) =>
                    x + y + z + a + b)
                  (Nothing) (Nothing) (Nothing) (Nothing) (Nothing)
  )
    .toEqual (Nothing)
})

// FOLDABLE

test ("foldr", () => {
  expect (Maybe.foldr ((x: number) => (acc: number) => x * 2 + acc) (2) (Just (3)))
    .toEqual (8)
  expect (Maybe.foldr ((x: number) => (acc: number) => x * 2 + acc) (2) (Nothing))
    .toEqual (2)
})

test ("foldl", () => {
  expect (Maybe.foldl ((acc: number) => (x: number) => x * 2 + acc) (2) (Just (3)))
    .toEqual (8)
  expect (Maybe.foldl ((acc: number) => (x: number) => x * 2 + acc) (2) (Nothing))
    .toEqual (2)
})

test ("toList", () => {
  expect (Maybe.toList (Just (3)))
    .toEqual (List (3))
  expect (Maybe.toList (Nothing))
    .toEqual (List ())
})

test ("fnull", () => {
  expect (Maybe.fnull (Just (3)))
    .toEqual (false)
  expect (Maybe.fnull (Nothing))
    .toEqual (true)
})

test ("flength", () => {
  expect (Maybe.flength (Just (3)))
    .toEqual (1)
  expect (Maybe.flength (Nothing))
    .toEqual (0)
})

test ("elem", () => {
  expect (Maybe.elem (3) (Nothing))
    .toBeFalsy ()
  expect (Maybe.elem (3) (Just (2)))
    .toBeFalsy ()
  expect (Maybe.elem (3) (Just (3)))
    .toBeTruthy ()
})

test ("elemF", () => {
  expect (Maybe.elemF (Nothing) (3))
    .toBeFalsy ()
  expect (Maybe.elemF (Just (2)) (3))
    .toBeFalsy ()
  expect (Maybe.elemF (Just (3)) (3))
    .toBeTruthy ()
})

test ("sum", () => {
  expect (Maybe.sum (Just (3)))
    .toEqual (3)
  expect (Maybe.sum (Nothing))
    .toEqual (0)
})

test ("product", () => {
  expect (Maybe.product (Just (3)))
    .toEqual (3)
  expect (Maybe.product (Nothing))
    .toEqual (1)
})

test ("concat", () => {
  expect (Maybe.concat (Just (List (1, 2, 3))))
    .toEqual (List (1, 2, 3))
  expect (Maybe.concat (Nothing))
    .toEqual (List ())
})

test ("concatMap", () => {
  expect (Maybe.concatMap ((e: number) => List (e, e)) (Just (3)))
    .toEqual (List (3, 3))
  expect (Maybe.concatMap ((e: number) => List (e, e)) (Nothing))
    .toEqual (List ())
})

test ("and", () => {
  expect (Maybe.and (Just (true)))
    .toEqual (true)
  expect (Maybe.and (Just (false)))
    .toEqual (false)
  expect (Maybe.and (Nothing))
    .toEqual (true)
})

test ("or", () => {
  expect (Maybe.or (Just (true)))
    .toEqual (true)
  expect (Maybe.or (Just (false)))
    .toEqual (false)
  expect (Maybe.or (Nothing))
    .toEqual (false)
})

test ("any", () => {
  expect (Maybe.any ((e: number) => e > 3) (Just (5)))
    .toEqual (true)
  expect (Maybe.any ((e: number) => e > 3) (Just (3)))
    .toEqual (false)
  expect (Maybe.any ((e: number) => e > 3) (Nothing))
    .toEqual (false)
})

test ("all", () => {
  expect (Maybe.all ((e: number) => e > 3) (Just (5)))
    .toEqual (true)
  expect (Maybe.all ((e: number) => e > 3) (Just (3)))
    .toEqual (false)
  expect (Maybe.all ((e: number) => e > 3) (Nothing))
    .toEqual (true)
})

test ("notElem", () => {
  expect (Maybe.notElem (3) (Nothing))
    .toBeTruthy ()
  expect (Maybe.notElem (3) (Just (2)))
    .toBeTruthy ()
  expect (Maybe.notElem (3) (Just (3)))
    .toBeFalsy ()
})

test ("find", () => {
  expect (Maybe.find ((e: number) => e > 3) (Just (5)))
    .toEqual (Just (5))
  expect (Maybe.find ((e: number) => e > 3) (Just (3)))
    .toEqual (Nothing)
  expect (Maybe.find ((e: number) => e > 3) (Nothing))
    .toEqual (Nothing)
})

// ORD

test ("gt", () => {
  expect (Maybe.gt (Just (1)) (Just (2)))
    .toBeTruthy ()
  expect (Maybe.gt (Just (1)) (Just (1)))
    .toBeFalsy ()
  expect (Maybe.gt (Just (1)) (Nothing))
    .toBeFalsy ()
  expect (Maybe.gt (Nothing) (Just (2)))
    .toBeFalsy ()
  expect (Maybe.gt (Nothing) (Nothing))
    .toBeFalsy ()
})

test ("lt", () => {
  expect (Maybe.lt (Just (3)) (Just (2)))
    .toBeTruthy ()
  expect (Maybe.lt (Just (1)) (Just (1)))
    .toBeFalsy ()
  expect (Maybe.lt (Just (3)) (Nothing))
    .toBeFalsy ()
  expect (Maybe.lt (Nothing) (Just (2)))
    .toBeFalsy ()
  expect (Maybe.lt (Nothing) (Nothing))
    .toBeFalsy ()
})

test ("gte", () => {
  expect (Maybe.gte (Just (1)) (Just (2)))
    .toBeTruthy ()
  expect (Maybe.gte (Just (2)) (Just (2)))
    .toBeTruthy ()
  expect (Maybe.gte (Just (2)) (Just (1)))
    .toBeFalsy ()
  expect (Maybe.gte (Just (1)) (Nothing))
    .toBeFalsy ()
  expect (Maybe.gte (Just (2)) (Nothing))
    .toBeFalsy ()
  expect (Maybe.gte (Nothing) (Just (2)))
    .toBeFalsy ()
  expect (Maybe.gte (Nothing) (Nothing))
    .toBeFalsy ()
})

test ("lte", () => {
  expect (Maybe.lte (Just (3)) (Just (2)))
    .toBeTruthy ()
  expect (Maybe.lte (Just (2)) (Just (2)))
    .toBeTruthy ()
  expect (Maybe.lte (Just (2)) (Just (3)))
    .toBeFalsy ()
  expect (Maybe.lte (Just (3)) (Nothing))
    .toBeFalsy ()
  expect (Maybe.lte (Just (2)) (Nothing))
    .toBeFalsy ()
  expect (Maybe.lte (Nothing) (Just (2)))
    .toBeFalsy ()
  expect (Maybe.lte (Nothing) (Nothing))
    .toBeFalsy ()
})

// SEMIGROUP

// test('mappend', () => {
//   expect(Just (List(3)).mappend(Just (List(2))))
//     .toEqual(Just (List(3, 2)))
//   expect(Just (List(3)).mappend(Nothing))
//     .toEqual(Just (List(3)))
//   expect(Nothing.mappend(Just (List(2))))
//     .toEqual(Nothing)
//   expect(Nothing.mappend(Nothing))
//     .toEqual(Nothing)
// })

// MAYBE FUNCTIONS (PART 2)

test ("maybe", () => {
  expect (Maybe.maybe (0) ((x: number) => x * 2) (Just (3)))
    .toEqual (6)
  expect (Maybe.maybe (0) ((x: number) => x * 2) (Nothing))
    .toEqual (0)
})

test ("listToMaybe", () => {
  expect (Maybe.listToMaybe (List (3)))
    .toEqual (Just (3))
  expect (Maybe.listToMaybe (List ()))
    .toEqual (Nothing)
})

test ("maybeToList", () => {
  expect (Maybe.maybeToList (Just (3)))
    .toEqual (List (3))
  expect (Maybe.maybeToList (Nothing))
    .toEqual (List ())
})

test ("catMaybes", () => {
  expect (Maybe.catMaybes (List<Maybe<number>> (Just (3), Just (2), Nothing, Just (1))))
    .toEqual (List (3, 2, 1))
})

test ("mapMaybe", () => {
  expect (Maybe.mapMaybe (Maybe.ensure ((x: number) => x > 2)) (List (1, 2, 3, 4, 5)))
    .toEqual (List (3, 4, 5))
})

// CUSTOM MAYBE FUNCTIONS

test ("isMaybe", () => {
  expect (Maybe.isMaybe (4)) .toEqual (false)
  expect (Maybe.isMaybe (Just (4))) .toEqual (true)
  expect (Maybe.isMaybe (Nothing)) .toEqual (true)
})

test ("normalize", () => {
  expect (Maybe.normalize (4)) .toEqual (Just (4))
  expect (Maybe.normalize (Just (4))) .toEqual (Just (4))
  expect (Maybe.normalize (Nothing)) .toEqual (Nothing)
  expect (Maybe.normalize (undefined)) .toEqual (Nothing)
  expect (Maybe.normalize (null)) .toEqual (Nothing)
})

test ("ensure", () => {
  expect (Maybe.ensure ((x: number) => x > 2) (3))
    .toEqual (Just (3))
  expect (Maybe.ensure ((x: number) => x > 3) (3))
    .toEqual (Nothing)
})

test ("imapMaybe", () => {
  expect (Maybe.imapMaybe (i => (e: number) => fmap (add (i))
                                                    (Maybe.ensure ((x: number) => x > 2) (e)))
                          (List (1, 2, 3, 4, 5)))
    .toEqual (List (5, 7, 9))
})

test ("maybeToNullable", () => {
  const element = React.createElement ("div")
  expect (Maybe.maybeToNullable (Nothing)) .toEqual (null)
  expect (Maybe.maybeToNullable (Just (element))) .toEqual (element)
})

test ("maybeToUndefined", () => {
  const element = React.createElement ("div")
  expect (Maybe.maybeToUndefined (Nothing)) .toEqual (undefined)
  expect (Maybe.maybeToUndefined (Just (element))) .toEqual (element)
})

test ("maybe_", () => {
  expect (Maybe.maybe_ (() => 0) ((x: number) => x * 2) (Just (3)))
    .toEqual (6)
  expect (Maybe.maybe_ (() => 0) ((x: number) => x * 2) (Nothing))
    .toEqual (0)
})

test ("joinMaybeList", () => {
  expect (Maybe.joinMaybeList (Just (List (1, 2, 3))))
    .toEqual (List (1, 2, 3))
  expect (Maybe.joinMaybeList (Nothing))
    .toEqual (List ())
})

test ("guardReplace", () => {
  expect (Maybe.guardReplace (true) (3))
    .toEqual (Just (3))
  expect (Maybe.guardReplace (false) (3))
    .toEqual (Nothing)
})

test ("orN", () => {
  expect (Maybe.orN (true)) .toEqual (true)
  expect (Maybe.orN (false)) .toEqual (false)
  expect (Maybe.orN (undefined)) .toEqual (false)
})
