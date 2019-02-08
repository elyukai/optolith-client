/**
 * @module Data.Functor
 *
 * Functors: uniform action over a parameterized type, generalizing the `map`
 * function on lists.
 *
 * @author Lukas Obermann
 */

import { Identity, isIdentity, runIdentity } from "../Control/Monad/Identity";
import { Either, isEither, isRight, Right } from "./Either";
import { cnst } from "./Function";
import { Const, isConst } from "./Functor/Const";
import { Cons, isList, isNil, List, Nil } from "./List";
import { isJust, isMaybe, Just, Maybe } from "./Maybe";
import { isOrderedMap, OrderedMap } from "./OrderedMap";
import { showP } from "./Show";

export type Functor<A> = Const<A>
                       | Either<any, A>
                       | Identity<A>
                       | List<A>
                       | Maybe<A>
                       | OrderedMap<any, A>

interface FunctorMap<A, B> {
  <A0> (x: Const<A0>): Const<A0>
  <E> (x: Either<E, A>): Either<E, B>
  (x: Identity<A>): Identity<B>
  (xs: List<A>): List<B>
  (x: Maybe<A>): Maybe<B>
  <K> (x: OrderedMap<K, A>): OrderedMap<K, B>
}

/**
 * `fmap :: (a -> b) -> f a -> f b`
 */
export const fmap =
  <A, B>
  (f: (x: A) => B): FunctorMap<A, B> =>
  (x: any): any => {
    if (isList (x)) {
      return isNil (x) ? Nil : Cons (f (x .x), fmap (f) (x .xs))
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
      return isRight (x) ? Right (f (x .value)) : x
    }

    if (isIdentity (x)) {
      return Identity (f (runIdentity (x)))
    }

    if (isMaybe (x)) {
      return isJust (x) ? Just (f (x .value)) : x
    }

    throw new TypeError (instanceErrorMsg ("fmap") (x))
  }

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
