/**
 * @module Lens
 *
 * Simple `Lens` implementation.
 *
 * @author Lukas Obermann
 */

import { pipe } from 'ramda';
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
  <FA, FB> (fmap: Fmap<FA, FB, A, B>) => (lift: (x: B) => FB) => (m: A) => FA

/**
 * `lens :: (a -> b) -> (a -> b -> a) -> Lens a b`
 *
 * Create a new `Lens` with the given getter and setter functions.
 */
export const lens =
  <A, B>
  (getter: (m: A) => B) =>
  (setter: (m: A) => (x: B) => A): Lens<A, B> =>
  fmap => lift => m => fmap (setter (m)) (lift (getter (m)))

/**
 * `view :: Lens a b -> a -> b`
 */
export const view = <A, B> (l: Lens<A, B>) => (m: A): B =>
  Const.getConst (l (Const.fmap) (Const.Const) (m))

/**
 * `over :: Lens a b -> (b -> b) -> a -> a`
 */
export const over = <A, B> (l: Lens<A, B>) => (f: (x: B) => B) => (m: A): A =>
  Identity.runIdentity (l (Identity.fmap) (pipe (f, Identity.Identity)) (m))

/**
 * `set :: Lens a b -> b -> a -> a`
 */
export const set = <A, B> (l: Lens<A, B>) => (x: B) => over (l) (_ => x)


// COMPOSING LENSES

interface PipeL {
  <A, B> (
    fn0: Lens<A, B>): Lens<A, B>;

  <A, B, C> (
    fn0: Lens<A, B>,
    fn1: Lens<B, C>): Lens<A, C>;

  <A, B, C, D> (
    fn0: Lens<A, B>,
    fn1: Lens<B, C>,
    fn2: Lens<C, D>): Lens<A, D>;

  <A, B, C, D, E> (
    fn0: Lens<A, B>,
    fn1: Lens<B, C>,
    fn2: Lens<C, D>,
    fn3: Lens<D, E>): Lens<A, E>;

  <A, B, C, D, E, F> (
    fn0: Lens<A, B>,
    fn1: Lens<B, C>,
    fn2: Lens<C, D>,
    fn3: Lens<D, E>,
    fn4: Lens<E, F>): Lens<A, F>;
}

type Fmap<FA, FB, A, B> = (fn: (x: B) => A) => (f: FB) => FA

/**
 * `pipeL`
 */
export const pipeL: PipeL =
  (...lenses: Lens<any, any>[]) =>
  (fmap: Fmap<any, any, any, any>) =>
  (lift: (x: any) => any): ((m: any) => any) =>
    lenses .reduceRight ((liftAcc, f) => f (fmap) (liftAcc), lift)


// NAMESPACED FUNCTIONS

export const Lens = {
  lens,
  view,
  over,
  set,
  pipeL,
}
