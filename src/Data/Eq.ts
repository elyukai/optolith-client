/**
 * @module Data.Eq
 *
 * @author Lukas Obermann
 */

import { Internals } from "./Internals";
import { show } from "./Show";

import Some = Internals.Some
import Maybe = Internals.Maybe
import Record = Internals.Record
import OrderedMap = Internals.OrderedMap
import OrderedSet = Internals.OrderedSet

const flengthMap = (xs: OrderedMap<any, any>): number => xs .value .size

const flength = (xs: OrderedSet<any>): number => xs .value .size

export const elem =
  <A> (e: A) => (xs: OrderedSet<A>): boolean =>
    [...xs .value] .some (equals (e))

export const all =
  <A> (f: (x: A) => boolean) => (xs: OrderedSet<A>): boolean =>
    [...xs .value] .every (f)

/**
 * `(==) :: a -> a -> Bool`
 *
 * Returns if both given values are equal.
 */
export const equals =
  // tslint:disable-next-line: cyclomatic-complexity
  <A extends Some> (x1: A) => (x2: A): boolean => {
    if (typeof x1 !== typeof x2) {
      return false
    }

    if (Internals.isMaybe (x1)) {
      return Internals.isMaybe (x2)
        && (
          Internals.isNothing (x1) && Internals.isNothing (x2 as unknown as Maybe<any>)
          || Internals.isJust (x1) && Internals.isJust (x2) && equals (x1 .value) (x2 .value)
        )
    }

    if (Internals.isEither (x1)) {
      return Internals.isEither (x2)
        && Internals.isRight (x1) === Internals.isRight (x2)
        && equals (x1 .value) (x2 .value)
    }

    if (Internals.isList (x1)) {
      const equalsCons =
        (xs1: any, xs2: any): boolean =>
          Internals.isNil (xs1)
          && Internals.isNil (xs2)
          || !Internals.isNil (xs1)
          && !Internals.isNil (xs2)
          && equals (xs1 .x) (xs2 .x)
          && equalsCons (xs1 .xs, xs2 .xs)

      return Internals.isList (x2) && equalsCons (x1, x2)
    }

    if (Internals.isPair (x1)) {
      return Internals.isPair (x2)
        && equals (x1 .first) (x2 .first)
        && equals (x1 .second) (x2 .second)
    }

    if (Internals.isOrderedSet (x1)) {
      if (Internals.isOrderedSet (x2)) {
        const firstValues = [...x1]
        const secondValues = [...x2]

        return flength (x1) === flength (x2)
          && firstValues .every ((e, i) => equals (e) (secondValues [i]))
      }

      return false
    }

    if (Internals.isOrderedMap (x1)) {
      if (Internals.isOrderedMap (x2)) {
        const firstValues = [...x1]
        const secondValues = [...x2]

        return flengthMap (x1) === flengthMap (x2)
          && firstValues .every (
            ([k, v], i) => {
              const second = secondValues [i]

              return equals (k) (second [0]) && equals (v) (second [1])
            }
          )
      }

      return false
    }

    if (Internals.isRecord (x1)) {
      if (Internals.isRecord (x2)) {
        return flength (x1 .keys) === flength (x2 .keys)
          && all
            (key => elem (key) (x2 .keys)
              && equals (getRecordField<typeof x1["defaultValues"]>
                          (key as string)
                          (x1))
                        (getRecordField<typeof x2["defaultValues"]>
                          (key as string)
                          (x2)))
            (x1 .keys)
      }

      return false
    }

    // tslint:disable-next-line: strict-type-predicates
    if (typeof x1 === "bigint") {
      // tslint:disable-next-line: strict-type-predicates
      return typeof x2 === "bigint" && x1 === x2
    }

    if (typeof x1 === "boolean") {
      return typeof x2 === "boolean" && x1 === x2
    }

    if (typeof x1 === "number") {
      return typeof x2 === "number" && x1 === x2
    }

    if (typeof x1 === "string") {
      return typeof x2 === "string" && x1 === x2
    }

    if (typeof x1 === "symbol") {
      return typeof x2 === "symbol" && x1 === x2
    }

    if (x1 === undefined) {
      return x2 === undefined
    }

    if (x1 === null) {
      return x2 === null
    }

    if (x1 instanceof Date) {
      return x2 instanceof Date && x1 .toISOString () === x2 .toISOString ()
    }

    return x1 === x2
  }

/**
 * `(!=) :: Maybe a -> Maybe a -> Bool`
 *
 * Returns if both given values are not equal.
 */
export const notEquals =
  <A extends Some> (m1: A) => (m2: A): boolean =>
    !equals (m1) (m2)

const getRecordField = <A> (key: keyof A) => (r: Record<A>) => {
  if (elem (key as string) (r .keys)) {
    const specifiedValue = r .values [key]

    // tslint:disable-next-line: strict-type-predicates
    if (specifiedValue !== null && specifiedValue !== undefined) {
      return specifiedValue as A[typeof key]
    }

    return r .defaultValues [key]
  }

  throw new TypeError (`Key ${show (key)} is not in Record ${show (r)}!`)
}


// NAMESPACED FUNCTIONS

export const Eq = {
  equals,
  notEquals,
}
