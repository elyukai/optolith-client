import { ValueBasedDependent } from '../types/data';
import { SkillishEntry } from '../types/wiki';
import { areSufficientAPAvailable } from './adventurePointsUtils';
import { Maybe, Record } from './dataUtils';
import { getDecreaseAP, getIncreaseAP } from './improvementCostUtils';

export const set =
  <T extends ValueBasedDependent>(instance: T, value: number): T =>
    (instance as Record<any>).insert('value', value) as T;

export const add =
  <T extends ValueBasedDependent>(instance: T, value: number): T =>
    (instance as Record<any>).modify(prev => prev + value, 'value') as T;

export const remove =
  <T extends ValueBasedDependent>(instance: T, value: number): T =>
    (instance as Record<any>).modify(prev => prev - value, 'value') as T;

export const addPoint =
  <T extends ValueBasedDependent>(instance: T): T =>
    (instance as Record<any>).modify(prev => prev + 1, 'value') as T;

export const removePoint =
  <T extends ValueBasedDependent>(instance: T): T =>
    (instance as Record<any>).modify(prev => prev - 1, 'value') as T;

export const getIncreaseCost = <T extends ValueBasedDependent>(
  wikiEntry: SkillishEntry,
  instance: T,
  availableAP: number,
  negativeApValid: boolean,
): Maybe<number> => {
  const cost = getIncreaseAP(wikiEntry.get('ic'), instance.get('value'));

  const validCost = areSufficientAPAvailable(
    cost,
    availableAP,
    negativeApValid,
  );

  return validCost ? Maybe.Just(cost) : Maybe.Nothing();
};

export const getDecreaseCost = <T extends ValueBasedDependent>(
  wikiEntry: SkillishEntry,
  instance: T,
): number => {
  return getDecreaseAP(wikiEntry.get('ic'), instance.get('value'));
};
