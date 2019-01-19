import { pipe } from "ramda";
import { Either, maybeToEither_ } from "../../../Data/Either";
import { equals } from "../../../Data/Eq";
import { length, List, notNullStr, splitOn } from "../../../Data/List";
import { bindF, ensure, fmap, fromJust, fromMaybe, isNothing, Just, mapM, Maybe, Nothing } from "../../../Data/Maybe";
import { show } from "../../../Data/Show";
import { toInt, toNatural } from "../NumberUtils";
import { Expect } from "./validateValueUtils";

export const validateMapRawProp =
  (expected: string) =>
  <A> (f: (x: Maybe<string>) => Maybe<A>) =>
  (received: Maybe<string>): Either<string, A> => {
    const res = f (received)

    return maybeToEither_<string, A> (() => `Expected: ${expected}, Received: ${show (received)}`)
                                     (res)
  }

/**
* Use if the received value at `validateMapRawProp` can be `Nothing`. The
* `Maybe` returned from the passed function says if the value is valid
* (`Just`) or invalid (`Nothing`). It will only check an available value, a
* `Nothing` passed to `optionalMap` will return `Right Nothing` on success.
*/
export const optionalMap =
  <A>
  (f: (x: string) => Maybe<A>) =>
  (x: Maybe<string>): Maybe<Maybe<A>> =>
    isNothing (x)
    ? Just (Nothing)
    : fmap<A, Just<A>> (Just) (f (fromJust (x)))

export const validateMapRequiredNonEmptyStringProp =
  validateMapRawProp (Expect.NonEmptyString)
                     (bindF<string, string> (ensure (notNullStr)))

export const validateMapOptionalStringListProp =
  (pred: (x: string) => boolean) =>
  (del: string) =>
    validateMapRawProp (Expect.List (Expect.NonEmptyString))
                       (optionalMap (pipe (
                         splitOn (del),
                         mapM<string, string> (ensure (pred))
                       )))

export const validateMapOptionalNonEmptyStringListProp =
  validateMapOptionalStringListProp (notNullStr)

export const validateMapRequiredNaturalNumberProp =
  validateMapRawProp (Expect.NaturalNumber)
                     (bindF (toNatural))

export const validateMapRequiredNaturalNumberListProp =
  (del: string) =>
    validateMapRawProp (Expect.List (Expect.NaturalNumber))
                       (bindF (pipe (
                         splitOn (del),
                         mapM (toNatural)
                       )))

export const validateMapOptionalNaturalNumberProp =
  validateMapRawProp (Expect.Maybe (Expect.NaturalNumber))
                     (optionalMap (toNatural))

export const validateMapOptionalNaturalNumberListProp =
  (del: string) =>
    validateMapRawProp (Expect.Maybe (Expect.List (Expect.NaturalNumber)))
                       (optionalMap (pipe (
                         splitOn (del),
                         mapM (toNatural)
                       )))

export const validateMapOptionalNaturalNumberFixedListProp =
  (len: number) =>
  (del: string) =>
    validateMapRawProp (Expect.Maybe (Expect.ListLength (len) (Expect.NaturalNumber)))
                       (optionalMap (pipe (
                         splitOn (del),
                         mapM (toNatural),
                         bindF<List<number>, List<number>>
                           (ensure (pipe (length, equals (len))))
                       )))

export const validateMapRequiredIntegerProp =
  validateMapRawProp (Expect.Integer)
                     (bindF (toInt))

export const validateMapOptionalIntegerProp =
  validateMapRawProp (Expect.Maybe (Expect.Integer))
                     (optionalMap (toInt))

export const validateMapBooleanProp =
  validateMapRawProp (Expect.Boolean)
                     (pipe (
                       fromMaybe ("TRUE"),
                       ensure ((x: string) => x === "TRUE" || x === "FALSE"),
                       fmap (x => x === "TRUE")
                     ))
