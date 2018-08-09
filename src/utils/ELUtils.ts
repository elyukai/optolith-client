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
): string => {
  return experienceLevels.foldlWithKey(
    result => id => el => {
      const prev = experienceLevels.lookup(result);

      const threshold = el.get('ap');

      if (
        ap >= threshold
        && (!Maybe.isJust(prev) || Maybe.fromJust(prev).get('ap') < threshold)
      ) {
        return id;
      }

      return result;
    },
    'EL_1'
  );
};

/**
 * Returns the experience level number id that fits the given AP value.
 * @param elList The list of all available experience levels.
 * @param ap The AP value you want to get the corresponding EL for.
 */
export const getExperienceLevelNumericIdByAp = (
  experienceLevels: OrderedMap<string, Record<ExperienceLevel>>,
  ap: number,
): number => {
  return getNumericId(getExperienceLevelIdByAp(experienceLevels, ap));
};

/**
 * Returns the id of the closest higher EL.
 * @param lowerId The lower EL's id.
 */
export function getHigherExperienceLevelId(lowerId: string): string {
  return getStringId(getNumericId(lowerId) + 1, 'EL');
}
