/**
 * @module Monad
 *
 * Provides generalized functions on the `Monad` typeclass for data structures,
 * e.g. `Maybe` or `List`.
 *
 * @author Lukas Obermann
 */

import { pipe } from 'ramda';
import { id } from './combinators';
import { Either, isEither, isRight, Left, Right } from './Either';
import { fmap } from './Functor';
import { fromElements, isList, List, show } from './List.new';
import { isJust, isMaybe, Just, Maybe, Some } from './Maybe.new';

type MonadicType = 'Either' | 'List' | 'Maybe';

interface bind {
  /**
   * `(>>=) :: Either e a -> (a -> Either e b) -> Either e b`
   */
  <E extends Some, A extends Some, B extends Some>
  (m: Either<E, A>): (f: (value: A) => Either<E, B>) => Either<E, B>;

  /**
   * `(>>=) :: [a] -> (a -> [b]) -> [b]`
   */
  <A extends Some, B extends Some> (m: List<A>): (f: (value: A) => List<B>) => List<B>;

  /**
   * `(>>=) :: Maybe a -> (a -> Maybe b) -> Maybe b`
   */
  <A extends Some, B extends Some> (m: Maybe<A>): (f: (value: A) => Maybe<B>) => Maybe<B>;
}

/**
 * `(>>=) :: Monad m => m a -> (a -> m b) -> m b`
 */
export const bind: bind =
  <A extends Some, B extends Some> (x: any) => (f: (value: A) => any): any => {
    if (isMaybe (x)) {
      return isJust (x) ? f (x .value) : x;
    }

    if (isEither (x)) {
      return isRight (x) ? f (x .value) : x;
    }

    if (isList (x)) {
      return fromElements (
        ...(x .value .reduce<ReadonlyArray<B>> (
          (acc, e) => [...acc, ...f (e)],
          []
        ))
      );
    }

    throw new TypeError (`${show (x)} is no Monad.`);
  };

// tslint:disable-next-line: class-name
interface bind_ {
  /**
   * `(=<<) :: (a -> Either e b) -> Either e a -> Either e b`
   */
  <E extends Some, A extends Some, B extends Some>
  (f: (value: A) => Either<E, B>): (m: Either<E, A>) => Either<E, B>;

  /**
   * `(=<<) :: (a -> [b]) -> [a] -> [b]`
   */
  <A extends Some, B extends Some> (f: (value: A) => List<B>): (m: List<A>) => List<B>;

  /**
   * `(=<<) :: (a -> Maybe b) -> Maybe a -> Maybe b`
   */
  <A extends Some, B extends Some> (f: (value: A) => Maybe<B>): (m: Maybe<A>) => Maybe<B>;
}

/**
 * `(=<<) :: Monad m => (a -> m b) -> m a -> m b`
 */
export const bind_: bind_ = (f: (value: any) => any) => (m: any): any => bind (m) (f);

interface then {
  /**
   * `(>>) :: Either e a -> Either e b -> Either e b`
   *
   * Sequentially compose two actions, discarding any value produced by the
   * first, like sequencing operators (such as the semicolon) in imperative
   * languages.
   *
   * ```a >> b = a >>= \ _ -> b```
   */
  <E extends Some, A extends Some> (m1: Either<E, any>): (m2: Either<E, A>) => Either<E, A>;

  /**
   * `(>>) :: [a] -> [b] -> [b]`
   *
   * Sequentially compose two actions, discarding any value produced by the
   * first, like sequencing operators (such as the semicolon) in imperative
   * languages.
   *
   * ```a >> b = a >>= \ _ -> b```
   */
  <A extends Some> (m1: List<any>): (m2: List<A>) => List<A>;

  /**
   * `(>>) :: Maybe a -> Maybe b -> Maybe b`
   *
   * Sequentially compose two actions, discarding any value produced by the
   * first, like sequencing operators (such as the semicolon) in imperative
   * languages.
   *
   * ```a >> b = a >>= \ _ -> b```
   */
  <A extends Some> (m1: Maybe<any>): (m2: Maybe<A>) => Maybe<A>;
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
export const then: then = (m1: any) => (m2: any): any => bind (m1) (_ => m2);

interface mreturn {
  /**
   * `return :: a -> Either e a`
   *
   * Inject a value into a `Either` type.
   */
  <A extends Some> (type: 'Either'): (x: A) => Either<any, A>;

  /**
   * `return :: a -> [a]`
   *
   * Inject a value into a list.
   */
  <A extends Some> (type: 'List'): (x: A) => List<A>;

  /**
   * `return :: a -> Maybe a`
   *
   * Inject a value into a `Maybe` type.
   */
  <A extends Some> (type: 'Maybe'): (x: A) => (m2: Maybe<A>) => Maybe<A>;
}

/**
 * `return :: a -> m a`
 *
 * Inject a value into a `Maybe` type.
 */
export const mreturn: mreturn =
  <A>(type: MonadicType) => (x: A): any => {
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

    throw new TypeError (`${type} is not a Monad.`);
  };

interface kleisli {
  /**
   * `(>=>) :: (a -> Either e b) -> (b -> Either e c) -> a -> Either e c`
   *
   * Left-to-right Kleisli composition of monads.
   */
  <E extends Some, A extends Some, B extends Some, C extends Some>
  (f1: (x: A) => Either<E, B>): (f2: (x: B) => Either<E, C>) => (x0: A) => Either<E, C>;

  /**
   * `(>=>) :: (a -> [b]) -> (b -> [c]) -> a -> [c]`
   *
   * Left-to-right Kleisli composition of monads.
   */
  <A extends Some, B extends Some, C extends Some>
  (f1: (x: A) => List<B>): (f2: (x: B) => List<C>) => (x0: A) => List<C>;

  /**
   * `(>=>) :: (a -> Maybe b) -> (b -> Maybe c) -> a -> Maybe c`
   *
   * Left-to-right Kleisli composition of monads.
   */
  <A extends Some, B extends Some, C extends Some>
  (f1: (x: A) => Maybe<B>): (f2: (x: B) => Maybe<C>) => (x0: A) => Maybe<C>;
}

/**
 * `(>=>) :: Monad m => (a -> m b) -> (b -> m c) -> a -> m c`
 *
 * Left-to-right Kleisli composition of monads.
 */
export const kleisli: kleisli =
  <A extends Some, B extends Some>
  (f1: (x: A) => any) =>
  (f2: (x: B) => any): any =>
    pipe (f1, bind_ (f2));

interface join {
  /**
   * `join :: Either e (Either e a) -> Either e a`
   *
   * The `join` function is the conventional monad join operator. It is used to
   * remove one level of monadic structure, projecting its bound argument into the
   * outer level.
   */
  <E extends Some, A extends Some> (m: Right<Either<E, A>>): Either<E, A>;

  /**
   * `join :: Either e (Either e a) -> Either e a`
   *
   * The `join` function is the conventional monad join operator. It is used to
   * remove one level of monadic structure, projecting its bound argument into the
   * outer level.
   */
  <E extends Some, A extends Some> (m: Left<Either<E, A>>): Left<Either<E, A>>;

  /**
   * `join :: [[a]] -> [a]`
   *
   * The `join` function is the conventional monad join operator. It is used to
   * remove one level of monadic structure, projecting its bound argument into the
   * outer level.
   */
  <A extends Some> (m: List<List<A>>): List<A>;

  /**
   * `join :: Maybe (Maybe a) -> Maybe a`
   *
   * The `join` function is the conventional monad join operator. It is used to
   * remove one level of monadic structure, projecting its bound argument into the
   * outer level.
   */
  <A extends Some> (m: Maybe<Maybe<A>>): Maybe<A>;
}

/**
 * `join :: Monad m => m (m a) -> m a`
 *
 * The `join` function is the conventional monad join operator. It is used to
 * remove one level of monadic structure, projecting its bound argument into the
 * outer level.
 */
export const join: join = (m: any): any => bind (m as Maybe<any>) (id);

interface liftM2 {
  /**
   * `liftM2 :: (a1 -> a2 -> r) -> Either e a1 -> Either e a2 -> Either e r`
   *
   * Promote a function to a monad, scanning the monadic arguments from left to
   * right.
   */
  <E extends Some, A1 extends Some, A2 extends Some, B extends Some>
  (f: (a1: A1) => (a2: A2) => B): (m1: Either<E, A1>) => (m2: Either<E, A2>) => Either<E, B>;

  /**
   * `liftM2 :: Monad m => (a1 -> a2 -> r) -> m a1 -> m a2 -> m r`
   *
   * Promote a function to a monad, scanning the monadic arguments from left to
   * right.
   */
  <A1 extends Some, A2 extends Some, B extends Some>
  (f: (a1: A1) => (a2: A2) => B): liftM2_<A1, A2, B>;
}

interface liftM2_<A1 extends Some, A2 extends Some, B extends Some> {
  (m1: List<A1>): (m2: List<A2>) => List<B>;
  (m1: Maybe<A1>): (m2: Maybe<A2>) => Maybe<B>;
}

/**
 * `liftM2 :: Monad m => (a1 -> a2 -> r) -> m a1 -> m a2 -> m r`
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 */
export const liftM2: liftM2 =
  <A1 extends Some, A2 extends Some, B extends Some>
  (f: (a1: A1) => (a2: A2) => B) =>
  (m1: any) =>
  (m2: any): any =>
    bind<A1, B> (m1) (a1 => fmap<A2, B> (a2 => f (a1) (a2)) (m2) as any);

interface liftM3 {
  /**
   * `liftM3 :: (a1 -> a2 -> a3 -> r) -> Either e a1 -> Either e a2 -> Either e a3 -> Either e r`
   *
   * Promote a function to a monad, scanning the monadic arguments from left to
   * right.
   */
  <E extends Some, A1 extends Some, A2 extends Some, A3 extends Some, B extends Some>
  (f: (a1: A1) => (a2: A2) => B):
  (m1: Either<E, A1>) =>
  (m2: Either<E, A2>) =>
  (m3: Either<E, A3>) => Either<E, B>;

  /**
   * `liftM3 :: Monad m => (a1 -> a2 -> a3 -> r) -> m a1 -> m a2 -> m a3 -> m r`
   *
   * Promote a function to a monad, scanning the monadic arguments from left to
   * right.
   */
  <A1 extends Some, A2 extends Some, A3 extends Some, B extends Some>
  (f: (a1: A1) => (a2: A2) => B): liftM3_<A1, A2, A3, B>;
}

interface liftM3_<A1 extends Some, A2 extends Some, A3 extends Some, B extends Some> {
  (m1: List<A1>): (m2: List<A2>) => (m3: List<A3>) => List<B>;
  (m1: Maybe<A1>): (m2: Maybe<A2>) => (m3: Maybe<A3>) => Maybe<B>;
}

/**
 * `liftM3 :: Monad m => (a1 -> a2 -> a3 -> r) -> m a1 -> m a2 -> m a3 -> m r`
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 */
export const liftM3: liftM3 =
  <A1 extends Some, A2 extends Some, A3 extends Some, B extends Some>
  (f: (a1: A1) => (a2: A2) => (a3: A3) => B) =>
  (m1: any) =>
  (m2: any) =>
  (m3: any): any =>
    bind<A1, B> (m1)
                (a1 => bind<A2, B> (m2)
                                   (a2 => fmap<A3, B> (a3 => f (a1) (a2) (a3))
                                                      (m3) as any));

interface liftM4 {
  /**
    * `liftM4 :: (Either e) m => (a1 -> a2 -> a3 -> a4 -> r) -> m a1 -> m a2 -> m a3 -> m a4 -> m r`
    *
    * Promote a function to a monad, scanning the monadic arguments from left to
    * right.
    */
  <
    E extends Some, A1 extends Some, A2 extends Some,
    A3 extends Some, A4 extends Some, B extends Some
  >
  (f: (a1: A1) => (a2: A2) => B):
  (m1: Either<E, A1>) =>
  (m2: Either<E, A2>) =>
  (m3: Either<E, A3>) =>
  (m3: Either<E, A4>) => Either<E, B>;

  /**
    * `liftM4 :: Monad m => (a1 -> a2 -> a3 -> a4 -> r) -> m a1 -> m a2 -> m a3 -> m a4 -> m r`
    *
    * Promote a function to a monad, scanning the monadic arguments from left to
    * right.
    */
  <A1 extends Some, A2 extends Some, A3 extends Some, A4 extends Some, B extends Some>
  (f: (a1: A1) => (a2: A2) => B): liftM4_<A1, A2, A3, A4, B>;
}

interface liftM4_<
  A1 extends Some, A2 extends Some, A3 extends Some, A4 extends Some, B extends Some
> {
  (m1: List<A1>): (m2: List<A2>) => (m3: List<A3>) => (m4: List<A4>) => List<B>;
  (m1: Maybe<A1>): (m2: Maybe<A2>) => (m3: Maybe<A3>) => (m4: Maybe<A4>) => Maybe<B>;
}

/**
 * `liftM4 :: Monad m => (a1 -> a2 -> a3 -> a4 -> r) -> m a1 -> m a2 -> m a3 -> m a4 -> m r`
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 */
export const liftM4: liftM4 =
  <A1 extends Some, A2 extends Some, A3 extends Some, A4 extends Some, B extends Some>
  (f: (a1: A1) => (a2: A2) => (a3: A3) => (a4: A4) => B) =>
  (m1: any) =>
  (m2: any) =>
  (m3: any) =>
  (m4: any): any =>
    bind<A1, B> (m1)
                (a1 => bind<A2, B> (m2)
                                   (a2 => bind<A3, B> (m3)
                                                      (a3 => fmap<A4, B> (a4 =>
                                                                          f (a1) (a2) (a3) (a4))
                                                                         (m4) as any)));
