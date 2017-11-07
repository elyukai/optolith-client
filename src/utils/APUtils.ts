import { last } from 'lodash';
import { AdventurePointsState } from '../reducers/adventurePoints';
import { DependentInstancesState } from '../reducers/dependentInstances';
import { getLeft } from '../selectors/adventurePointsSelectors';
import { get } from '../selectors/dependentInstancesSelectors';
import { SpecialAbilityInstance } from '../types/data.d';

/**
 * Checks if there are enough AP available.
 * @param cost The AP value you want to check.
 * @param ap The current AP state.
 * @param negativeApValid If the character's AP left can be a negative value (during character creation) or not.
 */
export function validate(cost: number, ap: AdventurePointsState, negativeApValid: boolean): boolean {
	if (cost > 0 && negativeApValid === false) {
		return cost <= getLeft(ap);
	}
	return true;
}

/**
 * Checks if there are enough AP available and if the restrictions for advantages/disadvantages will be met.
 * @param cost The AP value you want to check.
 * @param ap The current AP state.
 * @param state The list of dependent instances.
 * @param isMagicalOrBlessed If the the advantage/disadvantage is magical or blessed.
 * @param isDisadvantage If the entry is a disadvantage.
 * @param isInCharacterCreation If the character's AP left can be a negative value (during character creation) or not.
 */
export function validateDisAdvantages(cost: number, ap: AdventurePointsState, state: DependentInstancesState, isMagicalOrBlessed: { isBlessed: boolean; isMagical: boolean; }, isDisadvantage: boolean, isInCharacterCreation: boolean): [boolean, boolean, boolean] {
	const { isBlessed, isMagical } = isMagicalOrBlessed;
	const index = isBlessed ? 2 : isMagical ? 1 : 0;
	const target = isDisadvantage ? ap.disadv : ap.adv;
	const smallMax = getAdvantagesDisadvantagesSubMax(state, index);
	const equalizedCost = isDisadvantage ? cost * -1 : cost;
	const subValid = index > 0 ? target[index] + equalizedCost <= smallMax : true || !isInCharacterCreation;
	const mainValid = target[0] + equalizedCost <= 80 || !isInCharacterCreation;
	const totalValid = cost <= getLeft(ap) || isInCharacterCreation;

	return [ totalValid, mainValid, subValid ];
}

/**
 * Returns the maximum AP value you can spend on magical/blessed advantages/disadvantages.
 * @param state The list of dependent instances.
 * @param index The index in the AP array. `0` equals General, `1` equals Magical and `2` equals Blessed.
 */
export function getAdvantagesDisadvantagesSubMax(state: DependentInstancesState, index: number): number {
	let max = 50;
	if (index === 1) {
		const traditionActive = last((get(state, 'SA_70') as SpecialAbilityInstance).active);
		if (traditionActive && typeof traditionActive.sid === 'number' && traditionActive.sid >= 6 && traditionActive.sid <= 9) {
			max = 25;
		}
	}
	return max;
}
