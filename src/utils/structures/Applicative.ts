/**
 * @module Applicative
 *
 * Provides generalized functions on the `Applicative` typeclass for data
 * structures, e.g. `Maybe` or `List`.
 *
 * @author Lukas Obermann
 */

import { Either, isEither, isRight, Right } from './Either';
import { fmap } from './Functor';
import { fromElements, isList, List } from './List.new';
import { isJust, isMaybe, Just, Maybe, Some } from './Maybe.new';
import { show } from './Show';

type ApplicativeType = 'Either' | 'List' | 'Maybe';

interface pure {
  /**
   * `pure :: a -> Either e a`
   *
   * Lift a value.
   */
  <A extends Some> (type: 'Either'): (x: A) => Either<any, A>;

  /**
   * `pure :: a -> [a]`
   *
   * Lift a value.
   */
  <A extends Some> (type: 'List'): (x: A) => List<A>;

  /**
   * `pure :: a -> Maybe a`
   *
   * Lift a value.
   */
  <A extends Some> (type: 'Maybe'): (x: A) => (m2: Maybe<A>) => Maybe<A>;
}

/**
 * `pure :: a -> m a`
 *
 * Lift a value.
 */
export const pure: pure = <A>(type: ApplicativeType) => (x: A): any => {
  if (type === 'Either') {
    return Right (x);
  }

  if (type === 'List') {
    return fromElements (x);
  }

  if (type === 'Maybe') {
    if (x !== null && x !== undefined) {
      return Just (x);
    }

    throw new TypeError (`Cannot create a Just from a nullable value.`);
  }

  throw new TypeError (`${type} is not an Applicative.`);
};

interface ap {
  /**
   * `(<*>) :: Either e (a -> b) -> Either e a -> Either e b`
   *
   * Sequential application.
   */
  <E extends Some, A extends Some, B extends Some>
  (ma: Either<E, (value: A) => B>): (m: Either<E, A>) => Either<E, B>;

  /**
   * `(<*>) :: [a -> b] -> [a] -> [b]`
   *
   * Sequential application.
   */
  <A extends Some, B extends Some>(ma: List<(value: A) => B>): (m: List<A>) => List<B>;

  /**
   * `(<*>) :: Maybe (a -> b) -> Maybe a -> Maybe b`
   *
   * Sequential application.
   */
  <A extends Some, B extends Some>(ma: Maybe<(value: A) => B>): (m: Maybe<A>) => Maybe<B>;
}

/**
 * `(<*>) :: f (a -> b) -> f a -> f b`
 *
 * Sequential application.
 */
export const ap: ap =
  <A extends Some, B extends Some> (ma: any) => (m: any): any => {
    if (isMaybe (ma) && isMaybe (m)) {
      return isJust (ma) ? fmap (ma .value) (m as any) : ma;
    }

    if (isEither (ma) && isEither (m)) {
      return isRight (ma) ? fmap<A, B> (ma .value as any) (m as any) : ma;
    }

    if (isList (ma) && isList (m)) {
      return fromElements (
        ...(ma .value .reduce<ReadonlyArray<B>> (
          (acc, f) => [...acc, ...(m .value .map (f) as ReadonlyArray<any>)],
          []
        ))
      );
    }

    throw new TypeError (
      `${show (ma)} or ${show (m)} is not an Applicative or they are not of the same type.`
    );
  };
