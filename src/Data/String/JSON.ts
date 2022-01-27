import { Either as NewEither, Left, Right, toNewEither } from "../../App/Utilities/Either"
import { EnsureEnumType, GenericEnumType, isInEnum } from "../../App/Utilities/Enum"
import { Maybe, Nullable } from "../../App/Utilities/Maybe"
import { pipe } from "../../App/Utilities/pipe"
import { Expect } from "../../App/Utilities/Raw/Expect"
import { isBoolean, isNumber, isString } from "../../App/Utilities/typeCheckUtils"
import { bimap, bindF, Either, eitherToMaybe, fromLeft_, fromRight_, isLeft } from "../Either"
import { ident } from "../Function"
import { elem, fromArray, List } from "../List"
import { Nothing } from "../Maybe"
import { empty, insert, OrderedMap } from "../OrderedMap"
import { OmitName, Record, RecordBase, RecordIBase } from "../Record"

/**
 * `type GetJSON a = Unknown -> Either String a`
 *
 * Read a value parsed from a JSON.
 */
export type GetJSON<A> = (x: unknown) => Either<string, A>

/**
 * `type GetJSONRecord a`
 *
 * Read a value parsed from a JSON.
 */
export type GetJSONRecord<A extends RecordBase> = {
  [K in keyof A]: GetJSON<A[K] | Nothing>
}

export const tryParseJSON: (x: string) => NewEither<Error, unknown> =
  x => {
    try {
      return Right (JSON.parse (x))
    }
    catch (err) {
      if (err instanceof Error) {
        return Left (err)
      }

      return Left (new Error (String (err)))
    }
  }

export const parseJSON = (x: string): Maybe<unknown> => tryParseJSON (x).toMaybe ()

/**
 * `fromJSRecord :: Validators a -> (a -> b) -> String -> GetJSON b`
 *
 * `type Validators a = Dictionary (keyof a) (Unknown -> Bool)`
 *
 * Ensures that a value `x` from a JSON is an object of defined keys with
 * specific value. Every element of the object is tested by the validator at the
 * same key of `validators`. If all keys pass the tests, there are no other
 * unknown keys and `x` is an object, the object is passed to `toRecord`, which
 * creates a Record of the object, which is returned in a `Right`. If the object
 * is not of type `a`, a `Left` is returned, mentioning the `expected` type and
 * the actual type of the current key or the complete object.
 */
export const fromJSRecord =
  <A extends RecordIBase<any>> (validators: GetJSONRecord<OmitName<A>>) =>
  (toRecord: (x: OmitName<A>) => Record<A>) =>
  (expected: string): GetJSON<Record<A>> =>
  x => {
    if (typeof x === "object" && x !== null) {
      const validator_assocs = Object.entries (validators)
      const validated: A = {} as A

      for (const [ key, validator ] of validator_assocs) {
        const res = validator ((x as any) [key] as unknown)

        if (isLeft (res)) {
          return Left (`In object at key "${key}":\n${fromLeft_ (res)}`).toOldEither ()
        }
        else {
          (validated as RecordBase) [key] = fromRight_ (res)
        }
      }

      return Right (toRecord (validated)).toOldEither ()
    }

    return Left (`Expected: ${expected}, Received: not an object: ${JSON.stringify (x)}`).toOldEither ()
  }

export const tryParseJSONRecord =
  <A extends RecordIBase<any>> (validators: GetJSONRecord<OmitName<A>>) =>
  (toRecord: (x: OmitName<A>) => Record<A>) =>
  (expected: string) =>
  (x: string) =>
    tryParseJSON (x)
      .first (err => err.message)
      .bind (val => toNewEither (fromJSRecord<A> (validators) (toRecord) (expected) (val)))
      .toOldEither ()

export const parseJSONRecord =
  <A extends RecordIBase<any>> (validators: GetJSONRecord<OmitName<A>>) =>
  (toRecord: (x: OmitName<A>) => Record<A>) =>
  (expected: string) =>
    pipe (tryParseJSONRecord (validators) (toRecord) (expected), eitherToMaybe)

/**
 * `fromJS :: (Unknown -> Bool) -> (a -> b) -> String -> GetJSON b`
 *
 * Ensures that a value literal `x` from a JSON is of a specific type. `x` is
 * tested by the `validator`. If it is of type `a`, it is passed to `f`. The
 * result of `f` is returned as `Right b`. If the type is not `a`, a `Left` is
 * returned, mentioning the `expected` type and the actual type.
 */
const fromJS =
  <A> (validator: (x: unknown) => x is A) =>
  <B> (f: (x: A) => B) =>
  (expected: string): GetJSON<B> =>
  (x: unknown) =>
    (validator (x)
    ? Right (f (x))
    : Left (`Expected: ${expected}, Received: ${JSON.stringify (x)}`)).toOldEither ()

/**
 * `fromJSId :: (Unknown -> Bool) -> String -> GetJSON a`
 *
 * Like `fromJS`, but it will not transform the value.
 */
const fromJSId =
  <A> (validator: (x: unknown) => x is A) =>
    fromJS (validator) (ident)

/**
 * `orUndefined :: (Unknown -> Bool) -> Unknown -> Bool`
 *
 * Takes a predicate and a value and tests if the value matches the predicate or
 * `undefined`.
 */
const orUndefined =
  <A> (f: (x: unknown) => x is A) =>
  (x: unknown): x is A | undefined =>
    f (x) || x === undefined

export const fromJSString = fromJSId (isString) (Expect.String)

export const fromJSStringM = fromJS (orUndefined (isString))
                                    <Maybe<string>> (Nullable)
                                    (Expect.Maybe (Expect.String))

export const fromJSRational = fromJSId (isNumber) (Expect.Float)

export const fromJSRationalM = fromJS (orUndefined (isNumber))
                                      <Maybe<number>> (Nullable)
                                      (Expect.Maybe (Expect.Float))

export const fromJSBool = fromJSId (isBoolean) (Expect.Boolean)

export const fromJSBoolM = fromJS (orUndefined (isBoolean))
                                  <Maybe<boolean>> (Nullable)
                                  (Expect.Maybe (Expect.Boolean))

export const fromJSEnum =
  (enum_name: string) =>
  <A extends object> (enum_values: A) =>
    fromJSId ((x): x is EnsureEnumType<A> => (isString (x) || isNumber (x))
                                             && isInEnum (enum_values) (x as GenericEnumType<A>))
             (enum_name)

export const fromJSEnumM =
  (enum_name: string) =>
  <A extends object> (enum_values: A) =>
    fromJS ((x): x is EnsureEnumType<A> | undefined => (
                                                         (isString (x) || isNumber (x))
                                                         && isInEnum (enum_values)
                                                                     (x as GenericEnumType<A>)
                                                       )
                                                       || x === undefined)
           <Maybe<EnsureEnumType<A>>> (Nullable)
           (enum_name)

export const fromJSInArray =
  <A> (possible_values: List<A>) =>
    fromJSId ((x): x is A => elem (x) (possible_values))

export const fromJSInArrayNothing =
  <A> (possible_values: List<A>) =>
    fromJS (orUndefined ((x): x is A => elem (x) (possible_values)))
           (res => res === undefined ? Nothing : res)

export const mapM =
  <A, B>
  (f: (x: A) => Either<string, B>) =>
  (m: A[]): Either<string, B[]> => {
    if (m .length === 0) {
      return Right ([]).toOldEither ()
    }

    const arr: B[] = []

    for (let i = 0; i < m .length; i++) {
      const value = m [i]
      const res = f (value)

      if (isLeft (res)) {
        return Left (`In array at index ${i}\n${fromLeft_ (res)}`).toOldEither ()
      }

      arr .push (fromRight_ (res))
    }

    return Right (arr).toOldEither ()
  }

/**
 * `fromJSArray :: (Unknown -> Bool) -> (a -> b) -> String -> GetJSON [b]`
 *
 * Ensures that a value `x` from a JSON is an array of a specific type. Every
 * element of the array is tested by the `validator`. If every element is of
 * type `a`, the final list is returned as `Right [a]`. If one element is not of
 * type `a`, a `Left` is returned, mentioning the `expected` type and the actual
 * type. If the value is not an array at all, a `Left` is returned mentioning
 * the type mismatch, too.
 */
export const fromJSArray =
  <A> (validator: GetJSON<A>): GetJSON<List<A>> =>
    pipe (
      (x): Either<string, unknown[]> => Array.isArray (x)
        ? Right (x).toOldEither ()
        : Left (
            `Expected: ${Expect.Array ("a")}, Received: not an array (${JSON.stringify (x)})`
          ).toOldEither (),
      bindF (mapM (validator)),
      bimap ((str: string) => `In array:\n${str}`) (fromArray)
    )


/**
 * `fromJSDict :: (Unknown -> Bool) -> (a -> b) -> String -> GetJSON (OrderedMap String b)`
 *
 * Ensures that a value `x` from a JSON is a dictionary. Every element of the object is tested by the passed validator. If a value passes the test, it is transformed by `map` and inserted into  and `x` is an object, the object is passed to `map`. The result of `map` is returned as `Right b`. If the object is not of type `a`, a `Left` is returned, mentioning the `expected` type and the actual type of the current key or the complete object.
 */
export const fromJSDict =
  <A> (validator: GetJSON<A>) =>
  <B> (f: (x: A) => B) =>
  (expected: string): GetJSON<OrderedMap<string, B>> =>
  x => {
    if (typeof x === "object" && x !== null) {
      const assocs = Object.entries (x)

      let validated: OrderedMap<string, B> = empty

      for (const [ key, value ] of assocs) {
        const k =
          typeof key === "string"
          ? Right (key)
          : Left (`Expected: Key, Received: ${JSON.stringify (key)}`)

        const v = toNewEither (validator (value))

        if (k.isLeft) {
          return k.toOldEither ()
        }
        else if (v.isLeft) {
          return Left (`In object at key "${key}"\n${v.value}`).toOldEither ()
        }
        else {
          validated = insert (k.value) (f (v.value)) (validated)
        }
      }

      return Right (validated).toOldEither ()
    }
    else {
      return Left (`Expected: ${expected}, Received: not an object (${JSON.stringify (x)})`).toOldEither ()
    }
  }
