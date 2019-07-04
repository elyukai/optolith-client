import { bimap, fst, Pair, snd } from "../../../Data/Tuple";
import { add, inc, max, multiply, negate, subtractBy } from "../mathUtils";
import { pipe } from "../pipe";

/**
 * `getICMultiplier :: Int -> Int`
 *
 * Get the IC-specific multiplier for calculating AP cost.
 *
 * This is the exact AP cost value for adding (or removing) spells and
 * liturgical chants as well as the improvement cost value for skills up to
 * SR 12 and attributes up to 14.
 */
export const getICMultiplier = (ic: number) => ic === 5 ? 15 : ic

/**
 * Get the IC-specific threshold where the AP cost for one point does not equal
 * the IC-specific multiplier (`getICMultiplier`) anymore.
 */
const getCostThreshold = (ic: number) => ic === 5 ? 15 : 13

/**
 * Returns the multiplicand depending on IC-specific threshold
 * (`getCostThreshold`) and current value.
 */
const getValueMultiplier =
  (ic: number) => pipe (subtractBy (getCostThreshold (ic)), add (2), max (1))

/**
 * The function `getImprovementCost ic sr` returns the AP cost for one
 * step based on the passed improvement cost factor (`ic`) and the current skill
 * rating or value (`sr`).
 */
const getImprovementCost = (ic: number) => pipe (
  getValueMultiplier (ic),
  multiply (getICMultiplier (ic))
)

/**
 * `getIncreaseAP :: Int -> Int -> Int`
 *
 * `getIncreaseAP ic fromValue` returns the AP cost for the next increase.
 */
export const getIncreaseAP = (ic: number) => pipe (inc, getImprovementCost (ic))

/**
 * `getDecreaseAP :: Int -> Int -> Int`
 *
 * `getDecreaseAP ic fromValue` returns the AP cost for the next decrease.
 */
export const getDecreaseAP = (ic: number) => pipe (getImprovementCost (ic), negate)

/**
 * `sumAPValue :: (Int, Int) -> (Int, Int) -> Int`
 *
 * `sumAPValue (ic, toLevel) (fromLevel, startValue)` takes a pair consisting
 * of the IC and the next level it shall calculate the sum to (must be the
 * higher value, if you need to calculate decrease cost, use the previous value
 * here), as well as a pair of the previous level (or the next level, if you
 * need to calculate decrease cost) and the AP value that the calculated cost
 * will be added to (typically `0`).
 *
 * Examples:
 *
 * ```hs
 * sumAPValue (2, 5) (4, 0) == 2
 * sumAPValue (5, 10) (9, 0) == 15
 * sumAPValue (5, 15) (14, 0) == 30
 * sumAPValue (5, 15) (13, 0) == 45
 * ```
 */
const sumAPValue =
  (icAndMax: Pair<number, number>) => (current: Pair<number, number>): number =>
    fst (current) === snd (icAndMax)
      ? snd (current)
      : sumAPValue (icAndMax)
                   (bimap (inc)
                          (add (getImprovementCost (fst (icAndMax))
                                                   (inc (fst (current)))))
                          (current))

const getIncreaseRangeAP =
  (ic: number) => (fromValue: number) => (toValue: number) =>
    sumAPValue (Pair (ic, toValue)) (Pair (fromValue, 0))

const getDecreaseRangeAP =
  (ic: number) => (fromValue: number) => (toValue: number) =>
    -sumAPValue (Pair (ic, fromValue)) (Pair (toValue, 0))

/**
 * `getAPRange :: Int -> Int -> Int -> Int`
 *
 * `getAPRange ic fromValue toValue` returns the AP cost for the given value
 * range.
 */
export const getAPRange = (ic: number) => (fromValue: number) => (toValue: number) => {
  if (fromValue === toValue) {
    return 0
  }

  const getSignedAPRange = fromValue > toValue ? getDecreaseRangeAP : getIncreaseRangeAP

  return getSignedAPRange (ic) (fromValue) (toValue)
}

const improvementCostNames = ["A", "B", "C", "D", "E"]

/**
 * `getICName :: Int -> String`
 *
 * Returns the string representing the IC id.
 */
export const getICName = (numericId: number) => improvementCostNames [numericId - 1]
