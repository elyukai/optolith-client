import { pipe } from "ramda";
import { cnst } from "../../../../Data/Function";
import { List } from "../../../../Data/List";
import { Just, Maybe, maybe, Nothing } from "../../../../Data/Maybe";
import { filterWithKeyF, isOrderedMap, OrderedMap } from "../../../../Data/OrderedMap";
import { ActivatablePrerequisites, LevelAwarePrerequisites } from "../../../Models/Wiki/wikiTypeHelpers";
import { lte, max, min } from "../../mathUtils";

type LevelFilter = (key: number) => (value: ActivatablePrerequisites) => boolean

const createLowerFilter =
  (oldTier: number): LevelFilter => pipe (lte (oldTier), cnst)

const createInBetweenFilter =
  (oldTier: number) => (newTier: number): LevelFilter => {
    const lower = min (oldTier) (newTier)
    const higher = max (oldTier) (newTier)

    return (key: number) => cnst (key <= higher && key > lower)
  }

/**
 * `createFilter newLevel oldLevel` creates a new filter function for filtering
 * level-based prerequisites.
 */
const createFilter = (new_level: Maybe<number>) =>
  maybe<LevelFilter> (cnst (cnst (true)))
                     ((old_level: number) => maybe (createLowerFilter (old_level))
                                                   (createInBetweenFilter (old_level))
                                                   (new_level))

const createFlattenFiltered = (
  (prerequisites: OrderedMap<number, ActivatablePrerequisites>) =>
    pipe (
      filterWithKeyF (prerequisites),
      OrderedMap.elems,
      List.concat
    )
)

const flattenMap = (
  (prerequisites: OrderedMap<number, ActivatablePrerequisites>) =>
  (newTier: Maybe<number>) =>
    pipe (
      createFilter (newTier),
      createFlattenFiltered (prerequisites)
    )
)

export const flattenPrerequisites =
  (prerequisites: LevelAwarePrerequisites) =>
  (newTier: Maybe<number>) =>
  (oldTier: Maybe<number>): ActivatablePrerequisites =>
    isOrderedMap (prerequisites)
      ? flattenMap (prerequisites) (newTier) (oldTier)
      : prerequisites

export const getFirstLevelPrerequisites =
  (prerequisites: LevelAwarePrerequisites): ActivatablePrerequisites =>
    flattenPrerequisites (prerequisites) (Nothing) (Just (1))
