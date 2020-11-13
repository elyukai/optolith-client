/**
 * @module Data.Eq
 *
 * @author Lukas Obermann
 */

import * as ReEq from "./Ley_Eq.gen"

/**
 * `(==) :: a -> a -> Bool`
 *
 * Returns if both given values are equal.
 */
export const equals = <A> (x1: A) => (x2: A): boolean => {
    if (Internals.isMaybe (x1)) {
      return Internals.isMaybe (x2)
        && (
          (Internals.isNothing (x1) && Internals.isNothing (x2 as unknown as Maybe<any>))
          || (Internals.isJust (x1) && Internals.isJust (x2) && equals (x1 .value) (x2 .value))
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
          (Internals.isNil (xs1) && Internals.isNil (xs2))
          || (!Internals.isNil (xs1)
            && !Internals.isNil (xs2)
            && equals (xs1 .x) (xs2 .x)
            && equalsCons (xs1 .xs, xs2 .xs))

      return Internals.isList (x2) && equalsCons (x1, x2)
    }

    if (Internals.isTuple (x1)) {
      if (Internals.isTuple (x2) && x1 .length === x2 .length) {
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

    if (Internals.isOrderedSet (x1)) {
      if (Internals.isOrderedSet (x2)) {
        const firstValues = [ ...x1 ]
        const secondValues = [ ...x2 ]

        return flength (x1) === flength (x2)
          && firstValues .every ((e, i) => equals (e) (secondValues [i]))
      }

      return false
    }

    if (Internals.isOrderedMap (x1)) {
      if (Internals.isOrderedMap (x2)) {
        const firstValues = [ ...x1 ]
        const secondValues = [ ...x2 ]

        return flengthMap (x1) === flengthMap (x2)
          && firstValues .every (
            ([ k, v ], i) => {
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
          && all (key => elem (key) (x2 .keys)
                   && equals (getRecordField<any> (key as string) (x1 as Record<any>))
                             (getRecordField<any> (key as string) (x2 as Record<any>)))
                 (x1 .keys)
      }

      return false
    }

    if (Internals.isMap (x1)) {
      if (Internals.isMap (x2)) {
        return on (equals) (size) (x1) (x2) && on (equals) (assocs) (x1) (x2)
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

    if (typeof x1 === "object" && typeof x2 === "object") {
      return Object.entries (x1) .every (([ k1, v1 ]) => equals ((x2 as any)[k1]) (v1))
    }

    return x1 === x2
  }

// const equalsMap = (mp1: Map<any, any>) => (mp2: Map<any, any>): boolean =>
//   isTip (mp1) === isTip (mp2)
//   && (
//     isTip (mp1)
//     || equals (mp1.key) ((mp2 as Bin<any, any>) .key)
//     && equals (mp1 .value) ((mp2 as Bin<any, any>) .value)
//     && equalsMap (mp1 .left) ((mp2 as Bin<any, any>) .left)
//     && equalsMap (mp1 .right) ((mp2 as Bin<any, any>) .right)
//   )

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type equals<A> = (x1: A) => (x2: A) => boolean

/**
 * `(!=) :: a -> a -> Bool`
 *
 * Returns if both given values are not equal.
 */
export const notEquals =
  <A> (m1: A) => (m2: A): boolean =>
    ReEq.notEquals (m1, m2)


// NAMESPACED FUNCTIONS

export const Eq = {
  equals,
  notEquals,
}
