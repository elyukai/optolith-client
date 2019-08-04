/**
 * @module Data.Ord
 *
 * The `Ord` class is used for totally ordered datatypes.
 *
 * @author Lukas Obermann
 */

export type Ordering = LT | EQ | GT

export type LT = typeof LT
export const LT = Symbol ("LT")

export type EQ = typeof EQ
export const EQ = Symbol ("EQ")

export type GT = typeof GT
export const GT = Symbol ("GT")

export const isLTorEQ = (x: Ordering): x is LT | EQ => x === LT || x === EQ

/**
 * Convert a native ordering returned from a native compare function (e.g.
 * `Intl.Collator#compare`) into `Ordering` where a negative number will be
 * converted to `LT`, a positive number to `GT` and `0` to `EQ`.
 */
export const toOrdering = (n: number) => n < 0 ? LT : n > 0 ? GT : EQ

export const isOrdering = (x: any) => [LT, EQ, GT] .includes (x)
