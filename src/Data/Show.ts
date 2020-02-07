/**
 * @module Data.Show
 *
 * Conversion of values to readable `String`s.
 *
 * @author Lukas Obermann
 */

import { pipe } from "../App/Utilities/pipe"
import { Internals } from "./Internals"
import { GT, isOrdering, LT } from "./Ord"

const intercalate =
  (separator: string) => (xs: Internals.List<number | string>): string =>
  Internals.isNil (xs)
    ? ""
    : Internals.isNil (xs .xs)
    ? xs .x .toString ()
    : xs .x .toString () + separator + intercalate (separator) (xs .xs)

const map =
  <A, B> (f: (x: A) => B) => (xs: Internals.List<A>): Internals.List<B> =>
  Internals.isNil (xs) ? Internals.Nil : Internals.Cons (f (xs .x), map (f) (xs .xs))

const trimStart = (str: string) => str .replace (/^\s+/u, "")

/**
 * `show :: a -> String`
 *
 * Convert a value to a readable `String`.
 */
// tslint:disable-next-line: cyclomatic-complexity
export const show = (x: unknown): string => {
  if (Internals.isMaybe (x)) {
    if (Internals.isJust (x)) {
      return `Just (${show (x.value)})`
    }

    return `Nothing`
  }

  if (Internals.isEither (x)) {
    if (Internals.isRight (x)) {
      return `Right (${show (x .value)})`
    }

    return `Left (${show (x .value)})`
  }

  if (Internals.isList (x)) {
    return `[${intercalate (", ") (map (show) (x))}]`
  }

  if (Internals.isTuple (x)) {
    const arr: any = []

    for (let i = 0; i < x .length; i++) {
      const e = x .values [i]
      arr .push (e)
    }

    return `(${arr .map (show) .join (", ")})`
  }

  if (Internals.isOrderedSet (x)) {
    return `Set (${[ ...x ] .map (show) .join (", ")})`
  }

  if (Internals.isOrderedMap (x)) {
    return `Map (${
      [ ...x ] .map (([ k, v ]) => `${show (k)} = ${show (v)}`) .join (", ")
    })`
  }

  if (Internals.isRecord (x)) {
    const named = x .name !== undefined && x .name .length > 0 ? `${x .name} ` : ""

    return `${named}{ ${
      [ ...x .keys .value ]
        .sort ((a, b) => a < b ? -1 : a > b ? 1 : 0)
        .map (key =>
          `${key} = ${
            show (
              x .values [key] === null || x .values [key] === undefined
              ? x .defaultValues [key]
              : x .values [key]
)
          }`)
        .join (", ")
    } }`
  }

  if (isOrdering (x)) {
    return x === GT ? "GT" : x === LT ? "LT" : "EQ"
  }

  // tslint:disable-next-line: strict-type-predicates
  if (typeof x === "bigint") {
    return x .toString ()
  }

  if (typeof x === "boolean") {
    return x ? `True` : `False`
  }

  if (typeof x === "number") {
    return 1 / x === -Infinity ? "-0" : x .toString (10)
  }

  if (typeof x === "string") {
    return JSON.stringify (x)
  }

  if (typeof x === "symbol") {
    if (x.description === "") {
      return `Symbol`
    }
    else {
      return `Symbol "${x.description}"`
    }
  }

  if (x === undefined) {
    return `undefined`
  }

  if (x === null) {
    return `null`
  }

  if (x instanceof Date) {
    return `Date (${x .toISOString ()})`
  }

  return String (x)
}

const parensNeeded =
  (x: string) => x.includes ("\n[(") || /^\w.* /u .test (x)

const wrapParens = (x: string) => parensNeeded (x) ? `(${x})` : x

// tslint:disable-next-line: cyclomatic-complexity
export const showPDepth = (depth: number) => (x: unknown): string => {
  // depth whitespace
  const dws = " " .repeat (depth * 2)

  if (Internals.isMaybe (x)) {
    if (Internals.isJust (x)) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const str = trimNextDepth (depth) (x.value)

      if (str.includes ("\n")) {
        return `${dws}Just (\n${dws}  ${str}${dws}\n)`
      }

      return `${dws}Just ${wrapParens (str)}`
    }

    return `${dws}Nothing`
  }

  if (Internals.isEither (x)) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const str = trimNextDepth (depth) (x.value)

    if (Internals.isRight (x)) {
      if (str.includes ("\n")) {
        return `${dws}Right (\n${dws}  ${str}${dws}\n)`
      }

      return `${dws}Right ${wrapParens (str)}`
    }

    if (str.includes ("\n")) {
      return `${dws}Left (\n${dws}  ${str}${dws}\n)`
    }

    return `${dws}Left ${wrapParens (str)}`
  }

  if (Internals.isList (x)) {
    if (Internals.isNil (x)) {
      return `${dws}[]`
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return `${dws}[ ${[ ...x ] .map (trimNextDepth (depth)) .join (`\n${dws}, `)} ]`
  }

  if (Internals.isTuple (x)) {
    const arr: any = []

    for (let i = 0; i < x .length; i++) {
      const e = x .values [i]
      arr .push (e)
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return `${dws}( ${arr .map (trimNextDepth (depth)) .join (`\n${dws}, `)}\n${dws})`
  }

  if (Internals.isOrderedSet (x)) {
    return `${dws}Set ( ${
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      [ ...x ] .map (trimNextDepth (depth + 2)) .join (`\n${dws}    , `)
    }\n${dws})`
  }

  if (Internals.isOrderedMap (x)) {
    return `${dws}Map ( ${
      [ ...x ] .map (([ k, v ]) => `${show (k)} = ${show (v)}`) .join (`\n${dws}    , `)
    }\n${dws})`
  }

  if (Internals.isRecord (x)) {
    const named = x .name !== undefined && x .name .length > 0 ? `${x .name} ` : ""

    const mod_depth = depth + named .length / 2

    return `${dws}${named}{ ${
      [ ...x .keys .value ]
        .sort ((a, b) => a < b ? -1 : a > b ? 1 : 0)
        .map (key =>
          `${key} = ${
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            trimNextDepth (mod_depth)
                          (x .values [key] === null || x .values [key] === undefined
                          ? x .defaultValues [key]
                          : x .values [key])
                          .replace (/\n/ug, `\n   ${" " .repeat (key .length)}`)
          }`)
        .join (`\n${" " .repeat (named .length)}${dws}, `)
    } }`
  }

  if (isOrdering (x)) {
    return x === GT ? `${dws}GT` : x === LT ? `${dws}LT` : `${dws}EQ`
  }

  // tslint:disable-next-line: strict-type-predicates
  if (typeof x === "bigint") {
    return `${dws}${x .toString ()}`
  }

  if (typeof x === "boolean") {
    return x ? `${dws}True` : `${dws}False`
  }

  if (typeof x === "number") {
    return 1 / x === -Infinity ? `${dws}-0` : `${dws}${x .toString (10)}`
  }

  if (typeof x === "string") {
    return `${dws}${JSON.stringify (x)}`
  }

  if (typeof x === "symbol") {
    if (x.description === "") {
      return `${dws}Symbol`
    }
    else {
      return `${dws}Symbol "${x.description}"`
    }
  }

  if (x === undefined) {
    return `${dws}undefined`
  }

  if (x === null) {
    return `${dws}null`
  }

  if (x instanceof Date) {
    return `${dws}Date (${x .toISOString ()})`
  }

  return `${dws}${JSON.stringify (x)}`
}

const trimNextDepth =
  (current_depth: number) =>
    pipe (showPDepth (current_depth + 1), trimStart)

/**
 * `showP :: a -> String`
 *
 * Convert a value to a readable prettyfied `String`.
 */
export const showP = showPDepth (0)
