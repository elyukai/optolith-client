/**
 * @module Lens
 *
 * Simple `Lens` implementation.
 *
 * @author Lukas Obermann
 */

import { pipe } from "../App/Utilities/pipe";
import { Identity, runIdentity } from "../Control/Monad/Identity";
import { fmap } from "./Functor";
import { Const, getConst } from "./Functor/Const";
import { List } from "./List";
import { fst, Pair, snd } from "./Pair";

interface Getting<S, T, A, B> {
  (lift: (x: A) => Const<A>): (m: S) => Const<A>
}

type Getting_<S, A> = Getting<S, S, A, A>

interface Setting<S, T, A, B> {
  (lift: (x: A) => Identity<B>): (m: S) => Identity<T>
}

type Setting_<S, A> = Setting<S, S, A, A>

/**
 * `Lens s t a b = Functor f => (a -> f b) -> s -> f t`
 *
 * A getter and setter combined. Can be used by `Lens` functions.
 */
export interface Lens<S, T, A, B> extends Setting<S, T, A, B>, Getting<S, T, A, B> { }

/**
 * `Lens' s a = Lens s s a a`
 *
 * A `Simple Lens`.
 */
export type Lens_<S, A> = Lens<S, S, A, A>

/**
 * `Traversal s t a b = Applicative f => (a -> f b) -> s -> f t`
 *
 * A getter and setter combined. Can be used by `Traversal` functions.
 */
export interface Traversal<S, T, A, B> extends Setting<S, T, A, B> {
  (lift: (x: A) => Const<List<A>>): (m: S) => Const<List<A>>
}

/**
 * `Traversal' s a = Traversal s s a a`
 *
 * A `Simple Traversal`.
 */
export type Traversal_<S, A> = Traversal<S, S, A, A>

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
 * `view :: Lens' s a -> s -> a`
 */
export const view = <S, A> (l: Getting_<S, A>) => (m: S): A =>
  getConst (l (Const) (m))

/**
 * `over :: Lens' s a -> (a -> a) -> s -> s`
 */
export const over = <S, A> (l: Setting_<S, A>) => (f: (x: A) => A) => (m: S): S =>
  runIdentity (l (pipe (f, Identity)) (m))

/**
 * `set :: Lens' s a -> a -> s -> s`
 */
export const set = <S, A> (l: Setting_<S, A>) => (x: A) => over (l) (_ => x)

/**
 * `toListOf :: Traversal' s a -> s -> [a]`
 */
export const toListOf = <S, A> (l: Traversal_<S, A>) => (m: S): List<A> =>
  getConst (l (x => Const (List (x))) (m))


// /**
//  * `type Prism' s a = forall p f. (Choice p, Applicative f) => p a (f a) -> p s (f s)`
//  */
// export type Prism_ =

/**
 * `prism :: (b -> t) -> (s -> Either t a) -> Prism s t a b`
 *
 * Build a `Prism`.
 *
 * `Either t a` is used instead of `Maybe a` to permit the types of `s` and `t`
 * to differ.
 */
// export const prism =
//   <B, T> (f: (x: B) => T) =>
//   <S, A> (g: (x: S) => Either<T, A>) =>

/**
 * `prism' :: (b -> s) -> (s -> Maybe a) -> Prism s s a b`
 *
 * This is usually used to build a `Prism'`, when you have to use an operation
 * like `cast` which already returns a `Maybe`.
 */
// export const prism_ =
//   <B, S> (f: (x: B) => S) =>
//   <A> (g: (x: S) => Maybe<A>) =>
//     prism (f) (x => pipe_ (x, g, maybeToEither (x)))
