/**
 * @module Data.Record
 *
 * A record is a simple data structure for key-value pairs where the keys must
 * be `String`s and all values can have different types.
 *
 * @author Lukas Obermann
 */

import { pipe } from "../App/Utilities/pipe";
import { not } from "./Bool";
import { equals } from "./Eq";
import { Internals } from "./Internals";
import { lens, Lens_ } from "./Lens";
import { show } from "./Show";

import RecordPrototype = Internals.RecordPrototype
import OrderedSet = Internals.OrderedSet
import Maybe = Internals.Maybe

const elem =
  <A> (e: A) => (xs: OrderedSet<A>): boolean =>
    [...xs .value] .some (equals (e))

const foldl =
  <A, B>
  (f: (acc: B) => (current: A) => B) =>
  (initial: B) =>
  (xs: OrderedSet<A>): B =>
    [...xs .value] .reduce<B> ((acc, e) => f (acc) (e), initial)


// CONSTRUCTOR

export interface Record<A extends RecordBase> extends RecordPrototype {
  readonly values: Readonly<Required<A>>
  readonly defaultValues: Readonly<A>
  readonly keys: OrderedSet<string>
  readonly unique: symbol
  readonly name?: string
  readonly prototype: RecordPrototype
}

export interface RecordCreator<A extends RecordBase> {
  (x: PartialMaybeOrNothing<A>): Record<A>
  readonly keys: OrderedSet<string>
  readonly default: Record<A>
  readonly AL: Accessors<A>
  readonly A: StrictAccessors<A>
  readonly is: <B> (x: B | Record<A>) => x is Record<A>
}

const _Record =
  <A extends RecordBase>
  (name?: string) =>
  (unique: symbol) =>
  (keys: OrderedSet<string>) =>
  (def: A) =>
  (specified: PartialMaybeOrNothing<A>): Record<A> =>
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

const _createRecordCreator =
  (name?: string) =>
  <A extends RecordBase> (def: Required<A>): RecordCreator<A> => {
    const defaultValues = Object.freeze (Object.entries (def) .reduce<Required<A>> (
      (acc, [key, value]) => {
        // tslint:disable-next-line: strict-type-predicates
        if (typeof key !== "string") {
          throw new TypeError (
            `Record key must be a String! Got ${show (key)} instead.`
          )
        }

        // tslint:disable-next-line: strict-type-predicates
        if (value === null || value === undefined) {
          throw new TypeError (
            `Record field must not be a nullable value! Got ${show (value)} at `
            + `key ${show (key)} instead.`
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

    const creator = (x: PartialMaybeOrNothing<A>) =>
      _Record<A>
        (name)
        (unique)
        (keys)
        (defaultValues)
        (foldl<string, PartialMaybeOrNothing<A>>
          (
            acc => key => {
              // Maybe undefined!
              const value =
                (x as Required<A>) [key] as MaybeOrPartialMaybe<A[string]> === undefined
                  ? Internals.Nothing
                  : (x as Required<A>) [key] as MaybeOrPartialMaybe<A[string]>

              const defaultValue = defaultValues [key]

              return elem (key) (keys)
                && (
                  Internals.isMaybe (defaultValue) && Internals.isJust (value)
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
          (keys)
        )

    creator.keys = keys

    creator.default = creator (defaultValues)

    creator.AL = makeAccessors<A> (keys)
    creator.A = creator.AL as StrictAccessors<A>

    creator.is = <B> (x: B | Record<A>): x is Record<A> => isRecord (x) && x.unique === unique

    return Object.freeze (creator)
  }

export const fromDefault = _createRecordCreator ()

// tslint:disable-next-line: no-unnecessary-callback-wrapper
export const fromNamedDefault = (name: string) => _createRecordCreator (name)


// LENSES

/**
 * Creates lenses for every key in the passed record creator.
 */
export const makeLenses =
  <A extends RecordBase>
  (record: RecordCreator<A>): Lenses<A> =>
    Object.freeze (
      foldl<string, Lenses<A>> (acc => key => ({
                                 ...acc,
                                 [key]: lens<Record<A>, A[typeof key]> (record.AL [key])
                                                                       (setter (key)),
                               }))
                               ({} as Lenses<A>)
                               (record .keys)
    )


// MERGING RECORDS

const mergeSafe = <A extends RecordBase> (x: Partial<A>) => (r: Record<A>): Record<A> =>
  _Record<A> (r .name)
             (r .unique)
             (r .keys)
             (r .defaultValues)
             (foldl<string, Required<A>> (acc => key => ({
                                           ...acc,
                                           // tslint:disable-next-line: strict-type-predicates
                                           [key]: x [key] === null || x [key] === undefined
                                             ? r .values [key]
                                             : x [key],
                                         }))
                                         ({} as Required<A>)
                                         (r .keys))

/**
 * `mergeSafeR2 :: Record r => r a -> r a -> r a`
 *
 * `mergeSafeR2 x r` inserts properties from the passed records into `r`
 * that are part of `r`. It ignores all other properties in the other passed
 * records. Processes passed records in reverse order, so that `x` is being
 * merged into `r`. Returns the updated `Record`.
 */
export const mergeSafeR2 =
  <A extends RecordBase> (x: Record<Partial<A>>) => (r: Record<A>): Record<A> =>
    mergeSafe<A> (x .values) (r)

/**
 * `mergeSafeR3 :: Record r => r a -> r a -> r a -> r a`
 *
 * `mergeSafeR3 x2 x1 r` inserts properties from the passed records into `r`
 * that are part of `r`. It ignores all other properties in the other passed
 * records. Processes passed records in reverse order, so that `x1` is being
 * merged into `r` and so on. Returns the updated `Record`.
 */
export const mergeSafeR3 =
  <A extends RecordBase>
  (x2: Record<Partial<A>>) =>
  (x1: Record<Partial<A>>) =>
  (r: Record<A>): Record<A> =>
    mergeSafe<A> ({ ...x1 .values, ...x2 .values }) (r)

/**
 * `mergeSafeR4 :: Record r => r a -> r a -> r a -> r a -> r a`
 *
 * `mergeSafeR4 x3 x2 x1 r` inserts properties from the passed records into `r`
 * that are part of `r`. It ignores all other properties in the other passed
 * records. Processes passed records in reverse order, so that `x1` is being
 * merged into `r` and so on. Returns the updated `Record`.
 */
export const mergeSafeR4 =
  <A extends RecordBase>
  (x3: Record<Partial<A>>) =>
  (x2: Record<Partial<A>>) =>
  (x1: Record<Partial<A>>) =>
  (r: Record<A>): Record<A> =>
    mergeSafe<A> ({ ...x1 .values, ...x2 .values, ...x3 .values }) (r)

/**
 * `mergeSafeR5 :: Record r => r a -> r a -> r a -> r a -> r a -> r a`
 *
 * `mergeSafeR5 x4 x3 x2 x1 r` inserts properties from the passed records into
 * `r` that are part of `r`. It ignores all other properties in the other passed
 * records. Processes passed records in reverse order, so that `x1` is being
 * merged into `r` and so on. Returns the updated `Record`.
 */
export const mergeSafeR5 =
  <A extends RecordBase>
  (x4: Record<Partial<A>>) =>
  (x3: Record<Partial<A>>) =>
  (x2: Record<Partial<A>>) =>
  (x1: Record<Partial<A>>) =>
  (r: Record<A>): Record<A> =>
    mergeSafe<A> ({ ...x1 .values, ...x2 .values, ...x3 .values, ...x4 .values }) (r)


// CUSTOM FUNCTIONS

const accessor = <A extends RecordBase> (key: keyof A) => (r: Record<A>) => {
  if (elem<keyof A> (key) (r .keys)) {
    const x = r .values [key]

    return Internals.isMaybe (x) && Internals.isNothing (x) ? r .defaultValues [key] : x
  }

  throw new TypeError (`Key ${show (key)} is not in Record ${show (r)}!`)
}

const setter = <A extends RecordBase> (key: keyof A) => (r: Record<A>) => (x: A[typeof key]) =>
  r .values [key] === x
  ? r
  : _Record<A> (r .name)
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
  <A extends RecordBase> (keys: OrderedSet<string>): Accessors<A> =>
    Object.freeze (foldl<string, Accessors<A>> (acc => key => ({
                                                 ...acc,
                                                 [key]: accessor (key),
                                               }))
                                               ({} as Accessors<A>)
                                               (keys))

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
export const toObject = <A extends RecordBase> (r: Record<A>): A =>
  ({ ...r .defaultValues, ...r .values })

export import isRecord = Internals.isRecord


// NAMESPACED FUNCTIONS

export const Record = {
  fromDefault,

  mergeSafeR2,
  mergeSafeR3,
  mergeSafeR4,
  mergeSafeR5,

  makeLenses,
  member,
  notMember,
  toObject,
  isRecord,
}


// TYPE HELPERS

export type Accessor<A extends RecordBase, K extends keyof A> =
  (r: Record<Pick<A, K>>) => A[K]

export type Accessors<A extends RecordBase> = {
  [K in keyof A]: Accessor<A, K>
}

export type StrictAccessor<A extends RecordBase, K extends keyof A> =
  (r: Record<A>) => A[K]

export type StrictAccessors<A extends RecordBase> = {
  [K in keyof A]: StrictAccessor<A, K>
}

export type Lenses<A extends RecordBase> = {
  [K in keyof A]: Lens_<Record<A>, A[K]>
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

type PartialMaybeRequiredKeys<A> = {
  [K in keyof A]: A[K] extends Maybe<any> ? never : K
} [keyof A]

type PartialMaybePartialKeys<A> = {
  [K in keyof A]: A[K] extends Maybe<any> ? K : never
} [keyof A]

type MaybeOrPartialMaybe<A> = A extends Maybe<any> ? A : A | Internals.Nothing

/**
 * All `Maybe` properties will be optional and all others required.
 */
export type PartialMaybeOrNothing<A> = {
  [K in PartialMaybeRequiredKeys<A>]-?: A[K] extends Maybe<any> ? never : (A[K] | Internals.Nothing)
} & {
  [K in PartialMaybePartialKeys<A>]?: A[K] extends Maybe<any> ? A[K] : never
}

export interface RecordBase {
  [key: string]: any
}
