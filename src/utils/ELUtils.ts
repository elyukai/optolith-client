import * as R from 'ramda';
import { IdPrefixes } from '../constants/IdPrefixes';
import { ExperienceLevel } from '../types/wiki';
import { Maybe, OrderedMap, Record } from './dataUtils';
import { getNumericId, getStringId } from './IDUtils';

/**
 * Returns the experience level that fits the given AP value.
 * @param elList The list of all available experience levels.
 * @param ap The AP value you want to get the corresponding EL for.
 */
export const getExperienceLevelIdByAp = (
  experienceLevels: OrderedMap<string, Record<ExperienceLevel>>,
  ap: number,
): string => experienceLevels.foldlWithKey<string> (
    result => id => el => {
      const prev = experienceLevels.lookup (result);

      const threshold = el.get ('ap');

      if (
        ap >= threshold
        && (!Maybe.isJust (prev) || Maybe.fromJust (prev).get ('ap') < threshold)
      ) {
        return id;
      }

      return result;
    }
  ) ('EL_1');

/**
 * Returns the experience level number id that fits the given AP value.
 * @param elList The list of all available experience levels.
 * @param ap The AP value you want to get the corresponding EL for.
 */
export const getExperienceLevelNumericIdByAp = (
  experienceLevels: OrderedMap<string, Record<ExperienceLevel>>,
  ap: number,
): number => getNumericId (getExperienceLevelIdByAp (experienceLevels, ap));

/**
 * Returns the id of the closest higher EL.
 * @param lowerId The lower EL's id.
 */
export const getHigherExperienceLevelId = R.pipe (
  getNumericId,
  R.inc,
  getStringId (IdPrefixes.EXPERIENCE_LEVELS)
);
