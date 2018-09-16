import * as R from 'ramda';
import { List, Maybe, Tuple } from './dataUtils';
import { Just, Nothing } from './structures/maybe';

const getBase = (ic: number) => ic === 5 ? 15 : ic;

const getValueThreshold = (ic: number) => ic === 5 ? 15 : 13;
const getValueThresholdDiff = (ic: number) => (value: number) =>
  value - getValueThreshold (ic) + 2;

const getValueMultiplier = (ic: number) =>
  Maybe.maybe<number, number> (1) (
    R.pipe (
      getValueThresholdDiff (ic),
      R.max<number> (1)
    )
  );

/**
 * The function `getImprovementCost ic sr` returns the AP cost for one
 * step based on the passed improvement cost factor (`ic`) and the current skill
 * rating or value (`sr`).
 */
const getImprovementCost = (ic: number) => R.pipe (
  getValueMultiplier (ic),
  R.multiply (getBase (ic))
);

const getIncreasedFromValue = Maybe.fmap (R.inc);

/**
 * `getIncreaseAP ic fromValue` returns the AP cost for the next increase.
 * @param ic The improvement cost. Ranges from 1 = A to 5 = E.
 * @param fromValue The value that should be increased.
 */
export const getIncreaseAP = (ic: number) => R.pipe (
  getIncreasedFromValue,
  getImprovementCost (ic)
);

/**
 * `getDecreaseAP ic fromValue` returns the AP cost for the next decrease.
 * @param ic The improvement cost. Ranges from 1 = A to 5 = E.
 * @param fromValue The value that should be decreased.
 */
export const getDecreaseAP = (ic: number) => R.pipe (
  getImprovementCost (ic),
  R.negate
);

type Calculator = (ic: number) => (fromValue: Maybe<number>) => number;
type PrepareFromValue = (fromValue: number) => (index: number) => number;

/**
 * Builds a list with all the costs for every step and returns it's sum.
 */
const combineAPRange = (calculator: Calculator) =>
  (prepareFromValue: PrepareFromValue) =>
    (ic: number) => (fromValue: number) => (toValue: number) =>
      List.unfoldr<number, number> (
        step => step === 0
          ? Nothing ()
          : Just (
              Tuple.of<number, number> (
                calculator (ic) (Just (prepareFromValue (fromValue) (step - 1)))
              ) (step - 1)
            )
      ) (Math.abs (fromValue - toValue))
        .sum ();

const getIncreaseRangeAP = combineAPRange (getIncreaseAP) (R.add);
const getDecreaseRangeAP = combineAPRange (getDecreaseAP) (R.subtract);

/**
 * Returns the AP cost for the given value range.
 * @param ic The improvement cost. Ranges from 1 = A to 5 = E.
 * @param fromValue The previous value.
 * @param toValue The target value to which you want to get the accumulated AP cost for.
 */
export const getAPRange = (ic: number) => (fromValue: number) => (toValue: number) => {
  if (fromValue === toValue) {
    return 0;
  }

  const getSignedAPRange = fromValue > toValue ? getDecreaseRangeAP : getIncreaseRangeAP;

  return getSignedAPRange (ic) (fromValue) (toValue);
}

const improvementCostNames = ['A', 'B', 'C', 'D', 'E'];

/**
 * Returns the string representing the IC id.
 * @param numericId
 */
export const getICName = (numericId: number) => improvementCostNames[numericId - 1];
