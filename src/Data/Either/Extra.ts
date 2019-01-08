/**
 * @module Data.Either.Extra
 *
 * This module extends `Data.Either` with extra operations, particularly to
 * quickly extract from inside an `Either`. Some of these operations are
 * partial, and should be used with care in production-quality code.
 *
 * @author Lukas Obermann
 * @see Data.Either
 */

import { Either, isLeft, isRight, Left, Right } from "../Either";
import { fromJust, isJust, Just, Maybe, Nothing } from "../Maybe";


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
  <A, B>
  (left: A) =>
  (x: Maybe<B>): Either<A, B> =>
    isJust (x) ? Right (fromJust (x)) : Left (left)


// NAMESPACED FUNCTIONS

export const Extra = {
  fromLeft,
  fromRight,
  fromEither,
  fromLeft_,
  fromRight_,
  eitherToMaybe,
  maybeToEither,
}
