/**
 * @module Monad
 *
 * Provides generalized functions on the `Monad` typeclass for data structures,
 * e.g. `Maybe` or `List`.
 *
 * @author Lukas Obermann
 */

import * as Either from './Either';
import * as List from './List.new';
import * as Maybe from './Maybe.new';

interface Bind {
  /**
   * `(>>=) :: Either e a -> (a -> Either e b) -> Either e b`
   */
  <E extends Maybe.Some, A extends Maybe.Some, B extends Maybe.Some>
  (m: Either.Either<E, A>): (f: (value: A) => Either.Either<E, B>) => Either.Either<E, B>;

  /**
   * `(>>=) :: [a] -> (a -> [b]) -> [b]`
   */
  <A extends Maybe.Some, B extends Maybe.Some>
  (m: List.List<A>): (f: (value: A) => List.List<B>) => List.List<B>;

  /**
   * `(>>=) :: Maybe a -> (a -> Maybe b) -> Maybe b`
   */
  <A extends Maybe.Some, B extends Maybe.Some>
  (m: Maybe.Maybe<A>): (f: (value: A) => Maybe.Maybe<B>) => Maybe.Maybe<B>;
}

/**
 * `(>>=) :: Monad m => m a -> (a -> m b) -> m b`
 */
export const bind: Bind =
  <A extends Maybe.Some, B extends Maybe.Some> (m: any) => (f: (value: A) => any): any => {
    if (Maybe.isMaybe (m)) {
      return Maybe.bind<A, B> (m) (f as (value: A) => Maybe.Maybe<B>);
    }

    if (Either.isEither (m)) {
      return Either.bind<any, A, B> (m) (f as (value: A) => Either.Either<any, B>);
    }

    return List.bind<A, B> (m as List.List<A>) (f as (value: A) => List.List<B>);
  };

// tslint:disable-next-line: class-name
interface Bind_ {
  /**
   * `(=<<) :: (a -> Either e b) -> Either e a -> Either e b`
   */
  <E extends Maybe.Some, A extends Maybe.Some, B extends Maybe.Some>
  (f: (value: A) => Either.Either<E, B>): (m: Either.Either<E, A>) => Either.Either<E, B>;

  /**
   * `(=<<) :: (a -> [b]) -> [a] -> [b]`
   */
  <A extends Maybe.Some, B extends Maybe.Some>
  (f: (value: A) => List.List<B>): (m: List.List<A>) => List.List<B>;

  /**
   * `(=<<) :: (a -> Maybe b) -> Maybe a -> Maybe b`
   */
  <A extends Maybe.Some, B extends Maybe.Some>
  (f: (value: A) => Maybe.Maybe<B>): (m: Maybe.Maybe<A>) => Maybe.Maybe<B>;
}

/**
 * `(=<<) :: Monad m => (a -> m b) -> m a -> m b`
 */
export const bind_: Bind_ =
  <A extends Maybe.Some, B extends Maybe.Some> (f: (value: A) => any) => (m: any): any => {
    if (Maybe.isMaybe (m)) {
      return Maybe.bind_<A, B> (f as (value: A) => Maybe.Maybe<B>) (m);
    }

    if (Either.isEither (m)) {
      return Either.bind_<any, A, B> (f as (value: A) => Either.Either<any, B>) (m);
    }

    return List.bind_<A, B> (f as (value: A) => List.List<B>) (m as List.List<A>);
  };

interface Then {
  /**
   * `(>>) :: Either e a -> Either e b -> Either e b`
   *
   * Sequentially compose two actions, discarding any value produced by the
   * first, like sequencing operators (such as the semicolon) in imperative
   * languages.
   *
   * ```a >> b = a >>= \ _ -> b```
   */
  <E extends Maybe.Some, A extends Maybe.Some>
  (m1: Either.Either<E, any>): (m2: Either.Either<E, A>) => Either.Either<E, A>;

  /**
   * `(>>) :: [a] -> [b] -> [b]`
   *
   * Sequentially compose two actions, discarding any value produced by the
   * first, like sequencing operators (such as the semicolon) in imperative
   * languages.
   *
   * ```a >> b = a >>= \ _ -> b```
   */
  <A extends Maybe.Some> (m1: List.List<any>): (m2: List.List<A>) => List.List<A>;

  /**
   * `(>>) :: Maybe a -> Maybe b -> Maybe b`
   *
   * Sequentially compose two actions, discarding any value produced by the
   * first, like sequencing operators (such as the semicolon) in imperative
   * languages.
   *
   * ```a >> b = a >>= \ _ -> b```
   */
  <A extends Maybe.Some> (m1: Maybe.Maybe<any>): (m2: Maybe.Maybe<A>) => Maybe.Maybe<A>;
}

/**
 * `(>>) :: Monad m => m a -> m b -> m b`
 *
 * Sequentially compose two actions, discarding any value produced by the
 * first, like sequencing operators (such as the semicolon) in imperative
 * languages.
 *
 * ```a >> b = a >>= \ _ -> b```
 */
export const then: Then =
  <A extends Maybe.Some> (m1: any) => (m2: any): any => {
    if (Maybe.isMaybe (m1)) {
      return Maybe.then<A> (m1) (m2 as Maybe.Maybe<A>);
    }

    if (Either.isEither (m1)) {
      return Either.then<any, A> (m1) (m2 as Either.Either<any, A>);
    }

    return List.then<A> (m1 as List.List<any>) (m2 as List.List<A>);
  };

interface Join {
  /**
   * `join :: [[a]] -> [a]`
   *
   * The `join` function is the conventional monad join operator. It is used to
   * remove one level of monadic structure, projecting its bound argument into the
   * outer level.
   */
  <A extends Maybe.Some> (m: List.List<List.List<A>>): List.List<A>;

  /**
   * `join :: Maybe (Maybe a) -> Maybe a`
   *
   * The `join` function is the conventional monad join operator. It is used to
   * remove one level of monadic structure, projecting its bound argument into the
   * outer level.
   */
  <A extends Maybe.Some> (m: Maybe.Maybe<Maybe.Maybe<A>>): Maybe.Maybe<A>;
}

/**
 * `join :: Monad m => m (m a) -> m a`
 *
 * The `join` function is the conventional monad join operator. It is used to
 * remove one level of monadic structure, projecting its bound argument into the
 * outer level.
 */
export const join: Join =
  <A extends Maybe.Some>(m: any): any => {
    if (Maybe.isMaybe (m)) {
      return Maybe.join<A> (m);
    }

    return List.join<A> (m as List.List<any>);
  };

// /**
//  * `liftM2 :: Monad m => (a1 -> a2 -> r) -> m a1 -> m a2 -> m r`
//  *
//  * Promote a function to a monad, scanning the monadic arguments from left to
//  * right.
//  */
// export const liftM2 =
//   <A1 extends Some, A2 extends Some, B extends Some>
//   (fn: (a1: A1) => (a2: A2) => B) =>
//   (m1: Maybe<A1>) =>
//   (m2: Maybe<A2>): Maybe<B> =>
//     bind<A1, B> (m1)
//                 (a1 => fmap<A2, B> (a2 => fn (a1) (a2))
//                                    (m2));

// /**
//  * `liftM3 :: Monad m => (a1 -> a2 -> a3 -> r) -> m a1 -> m a2 -> m a3 -> m r`
//  *
//  * Promote a function to a monad, scanning the monadic arguments from left to
//  * right.
//  */
// export const liftM3 =
//   <A1 extends Some, A2 extends Some, A3 extends Some, B extends Some>
//   (fn: (a1: A1) => (a2: A2) => (a3: A3) => B) =>
//   (m1: Maybe<A1>) =>
//   (m2: Maybe<A2>) =>
//   (m3: Maybe<A3>): Maybe<B> =>
//     bind<A1, B> (m1)
//                 (a1 => bind<A2, B> (m2)
//                                    (a2 => fmap<A3, B> (a3 => fn (a1) (a2) (a3))
//                                                (m3)));

// /**
//  * `liftM4 :: Monad m => (a1 -> a2 -> a3 -> a4 -> r) -> m a1 -> m a2 -> m a3 -> m a4 -> m r`
//  *
//  * Promote a function to a monad, scanning the monadic arguments from left to
//  * right.
//  */
// export const liftM4 =
//   <A1 extends Some, A2 extends Some, A3 extends Some, A4 extends Some, B extends Some>
//   (fn: (a1: A1) => (a2: A2) => (a3: A3) => (a4: A4) => B) =>
//   (m1: Maybe<A1>) =>
//   (m2: Maybe<A2>) =>
//   (m3: Maybe<A3>) =>
//   (m4: Maybe<A4>): Maybe<B> =>
//     bind<A1, B> (m1)
//                 (a1 => bind<A2, B> (m2)
//                                    (a2 => bind<A3, B> (m3)
//                                                       (a3 => fmap<A4, B> (a4 =>
//                                                                           fn (a1) (a2) (a3) (a4))
//                                                                          (m4))));
