/**
 * @module Data.Eq
 *
 * @author Lukas Obermann
 */

import { on } from "./Function"
import { Internals } from "./Internals"
import { RecordIBase } from "./Record"
import { show } from "./Show"
import { curry, Pair } from "./Tuple"
import { curryN } from "./Tuple/Curry"

import Maybe = Internals.Maybe
import Record = Internals.Record
import OrderedMap = Internals.OrderedMap
import OrderedSet = Internals.OrderedSet
import Map = Internals.Map
import isTip = Internals.isTip
import List = Internals.List

const flengthMap = (xs: OrderedMap<any, any>): number => xs .value .size

const flength = (xs: OrderedSet<any>): number => xs .value .size

export const elem =
  <A> (e: A) => (xs: OrderedSet<A>): boolean =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    [ ...xs .value ] .some (equals (e))

export const all =
  <A> (f: (x: A) => boolean) => (xs: OrderedSet<A>): boolean =>
    [ ...xs .value ] .every (f)

const getRecordField = <A extends RecordIBase<any>> (key: keyof A) => (r: Record<A>) => {
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

/**
 * `foldrWithKey :: (Key -> a -> b -> b) -> b -> IntMap a -> b`
 *
 * Right-associative fold of a structure.
 */
const foldrWithKey =
  <K, A, B>
  (f: (key: K) => (current: A) => (acc: B) => B) =>
  (init: B) =>
  (mp: Map<K, A>): B =>
    isTip (mp)
    ? init
    : foldrWithKey (f) (f (mp .key) (mp .value) (foldrWithKey (f) (init) (mp .right))) (mp .left)

/**
 * `size :: IntMap a -> Int`
 *
 * The number of elements in the map.
 */
const size = (mp: Map<any, any>) => isTip (mp) ? 0 : mp .size

/**
 * `assocs :: IntMap a -> [(Key, a)]`
 *
 * Return all key/value pairs in the map.
 */
const assocs =
  <K, A> (mp: Map<K, A>): List<Pair<K, A>> =>
    foldrWithKey<K, A, List<Pair<K, A>>> (curry (curryN (Internals.Cons))) (List ()) (mp)

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


export type equals<A> = (x1: A) => (x2: A) => boolean

/**
 * `(!=) :: a -> a -> Bool`
 *
 * Returns if both given values are not equal.
 */
export const notEquals =
  <A> (m1: A) => (m2: A): boolean =>
    !equals (m1) (m2)


// NAMESPACED FUNCTIONS

export const Eq = {
  equals,
  notEquals,
}
