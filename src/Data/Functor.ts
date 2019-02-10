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
import { fromBinary, isPair, Pair } from "./Pair";
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

    if (isPair (x)) {
      return fromBinary (x .first, f (x .second))
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
