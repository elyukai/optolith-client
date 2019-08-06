import { bindF, Either, fromLeft_, fromRight_, isLeft, Left, Right } from "../../../Data/Either";
import { ident } from "../../../Data/Function";
import { empty, insert, OrderedMap } from "../../../Data/OrderedMap";
import { RecordBase } from "../../../Data/Record";
import { pipe } from "../pipe";
import { Expect } from "./showExpected";

export type JSONValidator<A> = (x: unknown) => Either<string, A>

export const ensureType =
  <A> (validator: (x: unknown) => x is A) =>
  <B> (map: (x: A) => B) =>
  (expected: string): JSONValidator<B> =>
  (x: unknown) =>
    validator (x)
    ? Right (map (x))
    : Left (`Expected: ${expected}, Received: ${JSON.stringify (x)}`)

export const ensureTypeId =
  <A> (validator: (x: unknown) => x is A) =>
    ensureType (validator) (ident)

export const ensureArrayType =
  <A> (validator: (x: unknown) => x is A) =>
  <B> (map: (x: A) => B) =>
  (expected: string): JSONValidator<B[]> =>
    pipe (
      (x): Either<string, unknown[]> => Array.isArray (x)
        ? Right (x)
        : Left (
            `Expected: ${Expect.Array (expected)}, Received: not an array (${JSON.stringify (x)})`
          ),
      bindF (mapMEither (ensureType (validator) (map) (Expect.Array (expected))))
    )

export const ensureArrayTypeId =
  <A> (validator: (x: unknown) => x is A) =>
    ensureArrayType (validator) (ident)

type Validators<A extends RecordBase> = {
  [K in keyof A]: JSONValidator<A[K]>
}

export const ensureObjectType =
  <A extends RecordBase> (validators: Validators<A>) =>
  <B> (map: (x: A) => B) =>
  (expected: string): JSONValidator<B> =>
  x => {
    if (typeof x === "object" && x !== null) {
      const unknown_keys = Object.keys (x)
      const validator_keys = Object.keys (validators)
      const validator_assocs = Object.entries (validators)

      const unknown_key = unknown_keys .find (key => !validator_keys .includes (key))

      if (unknown_key !== undefined) {
        return Left (
          `Expected: ${expected}, Received: unknown key "${unknown_key}" (${JSON.stringify (x)})`
        )
      }
      else {
        const validated: A = {} as A

        for (const [key, validator] of validator_assocs) {
          const res = validator ((x as any) [key] as unknown)

          if (isLeft (res)) {
            return Left (`In object at key "${key}"\n${fromLeft_ (res)}`)
          }
          else {
            validated [key] = fromRight_ (res)
          }
        }

        return Right (map (validated))
      }
    }
    else {
      return Left (`Expected: ${expected}, Received: not an object (${JSON.stringify (x)})`)
    }
  }

export const ensureDictObjectType =
  <A> (validator: JSONValidator<A>) =>
  <B> (map: (x: A) => B) =>
  (expected: string): JSONValidator<OrderedMap<string, B>> =>
  x => {
    if (typeof x === "object" && x !== null) {
      const assocs = Object.entries (x)

      let validated: OrderedMap<string, B> = empty

      for (const [key, value] of assocs) {
        const k =
          typeof key === "string"
          ? Right (key)
          : Left (`Expected: Key, Received: ${JSON.stringify (key)}`)

        const v = validator (value)

        if (isLeft (k)) {
          return k
        }
        else if (isLeft (v)) {
          return Left (`In object at key "${key}"\n${fromLeft_ (v)}`)
        }
        else {
          validated = insert (fromRight_ (k)) (map (fromRight_ (v))) (validated)
        }
      }

      return Right (validated)
    }
    else {
      return Left (`Expected: ${expected}, Received: not an object (${JSON.stringify (x)})`)
    }
  }

export const mapMEither =
  <A, B>
  (f: (x: A) => Either<string, B>) =>
  (m: A[]): Either<string, B[]> => {
    if (m .length === 0) {
      return Right ([])
    }

    const arr: B[] = []

    for (let i = 0; i < m .length; i++) {
      const value = m [i]
      const res = f (value)

      if (isLeft (res)) {
        return Left (`In array at index ${i}\n${fromLeft_ (res)}`)
      }

      arr .push (fromRight_ (res))
    }

    return Right (arr)
  }
