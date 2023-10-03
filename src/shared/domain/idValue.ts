/**
 * Operations on id-value pairs.
 */

/**
 * A pair of a numeric identifier and a value.
 */
export type IdValuePair = { id: number; value: number }

/**
 * Returns the pair with the highest value from a list, if it higher than the
 * values of all other pairs from that list. More than one with the highest
 * value will result in returning `undefined`. Duplicate identifiers will be
 * ignored.
 */
export const getSingleHighestPair = (pairs: IdValuePair[]): IdValuePair | undefined => {
  type IntermediateResult = { id: number | "multiple"; value: number } | undefined

  const intermediateResult = pairs.reduce<IntermediateResult>(
    (currentHighest, attr) =>
      currentHighest === undefined || attr.value > currentHighest.value
        ? attr
        : attr.value === currentHighest.value && attr.id !== currentHighest.id
        ? // different pairs with the same value, if it’s already "multiple"
          // it stays "multiple", in which case the id comparison will always be
          // true
          { id: "multiple", value: currentHighest.value }
        : currentHighest,
    undefined,
  )

  const isSingleHighest = (res: IntermediateResult): res is { id: number; value: number } =>
    res !== undefined && res.id !== "multiple"

  return isSingleHighest(intermediateResult) ? intermediateResult : undefined
}
