/**
 * @module Record
 *
 * A record is a simple data structure for key-value pairs where the keys must
 * be `String`s and all values can have different types.
 *
 * @author Lukas Obermann
 */

import { not, pipe } from 'ramda';
import { Lens, lens } from './Lens';
import { isJust, isMaybe, isNothing, Just, Maybe, Nothing } from './Maybe';
import { foldl, fromArray, OrderedSet } from './OrderedSet';
import { show } from './Show';


// CONSTRUCTOR

interface RecordPrototype {
  readonly isRecord: true
}

export interface Record<A extends RecordBase> extends RecordPrototype {
  readonly values: Readonly<Required<A>>
  readonly defaultValues: Readonly<A>
  readonly keys: OrderedSet<string>
  readonly prototype: RecordPrototype
}

export interface RecordCreator<A extends RecordBase> {
  (x: PartialMaybeOrNothing<A>): Record<A>
  readonly keys: OrderedSet<string>
  readonly default: Record<A>
}

const RecordPrototype =
  Object.freeze<RecordPrototype> ({
    isRecord: true,
  })

const _Record =
  <A extends RecordBase>
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
      }
    )

export const fromDefault =
  <A extends RecordBase> (def: Required<A>): RecordCreator<A> => {
    const defaultValues = Object.freeze (Object.entries (def) .reduce<Required<A>> (
      (acc, [key, value]) => {
        // tslint:disable-next-line: strict-type-predicates
        if (typeof key !== 'string') {
          throw new TypeError (`Record key must be a String! Got ${show (key)} instead.`)
        }

        // tslint:disable-next-line: strict-type-predicates
        if (value === null || value === undefined) {
          throw new TypeError (
            `Record field must not be a nullable value! Got ${show (value)} at key ${show (key)} instead.`
          )
        }

        return {
          ...acc,
          [key]: value,
        }
      },
      {} as Required<A>
    ))

    const keys = fromArray (Object.keys (def))

    const creator = (x: PartialMaybeOrNothing<A>) =>
      _Record<A>
        (keys)
        (defaultValues)
        (foldl<string, PartialMaybeOrNothing<A>>
          (
            acc => key => {
              const value = (x as Required<A>) [key]

              return OrderedSet.member (key) (keys)
                && (
                  isMaybe (defaultValues [key]) && isJust (value)
                  || (
                    !isMaybe (defaultValues [key])
                    && value !== null && value !== undefined && !isNothing (value)
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

    return Object.freeze (creator)
  }


// MERGING RECORDS

const mergeSafe = <A extends RecordBase> (x: Partial<A>) => (r: Record<A>): Record<A> =>
  _Record<A> (r .keys)
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

const getter = <A extends RecordBase> (key: keyof A) => (r: Record<A>) => {
  if (OrderedSet.member<keyof A> (key) (r .keys)) {
    const x = r .values [key]

    return isMaybe (x) && isNothing (x) ? r .defaultValues [key] : x
  }

  throw new TypeError (`Key ${show (key)} is not in Record ${show (r)}!`)
}

const setter = <A extends RecordBase> (key: keyof A) => (r: Record<A>) => (x: A[typeof key]) =>
  _Record<A> (r .keys)
             (r .defaultValues)
             ({
               ...r .values,
               [key]: x,
             })

/**
 * Creates getter functions for every key in the passed record creator.
 */
export const makeGetters =
  <A extends RecordBase> (record: RecordCreator<A>): Getters<A> =>
  Object.freeze (foldl<string, Getters<A>> (acc => key => ({
                                             ...acc,
                                             [key]: getter (key),
                                           }))
                                           ({} as Getters<A>)
                                           (record .keys))

/**
 * Creates lenses for every key in the passed record.
 *
 * If you have already generated the getters and if you need better performance
 * for generating the lenses, use `makeLenses_` instead.
 */
export const makeLenses = <A extends RecordBase> (record: RecordCreator<A>): Lenses<A> =>
  Object.freeze (foldl<string, Lenses<A>> (acc => key => ({
                                            ...acc,
                                            [key]: lens<Record<A>, A[typeof key]> (getter (key))
                                                                                  (setter (key)),
                                          }))
                                          ({} as Lenses<A>)
                                          (record .keys))

/**
 * Creates lenses for every key in the passed record.
 *
 * If you have not already generated the getters, use `makeLenses` instead.
 */
export const makeLenses_ =
  <A extends RecordBase> (getters: Getters<A>) => (record: RecordCreator<A>): Lenses<A> =>
    Object.freeze (
      foldl<string, Lenses<A>> (acc => key => ({
                                 ...acc,
                                 [key]: lens<Record<A>, A[typeof key]>
                                   (getters [key] as Getter<A, typeof key>)
                                   (setter (key)),
                               }))
                               ({} as Lenses<A>)
                               (record .keys)
    )

/**
 * `member :: String -> Record a -> Bool`
 *
 * Is the key a member of the record?
 */
export const member =
  (key: string) => (mp: Record<any>): boolean => OrderedSet.member (key) (mp .keys)

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

/**
 * Checks if the given value is a `Record`.
 * @param x The value to test.
 */
export const isRecord =
  (x: any): x is Record<any> =>
    typeof x === 'object' && x !== null && x.isRecord


// NAMESPACED FUNCTIONS

export const Record = {
  fromDefault,

  mergeSafe: mergeSafeR2,

  makeGetters,
  makeLenses,
  makeLenses_,
  member,
  notMember,
  toObject,
  isRecord,
}


// TYPE HELPERS

type Getter<A extends RecordBase, K extends keyof A> = (r: Record<Pick<A, K>>) => A[K]

type Getters<A extends RecordBase> = {
  [K in keyof A]: Getter<A, K>
}

type Lenses<A extends RecordBase> = {
  [K in keyof A]: Lens<Record<A>, A[K]>
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

export type RecordInterface<T> = T extends Record<infer O> ? O : never

export type RecordKey<K extends keyof T, T> =
  T[K] extends NonNullable<T[K]> ? Just<T[K]> : Maybe<NonNullable<T[K]>>

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

/**
 * All `Maybe` properties will be optional and all others required.
 */
export type PartialMaybeOrNothing<A> = {
  [K in PartialMaybeRequiredKeys<A>]-?: A[K] extends Maybe<any> ? never : A[K] | Nothing
} & {
  [K in PartialMaybePartialKeys<A>]?: A[K] extends Maybe<any> ? A[K] : never
}

interface RecordBase {
  [key: string]: any
}
