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
import { fst, Pair, snd } from "./Tuple";

interface Getter <S, T, A, B> {
  (lift: (x: A) => Const<A, B>): (m: S) => Const<A, T>
}

type Getter_ <S, A> = Getter<S, S, A, A>

interface Setter <S, T, A, B> {
  (lift: (x: A) => Identity<B>): (m: S) => Identity<T>
}

type Setter_ <S, A> = Setter<S, S, A, A>

// interface AReview <T, B> {
//   (x: Tagged<B, Identity<B>>): Tagged<T, Identity<T>>
// }

/**
 * `Lens s t a b = Functor f => (a -> f b) -> s -> f t`
 *
 * A getter and setter combined. Can be used by `Lens` functions.
 */
export interface Lens <S, T, A, B>
  extends Setter<S, T, A, B>, Getter<S, T, A, B> {
  // extends Setter<S, T, A, B>, Getter<S, T, A, B>, Traversal<S, T, A, B> {
  (lift: (x: A) => Const<A, B>): (m: S) => Const<A, T>
  (lift: (x: A) => Identity<B>): (m: S) => Identity<T>
}

/**
 * `Lens' s a = Lens s s a a`
 *
 * A `Simple Lens`.
 */
export type Lens_ <S, A> = Lens<S, S, A, A>

// /**
//  * `Traversal s t a b = Applicative f => (a -> f b) -> s -> f t`
//  *
//  * A getter and setter combined. Can be used by `Traversal` functions.
//  */
// export interface Traversal<S, T, A, B> extends Setter<S, T, A, B> {
//   (lift: (x: A) => Const<List<A>, B>): (m: S) => Const<List<A>, T>
//   (lift: (x: A) => Identity<B>): (m: S) => Identity<T>
// }

// /**
//  * `Traversal' s a = Traversal s s a a`
//  *
//  * A `Simple Traversal`.
//  */
// export type Traversal_<S, A> = Traversal<S, S, A, A>


// /**
//  * `type Prism s t a b = forall p f. (Choice p, Applicative f) => p a (f b) -> p s (f t)`
//  */
// export interface Prism<S, T, A, B>
//   extends Setter<S, T, A, B>, Traversal<S, T, A, B>, AReview<T, B> {
//   (lift: Tagged<A, Identity<B>>): Tagged<S, Identity<T>>
//   (lift: (x: A) => Identity<B>): (m: S) => Identity<T>
// }

// export type ExplA<P> = (t: ApplicativeName) => P

// /**
//  * `Prism' s a = Prism s s a a`
//  *
//  * A `Simple Prism`.
//  */
// export type Prism_<S, A> = Prism<S, S, A, A>

/**
 * `lens :: (s -> a) -> (s -> a -> s) -> Lens s a`
 *
 * Create a new `Lens` with the given getter and setter functions.
 */
export const lens =
  <S, A>
  (getter: (m: S) => A) =>
  (setter: (m: S) => (x: A) => S): Lens_<S, A> =>
  (lift: (x: A) => any) =>
  (m: S) =>
    fmap (setter (m)) (lift (getter (m))) as any

/**
 * `lens' :: (s -> (a, a -> s)) -> Lens s a`
 */
export const lens_ =
  <S, A>
  (f: (m: S) => Pair<A, (x: A) => S>) =>
    lens (pipe (f, fst)) (pipe (f, snd))

// /**
//  * `prism :: (b -> t) -> (s -> Either t a) -> Prism s t a b`
//  *
//  * Build a `Prism`.
//  *
//  * `Either t a` is used instead of `Maybe a` to permit the types of `s` and `t`
//  * to differ.
//  *
//  * ```haskell
//  * prism bt seta = dimap seta (either pure (fmap bt)) . right'
//  * ```
//  */
// export const prism =
//   <B, T>
//   (bt: (x: B) => T) =>
//   <S, A>
//   (seta: (x: S) => Either<T, A>): ExplA<Prism<S, T, A, B>> => {
//     const f =
//       <N extends ApplicativeName>
//       (t: N) =>
//       <F extends Choice<A, ApplicativeMap<B>[N]>>
//       (pab: F) => {
//           const cee: Choice<Either<any, A>, Either<any, Applicative<B>>> =
//             right_<A, Applicative<B>, any, F> (pab)

//           const fcontrav = seta
//           // @ts-ignore
//           const fcov = either (pure (t)) (fmap (bt))

//           return dimap (fcontrav) (fcov) (cee) as Choice<S, ApplicativeMap<T>[N]>
//       }

//     f.isPrism = true

//     // @ts-ignore
//     return f
//   }

// export const prism_ =
//   <B, S>
//   (bs: (x: B) => S) =>
//   <A>
//   (sma: (x: S) => Maybe<A>): ExplA<Prism<S, S, A, B>> =>
//     prism (bs) (s => maybe<Either<S, A>> (Left (s))
//                                          (Right as (x: A) => Right<A>)
//                                          (sma (s)))

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

// /**
//  * `overP :: Prism s t a b -> (a -> b) -> s -> t`
//  */
// tslint:disable-next-line: max-line-length
// export const overP = <S, T, A, B> (l: ExplA<Prism<S, T, A, B>>) => (f: (x: A) => B) => (m: S): T =>
//   runIdentity (l ("Identity") (pipe (f, Identity)) (m))

/**
 * `set :: Lens' s a -> a -> s -> s`
 */
export const set = <S, A> (l: Setter_<S, A>) => (x: A) => over (l) (_ => x)

// /**
//  * `setP :: Prism s t a b -> a -> s -> s`
//  */
// export const setP = <S, T, A, B> (l: ExplA<Prism<S, T, A, B>>) => (x: B) => overP (l) (_ => x)

// /**
//  * `toListOf :: Traversal' s a -> s -> [a]`
//  */
// export const toListOf = <S, A> (l: Traversal_<S, A>) => (m: S): List<A> =>
//   getConst (l (x => Const (List (x))) (m))

// /**
//  * `review :: AReview t b -> b -> t`
//  *
//  * ```haskell
//  * review r = runIdentity . unTagged . r . Tagged . Identity
//  * ```
//  */
// export const review =
//   <T, B> (r: ExplA<AReview<T, B>>) =>
//   (x: B): T =>
//     pipe_ (x, Identity, Tagged, r ("Identity"), unTagged, runIdentity)

// export interface _Just extends Prism<Maybe<any>, Maybe<any>, any, any> {
//   (lift: (x: any) => Identity<any>): (m: Maybe<any>) => Identity<Maybe<any>>
// }

// export const _Just =
//   prism<any, Maybe<any>> (Just)
//                          (maybe<Either<Maybe<any>, any>> (Left (Nothing))
//                                                          (Right)) as
//     <A, B> (t: ApplicativeName) => Prism<Maybe<A>, Maybe<B>, A, B>

// export const isPrism =
//   (x: any): x is ((t: ApplicativeName) => Prism<any, any, any, any>) =>
//     typeof x === "function" && x !== null && x.isPrism === true
