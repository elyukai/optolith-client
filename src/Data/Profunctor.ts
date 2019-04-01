/**
 * @module Data.Profunctor
 *
 * @author Lukas Obermann
 */

import { pipe } from "../App/Utilities/pipe";
import { isFunction } from "../App/Utilities/typeCheckUtils";
import { contramap } from "./Contravariant";
import { first } from "./Either";
import { fmap } from "./Functor";
import { isMarket, Market } from "./Market";
import { showP } from "./Show";
import { isTagged, Tagged } from "./Tagged";

export type Profunctor<B, C> = Market<any, any, B, C>
                             | Tagged<B, C>
                             | ((x: B) => C)

export type ProfunctorDimap<A, B, C, D> =
  <F extends Profunctor<B, C>>
  (x: F) =>
    F extends Market<infer A_, infer B_, B, C> ? Market<A_, B_, A, D> :
    F extends Tagged<B, C> ? Tagged<A, D> :
    F extends ((x: B) => C) ? ((x: A) => D) :
    never

/**
 * `dimap :: (a -> b) -> (c -> d) -> p b c -> p a d`
 *
 * Map over both arguments at the same time.
 */
export const dimap =
  <A, B>
  (a2b: (x: A) => B) =>
  <C, D>
  (c2d: (x: C) => D): ProfunctorDimap<A, B, C, D> =>
  (x: Profunctor<any, any>): any => {
    if (isMarket (x)) {
      return Market (fmap (c2d) (x.to)) (contramap (a2b) (pipe (x.fro, first (c2d))))
    }

    if (isTagged (x)) {
      return Tagged ((c2d) (x.x))
    }

    if (isFunction (x)) {
      return pipe (a2b, x, c2d)
    }

    throw new TypeError (instanceErrorMsg ("dimap") (x))
  }

export type ProfunctorRmap<B, C> =
  <F extends Profunctor<any, B>>
  (x: F) =>
    F extends Market<infer A_, infer B_, infer A, B> ? Market<A_, B_, A, C> :
    F extends Tagged<infer A1, B> ? Tagged<A1, C> :
    F extends ((x: infer A2) => B) ? ((x: A2) => C) :
    never

/**
 * `rmap :: (b -> c) -> p a b -> p a c`
 *
 * Map the second argument covariantly.
 */
export const rmap =
  <B, C>
  (b2c: (x: B) => C): ProfunctorRmap<B, C> =>
  (x: Profunctor<any, any>): any => {
    if (isMarket (x)) {
      return Market (fmap (b2c) (x.to)) (pipe (x.fro, first (b2c)))
    }

    if (isTagged (x)) {
      return Tagged (b2c (x.x))
    }

    if (isFunction (x)) {
      return pipe (x, b2c)
    }

    throw new TypeError (instanceErrorMsg ("rmap") (x))
  }

const instanceErrorMsg =
  (fname: string) =>
  (x: any) =>
    `${fname}: missing instance of Profunctor\n${showP (x)}`
