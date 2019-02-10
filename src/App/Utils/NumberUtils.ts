import { pipe } from "ramda";
import { bindF } from "../../Control/Monad";
import { List, subscript } from "../../Data/List";
import { ensure, fromMaybe, Just, Maybe, Nothing } from "../../Data/Maybe";
import { inc } from "./mathUtils";
import { not } from "./not";
import { isInteger, isNaturalNumber } from "./RegexUtils";

/**
 * A list of all Roman numbers from 1 to 13.
 */
const romanNumbers =
  List (
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
    "XIII"
  )

/**
 * Converts a number to a Roman number.
 *
 * Example:
 *
 * ```haskell
 * toRoman 3 == "III"
 * ```
 */
export const toRoman = pipe (inc, subscript (romanNumbers), fromMaybe (""))

/**
 * Converts a 0-based number to a Roman number.
 *
 * Example:
 *
 * ```haskell
 * toRomanFromIndex 3 == "II"
 * ```
 */
export const toRomanFromIndex = pipe (subscript (romanNumbers), fromMaybe (""))

/**
 * Forces signing on the given number.
 */
export const sign = (number: number): string =>
  number > 0 ? `+${number}` : String (number)

/**
 * Forces signing on the given number, returns the specified string when the
 * number is `0`.
 */
export const signNullCustom = (stringFor0: string) => (number: number): string =>
  number > 0 ? `+${number}` : number < 0 ? String (number) : stringFor0

/**
 * Forces signing on the given number, ignores 0.
 */
export const signNull = signNullCustom ("")

/**
 * Multiplies given string by 100 if it contains `,` o `.`.
 */
export const multiplyString = (string: string): string => {
  if (/^\d+[,\.]\d+$/.test (string)) {
    const float = unsafeToFloat (string.replace (/,/, "."))
    const multiplied = float * 100

    return String (multiplied)
  }

  return string
}

/**
 * Converts a string to a decimal integer. This function does **not** check if
 * the string is a valid number.
 */
export const unsafeToInt = (string: string) => Number.parseInt (string, 10)

/**
 * Converts a string to a floating point number. This function does
 * **not** check if the string is a valid number.
 */
export const unsafeToFloat = (string: string) => Number.parseFloat (string)

/**
 * Converts a string to a decimal integer. If the string is not a valid integer,
 * it returns `Nothing`, otherwise a `Just` of the integer.
 */
export const toInt =
  (e: string): Maybe<number> =>
    e.length > 0 && isInteger (e) ? Just (unsafeToInt (e)) : Nothing

/**
 * Converts a string to a decimal number. If the string is not a valid natural
 * number, it returns `Nothing`, otherwise a `Just` of the number.
 */
export const toNatural =
  (e: string): Maybe<number> =>
    e.length > 0 && isNaturalNumber (e) ? Just (unsafeToInt (e)) : Nothing

/**
 * Converts a string to a floating point number. If the string is not a valid
 * floating point number, it returns `Nothing`, otherwise a `Just` of the
 * number.
 */
export const toFloat =
  (e: string): Maybe<number> =>
    e.length > 0 ? misNotNaN (Just (unsafeToFloat (e.replace (/\,/, ".")))) : Nothing

const isNotNaN = pipe (Number.isNaN, not)

const misNotNaN = bindF<number, number> (ensure (isNotNaN))
