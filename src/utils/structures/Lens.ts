/**
 * @module Lens
 *
 * Simple `Lens` implementation.
 *
 * @author Lukas Obermann
 */

// import { pipe } from 'ramda';
import * as Const from './Const';
import * as Identity from './Identity';

/**
 * `Lens a b = Functor f => (b -> f b) -> a -> f a`
 *
 * A getter and setter combined. Can be used by `Lens` functions.
 *
 * This implementation has one more argument because the needed `fmap` cannot be
 * selected by this function, so `fmap` must be passed.
 *
 * `Lens a b = Functor f => ((b -> a) -> f b -> f a) -> (b -> f b) -> a -> f a`
 */
export type Lens<A, B> =
  <FA, FB> (fmap: (fn: (x: B) => A) => (f: FB) => FA) => (lift: (x: B) => FB) => (m: A) => FA

/**
 * `lens :: (a -> b) -> (a -> b -> a) -> Lens a b`
 *
 * Create a new `Lens` with the given getter and setter functions.
 */
export const lens =
  <A, B>
  (getter: (m: A) => B) =>
  (setter: (m: A) => (x: B) => A): Lens<A, B> =>
  <FA, FB>
  (fmap: (fn: (x: B) => A) => (f: FB) => FA) =>
  (lift: (x: B) => FB) =>
  (m: A): FA => fmap (setter (m)) (lift (getter (m)))

/**
 * `view :: Lens a b -> a -> b`
 */
export const view = <A, B> (l: Lens<A, B>) => (m: A): B =>
  Const.getConst (l (Const.fmap) (Const.Const) (m));

/**
 * `over :: Lens a b -> (b -> b) -> a -> a`
 */
export const over = <A, B> (l: Lens<A, B>) => (f: (x: B) => B) => (m: A): A =>
  Identity.runIdentity (l (Identity.fmap) (y => Identity.Identity (f (y))) (m));

/**
 * `set :: Lens a b -> b -> a -> a`
 */
export const set = <A, B> (l: Lens<A, B>) => (x: B) => over (l) (_ => x);

// /**
//  * `compose :: Lens b c -> Lens a b -> Lens a c`
//  */
// export const compose = <A, B, C> (second: Lens<B, C>) => (first: Lens<A, B>): Lens<A, C> =>
//   lens (pipe (first .getter, second .getter))
//        (m => x => first .setter (m)
//                                 (second .setter (first .getter (m))
//                                                 (x)));
