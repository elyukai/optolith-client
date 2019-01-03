/**
 * @module Ord
 *
 * The `Ord` class is used for totally ordered datatypes.
 *
 * @author Lukas Obermann
 */

// @ts-ignore
type _ = null

export type Ordering = LT | EQ | GT

export type LT = typeof LT
export const LT = Symbol ('LT')

export type EQ = typeof EQ
export const EQ = Symbol ('EQ')

export type GT = typeof GT
export const GT = Symbol ('GT')

export const isGTorEQ = (x: Ordering): x is GT | EQ => x === GT || x === EQ
