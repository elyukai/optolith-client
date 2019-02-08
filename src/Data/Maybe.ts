/**
 * @module Data.Maybe
 *
 * The `Maybe` type encapsulates an optional value. A value of type `Maybe a`
 * either contains a value of type `a` (represented as `Just a`), or it is empty
 * (represented as `Nothing`). Using `Maybe` is a good way to deal with errors
 * or exceptional cases without resorting to drastic measures such as `error`.
 *
 * The `Maybe` type is also a monad. It is a simple kind of error monad, where
 * all errors are represented by `Nothing`. A richer error monad can be built
 * using the `Either` type.
 *
 * @author Lukas Obermann
 * @see Either
 */

import { pipe } from "ramda";
import * as Math from "../App/Utils/mathUtils";
import { empty } from "../Control/Applicative";
import { bind, liftM2 } from "../Control/Monad";
import { fnull, foldl, foldr, toList } from "./Foldable";
import { ident } from "./Function";
import { cons, consF, head, ifoldr, List } from "./List";


// MAYBE TYPE DEFINITION

export type Maybe<A extends Some> = Just<A> | Nothing


// CONSTRUCTORS

// Just

interface JustPrototype {
  readonly isJust: true
  readonly isNothing: false
}

export interface Just<A extends Some> extends JustPrototype {
  readonly value: A
}

const JustPrototype =
  Object.freeze<JustPrototype> ({
    isJust: true,
    isNothing: false,
  })

/**
 * `Just :: a -> Maybe a`
 *
 * Creates a new `Just` from the passed value.
 */
export const Just = <A extends Some> (x: A): Just<A> => {
  if (x !== null && x !== undefined) {
    return Object.create (
      JustPrototype,
      {
        value: {
          value: x,
          enumerable: true,
        },
      }
    )
  }

  throw new TypeError ("Cannot create a Just from a nullable value.")
}

// Nothing

interface NothingPrototype extends Object {
  readonly isJust: false
  readonly isNothing: true
}

export interface Nothing extends NothingPrototype { }

const NothingPrototype: NothingPrototype =
  Object.freeze<NothingPrototype> ({
    isJust: false,
    isNothing: true,
  })

/**
 * `Nothing :: Maybe a`
 *
 * The empty `Maybe`.
 */
export const Nothing: Nothing = Object.create (NothingPrototype)

/**
 * `fromNullable :: a -> Maybe a`
 *
 * Creates a new `Maybe` from the given nullable value.
 */
export const fromNullable =
  <A extends Some> (x: A | Nullable): Maybe<A> =>
    x !== null && x !== undefined ? Just (x) : Nothing


// MAYBE FUNCTIONS (PART 1)

/**
 * `isJust :: Maybe a -> Bool`
 *
 * The `isJust` function returns `true` if its argument is of the form
 * `Just _`.
 */
export const isJust =
  <A extends Some> (x: Maybe<A>): x is Just<A> =>
    Object.getPrototypeOf (x) === JustPrototype

/**
 * `isNothing :: Maybe a -> Bool`
 *
 * The `isNothing` function returns `true` if its argument is `Nothing`.
 */
export const isNothing = (x: Maybe<Some>): x is Nothing => x === Nothing

/**
 * `fromJust :: Maybe a -> a`
 *
 * The `fromJust` function extracts the element out of a `Just` and throws an
 * error if its argument is `Nothing`.
 *
 * @throws TypeError
 */
export const fromJust =
  <A extends Some> (x: Just<A>): A => {
    if (isJust (x)) {
      return x.value
    }

    throw new TypeError (`Cannot extract a value out of type Nothing.`)
  }

/**
 * `fromMaybe :: a -> Maybe a -> a`
 *
 * The `fromMaybe` function takes a default value and and `Maybe` value. If
 * the `Maybe` is `Nothing`, it returns the default values otherwise, it
 * returns the value contained in the `Maybe`.
 */
export const fromMaybe =
  <A extends Some> (def: A) => (x: Maybe<A>): A =>
    isJust (x) ? x .value : def

/**
 * `fromMaybe' :: (() -> a) -> Maybe a -> a`
 *
 * The `fromMaybe'` function takes a default value and and `Maybe` value. If
 * the `Maybe` is `Nothing`, it returns the default values otherwise, it
 * returns the value contained in the `Maybe`.
 *
 * Lazy version of `fromMaybe`.
 */
export const fromMaybe_ =
  <A extends Some> (def: () => A) => (x: Maybe<A>): A =>
    isJust (x) ? x .value : def ()


// ORD

/**
 * `(>) :: Maybe a -> Maybe a -> Bool`
 *
 * Returns if the *second* value is greater than the first value.
 *
 * If one of the values is `Nothing`, `(>)` always returns `false`.
 */
export const gt =
  (x: Maybe<number>) => (y: Maybe<number>): boolean =>
    fromMaybe (false) (liftM2 (Math.gt) (x) (y))

/**
 * `(<) :: Maybe a -> Maybe a -> Bool`
 *
 * Returns if the *second* value is lower than the first value.
 *
 * If one of the values is `Nothing`, `(<)` always returns `false`.
 */
export const lt =
  (x: Maybe<number>) => (y: Maybe<number>): boolean =>
    fromMaybe (false) (liftM2 (Math.lt) (x) (y))

/**
 * `(>=) :: Maybe a -> Maybe a -> Bool`
 *
 * Returns if the *second* value is greater than or equals the first
 * value.
 *
 * If one of the values is `Nothing`, `(>=)` always returns `false`.
 */
export const gte =
  (x: Maybe<number>) => (y: Maybe<number>): boolean =>
    fromMaybe (false) (liftM2 (Math.gte) (x) (y))

/**
 * `(<=) :: Maybe a -> Maybe a -> Bool`
 *
 * Returns if the *second* value is lower than or equals the first
 * value.
 *
 * If one of the values is `Nothing`, `(<=)` always returns `false`.
 */
export const lte =
  (x: Maybe<number>) => (y: Maybe<number>): boolean =>
    fromMaybe (false) (liftM2 (Math.lte) (x) (y))


// SEMIGROUP

/**
 * `mappend :: Semigroup a => Maybe a -> Maybe a -> Maybe a`
 *
 * Concatenates the `Semigroup`s contained in the two `Maybe`s, if both are of
 * type `Just a`. If at least one of them is `Nothing`, it returns the first
 * element.
 */
export const mappend =
  <A> (x: Maybe<List<A>>) => (y: Maybe<List<A>>): Maybe<List<A>> =>
    isJust (x) && isJust (y)
      ? Just (List.append (fromJust (x)) (fromJust (y)))
      : x


// MAYBE FUNCTIONS (PART 2)

/**
 * `maybe :: b -> (a -> b) -> Maybe a -> b`
 *
 * The `maybe` function takes a default value, a function, and a `Maybe`
 * value. If the `Maybe` value is `Nothing`, the function returns the default
 * value. Otherwise, it applies the function to the value inside the `Just`
 * and returns the result.
 */
export const maybe =
  <B extends Some> (def: B) =>
  <A extends Some> (f: (x: A) => B) =>
    foldl<A, B> (() => f) (def)

/**
 * `listToMaybe :: [a] -> Maybe a`
 *
 * The `listToMaybe` function returns `Nothing` on an empty list or `Just a`
 * where `a` is the first element of the list.
 */
export const listToMaybe =
  <A extends Some> (xs: List<A>): Maybe<A> =>
    fnull (xs) ? Nothing : Just (head (xs))

/**
 * `maybeToList :: Maybe a -> [a]`
 *
 * The `maybeToList` function returns an empty list when given `Nothing` or a
 * singleton list when not given `Nothing`.
 */
export const maybeToList = toList

/**
 * `catMaybes :: [Maybe a] -> [a]`
 *
 * The `catMaybes` function takes a list of `Maybe`s and returns a list of all
 * the `Just` values.
 */
export const catMaybes =
  <A extends Some>
  (xs: List<Maybe<A>>): List<A> =>
    foldr<Maybe<A>, List<A>> (maybe<(xs: List<A>) => List<A>> (ident)
                                                              (consF))
                             (empty ("List"))
                             (xs)

/**
 * `mapMaybe :: (a -> Maybe b) -> [a] -> [b]`
 *
 * The `mapMaybe` function is a version of `map` which can throw out elements.
 * If particular, the functional argument returns something of type `Maybe b`.
 * If this is `Nothing`, no element is added on to the result list. If it is
 * `Just b`, then `b` is included in the result list.
 */
export const mapMaybe =
  <A extends Some, B extends Some>
  (f: (x: A) => Maybe<B>) =>
    foldr<A, List<B>> (pipe (
                        f,
                        maybe<(xs: List<B>) => List<B>> (ident)
                                                        (consF)
                      ))
                      (empty ("List"))


// CUSTOM MAYBE FUNCTIONS

/**
 * `isMaybe :: a -> Bool`
 *
 * The `isMaybe` function returns `True` if its argument is a `Maybe`.
 */
export const isMaybe =
  (x: any): x is Maybe<any> =>
    typeof x === "object" && x !== null && (isJust (x) || isNothing (x))

/**
 * `normalize :: (a | Maybe a) -> Maybe a`
 *
 * Creates a new `Maybe` from the given nullable value. If the value is
 * already an instance of `Maybe`, it will just return the value.
 */
export const normalize =
  <A extends Some>
  (x: A | Nullable | Maybe<A>): Maybe<A> =>
    isMaybe (x) ? x : fromNullable (x)

interface Ensure {
  /**
   * `ensure :: (a -> Bool) -> a -> Maybe a`
   *
   * Creates a new `Just a` from the given value if the given predicate
   * evaluates to `True` and the given value is not nullable. Otherwise returns
   * `Nothing`.
   */
  <A extends Some, A1 extends A>
  (pred: (x: A) => x is A1):
  (x: A | Nullable) => Maybe<A1>

  /**
   * `ensure :: (a -> Bool) -> a -> Maybe a`
   *
   * Creates a new `Just a` from the given value if the given predicate
   * evaluates to `True` and the given value is not nullable. Otherwise returns
   * `Nothing`.
   */
  <A extends Some>
  (pred: (x: A) => boolean):
  (x: A | Nullable) => Maybe<A>
}

/**
 * `ensure :: (a -> Bool) -> a -> Maybe a`
 *
 * Creates a new `Just a` from the given value if the given predicate
 * evaluates to `True` and the given value is not nullable. Otherwise returns
 * `Nothing`.
 */
export const ensure: Ensure =
  <A extends Some>
  (pred: (x: A) => boolean) =>
  (x: A | Nullable): Maybe<A> =>
    bind<A> (fromNullable (x))
            (a => pred (a) ? Just (a) : Nothing)

/**
 * `imapMaybe :: (Int -> a -> Maybe b) -> [a] -> [b]`
 *
 * The `imapMaybe` function is a version of `map` which can throw out
 * elements. If particular, the functional argument returns something of type
 * `Maybe b`. If this is `Nothing`, no element is added on to the result list.
 * If it is `Just b`, then `b` is included in the result list.
 */
export const imapMaybe =
  <A extends Some, B extends Some>
  (f: (index: number) => (x: A) => Maybe<B>) =>
    ifoldr<A, List<B>>
      (index => x => acc =>
        pipe (
          f (index),
          maybe<List<B>> (acc)
                         (cons (acc)))
                         (x))
      (empty ("List"))

/**
 * `maybeToNullable :: Maybe a -> (a | Null)`
 *
 * The `maybeToNullable` function returns `null` when given `Nothing` or
 * returns the value inside the `Just`.
 */
export const maybeToNullable =
  <A extends Some>
  (x: Maybe<A>): A | null =>
    isJust (x) ? x .value : null

/**
 * `maybeToUndefined :: Maybe a -> (a | undefined)`
 *
 * The `maybeToUndefined` function returns `undefined` when given `Nothing` or
 * returns the value inside the `Just`.
 */
export const maybeToUndefined =
  <A extends Some>
  (x: Maybe<A>): A | undefined =>
    isJust (x) ? x .value : undefined

/**
 * `maybe' :: (() -> b) -> (a -> b) -> Maybe a -> b`
 *
 * The `maybe'` function takes a default value, a function, and a `Maybe`
 * value. If the `Maybe` value is `Nothing`, the function returns the default
 * value. Otherwise, it applies the function to the value inside the `Just`
 * and returns the result.
 *
 * This is a lazy variant of `maybe`.
 */
export const maybe_ =
  <B extends Some>
  (def: () => B) =>
    maybe<B> (def ())

export const INTERNAL_shallowEquals =
  <A extends Some>
  (x: Maybe<A>) =>
  (y: Maybe<A>) =>
    isNothing (x) && isNothing (y)
    || isJust (x) && isJust (y) && x .value === y .value


// NAMESPACED FUNCTIONS

export const Maybe = {
  Just,
  Nothing,
  fromNullable,

  isJust,
  isNothing,
  fromJust,
  fromMaybe,

  gt,
  lt,
  gte,
  lte,

  maybe,
  maybe_,
  listToMaybe,
  maybeToList,
  catMaybes,
  mapMaybe,

  isMaybe,
  normalize,
  ensure,
  imapMaybe,
  maybeToNullable,
  maybeToUndefined,
}


// TYPE HELPERS

export type MaybeContent<A> = A extends Maybe<infer AI> ? AI : never

// tslint:disable-next-line:interface-over-type-literal
export type Some = {}
export type Nullable = null | undefined
