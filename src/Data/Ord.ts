/**
 * @module Data.Ord
 *
 * The `Ord` class is used for totally ordered datatypes.
 *
 * @author Lukas Obermann
 */

export type Ordering = LT | EQ | GT

/**
 * ```haskell
 * type Compare = a -> a -> Ordering
 * ```
 *
 * A compare function returns how the elements are related in terms of order.
 *
 * The returned `Ordering` is to be read *x Ordering y*, so that if `x` is
 * larger than `y`, `GT` is returned.
 */
export type Compare<A> = (x: A) => (y: A) => Ordering

export const LT = Symbol ("LT")
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LT = typeof LT

export const EQ = Symbol ("EQ")
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type EQ = typeof EQ

export const GT = Symbol ("GT")
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GT = typeof GT

export const isLTorEQ = (x: Ordering): x is LT | EQ => x === LT || x === EQ

/**
 * ```haskell
 * toOrdering :: Int -> Ordering
 * ```
 *
 * Convert a native ordering returned from a native compare function (e.g.
 * `Intl.Collator#compare`) into `Ordering` where a negative number will be
 * converted to `LT`, a positive number to `GT` and `0` to `EQ`.
 */
export const toOrdering: (n: number) => Ordering = n => n < 0 ? LT : n > 0 ? GT : EQ

export const isOrdering = (x: any) => [ LT, EQ, GT ] .includes (x)
