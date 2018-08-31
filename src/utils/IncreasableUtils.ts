import R from 'ramda';
import { ValueBasedDependent } from '../types/data';
import { SkillishEntry } from '../types/wiki';
import { areSufficientAPAvailable } from './adventurePointsUtils';
import { Just, Maybe, Record } from './dataUtils';
import { getDecreaseAP, getIncreaseAP } from './improvementCostUtils';

export const set =
  <T extends ValueBasedDependent>(instance: T, value: number): T =>
    (instance as Record<any>).insert ('value') (value) as T;

export const add =
  <T extends ValueBasedDependent>(instance: T, value: number): T =>
    (instance as Record<any>).modify (R.add (value)) ('value') as T;

export const remove =
  <T extends ValueBasedDependent>(instance: T, value: number): T =>
    (instance as Record<any>).modify (R.flip (R.subtract) (value)) ('value') as T;

export const addPoint =
  <T extends ValueBasedDependent>(instance: T): T =>
    (instance as Record<any>).modify (R.inc) ('value') as T;

export const removePoint =
  <T extends ValueBasedDependent>(instance: T): T =>
    (instance as Record<any>).modify (R.dec) ('value') as T;

export const getIncreaseCost = <T extends ValueBasedDependent>(
  wikiEntry: SkillishEntry,
  instance: T,
  availableAP: number,
  negativeApValid: boolean,
): Maybe<number> =>
  Just (getIncreaseAP (wikiEntry.get ('ic')) (instance.lookup ('value')))
    .bind (Maybe.ensure (areSufficientAPAvailable (negativeApValid) (availableAP)));

export const getDecreaseCost = <T extends ValueBasedDependent>(
  wikiEntry: SkillishEntry,
  instance: T,
): number => getDecreaseAP (wikiEntry.get ('ic')) (instance.lookup ('value'));
