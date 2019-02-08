/**
 * @module Data.Either
 *
 * The `Either` type represents values with two possibilities: a value of type
 * `Either a b` is either `Left a` or `Right b`.
 *
 * The `Either` type is sometimes used to represent a value which is either
 * correct or an error by convention, the `Left` constructor is used to hold an
 * error value and the `Right` constructor is used to hold a correct value
 * (mnemonic: "right" also means "correct").
 *
 * @author Lukas Obermann
 */

import { empty } from "../Control/Applicative";
import { foldr } from "./Foldable";
import { cons, consF, List } from "./List";
import { fromJust, isJust, Just, Maybe, Nothing } from "./Maybe";
import { fromBoth, Pair } from "./Pair";


// EITHER TYPE DEFINITION

export type Either<A, B> = Left<A> | Right<B>


// PROTOTYPES

// Left

interface LeftPrototype {
  readonly isLeft: true
  readonly isRight: false
}

const LeftPrototype =
  Object.freeze<LeftPrototype> ({
    isLeft: true,
    isRight: false,
  })

// Right

interface RightPrototype {
  readonly isLeft: false
  readonly isRight: true
}

const RightPrototype: RightPrototype =
  Object.freeze<RightPrototype> ({
    isLeft: false,
    isRight: true,
  })


// CONSTRUCTORS

// Left

export interface Left<A> extends LeftPrototype {
  readonly value: A
}

/**
 * `Left :: a -> Either a b`
 *
 * Creates a new `Left` from the passed value.
 */
export const Left =
  <A>
  (x: A): Left<A> =>
    Object.create (
      LeftPrototype,
      {
        value: {
          value: x,
          enumerable: true,
        },
      }
    )

// Right

export interface Right<B> extends RightPrototype {
  readonly value: B
  readonly prototype: RightPrototype
}

/**
 * `Right :: b -> Either a b`
 *
 * Creates a new `Right` from the passed value.
 */
export const Right =
  <B>
  (x: B): Right<B> =>
    Object.create (
      RightPrototype,
      {
        value: {
          value: x,
          enumerable: true,
        },
      }
    )


// @module Data.Either.Extra
//
// This module extends `Data.Either` with extra operations, particularly to
// quickly extract from inside an `Either`. Some of these operations are
// partial, and should be used with care in production-quality code.
//
// @author Lukas Obermann
// @see Data.Either

/**
 * `fromLeft :: a -> Either a b -> a`
 *
 * Return the contents of a `Left`-value or a default value otherwise.
 *
 * `fromLeft 1 (Left 3) == 3`
 * `fromLeft 1 (Right "foo") == 1`
 */
export const fromLeft =
  <A>
  (def: A) =>
  (x: Either<A, any>): A =>
    isLeft (x) ? x .value : def

/**
 * `fromRight :: b -> Either a b -> b`
 *
 *
 * Return the contents of a `Right`-value or a default value otherwise.
 *
 * `fromRight 1 (Right 3) == 3`
 * `fromRight 1 (Left "foo") == 1`
 */
export const fromRight =
  <B>
  (def: B) =>
  (x: Either<any, B>): B =>
    isRight (x) ? x .value : def

/**
 * `fromEither :: Either a a -> a`
 *
 * Pull the value out of an `Either` where both alternatives have the same type.
 *
 * `\x -> fromEither (Left x ) == x`
 * `\x -> fromEither (Right x) == x`
 */
export const fromEither =
  <A>
  (x: Either<A, A>): A =>
    isRight (x) ? x .value : x .value

/**
 * `fromLeft' :: Either l r -> l`
 *
 * The `fromLeft'` function extracts the element out of a `Left` and throws an
 * error if its argument is `Right`. Much like `fromJust`, using this function
 * in polished code is usually a bad idea.
 *
 * `\x -> fromLeft' (Left  x) == x`
 * `\x -> fromLeft' (Right x) == undefined`
 *
 * @throws TypeError
 */
export const fromLeft_ =
  <L>
  (x: Left<L>): L => {
    if (isLeft (x)) {
      return x .value
    }

    throw new TypeError (`Cannot extract a Left value out of ${x}.`)
  }

/**
 * `fromRight' :: Either l r -> r`
 *
 * The `fromRight'` function extracts the element out of a `Right` and throws an
 * error if its argument is `Left`. Much like `fromJust`, using this function
 * in polished code is usually a bad idea.
 *
 * `\x -> fromRight' (Right x) == x`
 * `\x -> fromRight' (Left  x) == undefined`
 *
 * @throws TypeError
 */
export const fromRight_ =
  <R>
  (x: Right<R>): R => {
    if (isRight (x)) {
      return x .value
    }

    throw new TypeError (`Cannot extract a Right value out of ${x}.`)
  }

/**
 * `eitherToMaybe :: Either a b -> Maybe b`
 *
 * Given an `Either`, convert it to a `Maybe`, where `Left` becomes `Nothing`.
 *
 * `\x -> eitherToMaybe (Left x) == Nothing`
 * `\x -> eitherToMaybe (Right x) == Just x`
 */
export const eitherToMaybe =
  <B>
  (x: Either<any, B>): Maybe<B> =>
    isRight (x) ? Just (x .value) : Nothing

/**
 * `maybeToEither :: a -> Maybe b -> Either a b`
 *
 * Given a `Maybe`, convert it to an `Either`, providing a suitable value for
 * the `Left` should the value be `Nothing`.
 *
 * `\a b -> maybeToEither a (Just b) == Right b`
 * `\a -> maybeToEither a Nothing == Left a`
 */
export const maybeToEither =
  <A>
  (left: A) =>
  <B> (x: Maybe<B>): Either<A, B> =>
    isJust (x) ? Right (fromJust (x)) : Left (left)

/**
 * `maybeToEither' :: (() -> a) -> Maybe b -> Either a b`
 *
 * Given a `Maybe`, convert it to an `Either`, providing a suitable value for
 * the `Left` should the value be `Nothing`.
 *
 * `\a b -> maybeToEither a (Just b) == Right b`
 * `\a -> maybeToEither a Nothing == Left a`
 *
 * Lazy version of `maybeToEither`.
 */
export const maybeToEither_ =
  <A>
  (left: () => A) =>
  <B>
  (x: Maybe<B>): Either<A, B> =>
    isJust (x) ? Right (fromJust (x)) : Left (left ())


// EITHER FUNCTIONS (PART 1)

/**
 * `isLeft :: Either a b -> Bool`
 *
 * Return `True` if the given value is a `Left`-value, `False` otherwise.
 */
export const isLeft =
  <A, B> (x: Either<A, B>): x is Left<A> =>
    Object.getPrototypeOf (x) === LeftPrototype

/**
* `isRight :: Either a b -> Bool`
*
* Return `True` if the given value is a `Right`-value, `False` otherwise.
*/
export const isRight =
  <A, B> (x: Either<A, B>): x is Right<B> =>
    Object.getPrototypeOf (x) === RightPrototype


// BIFUNCTOR

/**
 * `bimap :: (a -> b) -> (c -> d) -> Either a c -> Either b d`
 */
export const bimap =
  <A, B, C, D>
  (fLeft: (l: A) => B) =>
  (fRight: (r: C) => D) =>
  (x: Either<A, C>): Either<B, D> =>
    isRight (x)
      ? Right (fRight (x .value))
      : Left (fLeft (x .value))

/**
 * `first :: (a -> b) -> Either a c -> Either b c`
 */
export const first =
  <A, B, C>
  (f: (l: A) => B) =>
  (x: Either<A, C>): Either<B, C> =>
    isLeft (x)
      ? Left (f (x .value))
      : x

/**
 * `second :: (b -> c) -> Either a b -> Either a c`
 */
export const second =
  <A, B, C>
  (f: (r: B) => C) =>
  (x: Either<A, B>): Either<A, C> =>
    isRight (x)
      ? Right (f (x .value))
      : x


// ORD

/**
 * `(>) :: Either a b -> Either a b -> Bool`
 *
 * Returns if the *second* value is greater than the first value.
 *
 * If the second value is a `Right` and the first is a `Left`, `(>)` always
 * returns `True`.
 *
 * If the second value is a `Left` and the first is a `Right`, `(>)` always
 * returns `False`.
 */
export const gt =
  <A extends number | string, B extends number | string>
  (m1: Either<A, B>) =>
  (m2: Either<A, B>): boolean =>
    isRight (m2) && isLeft (m1)
    || isRight (m1) && isRight (m2) && m2 .value > m1 .value
    || isLeft (m1) && isLeft (m2) && m2 .value > m1 .value

/**
 * `(<) :: Either a b -> Either a b -> Bool`
 *
 * Returns if the *second* value is lower than the first value.
 *
 * If the second value is a `Left` and the first is a `Right`, `(<)` always
 * returns `True`.
 *
 * If the second value is a `Right` and the first is a `Left`, `(<)` always
 * returns `False`.
 */
export const lt =
  <A extends number | string, B extends number | string>
  (m1: Either<A, B>) =>
  (m2: Either<A, B>): boolean =>
    isLeft (m2) && isRight (m1)
    || isRight (m1) && isRight (m2) && m2 .value < m1 .value
    || isLeft (m1) && isLeft (m2) && m2 .value < m1 .value

/**
 * `(>=) :: Either a b -> Either a b -> Bool`
 *
 * Returns if the *second* value is greater than or equals the first
 * value.
 *
 * If the second value is a `Right` and the first is a `Left`, `(>=)` always
 * returns `True`.
 *
 * If the second value is a `Left` and the first is a `Right`, `(>=)` always
 * returns `False`.
 */
export const gte =
  <A extends number | string, B extends number | string>
  (m1: Either<A, B>) =>
  (m2: Either<A, B>): boolean =>
    isRight (m2) && isLeft (m1)
    || isRight (m1) && isRight (m2) && m2 .value >= m1 .value
    || isLeft (m1) && isLeft (m2) && m2 .value >= m1 .value

/**
 * `(<=) :: Either a b -> Either a b -> Bool`
 *
 * Returns if the *second* value is lower than or equals the second
 * value.
 *
 * If the second value is a `Left` and the first is a `Right`, `(<=)` always
 * returns `True`.
 *
 * If the second value is a `Right` and the first is a `Left`, `(<=)` always
 * returns `False`.
 */
export const lte =
  <A extends number | string, B extends number | string>
  (m1: Either<A, B>) =>
  (m2: Either<A, B>): boolean =>
    isLeft (m2) && isRight (m1)
    || isRight (m1) && isRight (m2) && m2 .value <= m1 .value
    || isLeft (m1) && isLeft (m2) && m2 .value <= m1 .value


// EITHER FUNCTIONS (PART 2)

/**
 * `either :: (a -> c) -> (b -> c) -> Either a b -> c`
 *
 * Case analysis for the `Either` type. If the value is `Left a`, apply the
 * first function to `a` if it is `Right b`, apply the second function to `b`.
 */
export const either =
  <A, B, C>
  (fLeft: (l: A) => C) =>
  (fRight: (r: B) => C) =>
  (x: Either<A, B>): C =>
    isRight (x) ? fRight (x .value) : fLeft (x .value)

/**
 * `lefts :: [Either a b] -> [a]`
 *
 * Extracts from a list of `Either` all the `Left` elements. All the `Left`
 * elements are extracted in order.
 */
export const lefts =
  <A, B> (xs: List<Either<A, B>>): List<A> =>
    foldr<Either<A, B>, List<A>> (x => acc => isLeft (x)
                                               ? cons (acc) (x .value)
                                               : acc)
                                 (empty ("List"))
                                 (xs)

/**
 * `rights :: [Either a b] -> [b]`
 *
 * Extracts from a list of `Either` all the `Right` elements. All the `Right`
 * elements are extracted in order.
 */
export const rights =
  <A, B> (xs: List<Either<A, B>>): List<B> =>
    foldr<Either<A, B>, List<B>> (x => acc => isRight (x)
                                              ? cons (acc) (x .value)
                                              : acc)
                                 (empty ("List"))
                                 (xs)

/**
 * `partitionEithers :: [Either a b] -> ([a], [b])`
 *
 * Partitions a list of `Either` into two lists. All the `Left` elements are
 * extracted, in order, to the first component of the output. Similarly the
 * `Right` elements are extracted to the second component of the output.
 */
export const partitionEithers =
  <A, B> (xs: List<Either<A, B>>): Pair<List<A>, List<B>> =>
    foldr<Either<A, B>, Pair<List<A>, List<B>>>
      (x => isRight (x)
            ? Pair.second (consF (x .value))
            : Pair.first (consF (x .value)))
      (fromBoth<List<A>, List<B>> (empty ("List")) (empty ("List")))
      (xs)


// CUSTOM EITHER FUNCTIONS

/**
 * `isEither :: a -> Bool`
 *
 * Return `True` if the given value is an `Either`.
 */
export const isEither =
  (x: any): x is Either<any, any> =>
    typeof x === "object" && x !== null && (isLeft (x) || isRight (x))


// TYPE HELPERS

export type LeftI<A> = A extends Left<infer I> ? I : never
export type RightI<A> = A extends Right<infer I> ? I : never


// NAMESPACED FUNCTIONS

export const Either = {
  Left,
  Right,

  fromLeft,
  fromRight,
  fromEither,
  fromLeft_,
  fromRight_,
  eitherToMaybe,
  maybeToEither,
  maybeToEither_,

  bimap,
  first,
  second,

  gt,
  lt,
  gte,
  lte,

  isLeft,
  isRight,
  either,
  lefts,
  rights,
  partitionEithers,

  isEither,
}
