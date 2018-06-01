import { flatten } from 'lodash';
import R from 'ramda';
import { ActivatablePrerequisites, LevelAwarePrerequisites } from '../types/wiki.d';

type LevelPair = [number, ActivatablePrerequisites];
type PrerequisiteFilter = (pair: LevelPair) => boolean;

const createLowerFilter = (oldTier: number) =>
  (pair: LevelPair): boolean =>
    pair[0] <= oldTier;

const createInBetweenFilter = (oldTier: number, newTier: number) => {
  const lower = Math.min(oldTier, newTier);
  const higher = Math.max(oldTier, newTier);

  return (pair: LevelPair): boolean => pair[0] <= higher && pair[0] > lower;
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
    return R.T;
  }
};

const createFlattenFiltered = (prerequisites: Map<number, ActivatablePrerequisites>) =>
  (filter: PrerequisiteFilter) => {
    return flatten([...prerequisites].filter(e => filter(e)).map(e => e[1]))
  };

const flattenMap = (
  prerequisites: Map<number, ActivatablePrerequisites>,
  oldTier?: number,
  newTier?: number,
) => R.pipe(
  createFilter(newTier),
  createFlattenFiltered(prerequisites),
)(oldTier);

export function flattenPrerequisites(
  prerequisites: LevelAwarePrerequisites,
): ActivatablePrerequisites;
export function flattenPrerequisites(
  prerequisites: LevelAwarePrerequisites,
  tier: number,
): ActivatablePrerequisites;
export function flattenPrerequisites(
  prerequisites: LevelAwarePrerequisites,
  oldTier: number,
  newTier: number,
): ActivatablePrerequisites;
export function flattenPrerequisites(
  prerequisites: LevelAwarePrerequisites,
  oldTier?: number,
  newTier?: number,
): ActivatablePrerequisites {
  if (prerequisites instanceof Map) {
    return flattenMap(prerequisites, oldTier, newTier);
  }

  return prerequisites;
}

export const getFirstTierPrerequisites = (
  prerequisites: LevelAwarePrerequisites,
): ActivatablePrerequisites => flattenPrerequisites(prerequisites, 1);
