import { fmap } from "../../Data/Functor";
import { and } from "../../Data/Maybe";
import { inc, lt } from "../../Data/Num";
import { foldlWithKey, lookupF, OrderedMap } from "../../Data/OrderedMap";
import { Record } from "../../Data/Record";
import { IdPrefixes } from "../Constants/IdPrefixes";
import { ExperienceLevelId } from "../Constants/Ids";
import { ExperienceLevel } from "../Models/Wiki/ExperienceLevel";
import { getNumericId, prefixId } from "./IDUtils";
import { pipe } from "./pipe";

const { ap } = ExperienceLevel.AL

/**
 * Returns the experience level that fits the given AP value.
 */
export const getExperienceLevelIdByAp =
  (experience_levels: OrderedMap<string, Record<ExperienceLevel>>) =>
  (current_ap: number) =>
    foldlWithKey<string, Record<ExperienceLevel>, string>
      (result => id => el => {
          const prev = lookupF (experience_levels) (result)

          const threshold = ap (el)

          return current_ap >= threshold && and (fmap (pipe (ap, lt (threshold))) (prev))
            ? id
            : result
        })
      (ExperienceLevelId.Inexperienced)
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
