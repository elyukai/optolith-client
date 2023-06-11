import { isInteger, isNaturalNumber } from "./regex.ts"

/**
 * The minus sign.
 */
export const minus = "−"

/**
 * Forces signing on the given number, returns the specified string when the
 * number is `0`.
 */
export const signNullCustom =
  (zero: string) =>
  (x: number): string =>
    x > 0 ? `+${x}` : x < 0 ? `${minus}\u2060${Math.abs(x)}` : zero

/**
 * Forces signing on the given number.
 */
export const sign = (x: number): string =>
  x > 0 ? `+${x}` : x < 0 ? `${minus}\u2060${Math.abs(x)}` : "0"

/**
 * Converts a string to an integer. If the string is not a valid integer, it
 * returns `undefined`.
 */
export const parseInt =
  (str: string): number | undefined =>
    str.length > 0 && isInteger(str) ? Number.parseInt(str, 10) : undefined

/**
 * Converts a string to a natural number. If the string is not a valid natural
 * number, it returns `undefined`.
 */
export const parseNat =
  (str: string): number | undefined =>
    str.length > 0 && isNaturalNumber(str) ? Number.parseInt(str, 10) : undefined
