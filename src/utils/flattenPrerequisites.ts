import { flatten } from 'lodash';
import { ActivatablePrerequisites, LevelAwarePrerequisites } from '../types/wiki.d';
import { pipe } from './pipe';

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
  (oldTier: number): PrerequisiteFilter => {
  if (typeof newTier === 'number') {
    return createInBetweenFilter(oldTier, newTier)
  }
  else {
    return createLowerFilter(oldTier);
  }
};

const createFlattenFiltered = (prerequisites: Map<number, ActivatablePrerequisites>) =>
  (filter: PrerequisiteFilter) => {
    return flatten([...prerequisites].filter(e => filter(e)).map(e => e[1]))
  };

const flattenMap = (
  prerequisites: Map<number, ActivatablePrerequisites>,
  oldTier: number,
  newTier?: number,
) => pipe(
  createFilter(newTier),
  createFlattenFiltered(prerequisites),
)(oldTier);

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
  oldTier: number,
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
