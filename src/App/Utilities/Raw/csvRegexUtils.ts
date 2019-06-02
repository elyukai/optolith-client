/**
 * Returns a Regex source string representing a pair with a delimiter.
 */
export const pairRx =
  (del: string) => (fst: string, snd: string) => `${fst}${del}${snd}`

/**
 * Returns a Regex source string representing a non-empty list with a delimiter.
 */
export const listRx =
  (del: string) => (e: string) => `${e}(?:${del}${e})*`

/**
 * Returns a Regex source string representing a list of a set length with a
 * delimiter.
 */
export const listLengthRx =
  (l: number) => (del: string) => (e: string) => `${e}(?:${del}${e}){${l - 1}}`

/**
 * Returns a Regex source string representing a list of a length in a specified
 * range with a delimiter.
 */
export const listRangeRx =
  (l: number, u: number) => (del: string) => (e: string) => `${e}(?:${del}${e}){${l - 1},${u - 1}}`

/**
 * Returns a Regex source string representing a pair with a `"?"` delimiter.
 */
export const qmPairRx = pairRx ("?")
