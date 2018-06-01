import { ExperienceLevel } from '../types/wiki.d';
import { getNumericId, getStringId } from './IDUtils';

/**
 * Returns the experience level that fits the given AP value.
 * @param elList The list of all available experience levels.
 * @param ap The AP value you want to get the corresponding EL for.
 */
export const getExperienceLevelIdByAp = (
  experienceLevels: Map<string, ExperienceLevel>,
  ap: number,
): string => {
  return [...experienceLevels].reduce((result, [id, { ap: threshold }]) => {
    const prev = experienceLevels.get(result);
    if (ap >= threshold && (!prev || prev.ap < threshold)) {
      return id;
    }
    return result;
  }, 'EL_1');
};

/**
 * Returns the experience level number id that fits the given AP value.
 * @param elList The list of all available experience levels.
 * @param ap The AP value you want to get the corresponding EL for.
 */
export const getExperienceLevelNumericIdByAp = (
  experienceLevels: Map<string, ExperienceLevel>,
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
