/**
 * @module Functor
 *
 * Provides generalized functions on the `Functor` typeclass for data
 * structures, e.g. `Maybe` or `List`.
 *
 * @author Lukas Obermann
 */

import { cnst } from './combinators';
import { Either, isEither, isRight, Right } from './Either';
import { fromArray, isList, List } from './List.new';
import { isJust, isMaybe, Just, Maybe, Some } from './Maybe.new';
import { show } from './Show';

interface fmap {
  /**
   * `fmap :: (a0 -> b) -> Either a a0 -> Either a b`
   */
  <A extends Some, A0 extends Some, B extends Some>
  (f: (value: A0) => B): (m: Either<A, A0>) => Either<A, B>;

  /**
   * `fmap :: Functor => (a -> b) -> f a -> f b`
   */
  <A extends Some, B extends Some> (f: (value: A) => B): fmap_<A, B>;
}

interface fmap_<A extends Some, B extends Some> {
  (m: List<A>): List<B>;
  (m: Maybe<A>): Maybe<B>;
}

/**
 * `fmap :: Functor => (a -> b) -> f a -> f b`
 */
export const fmap: fmap =
  <A extends Some, B extends Some> (f: (value: A) => B) => (x: any): any => {
    if (isMaybe (x)) {
      return isJust (x) ? Just (f (x .value)) : x;
    }

    if (isEither (x)) {
      return isRight (x) ? Right (f (x .value)) : x;
    }

    if (isList (x)) {
      return fromArray (x .value .map (f));
    }

    throw new TypeError (`${show (x)} is no Functor.`);
  };

interface mapReplace {
  /**
   * `(<$) :: a0 -> Either a b -> Either a a0`
   *
   * Replace all locations in the input with the same value. The default
   * definition is `fmap . const`, but this may be overridden with a more
   * efficient version.
   */
  <A extends Some, A0 extends Some> (x: A0): (m: Either<A, any>) => Either<A, A0>;

  /**
   * `(<$) :: Functor f => a -> f b -> f a`
   *
   * Replace all locations in the input with the same value. The default
   * definition is `fmap . const`, but this may be overridden with a more
   * efficient version.
   */
  <A extends Some> (x: A): mapReplace_<A>;
}

interface mapReplace_<A extends Some> {
  (m: List<any>): List<A>;
  (m: Maybe<Some>): Maybe<A>;
}


/**
 * `(<$) :: Functor f => a -> f b -> f a`
 *
 * Replace all locations in the input with the same value. The default
 * definition is `fmap . const`, but this may be overridden with a more
 * efficient version.
 */
export const mapReplace: mapReplace =
  <A extends Some, B extends Some> (x: A) => fmap<B, A> (cnst (x)) as any;
