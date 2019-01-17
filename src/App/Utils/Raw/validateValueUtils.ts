import { pipe } from "ramda";
import { Either, first, fromRight_, isEither, isLeft, Left, Right, RightI } from "../../../Data/Either";
import { appendStr, notNullStr } from "../../../Data/List";
import { all, any, bindF, ensure, isJust, Maybe } from "../../../Data/Maybe";
import { show } from "../../../Data/Show";
import { isInteger, isNaturalNumber } from "../RegexUtils";

export const Expect = Object.freeze ({
  NonEmptyString: "String (non-empty)",
  NaturalNumber: "Natural",
  Integer: "Int",
  Maybe: (x: string) => `Maybe ${x}`,
})

interface ValidateReceived {
  <A, A1 extends A> (f: (x: A) => x is A1): (received: A) => Either<string, A1>
  <A> (f: (x: A) => boolean): (received: A) => Either<string, A>
}

/**
 * `validateProp` takes the origin function's name, the expected type/value,
 * a predicate and the value to test. If the predicate returns `True` on the
 * value, it returns the value wrapped in a `Right`. If the predicate returns
 * `False`, it returns an error message describing expected and received input.
 */
export const validateProp =
  (expected: string): ValidateReceived =>
  <A> (pred: (x: A) => boolean) =>
  (received: A): Either<string, A> =>
    pred (received)
    ? Right (received)
    : Left (`Expected: ${expected}, Received: ${show (received)}`)

interface ValidateRawReceived {
  <A1 extends Maybe<string>>
  (f: (x: Maybe<string>) => x is A1):
  (received: Maybe<string>) => Either<string, A1>

  (f: (x: Maybe<string>) => boolean):
  (received: Maybe<string>) => Either<string, Maybe<string>>
}

/**
 * `validateRawProp` takes the origin function's name, the expected type/value,
 * a predicate and the value to test. If the predicate returns `True` on the
 * value, it returns the value wrapped in a `Right`. If the predicate returns
 * `False`, it returns an error message describing expected and received input.
 *
 * If the received string is empty, a `Nothing` will be passed to the predicate.
 * This allows easy checking with `all`/`any` from `Data.Maybe` if the key/value
 * is required or optional.
 */
export const validateRawProp =
  (expected: string): ValidateRawReceived =>
  (pred: (x: Maybe<string>) => boolean) =>
    pipe (
      mstrToMaybe,
      received => pred (received)
        ? Right (received)
        : Left (`Expected: ${expected}, Received: ${show (received)}`)
    )

export const validateRequiredNonEmptyStringProp =
  validateRawProp (Expect.NonEmptyString) (isJust)

export const validateRequiredNaturalNumberProp =
  validateRawProp (Expect.NaturalNumber) (any (isNaturalNumber))

export const validateRequiredIntegerProp =
  validateRawProp (Expect.Integer) (any (isInteger))

export const validateOptionalIntegerProp =
  validateRawProp (Expect.Maybe (Expect.Integer)) (all (isInteger))

interface LookupKeyValid {
  <A1 extends Maybe<string>>
  (validate: (received: Maybe<string>) => Either<string, A1>):
  (key: string) => Either<string, A1>

  (validate: (received: Maybe<string>) => Either<string, Maybe<string>>):
  (key: string) => Either<string, Maybe<string>>
}

/**
 * Creates a shortcut for reuse when checking table data. Takes a function that
 * looks up a key, a function that validates the result from the first function
 * and the key and returns the result of the first function where a possible
 * error message is prepended by the name of the key.
 */
export const lookupKeyValid =
  (lookup: (key: string) => Maybe<string>): LookupKeyValid =>
  (validate: (x: Maybe<string>) => Either<string, Maybe<string>>) =>
  (key: string) =>
    pipe (lookup, validate, first (appendStr (`"${key}": `))) (key)

/**
 * Takes a `Maybe String` and returns `Nothing` if the string is empty,
 * otherwise a `Just` of the string.
 */
export const mstrToMaybe = bindF<string, string> (ensure (notNullStr))

interface AllEither {
  [key: string]: Either<string, any>
}

type MapRight<A extends AllEither> = {
  [K in keyof A]: RightI<Exclude<A[K], Left<any>>>
}

/**
 * Takes an object containing all values needed in `f` and validates every
 * value. If there is at least one `Left` value, the first is going to be
 * returned. Otherwise the result of `f` is returned, wrapped in a `Right`.
 */
export const allRights =
  <A extends AllEither>
  (es: A) =>
  <B>
  (f: (rs: MapRight<A>) => B): Either<string, B> => {
    const rs =
      Object.entries (es)
        .reduce<Left<string> | MapRight<A>> (
          (rsAcc, [key, e]) =>
            isEither (rsAcc)
            ? rsAcc
            : isLeft (e)
            ? e
            : { ...rsAcc, [key]: fromRight_ (e) },
          {} as MapRight<A>
        )

    if (isEither (rs)) return rs

    return Right (f (rs))
  }
