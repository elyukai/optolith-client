/**
 * @module Ord
 *
 * The `Ord` class is used for totally ordered datatypes.
 *
 * @author Lukas Obermann
 */

export type Ordering = LT | EQ | GT

export type LT = typeof LT
export const LT = Symbol ('LT')

export type EQ = typeof LT
export const EQ = Symbol ('EQ')

export type GT = typeof LT
export const GT = Symbol ('GT')
