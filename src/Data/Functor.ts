/**
 * @module Data.Functor
 *
 * Functors: uniform action over a parameterized type, generalizing the `map`
 * function on lists.
 *
 * @author Lukas Obermann
 */

import { pipe } from "../App/Utilities/pipe";
import { isFunction } from "../App/Utilities/typeCheckUtils";
import { Identity, isIdentity, runIdentity } from "../Control/Monad/Identity";
import { IO, isIO } from "../System/IO";
import { Either, first, isEither, isLeft, Right } from "./Either";
import { cnst } from "./Function";
import { Const, isConst } from "./Functor/Const";
import { Cons, isList, isNil, List, Nil } from "./List";
import { isMarket, Market } from "./Market";
import { isMaybe, isNothing, Just, Maybe } from "./Maybe";
import { isOrderedMap, OrderedMap } from "./OrderedMap";
import { isPair, Pair } from "./Pair";
import { showP } from "./Show";

export type Functor<A> = Const<A>
                       | Either<any, A>
                       | Identity<A>
                       | IO<A>
                       | List<A>
                       | Maybe<A>
                       | OrderedMap<any, A>
                       | Pair<any, A>
                       | ((x: any) => A)
                       | Market<any, any, any, A>

export type FunctorMap<A, B> =
  <F extends Functor<A>>
  (x: F) =>
    F extends Const<infer A0> ? Const<A0> :
    F extends Either<any, A> ? Exclude<F, Right<any>> | Right<B> :
    F extends Identity<A> ? Identity<B> :
    F extends IO<A> ? IO<B> :
    F extends List<A> ? List<B> :
    F extends Maybe<A> ? Maybe<B> :
    F extends OrderedMap<infer K, A> ? OrderedMap<K, B> :
    F extends Pair<infer A1, A> ? Pair<A1, B> :
    F extends ((x: infer I) => A) ? (x: I) => B :
    F extends Market<infer A_, infer B_, infer S_, A> ? Market<A_, B_, S_, B> :
    never

/**
 * `fmap :: (a -> b) -> f a -> f b`
 */
export const fmap =
  <A, B>
  (f: (x: A) => B): FunctorMap<A, B> =>
  (x: Functor<any>): any => {
    if (isList (x)) {
      if (isNil (x)) {
        return Nil
      }

      const nextElement = fmap (f) ((x as Cons<A>) .xs)
      const nextValue = f ((x as Cons<A>) .x)

      if (nextValue === x .x && nextElement === x .xs) {
        return x
      }

      return Cons (nextValue, nextElement)
    }

    if (isOrderedMap (x)) {
      return OrderedMap.fromArray (
        [...x .value] .map (([k, a]) => [k, f (a)] as [any, B])
      )
    }

    if (isConst (x)) {
      return x
    }

    if (isEither (x)) {
      if (isLeft (x)) {
        return x
      }

      const nextValue = f (x .value)

      if (nextValue === x .value) {
        return x
      }

      return Right (nextValue)
    }

    if (isIdentity (x)) {
      const nextValue = f (runIdentity (x))

      if (nextValue === runIdentity (x)) {
        return x
      }

      return Identity (nextValue)
    }

    if (isIO (x)) {
      return IO (() => x .f () .then (f))
    }

    if (isMaybe (x)) {
      if (isNothing (x)) {
        return x
      }

      const nextValue = f (x .value)

      if (nextValue === x .value) {
        return x
      }

      return Just (nextValue)
    }

    if (isPair (x)) {
      const nextValue = f (x .second)

      if (nextValue === x .second) {
        return x
      }

      return Pair (x .first, f (x .second))
    }

    if (isFunction (x)) {
      return pipe (x, f)
    }

    if (isMarket (x)) {
      return Market (pipe (x.to, f)) (pipe (x.fro, first (f)))
    }

    throw new TypeError (instanceErrorMsg ("fmap") (x))
  }

interface fmapF {
  /**
   * `fmap :: Const a a0 -> (a -> b) -> Const b a0`
   */
  <A0> (x: Const<A0>): <B> (f: (x: A0) => B) => Const<A0>
  /**
   * `fmap :: Either e a -> (a -> b) -> Either e b`
   */
  <E, A> (x: Either<E, A>): <B> (f: (x: A) => B) => Either<E, B>
  /**
   * `fmap :: Identity a -> (a -> b) -> Identity b`
   */
  <A> (x: Identity<A>): <B> (f: (x: A) => B) => Identity<B>
  /**
   * `fmap :: IO a -> (a -> b) -> IO b`
   */
  <A> (x: IO<A>): <B> (f: (x: A) => B) => IO<B>
  /**
   * `fmap :: [a] -> (a -> b) -> [b]`
   */
  <A> (x: List<A>): <B> (f: (x: A) => B) => List<B>
  /**
   * `fmap :: Maybe a -> (a -> b) -> Maybe b`
   */
  <A> (x: Maybe<A>): <B> (f: (x: A) => B) => Maybe<B>
  /**
   * `fmap :: Map k a -> (a -> b) -> Map k b`
   */
  <K, A> (x: OrderedMap<K, A>): <B> (f: (x: A) => B) => OrderedMap<K, B>
  /**
   * `fmap :: (a0, a) -> (a -> b) -> (a0, b)`
   */
  <A1, A> (x: Pair<A1, A>): <B> (f: (x: A) => B) => Pair<A1, B>
  /**
   * `fmap :: (a0 -> a) -> (a -> b) -> a0 -> b`
   */
  <A0, A> (f: (x: A0) => A): <B> (f: (x: A) => B) => (x: A0) => B
  /**
   * `fmap :: Market a b s t -> (t -> u) -> Market a b s u`
   */
  <A, B, S, T> (x: Market<A, B, S, T>): <U> (f: (x: T) => U) => Market<A, B, S, U>
}

/**
 * `fmapF :: f a -> (a -> b) -> f b`
 */
export const fmapF: fmapF =
  (x: any) =>
  (f: (x: any) => any): any =>
    fmap (f) (x)

/**
 * `(<$) :: a -> f b -> f a`
 *
 * Replace all locations in the input with the same value. The default
 * definition is `fmap . const`, but this may be overridden with a more
 * efficient version.
 */
export const mapReplace = <A> (x: A) => fmap<any, A> (cnst (x))

const instanceErrorMsg =
  (fname: string) =>
  (x: any) =>
    `${fname}: missing instance of Functor\n${showP (x)}`
