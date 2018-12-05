/**
 * @module Functor
 *
 * Provides generalized functions on the `Functor` typeclass for data
 * structures, e.g. `Maybe` or `List`.
 *
 * @author Lukas Obermann
 */

import * as Either from './either';
import * as List from './list2';
import * as Maybe from './maybe2';

interface Fmap {
  /**
   * `fmap :: (a -> b) -> Maybe a -> Maybe b`
   */
  <A extends Maybe.Some, B extends Maybe.Some>
  (f: (value: A) => B): (m: Maybe.Maybe<A>) => Maybe.Maybe<B>;
  /**
   * `fmap :: (a -> b) -> Either a a -> Either a b`
   */
  <A extends Maybe.Some, B extends Maybe.Some>
  (f: (value: A) => B): (m: Either.Either<A, A>) => Either.Either<A, B>;
  /**
   * `fmap :: (a -> b) -> [a] -> [b]`
   */
  <A extends Maybe.Some, B extends Maybe.Some>
  (f: (value: A) => B): (m: List.List<A>) => List.List<B>;
}

/**
 * `fmap :: Functor => (a -> b) -> f a -> f b`
 */
export const fmap: Fmap =
  <A extends Maybe.Some, B extends Maybe.Some> (f: (value: A) => B) => (x: any): any => {
    if (Maybe.isMaybe (x)) {
      return Maybe.fmap<A, B> (f) (x as Maybe.Maybe<A>);
    }

    if (Either.isEither (x)) {
      return Either.fmap<A, B> (f) (x as Either.Either<A, A>);
    }

    return List.fmap<A, B> (f) (x as List.List<A>);
  };
