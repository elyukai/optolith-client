import { ValueBasedDependent } from '../types/data.d';
import { SkillishEntry } from '../types/wiki';
import { areSufficientAPAvailable } from './adventurePointsUtils';
import { getDecreaseAP, getIncreaseAP } from './improvementCostUtils';

export const set = <T extends ValueBasedDependent>(
  instance: T,
  value: number,
): T => {
  return {
    ...(instance as any),
    value,
  };
};

export const add = <T extends ValueBasedDependent>(
  instance: T,
  value: number,
): T => {
  return {
    ...(instance as any),
    value: instance.value + value,
  };
};

export const remove = <T extends ValueBasedDependent>(
  instance: T,
  value: number,
): T => {
  return {
    ...(instance as any),
    value: instance.value - value,
  };
};

export const addPoint = <T extends ValueBasedDependent>(
  instance: T,
): T => {
  return {
    ...(instance as any),
    value: instance.value + 1,
  };
};

export const removePoint = <T extends ValueBasedDependent>(
  instance: T,
): T => {
  return {
    ...(instance as any),
    value: instance.value - 1,
  };
};

export const getIncreaseCost = <T extends ValueBasedDependent>(
  wikiEntry: SkillishEntry,
  instance: T,
  availableAP: number,
  negativeApValid: boolean,
): number | undefined => {
  const cost = getIncreaseAP(wikiEntry.ic, instance.value);

  const validCost = areSufficientAPAvailable(
    cost,
    availableAP,
    negativeApValid,
  );

  return !validCost ? undefined : cost;
};

export const getDecreaseCost = <T extends ValueBasedDependent>(
  wikiEntry: SkillishEntry,
  instance: T,
): number => {
  return getDecreaseAP(wikiEntry.ic, instance.value);
};
