import { cnst } from "../../../Data/Function";
import { inRange } from "../../../Data/Ix";
import { concat } from "../../../Data/List";
import { fromJust, isJust, Just, Maybe, Nothing } from "../../../Data/Maybe";
import { elems, filterWithKey, isOrderedMap } from "../../../Data/OrderedMap";
import { first } from "../../../Data/Tuple";
import { ActivatablePrerequisites, LevelAwarePrerequisites } from "../../Models/Wiki/wikiTypeHelpers";
import { inc, lte, minmax } from "../mathUtils";
import { pipe } from "../pipe";

const keyInRangePred =
  (mnew_level: Maybe<number>) =>
  (mold_level: Maybe<number>): (key: number) => boolean => {
    // Used for changing level
    if (isJust (mnew_level) && isJust (mold_level)) {
      const new_level = fromJust (mnew_level)
      const old_level = fromJust (mold_level)

      return inRange (first (inc) (minmax (new_level) (old_level)))
    }
    // Used for activating an entry
    else if (isJust (mnew_level)) {
      const new_level = fromJust (mnew_level)

      return lte (new_level)
    }
    // Used for deactivating an entry
    else if (isJust (mold_level)) {
      const old_level = fromJust (mold_level)

      return lte (old_level)
    }
    else {
      return cnst (true)
    }
  }

const flattenMap =
  (mnew_level: Maybe<number>) =>
  (mold_level: Maybe<number>) =>
    pipe (
      filterWithKey ((key: number) => (_: ActivatablePrerequisites) =>
                      keyInRangePred (mnew_level) (mold_level) (key)),
      elems,
      concat
    )

export const flattenPrerequisites =
  (newTier: Maybe<number>) =>
  (oldTier: Maybe<number>) =>
  (prerequisites: LevelAwarePrerequisites): ActivatablePrerequisites =>
    isOrderedMap (prerequisites)
      ? flattenMap (newTier) (oldTier) (prerequisites)
      : prerequisites

export const getFirstLevelPrerequisites = flattenPrerequisites (Just (1)) (Nothing)
