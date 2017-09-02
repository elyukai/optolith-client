import { DependentInstancesState } from '../reducers/dependentInstances';
import { get } from '../selectors/dependentInstancesSelectors';
import { ProfessionInstance, ProfessionVariantInstance, RaceInstance } from '../types/data.d';
import { dice } from './dice';

/**
 * Returns the AP cost difference between the given Races/Professions/Profession Variants. If you have to pay more, the returned number is positive and vice versa.
 * @param state All entries.
 * @param prevId The id of the previous RCP instance.
 * @param nextId The id of the next RCP instance.
 */
export function getDiffCost(state: DependentInstancesState, prevId?: string, nextId?: string) {
	const prev = prevId ? (get(state, prevId) as ProfessionInstance | ProfessionVariantInstance | RaceInstance).ap : 0;
	const next = nextId ? (get(state, nextId) as ProfessionInstance | ProfessionVariantInstance | RaceInstance).ap : 0;
	return next - prev;
}

export function rerollHairColor(current: RaceInstance) {
	const result = dice(20);
	return current.hairColors[result - 1];
}

export function rerollEyeColor(current: RaceInstance) {
	const result = dice(20);
	return current.eyeColors[result - 1];
}

export function rerollSize(race: RaceInstance) {
	const [ base, ...dices ] = race.size;
	const arr: number[] = [];
	dices.forEach((e: [number, number]) => {
		const elements = Array.from({ length: e[0] }, () => e[1]);
		arr.push(...elements);
	});
	const result = (base as number) + arr.map(e => dice(e)).reduce((a, b) => a + b, 0);
	return result.toString();
}

export function rerollWeight(race: RaceInstance, size: string = rerollSize(race)) {
	const { id, weight } = race;
	const [ base, ...dices ] = weight;
	const arr: number[] = [];
	dices.forEach((e: [number, number]) => {
		const elements = Array.from({ length: e[0] }, () => e[1]);
		arr.push(...elements);
	});
	const add = ['R_1', 'R_2', 'R_3', 'R_4', 'R_5', 'R_6', 'R_7'].includes(id) ?
		arr.map(e => {
			const result = dice(Math.abs(e));
			return result % 2 > 0 ? -result : result;
		}) :
		arr.map(e => {
			const result = dice(Math.abs(e));
			return e < 0 ? -result : result;
		});
	const result = Number.parseInt(size) + (base as number) + add.reduce((a, b) => a + b, 0);
	return [result.toString(), size] as [string, string];
}
