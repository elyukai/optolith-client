import * as R from 'ramda';
import { ActivatablePrerequisites, AllRequirements, LevelAwarePrerequisites } from '../../types/wiki';
import { flip } from '../flip';
import { Just, List, Maybe, Nothing, OrderedMap } from './dataUtils';

type LevelFilter = (key: number) =>
  (value: ActivatablePrerequisites) => boolean;

const createLowerFilter = (oldTier: number): LevelFilter =>
  (key: number) => (): boolean =>
    key <= oldTier;

const createInBetweenFilter = (oldTier: number) => (newTier: number): LevelFilter => {
  const lower = Math.min (oldTier, newTier);
  const higher = Math.max (oldTier, newTier);

  return (key: number) => (): boolean =>
    key <= higher && key > lower;
};

/**
 * `createFilter newLevel oldLevel` creates a new filter function for filtering
 * level-based prerequisites.
 */
const createFilter = (newTier: Maybe<number>) =>
  R.pipe (
    Maybe.fmap<number, LevelFilter> (
      oldTier => Maybe.maybe<number, LevelFilter> (createLowerFilter (oldTier))
                                                  (createInBetweenFilter (oldTier))
                                                  (newTier)
    ),
    Maybe.fromMaybe<LevelFilter> (() => () => true)
  );

const createFlattenFiltered = (
  (prerequisites: OrderedMap<number, ActivatablePrerequisites>) =>
    R.pipe (
      flip<
        (key: number) => (value: List<AllRequirements>) => boolean,
        OrderedMap<number, List<AllRequirements>>,
        OrderedMap<number, List<AllRequirements>>
      > (OrderedMap.filterWithKey) (prerequisites),
      OrderedMap.elems,
      List.concat
    )
);

const flattenMap = (
  (prerequisites: OrderedMap<number, ActivatablePrerequisites>) =>
  (newTier: Maybe<number>) =>
    R.pipe (
      createFilter (newTier),
      createFlattenFiltered (prerequisites)
    )
);

export const flattenPrerequisites = (
  (prerequisites: LevelAwarePrerequisites) =>
  (newTier: Maybe<number>) =>
  (oldTier: Maybe<number>): ActivatablePrerequisites => {
    if (prerequisites instanceof OrderedMap) {
      return flattenMap (prerequisites) (newTier) (oldTier);
    }

    return prerequisites;
  }
);

export const getFirstTierPrerequisites = (
  prerequisites: LevelAwarePrerequisites,
): ActivatablePrerequisites => flattenPrerequisites (prerequisites) (Nothing ()) (Just (1));
