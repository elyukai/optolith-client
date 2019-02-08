/**
 * @module Control.Monad
 *
 * The `Monad` class defines the basic operations over a *monad*, a concept from
 * a branch of mathematics known as *category theory*. From the perspective of a
 * Haskell programmer, however, it is best to think of a monad as an
 * *abstract datatype* of actions. Haskell's `do` expressions provide a
 * convenient syntax for writing monadic expressions.
 *
 * @author Lukas Obermann
 */

import { pipe } from "ramda";
import { Either, isEither, isRight, Right } from "../Data/Either";
import { fnull } from "../Data/Foldable";
import { ident } from "../Data/Function";
import { fmap } from "../Data/Functor";
import { append, cons, empty, head, isList, isNil, List, map, pure, tail } from "../Data/List";
import { isJust, isMaybe, Just, Maybe, Some } from "../Data/Maybe";
import { showP } from "../Data/Show";

export type Monad<A> = Either<any, A>
                     | List<A>
                     | Maybe<A>

type MonadStr = "Either" | "List" | "Maybe"

interface MonadBind {
  <E, A> (x: Either<E, A>): <B> (f: (x: A) => Either<E, B>) => Either<E, B>
  <A> (xs: List<A>): <B> (f: (x: A) => List<B>) => List<B>
  <A extends Some> (x: Maybe<A>): <B extends Some> (f: (x: A) => Maybe<B>) => Maybe<B>
}

/**
 * `(>>=) :: Monad m => m a -> (a -> m b) -> m b`
 */
export const bind: MonadBind =
  <A> (x: any) => (f: (x: A) => any): any => {
    if (isList (x)) {
      return isNil (x) ? empty : append (f (x .x))
                                        (bind<A> (x .xs) (f))
    }

    if (isEither (x)) {
      return isRight (x) ? f (x .value) : x
    }

    if (isMaybe (x)) {
      return isJust (x) ? f (x .value) : x
    }

    throw new TypeError (instanceErrorMsg (">>=") (x))
  }

interface MonadBindF {
  <E, A, B> (f: (x: A) => Either<E, B>): (x: Either<E, A>) => Either<E, B>
  <A, B> (f: (x: A) => List<B>): (xs: List<A>) => List<B>
  <A extends Some, B extends Some> (f: (x: A) => Maybe<B>): (x: Maybe<A>) => Maybe<B>
}

/**
 * `(=<<) :: Monad m => (a -> m b) -> m a -> m b`
 */
export const bindF: MonadBindF =
  <A> (f: (x: A) => any) => (x: any): any => bind<A> (x) (f)

interface MonadThen {
  <E> (x: Either<E, any>): <A> (x: Either<E, A>) => Either<E, A>
  (xs: List<any>): <A> (ys: List<A>) => List<A>
  (x: Maybe<any>): <A extends Some> (y: Maybe<A>) => Maybe<A>
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
export const then: MonadThen =
  (x: any) => (y: any): any =>
    bind<any> (x) (_ => y)

interface MonadKleisli {
  <E, A, B, C>
  (f: (x: A) => Either<E, B>):
  (g: (x: B) => Either<E, C>) =>
  (x: A) => Either<E, C>

  <A, B, C>
  (f: (x: A) => List<B>):
  (g: (x: B) => List<C>) =>
  (x: A) => List<C>

  <A extends Some, B extends Some, C extends Some>
  (f: (x: A) => Maybe<B>):
  (g: (x: B) => Maybe<C>) =>
  (x: A) => Maybe<C>
}

/**
 * `(>=>) :: Monad m => (a -> m b) -> (b -> m c) -> a -> m c`
 *
 * Left-to-right Kleisli composition of monads.
 */
export const kleisli: MonadKleisli =
  (f: (x: any) => any) =>
  (g: (x: any) => any) =>
    pipe (f, bindF (g) as (x: any) => any)

interface MonadJoin {
  <E, A> (x: Either<E, Either<E, A>>): Either<E, A>
  <A> (xss: List<List<A>>): List<A>
  <A extends Some> (x: Maybe<Maybe<A>>): Maybe<A>
}

/**
 * `join :: Monad m => m (m a) -> m a`
 *
 * The `join` function is the conventional monad join operator. It is used to
 * remove one level of monadic structure, projecting its bound argument into the
 * outer level.
 */
export const join: MonadJoin = bindF<any, any> (ident) as (x: any) => any

interface MonadMapM {
  (t: "Either"): <E, A, B> (f: (x: A) => Either<E, B>) => (xs: List<A>) => Either<E, List<B>>
  (t: "List"): <A, B> (f: (x: A) => List<B>) => (xs: List<A>) => List<List<B>>
  (t: "Maybe"): <A, B extends Some> (f: (x: A) => Maybe<B>) => (xs: List<A>) => Maybe<List<B>>
}

/**
 * `mapM :: Monad m => (a -> m b) -> [a] -> m [b]`
 *
 * Map each element of a structure to a monadic action, evaluate these actions
 * from left to right, and collect the results.
 *
 * In case of `Maybe`, if the function returns a `Nothing`, it is immediately
 * returned by the function. If `f` did not return any `Nothing`, the list of
 * unwrapped return values is returned as a `Just`. If `xs` is empty,
 * `Just []` is returned.
 */
export const mapM: MonadMapM =
  (t: MonadStr) =>
  (f: (x: any) => any) =>
  (xs: List<any>): any => {
    if (t === "List") {
      return sequence ("List") (map (f) (xs))
    }

    if (t === "Either") {
      return sequence ("Either") (map (f) (xs))
    }

    if (t === "Maybe") {
      return sequence ("Maybe") (map (f) (xs))
    }

    throw new TypeError (instanceErrorMsg ("mapM") (t))
  }

interface MonadSequence {
  (t: "Either"): <E, A> (xs: List<Either<E, A>>) => Either<E, List<A>>
  (t: "List"): <A> (xs: List<List<A>>) => List<List<A>>
  (t: "Maybe"): <A extends Some> (xs: List<Maybe<A>>) => Maybe<List<A>>
}

/**
 * `sequence :: [m a] -> m [a]`
 *
 * Evaluate each monadic action in the structure from left to right, and collect
 * the results.
 *
 * ```haskell
 * sequence [] = return []
 * sequence (m:ms) = m >>= (\x -> sequence ms >>= (\xs -> return $ x:xs))
 * ```
 */
export const sequence: MonadSequence =
  (t: MonadStr) =>
  (xs: List<any>): any => {
    if (t === "List") {
      if (fnull (xs)) {
        return pure (empty)
      }

      const m = head (xs)
      const ms = tail (xs)

      return bind (m as List<any>)
                  (x => bind (sequence ("List") (ms))
                             (zs => pure (cons (zs) (x))))
    }

    if (t === "Either") {
      if (fnull (xs)) {
        return Right (empty)
      }

      const m = head (xs)
      const ms = tail (xs)

      return bind (m as Either<any, any>)
                  (x => bind (sequence ("Either") (ms))
                             (zs => Right (cons (zs) (x))))
    }

    if (t === "Maybe") {
      if (fnull (xs)) {
        return Just (empty)
      }

      const m = head (xs)
      const ms = tail (xs)

      return bind (m as Maybe<any>)
                  (x => bind (sequence ("Maybe") (ms))
                             (zs => Just (cons (zs) (x))))
    }

    throw new TypeError (instanceErrorMsg ("sequence") (t))
  }

interface MonadLiftM2<A1, A2, B> {
  (x1: List<A1>):
  (x2: List<A2>) => List<B>

  <E>
  (x1: Either<E, A1>):
  (x2: Either<E, A2>) => Either<E, B>

  (x1: Maybe<A1>):
  (x2: Maybe<A2>) => Maybe<B>
}

/**
 * `liftM2 :: Monad m => (a1 -> a2 -> r) -> Maybe a1 -> Maybe a2 -> Maybe r`
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 */
export const liftM2 =
  <A1, A2, B>
  (f: (a1: A1) => (a2: A2) => B): MonadLiftM2<A1, A2, B> =>
  (x1: any) =>
  (x2: any): any =>
    bind (x1) (a1 => fmap (f (a1 as A1)) (x2) as any)

interface MonadLiftM3<A1, A2, A3, B> {
  (x1: List<A1>):
  (x2: List<A2>) =>
  (x3: List<A3>) => List<B>

  <E>
  (x1: Either<E, A1>):
  (x2: Either<E, A2>) =>
  (x3: Either<E, A3>) => Either<E, B>

  (x1: Maybe<A1>):
  (x2: Maybe<A2>) =>
  (x3: Maybe<A3>) => Maybe<B>
}

/**
 * `liftM3 :: Monad m => (a1 -> a2 -> a3 -> r) -> Maybe a1 -> Maybe a2 -> Maybe a3 -> Maybe r`
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 */
export const liftM3 =
  <A1, A2, A3, B>
  (f: (a1: A1) => (a2: A2) => (a3: A3) => B): MonadLiftM3<A1, A2, A3, B> =>
  (x1: any) =>
  (x2: any) =>
  (x3: any): any =>
    bind (x1) (a1 => liftM2 (f (a1 as A1)) (x2) (x3) as any)

interface MonadLiftM4<A1, A2, A3, A4, B> {
  (x1: List<A1>):
  (x2: List<A2>) =>
  (x3: List<A3>) =>
  (x4: List<A4>) => List<B>

  <E>
  (x1: Either<E, A1>):
  (x2: Either<E, A2>) =>
  (x3: Either<E, A3>) =>
  (x4: Either<E, A4>) => Either<E, B>

  (x1: Maybe<A1>):
  (x2: Maybe<A2>) =>
  (x3: Maybe<A3>) =>
  (x4: Maybe<A4>) => Maybe<B>
}

/**
 * ```haskell
 * liftM4 :: Monad m => (a1 -> a2 -> a3 -> a4 -> r)
 *                   -> m a1
 *                   -> m a2
 *                   -> m a3
 *                   -> m a4
 *                   -> m r
 * ```
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 */
export const liftM4 =
  <A1, A2, A3, A4, B>
  (f: (a1: A1) => (a2: A2) => (a3: A3) => (a4: A4) => B): MonadLiftM4<A1, A2, A3, A4, B> =>
  (x1: any) =>
  (x2: any) =>
  (x3: any) =>
  (x4: any): any =>
    bind (x1) (a1 => liftM3 (f (a1 as A1)) (x2) (x3) (x4) as any)

interface MonadLiftM5<A1, A2, A3, A4, A5, B> {
  (x1: List<A1>):
  (x2: List<A2>) =>
  (x3: List<A3>) =>
  (x4: List<A4>) =>
  (x5: List<A5>) => List<B>

  <E>
  (x1: Either<E, A1>):
  (x2: Either<E, A2>) =>
  (x3: Either<E, A3>) =>
  (x4: Either<E, A4>) =>
  (x5: Either<E, A5>) => Either<E, B>

  (x1: Maybe<A1>):
  (x2: Maybe<A2>) =>
  (x3: Maybe<A3>) =>
  (x4: Maybe<A4>) =>
  (x5: Maybe<A5>) => Maybe<B>
}

/**
 * ```haskell
 * liftM5 :: Monad m => (a1 -> a2 -> a3 -> a4 -> a5 -> r)
 *                   -> m a1
 *                   -> m a2
 *                   -> m a3
 *                   -> m a4
 *                   -> m a5
 *                   -> m r
 * ```
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 */
export const liftM5 =
  <A1, A2, A3, A4, A5, B>
  (f: (a1: A1) => (a2: A2) => (a3: A3) => (a4: A4) => (a5: A5) => B):
  MonadLiftM5<A1, A2, A3, A4, A5, B> =>
  (x1: any) =>
  (x2: any) =>
  (x3: any) =>
  (x4: any) =>
  (x5: any): any =>
    bind (x1) (a1 => liftM4 (f (a1 as A1)) (x2) (x3) (x4) (x5) as any)

const instanceErrorMsg =
  (fname: string) =>
  (x: any) =>
    `${fname}: missing instance of Monad\n${showP (x)}`
