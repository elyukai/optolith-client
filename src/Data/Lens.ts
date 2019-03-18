/**
 * @module Lens
 *
 * Simple `Lens` implementation.
 *
 * @author Lukas Obermann
 */

import { pipe } from "ramda";
import { Identity, runIdentity } from "../Control/Monad/Identity";
import { fmap } from "./Functor";
import { Const, getConst } from "./Functor/Const";
import { fst, Pair, snd } from "./Pair";

/**
 * `Lens s t a b = Functor f => (a -> f b) -> s -> f t`
 *
 * A getter and setter combined. Can be used by `Lens` functions.
 */
export interface Lens<S, T, A, B> {
  (lift: (x: A) => Const<A>): (m: S) => Const<A>
  (lift: (x: A) => Identity<B>): (m: S) => Identity<T>
}

/**
 * `Lens' s a = Lens s s a a`
 *
 * A `Simple Lens`.
 */
export type Lens_<S, A> = Lens<S, S, A, A>

/**
 * `lens :: (s -> a) -> (s -> a -> s) -> Lens s a`
 *
 * Create a new `Lens` with the given getter and setter functions.
 */
export const lens =
  <S, A>
  (getter: (m: S) => A) =>
  (setter: (m: S) => (x: A) => S): Lens_<S, A> =>
    (lift: (x: A) => any) => (m: S) => fmap (setter (m)) (lift (getter (m))) as any

/**
 * `lens' :: (s -> (a, a -> s)) -> Lens s a`
 */
export const lens_ =
  <S, A>
  (f: (m: S) => Pair<A, (x: A) => S>) =>
    lens (pipe (f, fst)) (pipe (f, snd))

/**
 * `view :: Lens s a -> s -> a`
 */
export const view = <S, A> (l: Lens_<S, A>) => (m: S): A =>
  getConst (l (Const) (m))

/**
 * `over :: Lens s a -> (a -> a) -> s -> s`
 */
export const over = <S, A> (l: Lens_<S, A>) => (f: (x: A) => A) => (m: S): S =>
  runIdentity (l (pipe (f, Identity)) (m))

/**
 * `set :: Lens s a -> a -> s -> s`
 */
export const set = <S, A> (l: Lens_<S, A>) => (x: A) => over (l) (_ => x)


// /**
//  * `type Prism' s a = forall p f. (Choice p, Applicative f) => p a (f a) -> p s (f s)`
//  */
// export type Prism_ =

// /**
//  * `prism' :: (b -> s) -> (s -> Maybe a) -> Prism s s a b`
//  */
// export const prism_ =


// // Special lenses

// export const _Just = lens (fromJust as <A> (m: Maybe<A>) => A)
//                           ((m: ) => x => mapReplace (x) (m))
