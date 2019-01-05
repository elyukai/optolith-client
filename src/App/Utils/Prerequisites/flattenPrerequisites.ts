import { pipe } from "ramda";
import { ActivatablePrerequisites, AllRequirements, LevelAwarePrerequisites } from "../../Models/Wiki/wikiTypeHelpers";
import { cnst } from "../../../Data/Function";
import { List } from "../../../Data/List";
import { fmap, fromMaybe, Just, Maybe, maybe, Nothing } from "../../../Data/Maybe";
import { filterWithKey_, isOrderedMap, OrderedMap } from "../../../Data/OrderedMap";
import { lte, max, min } from "../mathUtils";

type LevelFilter = (key: number) => (value: ActivatablePrerequisites) => boolean

const createLowerFilter = (oldTier: number): LevelFilter => pipe (lte (oldTier), cnst)

const createInBetweenFilter = (oldTier: number) => (newTier: number): LevelFilter => {
  const lower = min (oldTier) (newTier)
  const higher = max (oldTier) (newTier)

  return (key: number) => cnst (key <= higher && key > lower)
}

/**
 * `createFilter newLevel oldLevel` creates a new filter function for filtering
 * level-based prerequisites.
 */
const createFilter = (newTier: Maybe<number>) =>
  pipe (
    fmap<number, LevelFilter> (
      oldTier => maybe<number, LevelFilter> (createLowerFilter (oldTier))
                                            (createInBetweenFilter (oldTier))
                                            (newTier)
    ),
    fromMaybe<LevelFilter> (() => () => true)
  )

const createFlattenFiltered = (
  (prerequisites: OrderedMap<number, ActivatablePrerequisites>) =>
    pipe (
      filterWithKey_<number, List<AllRequirements>> (prerequisites),
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

export const getFirstTierPrerequisites =
  (prerequisites: LevelAwarePrerequisites): ActivatablePrerequisites =>
    flattenPrerequisites (prerequisites) (Nothing) (Just (1))
