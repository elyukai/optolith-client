import { pipe } from "ramda";
import { IdPrefixes } from "../constants/IdPrefixes";
import { getNumericId, prefixId } from "./IDUtils";
import { inc, lt } from "./mathUtils";
import { and, fmap } from "./structures/Maybe";
import { foldlWithKey, lookup_, OrderedMap } from "./structures/OrderedMap";
import { Record } from "./structures/Record";
import { ExperienceLevel } from "./wikiData/ExperienceLevel";

const { ap } = ExperienceLevel.A

/**
 * Returns the experience level that fits the given AP value.
 */
export const getExperienceLevelIdByAp =
  (experience_levels: OrderedMap<string, Record<ExperienceLevel>>) =>
  (current_ap: number) =>
    foldlWithKey<string, Record<ExperienceLevel>, string>
      (result => id => el => {
          const prev = lookup_ (experience_levels) (result)

          const threshold = ap (el)

          return current_ap >= threshold && and (fmap (pipe (ap, lt (threshold))) (prev))
            ? id
            : result
        }
      )
      ("EL_1")
      (experience_levels)

/**
 * Returns the experience level number id that fits the given AP value.
 * @param elList The list of all available experience levels.
 * @param ap The AP value you want to get the corresponding EL for.
 */
export const getExperienceLevelNumericIdByAp =
  (experienceLevels: OrderedMap<string, Record<ExperienceLevel>>) =>
    pipe (getExperienceLevelIdByAp (experienceLevels), getNumericId)

/**
 * Returns the id of the closest higher EL (does not need to be valid!).
 * @param lowerId The lower EL's id.
 */
export const getHigherExperienceLevelId =
  pipe (getNumericId, inc, prefixId (IdPrefixes.EXPERIENCE_LEVELS))
