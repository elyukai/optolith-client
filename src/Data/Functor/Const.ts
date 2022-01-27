/**
 * @module Data.Functor.Const
 *
 * `Const` is like the `id` function as a functor. It always keeps its initial
 * value.
 *
 * @author Lukas Obermann
 */

import { Internals } from "../Internals"

// CONSTRUCTOR

export import Const = Internals.Const

/**
 * `getConst :: Const a b -> a`
 */
export const getConst = <A, B> (x: Const<A, B>): A => x .value


// CUSTOM CONST FUNCTIONS

export const { isConst } = Internals
