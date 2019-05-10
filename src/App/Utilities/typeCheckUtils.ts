import { bindF, ensure, Maybe } from "../../Data/Maybe";

export const isString =
  <A> (arg: A | string): arg is string =>
    typeof arg === "string"

export const isStringM = ensure (isString)

export const misStringM: <A> (x: Maybe<A | string>) => Maybe<string> =
  bindF<any, string> (ensure (isString))

export const misNonEmptyStringM: <A> (x: Maybe<A | string>) => Maybe<string> =
  bindF<any, string> (ensure (e => isString (e) && e .length > 0))

export const isNumber =
  <A> (arg: A | number): arg is number =>
    typeof arg === "number"

export const isNumberM = ensure (isNumber)

export const misNumberM: <A> (x: Maybe<A | number>) => Maybe<number> =
  bindF<any, number> (ensure (isNumber))

export const isObject =
  <A, A1 extends object> (arg: A | A1): arg is A1 =>
    typeof arg === "object"

export const isBoolean =
  <A> (arg: A | boolean): arg is boolean =>
    typeof arg === "boolean"

export const isFunction =
  <A, A1 extends ((x?: any) => any)> (arg: A | A1): arg is A1 =>
    typeof arg === "function"
