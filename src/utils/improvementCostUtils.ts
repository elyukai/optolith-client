const getBase = (ic: number) => ic === 5 ? 15 : ic;

const getValueThreshold = (ic: number) => ic === 5 ? 15 : 13;
const getValueThresholdDiff = (ic: number, value: number) => {
  return value - getValueThreshold(ic) + 2;
}

const getValueMultiplier = (ic: number, value?: number) => {
  if (value === undefined) {
    return 1;
  }
  else {
    const thresholdValue = getValueThresholdDiff(ic, value);
    return Math.max(1, thresholdValue);
  }
};

const getImprovementCost = (ic: number, value?: number) => {
  return getBase(ic) * getValueMultiplier(ic, value);
};

const getIncreasedFromValue = (fromValue?: number) => {
  return typeof fromValue === 'number' ? fromValue + 1 : undefined;
};

/**
 * Returns the AP cost for the next increase.
 * @param ic The improvement cost. Ranges from 1 = A to 5 = E.
 * @param fromValue The value that should be increased.
 */
export const getIncreaseAP = (ic: number, fromValue?: number): number => {
  return getImprovementCost(ic, getIncreasedFromValue(fromValue));
};

/**
 * Returns the AP cost for the next decrease.
 * @param ic The improvement cost. Ranges from 1 = A to 5 = E.
 * @param fromValue The value that should be decreased.
 */
export const getDecreaseAP = (ic: number, fromValue?: number): number => {
  return getImprovementCost(ic, fromValue) * -1;
};

type Calculator = (ic: number, fromValue?: number) => number;
type PrepareFromValue = (fromValue: number, index: number) => number;

const combineAPRange = (calculator: Calculator, prepareFromValue: PrepareFromValue) => {
  return (ic: number, fromValue: number, toValue: number): number => {
    const steps = Math.abs(fromValue - toValue);
    const stepsArr = Array.from({ length: steps })

    return stepsArr.reduce<number>((sum, _, i) => {
      return sum + calculator(ic, prepareFromValue(fromValue, i));
    }, 0);
  };
}

const getIncreaseRangeAP = combineAPRange(getIncreaseAP, (v, i) => i + v);
const getDecreaseRangeAP = combineAPRange(getDecreaseAP, (v, i) => v - i);

/**
 * Returns the AP cost for the given value range.
 * @param ic The improvement cost. Ranges from 1 = A to 5 = E.
 * @param fromValue The previous value.
 * @param toValue The target value to which you want to get the accumulated AP cost for.
 */
export const getAPRange = (ic: number, fromValue: number, toValue: number) => {
  if (fromValue === toValue) {
    return 0;
  }
  else if (fromValue > toValue) {
    return getDecreaseRangeAP(ic, fromValue, toValue);
  }
  else {
    return getIncreaseRangeAP(ic, fromValue, toValue);
  }
}

const improvementCostNames = ['A', 'B', 'C', 'D', 'E'];

/**
 * Returns the string representing the IC id.
 * @param numericId
 */
export const getICName = (numericId: number) => improvementCostNames[numericId - 1];
