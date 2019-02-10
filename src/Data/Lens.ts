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

/**
 * `Lens a b = Functor f => (b -> f b) -> a -> f a`
 *
 * A getter and setter combined. Can be used by `Lens` functions.
 *
 * `Lens a b = Functor f => ((b -> a) -> f b -> f a) -> (b -> f b) -> a -> f a`
 */
export interface Lens<A, B> {
  (lift: (x: B) => Const<B>): (m: A) => Const<B>
  (lift: (x: B) => Identity<B>): (m: A) => Identity<A>
}

/**
 * `lens :: (a -> b) -> (a -> b -> a) -> Lens a b`
 *
 * Create a new `Lens` with the given getter and setter functions.
 */
export const lens =
  <A, B>
  (getter: (m: A) => B) =>
  (setter: (m: A) => (x: B) => A): Lens<A, B> =>
    (lift: any) => (m: any) => fmap (setter (m)) (lift (getter (m))) as any

/**
 * `view :: Lens a b -> a -> b`
 */
export const view = <A, B> (l: Lens<A, B>) => (m: A): B =>
  getConst (l (Const) (m))

/**
 * `over :: Lens a b -> (b -> b) -> a -> a`
 */
export const over = <A, B> (l: Lens<A, B>) => (f: (x: B) => B) => (m: A): A =>
  runIdentity (l (pipe (f, Identity)) (m))

/**
 * `set :: Lens a b -> b -> a -> a`
 */
export const set = <A, B> (l: Lens<A, B>) => (x: B) => over (l) (_ => x)


// NAMESPACED FUNCTIONS

export const Lens = {
  lens,
  view,
  over,
  set,
}
