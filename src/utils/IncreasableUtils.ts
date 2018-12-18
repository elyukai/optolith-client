import * as R from 'ramda';
import { Categories, IncreasableCategory } from '../constants/Categories';
import { ValueBasedDependent } from '../types/data';
import { IncreasableEntry } from '../types/wiki';
import { getAreSufficientAPAvailable } from './adventurePoints/adventurePointsUtils';
import { getIncreaseAP } from './adventurePoints/improvementCostUtils';
import { Just, Maybe, Record } from './dataUtils';
import { isAttribute } from './WikiUtils';

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

export const getBaseValueByCategory = (category: IncreasableCategory) => {
  switch (category) {
    case Categories.ATTRIBUTES:
      return 8;
    case Categories.COMBAT_TECHNIQUES:
      return 6;
    case Categories.LITURGIES:
      return 0;
    case Categories.SPELLS:
      return 0;
    case Categories.TALENTS:
      return 0;
  }
};

const getValueFromHeroStateEntry = (wikiEntry: IncreasableEntry) =>
  (maybeEntry: Maybe<ValueBasedDependent>) =>
    Maybe.fromMaybe (getBaseValueByCategory (wikiEntry.get ('category')))
                    (maybeEntry.fmap (entry => entry.get ('value')));

export const getAreSufficientAPAvailableForIncrease = <T extends ValueBasedDependent>(
  wikiEntry: IncreasableEntry,
  instance: Maybe<T>,
  availableAP: number,
  negativeApValid: boolean,
): boolean =>
  getAreSufficientAPAvailable (negativeApValid)
                           (availableAP)
                           (getIncreaseAP (isAttribute (wikiEntry)
                                            ? 5
                                            : wikiEntry.get ('ic'))
                                          (Just (getValueFromHeroStateEntry (wikiEntry)
                                                                            (instance))));
