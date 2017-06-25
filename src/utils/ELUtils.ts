import { ExperienceLevel } from '../types/data.d';

/**
 * Returns the experience level that fits the given AP value.
 * @param elList The list of all available experience levels.
 * @param ap The AP value you want to get the corresponding EL for.
 */
export function getExperienceLevelIdByAp(elList: Map<string, ExperienceLevel>, ap: number): string {
	return [...elList].reduce((result, [id, { ap: threshold }]) => {
		const prev = elList.get(result);
		if (ap >= threshold && (!prev || prev.ap < threshold)) {
			return id;
		}
		return result;
	}, 'EL_1');
}
