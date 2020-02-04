/**
 * @module Data.Contravariant
 *
 * @author Lukas Obermann
 */

import { pipe } from "../App/Utilities/pipe"
import { showP } from "./Show"

const instanceErrorMsg =
  (fname: string) =>
  (x: any) =>
    `${fname}: missing instance of Contravariant\n${showP (x)}`

export type Contravariant<A> = ((x: A) => any)

export type ContravariantMap<A, B> =
  <F extends Contravariant<A>>
  (x: F) =>
    F extends ((x: A) => infer R) ? (x: B) => R :
    never

/**
 * `contramap :: (a -> b) -> f b -> f a`
 */
export const contramap =
  <A, B>
  (f: (x: A) => B): ContravariantMap<A, B> =>
  (x: Contravariant<any>): any => {
    if (typeof x === "function") {
      return pipe (x, f)
    }

    throw new TypeError (instanceErrorMsg ("contramap") (x))
  }
