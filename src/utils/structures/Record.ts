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
import { Just, Maybe } from './Maybe';
import { foldl, fromArray, OrderedSet } from './OrderedSet';
import { show } from './Show';


// CONSTRUCTOR

interface RecordPrototype {
  readonly isRecord: true;
}

export interface Record<A extends RecordBase> extends RecordPrototype {
  readonly values: Readonly<Partial<A>>;
  readonly defaultValues: Readonly<A>;
  readonly keys: OrderedSet<string>;
  readonly prototype: RecordPrototype;
}

export interface RecordCreator<A extends RecordBase> {
  (x: Partial<A>): Record<A>;
}

const RecordPrototype: RecordPrototype =
  Object.create (Object.prototype, { isRecord: { value: true }})

const _Record =
  <A extends RecordBase>
  (keys: OrderedSet<string>) =>
  (def: A) =>
  (specified: Partial<A>): Record<A> =>
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
    const defaultValues = Object.freeze (Object.entries (def) .reduce<A> (
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
        };
      },
      {} as A
    ))

    const keys = fromArray (Object.keys (def))

    return x =>
      _Record<A>
        (keys)
        (defaultValues)
        (Object.entries (x) .reduce<Partial<A>> (
          (acc, [key, value]) =>
            // tslint:disable-next-line: strict-type-predicates
            OrderedSet.member (key) (keys) && value !== null && value !== undefined
              ? { ...acc, [key]: value }
              : acc,
          {}
        ))
  }


// MERGING RECORDS

const mergeSafe = <A extends RecordBase> (x: Partial<A>) => (r: Record<A>): Record<A> =>
  _Record<A> (r .keys)
             (r .defaultValues)
             (foldl<string, A> (acc => key => ({
                                 ...acc,
                                 // tslint:disable-next-line: strict-type-predicates
                                 [key]: x [key] === null || x [key] === undefined
                                   ? r .values [key]
                                   : x [key],
                               }))
                               ({} as A)
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
    const specifiedValue = r .values [key]

    // tslint:disable-next-line: strict-type-predicates
    if (specifiedValue !== null && specifiedValue !== undefined) {
      return specifiedValue as A[typeof key]
    }

    return r .defaultValues [key]
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
    Object.freeze (Object.keys (record ({}) .defaultValues) .reduce<Getters<A>> (
      (acc, key) => ({
        ...acc,
        [key]: getter (key),
      }),
      {} as Getters<A>
    ))

/**
 * Creates lenses for every key in the passed record.
 *
 * If you already generated the getters and if you need better performance for
 * generating them, use `makeLenses_` instead.
 */
export const makeLenses = <A extends RecordBase> (record: RecordCreator<A>): Lenses<A> =>
  Object.freeze (Object.keys (record ({}) .defaultValues) .reduce<Lenses<A>> (
    (acc, key) => ({
      ...acc,
      [key]: lens<Record<A>, A[typeof key]> (getter (key)) (setter (key)),
    }),
    {} as Lenses<A>
  ))

/**
 * Creates lenses for every key in the passed record.
 *
 * If you have not already generated the getters, use `makeLenses_` instead.
 */
export const makeLenses_ =
  <A extends RecordBase> (getters: Getters<A>) => (record: RecordCreator<A>): Lenses<A> =>
    Object.freeze (Object.keys (record ({}) .defaultValues) .reduce<Lenses<A>> (
      (acc, key) => ({
        ...acc,
        [key]: lens<Record<A>, A[typeof key]> (getters [key] as Getter<A, typeof key>)
                                              (setter (key)),
      }),
      {} as Lenses<A>
    ))

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
    typeof x === 'object' && x !== null && x.isRecord;


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
};


// TYPE HELPERS

type Getter<A extends RecordBase, K extends keyof A> = (r: Record<Pick<A, K>>) => A[K]

type Getters<A extends RecordBase> = {
  [K in keyof A]: Getter<A, K>;
}

type Lenses<A extends RecordBase> = {
  [K in keyof A]: Lens<Record<A>, A[K]>;
}

export interface UnsafeStringKeyObject<V> {
  [id: string]: V;
}

export interface StringKeyObject<V> {
  readonly [id: string]: V;
}

export interface NumberKeyObject<V> {
  readonly [id: number]: V;
}

/**
 * From T remove a set of properties K
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type RecordInterface<T> = T extends Record<infer O> ? O : never

export type RecordKey<K extends keyof T, T> =
  T[K] extends NonNullable<T[K]> ? Just<T[K]> : Maybe<NonNullable<T[K]>>

// type ObjectDeleteProperty<T, D extends keyof T> = {
//   [K in Exclude<keyof T, D>]: T[K];
// };

interface RecordBase {
  [key: string]: any;
}
