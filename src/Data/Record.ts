/**
 * @module Data.Record
 *
 * A record is a simple data structure for key-value pairs where the keys must
 * be `String`s and all values can have different types.
 *
 * Record automatically create accessor functions to access the values inside a
 * record behind the `A` attribute of a record creator function. If you need to
 * modify or set the values, you need to `makeLenses` from the record creator
 * function. You can use the lenses with the `Data.Lens` module to view, set and
 * modify values.
 *
 * @author Lukas Obermann
 */

import { pipe } from "../App/Utilities/pipe"
import { not } from "./Bool"
import { equals } from "./Eq"
import { Internals } from "./Internals"
import { lens, Lens_ } from "./Lens"
import { show } from "./Show"

import RecordPrototype = Internals.RecordPrototype
import OrderedSet = Internals.OrderedSet
import Maybe = Internals.Maybe

const elem =
  <A> (e: A) => (xs: OrderedSet<A>): boolean =>
    [ ...xs .value ] .some (equals (e))

const foldl =
  <A, B>
  (f: (acc: B) => (current: A) => B) =>
  (initial: B) =>
  (xs: OrderedSet<A>): B =>
    [ ...xs .value ] .reduce<B> ((acc, e) => f (acc) (e), initial)


// CONSTRUCTOR

export interface Record<A extends RecordIBase<any>> extends RecordPrototype {
  readonly values: Readonly<Required<A>>
  readonly defaultValues: Readonly<A>
  readonly keys: OrderedSet<string>
  readonly unique: symbol
  readonly name: A["@@name"]
  readonly prototype: RecordPrototype
}

export interface RecordCreator<A extends RecordIBase<any>> {
  (x: PartialMaybeOrNothing<OmitName<A>>): Record<A>
  readonly keys: OrderedSet<string>
  readonly default: Record<A>
  readonly AL: Accessors<A>
  readonly A: StrictAccessors<A>
  readonly is: <B> (x: B | Record<A>) => x is Record<A>
}

const _Record =
  <A extends RecordIBase<Name>, Name extends string>
  (name: Name) =>
  (unique: symbol) =>
  (keys: OrderedSet<string>) =>
  (def: Omit<A, "@@name">) =>
  (specified: PartialMaybeOrNothing<Omit<A, "@@name">>): Record<A> =>
    Object.create (
      RecordPrototype,
      {
        values: {
          value: Object.freeze (specified),
          enumerable: true,
        },
        defaultValues: {
          value: def,
          enumerable: true,
        },
        keys: {
          value: keys,
          enumerable: true,
        },
        unique: {
          value: unique,
          enumerable: true,
        },
        name: {
          value: name,
          enumerable: true,
        },
      }
    )

const accessor =
  <A extends RecordIBase<Name>, Name extends string = A["@@name"]>
  (key: keyof A) =>
  (r: Record<A>) => {
    if (elem<keyof A> (key) (r .keys)) {
      const x = r .values [key]

      return Internals.isMaybe (x) && Internals.isNothing (x) ? r .defaultValues [key] : x
    }

    throw new TypeError (`Key ${show (key)} is not in Record ${show (r)}!`)
  }

const setter =
  <A extends RecordIBase<Name>, Name extends string = A["@@name"]>
  (key: keyof A) =>
  (r: Record<A>) =>
  (x: A[typeof key]) =>
    r .values [key] === x
    ? r
    : _Record<A, Name> (r .name)
                       (r .unique)
                       (r .keys)
                       (r .defaultValues)
                       ({
                         ...r .values,
                         [key]: x,
                       })

/**
 * Creates accessor functions for every key in the passed record creator.
 */
const makeAccessors =
  <A extends RecordIBase<any>>
  (keys: OrderedSet<string>): Accessors<A> =>
    Object.freeze (foldl<string, Accessors<A>> (acc => key => ({
                                                 ...acc,
                                                 [key]: accessor (key),
                                               }))
                                               ({} as Accessors<A>)
                                               (keys))

export const fromDefault =
  <Name extends string>(name: Name) =>
  <A extends RecordIBase<Name>> (def: Omit<A, "@@name">): RecordCreator<A> => {
    const defaultValues = Object.freeze (Object.entries (def) .reduce<Required<A>> (
      (acc, [ key, value ]) => {
        if (typeof key !== "string") {
          throw new TypeError (
            `Record key must be a String! Got ${show (key)} instead.`
          )
        }

        return {
          ...acc,
          [key]: value,
        }
      },
      {} as Required<A>
    ))

    const keys = Internals.setFromArray (show) (Object.keys (def))

    const unique = Symbol ("Record")

    const creator = (x: PartialMaybeOrNothing<OmitName<A>>) =>
      _Record<A, Name>
        (name)
        (unique)
        (keys)
        (defaultValues)
        (foldl<string, PartialMaybeOrNothing<A>>
          (acc => key => {
              // Maybe undefined!
              const value =
                (x as Required<A>) [key] as MaybeOrPartialMaybe<A[string]> === undefined
                  ? Internals.Nothing
                  : (x as Required<A>) [key] as MaybeOrPartialMaybe<A[string]>

              const defaultValue = defaultValues [key]

              return elem (key) (keys)
                && (
                  (Internals.isMaybe (defaultValue) && Internals.isJust (value))
                  || (
                    !Internals.isMaybe (defaultValue)
                    && value !== null
                    && value !== undefined
                    && !Internals.isNothing (value)
                  )
                )
                ? { ...acc, [key]: value } as PartialMaybeOrNothing<A>
                : acc
          })
          (defaultValues)
          (keys))

    creator.keys = keys

    creator.default = creator (defaultValues)

    creator.AL = makeAccessors<A> (keys)
    creator.A = creator.AL as StrictAccessors<A>

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    creator.is = <B> (x: B | Record<A>): x is Record<A> => isRecord (x) && x.unique === unique

    return Object.freeze (creator)
  }


// LENSES

/**
 * Creates lenses for every key in the passed record creator.
 */
export const makeLenses =
  <A extends RecordIBase<Name>, Name extends string = A["@@name"]>
  (record: RecordCreator<A>): Lenses<A> =>
    Object.freeze (
      foldl<string, Lenses<A>> (acc => key => ({
                                 ...acc,
                                 [key]: lens<Record<A>, A[typeof key]> (record.A [key])
                                                                       (setter (key)),
                               }))
                               ({} as Lenses<A>)
                               (record .keys)
    )


// CUSTOM FUNCTIONS

/**
 * `member :: String -> Record a -> Bool`
 *
 * Is the key a member of the record?
 */
export const member =
  (key: string) => (mp: Record<any>): boolean => elem (key) (mp .keys)

/**
 * `notMember :: String -> Record a -> Bool`
 *
 * Is the key not a member of the record?
 */
export const notMember = (key: string) => pipe (member (key), not)

/**
 * Converts the passed record to a native object.
 */
export const toObject = <A extends RecordIBase<any>> (r: Record<A>): Omit<A, "@@name"> =>
  ({ ...r .defaultValues, ...r .values })

export import isRecord = Internals.isRecord


// NAMESPACED FUNCTIONS

export const Record = {
  fromDefault,

  makeLenses,
  member,
  notMember,
  toObject,
  isRecord,
}


// TYPE HELPERS

export type Accessor<A extends RecordIBase<any>, K extends keyof A> =
  (r: Record<Pick<A, K> & { "@@name": string }>) => A[K]

export type Accessors<A extends RecordIBase<any>> = {
  [K in keyof OmitName<Required<A>>]: Accessor<A, K>
}

export type StrictAccessor<A extends RecordIBase<any>, K extends keyof A> =
  (r: Record<A>) => A[K]

export type StrictAccessors<A extends RecordIBase<any>> = {
  [K in keyof OmitName<Required<A>>]: StrictAccessor<A, K>
}

export type Lenses<A extends RecordIBase<any>> = {
  [K in keyof OmitName<Required<A>>]: Lens_<Record<A>, A[K]>
}

export interface UnsafeStringKeyObject<V> {
  [id: string]: V
}

export interface StringKeyObject<V> {
  readonly [id: string]: V
}

export interface NumberKeyObject<V> {
  readonly [id: number]: V
}

/**
 * From T remove a set of properties K
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type RecordI<T> = T extends Record<infer O> ? O : never

// type ObjectDeleteProperty<T, D extends keyof T> = {
//   [K in Exclude<keyof T, D>]: T[K]
// }

export type RequiredExcept<A extends RecordBase, K extends keyof A> = {
  [K1 in Exclude<keyof A, K>]-?: Exclude<A[K1], undefined>
} & {
  [K1 in K]?: A[K1]
}

type PartialMaybeRequiredKeys<A extends RecordBase> = {
  [K in keyof A]: A[K] extends Maybe<any> ? never : K
} [keyof A]

type PartialMaybePartialKeys<A extends RecordBase> = {
  [K in keyof A]: A[K] extends Maybe<any> ? K : never
} [keyof A]

type MaybeOrPartialMaybe<A> = A extends Maybe<any> ? A : A | Internals.Nothing

/**
 * All `Maybe` properties will be optional and all others required.
 */
export type PartialMaybeOrNothing<A extends RecordBase> = {
  [K in PartialMaybeRequiredKeys<A>]-?: A[K] extends Maybe<any> ? never : (A[K] | Internals.Nothing)
} & {
  [K in PartialMaybePartialKeys<A>]?: A[K] extends Maybe<any> ? A[K] : never
}

export type RecordIBase<Name extends string> = RecordBase & { "@@name": Name }

export type OmitName<A extends RecordIBase<any>> = Omit<A, "@@name">

export interface RecordBase {
  [key: string]: any
}
