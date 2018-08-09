import R from 'ramda';
import { ActivatablePrerequisites, LevelAwarePrerequisites } from '../types/wiki';
import { OrderedMap } from './dataUtils';

type PrerequisiteFilter = (key: number) =>
  (value: ActivatablePrerequisites) => boolean;

const createLowerFilter = (oldTier: number) =>
  (key: number) => (): boolean =>
    key <= oldTier;

const createInBetweenFilter = (oldTier: number, newTier: number) => {
  const lower = Math.min(oldTier, newTier);
  const higher = Math.max(oldTier, newTier);

  return (key: number) => (): boolean =>
    key <= higher && key > lower;
};

const createFilter = (newTier?: number) =>
  (oldTier?: number): PrerequisiteFilter => {
  if (isNumber(oldTier) && isNumber(newTier)) {
    return createInBetweenFilter(oldTier, newTier)
  }
  else if (isNumber(oldTier)) {
    return createLowerFilter(oldTier);
  }
  else {
    return () => () => true;
  }
};

const createFlattenFiltered =
  (prerequisites: OrderedMap<number, ActivatablePrerequisites>) =>
    (filter: PrerequisiteFilter) =>
      OrderedMap.toValueList(prerequisites.filterWithKey(filter)).concatInner();

const flattenMap = (
  prerequisites: OrderedMap<number, ActivatablePrerequisites>,
  oldTier?: number,
  newTier?: number,
) => R.pipe(
  createFilter(newTier),
  createFlattenFiltered(prerequisites),
)(oldTier);

export function flattenPrerequisites(
  prerequisites: LevelAwarePrerequisites,
  oldTier?: number,
  newTier?: number,
): ActivatablePrerequisites {
  if (prerequisites instanceof OrderedMap) {
    return flattenMap(prerequisites, oldTier, newTier);
  }

  return prerequisites;
}

export const getFirstTierPrerequisites = (
  prerequisites: LevelAwarePrerequisites,
): ActivatablePrerequisites => flattenPrerequisites(prerequisites, 1);
