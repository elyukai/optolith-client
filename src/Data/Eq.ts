/**
 * @module Data.Eq
 *
 * @author Lukas Obermann
 */

import { isEither, isRight } from "./Either";
import { fnull, isList } from "./List";
import { isJust, isMaybe, isNothing, Maybe, Some } from "./Maybe";
import { isOrderedMap, OrderedMap } from "./OrderedMap";
import { all, isOrderedSet, member, OrderedSet } from "./OrderedSet";
import { isRecord, Record } from "./Record";
import { show } from "./Show";
import { isTuple } from "./Tuple";

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

    if (isMaybe (x1)) {
      return isMaybe (x2)
        && (
          isNothing (x1) && isNothing (x2 as unknown as Maybe<any>)
          || isJust (x1) && isJust (x2) && equals (x1 .value) (x2 .value)
        )
    }

    if (isEither (x1)) {
      return isEither (x2)
        && isRight (x1) === isRight (x2)
        && equals (x1 .value) (x2 .value)
    }

    if (isList (x1)) {
      const equalsCons =
        (xs1: any, xs2: any): boolean =>
          fnull (xs1)
          && fnull (xs2)
          || !fnull (xs1)
          && !fnull (xs2)
          && equals (xs1 .x) (xs2 .x)
          && equalsCons (xs1 .xs, xs2 .xs)

      return isList (x2) && equalsCons (x1, x2)
    }

    if (isTuple (x1)) {
      if (isTuple (x2) && x1 .length === x2 .length) {
        for (let i = 0; i < x1 .length; i++) {
          const equal = equals (x1 .values [i]) (x2 .values [i])

          if (!equal) {
            return false
          }
        }

        return true
      }

      return false
    }

    if (isOrderedSet (x1)) {
      if (isOrderedSet (x2)) {
        const firstValues = [...x1]
        const secondValues = [...x2]

        return OrderedSet.flength (x1) === OrderedSet.flength (x2)
          && firstValues .every ((e, i) => equals (e) (secondValues [i]))
      }

      return false
    }

    if (isOrderedMap (x1)) {
      if (isOrderedMap (x2)) {
        const firstValues = [...x1]
        const secondValues = [...x2]

        return OrderedMap.flength (x1) === OrderedMap.flength (x2)
          && firstValues .every (
            ([k, v], i) => {
              const second = secondValues [i]

              return equals (k) (second [0]) && equals (v) (second [1])
            }
          )
      }

      return false
    }

    if (isRecord (x1)) {
      if (isRecord (x2)) {
        return OrderedSet.flength (x1 .keys) === OrderedSet.flength (x2 .keys)
          && all
            (key => member (key) (x2 .keys)
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

export type equals<A> = (x1: A) => (x2: A) => boolean

/**
 * `(!=) :: a -> a -> Bool`
 *
 * Returns if both given values are not equal.
 */
export const notEquals =
  <A extends Some> (m1: A) => (m2: A): boolean =>
    !equals (m1) (m2)

const getRecordField = <A> (key: keyof A) => (r: Record<A>) => {
  if (member (key as string) (r .keys)) {
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
