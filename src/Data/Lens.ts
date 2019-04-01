/**
 * @module Lens
 *
 * Simple `Lens` implementation.
 *
 * @author Lukas Obermann
 */

import { pipe } from "../App/Utilities/pipe";
import { Identity, runIdentity } from "../Control/Monad/Identity";
import { Either, Left, Right } from "./Either";
import { fmap } from "./Functor";
import { Const, getConst } from "./Functor/Const";
import { List } from "./List";
import { Just, maybe, Maybe, Nothing } from "./Maybe";
import { fst, Pair, snd } from "./Pair";
import { dimap, rmap } from "./Profunctor";
import { right_ } from "./Profunctor/Choice";

interface Getter<S, T, A, B> {
  (lift: (x: A) => Const<A>): (m: S) => Const<A>
}

type Getter_<S, A> = Getter<S, S, A, A>

interface Setter<S, T, A, B> {
  (lift: (x: A) => Identity<B>): (m: S) => Identity<T>
}

type Setter_<S, A> = Setter<S, S, A, A>

/**
 * `Lens s t a b = Functor f => (a -> f b) -> s -> f t`
 *
 * A getter and setter combined. Can be used by `Lens` functions.
 */
export interface Lens<S, T, A, B> extends Setter<S, T, A, B>, Getter<S, T, A, B> { }

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
export interface Traversal<S, T, A, B> extends Setter<S, T, A, B> {
  (lift: (x: A) => Const<List<A>>): (m: S) => Const<List<A>>
}

/**
 * `Traversal' s a = Traversal s s a a`
 *
 * A `Simple Traversal`.
 */
export type Traversal_<S, A> = Traversal<S, S, A, A>


/**
 * `type Prism s t a b = forall p f. (Choice p, Applicative f) => p a (f b) -> p s (f t)`
 */
export interface Prism<S, T, A, B> extends Setter<S, T, A, B> {

}

/**
 * `Prism' s a = Prism s s a a`
 *
 * A `Simple Prism`.
 */
export type Prism_<S, A> = Prism<S, S, A, A>

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
export const view = <S, A> (l: Getter_<S, A>) => (m: S): A =>
  getConst (l (Const) (m))

/**
 * `over :: Lens' s a -> (a -> a) -> s -> s`
 */
export const over = <S, A> (l: Setter_<S, A>) => (f: (x: A) => A) => (m: S): S =>
  runIdentity (l (pipe (f, Identity)) (m))

/**
 * `set :: Lens' s a -> a -> s -> s`
 */
export const set = <S, A> (l: Setter_<S, A>) => (x: A) => over (l) (_ => x)

/**
 * `toListOf :: Traversal' s a -> s -> [a]`
 */
export const toListOf = <S, A> (l: Traversal_<S, A>) => (m: S): List<A> =>
  getConst (l (x => Const (List (x))) (m))

/**
 * `prism :: (b -> t) -> (s -> Either t a) -> Prism s t a b`
 *
 * Build a `Prism`.
 *
 * `Either t a` is used instead of `Maybe a` to permit the types of `s` and `t`
 * to differ.
 */
export const prism =
  <B, T>
  (to: (x: B) => T) =>
  <S, A>
  (fro: (x: S) => Either<T, A>): Prism<S, T, A, B> =>
  pab => {
    const pat = rmap (to) (pab)

    return dimap (fro)
                 <Identity<T>, T>
                 (runIdentity)
                 (right_ (pat))
  }
      //  dimap (fro) (right_ (either (pure) (fmap (to))))

// /**
//  * `prism' :: (b -> s) -> (s -> Maybe a) -> Prism s s a b`
//  *
//  * This is usually used to build a `Prism'`, when you have to use an operation
//  * like `cast` which already returns a `Maybe`.
//  */
// export const prism_ =
//   <B, S> (f: (x: B) => S) =>
//   <A> (g: (x: S) => Maybe<A>) =>
//     prism (f) (x => pipe_ (x, g, maybeToEither (x)))


export interface _Just extends Prism<Maybe<any>, Maybe<any>, any, any> {
  <A, B> (lift: (x: A) => Identity<B>): (m: Maybe<A>) => Identity<Maybe<B>>
}

export const _Just: _Just =
  prism<any, Maybe<any>> (Just)
                         (maybe<Either<Maybe<any>, any>> (Left (Nothing))
                                                         (Right))
