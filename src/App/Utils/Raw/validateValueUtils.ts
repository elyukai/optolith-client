import { Either, Left, Right } from "../../../Data/Either";
import { notNullStr } from "../../../Data/List";
import { any } from "../../../Data/Maybe";
import { show } from "../../../Data/Show";
import { isInteger, isNaturalNumber } from "../RegexUtils";

export enum ExpectedGenericValues {
  NonEmptyString = "String (non-empty)",
  NaturalNumber = "Natural",
  Integer = "Int"
}

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
    : Left (`${origin}: Expected: ${expected}, Received: ${show (received)}`)

export const validateNonEmptyStringProp =
  validateProp (ExpectedGenericValues.NonEmptyString) (any (notNullStr))

export const validateNaturalNumberProp =
  validateProp (ExpectedGenericValues.NaturalNumber) (any (isNaturalNumber))

export const validateIntegerProp =
  validateProp (ExpectedGenericValues.Integer) (any (isInteger))
