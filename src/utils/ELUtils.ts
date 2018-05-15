import { ExperienceLevel } from '../types/wiki.d';

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

/**
 * Returns the experience level number id that fits the given AP value.
 * @param elList The list of all available experience levels.
 * @param ap The AP value you want to get the corresponding EL for.
 */
export function getExperienceLevelNumberIdByAp(elList: Map<string, ExperienceLevel>, ap: number): number {
	return Number.parseInt(getExperienceLevelIdByAp(elList, ap).split(/_/)[1]);
}

/**
 * Returns the id of the closest higher EL.
 * @param lowerId The lower EL's id.
 */
export function getHigherExperienceLevelId(lowerId: string): string {
	return `EL_${Number.parseInt(lowerId.split('_')[1]) + 1}`;
}
