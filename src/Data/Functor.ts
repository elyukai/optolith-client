/**
 * @module Data.Functor
 *
 * Functors: uniform action over a parameterized type, generalizing the `map`
 * function on lists.
 *
 * @author Lukas Obermann
 */

import { Identity, isIdentity, runIdentity } from "../Control/Monad/Identity";
import { Either, isEither, isLeft, Right } from "./Either";
import { cnst } from "./Function";
import { Const, isConst } from "./Functor/Const";
import { Cons, isList, isNil, List, Nil } from "./List";
import { isMaybe, isNothing, Just, Maybe } from "./Maybe";
import { isOrderedMap, OrderedMap } from "./OrderedMap";
import { isPair, Pair } from "./Pair";
import { showP } from "./Show";

export type Functor<A> = Const<A>
                       | Either<any, A>
                       | Identity<A>
                       | List<A>
                       | Maybe<A>
                       | OrderedMap<any, A>
                       | Pair<any, A>

export type FunctorMap<A, B> =
  <F extends Functor<A>>
  (x: F) =>
    F extends Const<infer A0> ? Const<A0> :
    F extends Either<any, A> ? Exclude<F, Right<any>> | Right<B> :
    F extends Identity<A> ? Identity<B> :
    F extends List<A> ? List<B> :
    F extends Maybe<A> ? Maybe<B> :
    F extends OrderedMap<infer K, A> ? OrderedMap<K, B> :
    F extends Pair<infer A1, A> ? Pair<A1, B> :
    never

/**
 * `fmap :: (a -> b) -> f a -> f b`
 */
export const fmap =
  <A, B>
  (f: (x: A) => B): FunctorMap<A, B> =>
  (x: any): any => {
    if (isList (x)) {
      if (isNil (x)) {
        return Nil
      }

      const nextElement = fmap (f) (x .xs)
      const nextValue = f (x .x)

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

    throw new TypeError (instanceErrorMsg ("fmap") (x))
  }

interface fmapF {
  <A0> (x: Const<A0>): <B> (f: (x: A0) => B) => Const<A0>;
  <E, A> (x: Either<E, A>): <B> (f: (x: A) => B) => Either<E, B>;
  <A> (x: Identity<A>): <B> (f: (x: A) => B) => Identity<B>;
  <A> (x: List<A>): <B> (f: (x: A) => B) => List<B>;
  <A> (x: Maybe<A>): <B> (f: (x: A) => B) => Maybe<B>;
  <K, A> (x: OrderedMap<K, A>): <B> (f: (x: A) => B) => OrderedMap<K, B>;
  <A1, A> (x: Pair<A1, A>): <B> (f: (x: A) => B) => Pair<A1, B>;
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
