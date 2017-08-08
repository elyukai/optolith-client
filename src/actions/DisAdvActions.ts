import * as ActionTypes from '../constants/ActionTypes';
import { DISADVANTAGES } from '../constants/Categories';
import { get } from '../selectors/dependentInstancesSelectors';
import { AsyncAction } from '../stores/AppStore';
import { ActivateArgs, AdvantageInstance, DeactivateArgs, DisadvantageInstance, UndoExtendedActivateArgs, UndoExtendedDeactivateArgs } from '../types/data.d';
import { isMagicalOrBlessed } from '../utils/ActivatableUtils';
import { alert } from '../utils/alert';
import { getAdvantagesDisadvantagesSubMax, validateDisAdvantages } from '../utils/APUtils';
import { translate } from '../utils/I18n';

interface ActivateArgsWithEntryType extends UndoExtendedActivateArgs {
	isBlessed: boolean;
	isMagical: boolean;
	isDisadvantage: boolean;
}

export interface ActivateDisAdvAction {
	type: ActionTypes.ACTIVATE_DISADV;
	payload: ActivateArgsWithEntryType;
}

export function _addToList(args: ActivateArgs): AsyncAction {
	return (dispatch, getState) => {
		const { ap, dependent } = getState().currentHero.present;
		const { id, cost, ...other } = args;
		const entry = get(dependent, id) as AdvantageInstance | DisadvantageInstance;
		const entryType = isMagicalOrBlessed(entry);
		const isDisadvantage = entry.category === DISADVANTAGES;
		const validCost = validateDisAdvantages(cost, ap, dependent, entryType, isDisadvantage);
		if (!validCost[0]) {
			alert(translate('notenoughap.title'), translate('notenoughap.content'));
			return;
		}
		else if (!validCost[1]) {
			const type = isDisadvantage ? translate('reachedaplimit.disadvantages') : translate('reachedaplimit.advantages');
			alert(translate('reachedaplimit.title', type), translate('notenoughap.content', type));
			return;
		}
		else if (!validCost[2]) {
			const type = isDisadvantage ? entryType.isBlessed ? translate('reachedcategoryaplimit.blesseddisadvantages') : translate('reachedcategoryaplimit.magicaldisadvantages') : entryType.isBlessed ? translate('reachedcategoryaplimit.blessedadvantages') : translate('reachedcategoryaplimit.magicaladvantages');
			const ap = getAdvantagesDisadvantagesSubMax(dependent, entryType.isBlessed ? 2 : entryType.isMagical ? 1 : 0);
			alert(translate('reachedcategoryaplimit.title', type), translate('reachedcategoryaplimit.content', ap, type));
			return;
		}
		dispatch({
			type: ActionTypes.ACTIVATE_DISADV,
			payload: {
				id,
				cost,
				...other,
				...entryType,
				isDisadvantage
			}
		} as ActivateDisAdvAction);
	};
}

interface DeactivateArgsWithEntryType extends UndoExtendedDeactivateArgs {
	isBlessed: boolean;
	isMagical: boolean;
	isDisadvantage: boolean;
}

export interface DeactivateDisAdvAction {
	type: ActionTypes.DEACTIVATE_DISADV;
	payload: DeactivateArgsWithEntryType;
}

export function _removeFromList(args: DeactivateArgs): AsyncAction {
	return (dispatch, getState) => {
		const { ap, dependent } = getState().currentHero.present;
		const { id, cost } = args;
		const negativeCost = cost * -1; // the entry should be removed
		const entry = get(dependent, id) as AdvantageInstance | DisadvantageInstance;
		const entryType = isMagicalOrBlessed(entry);
		const isDisadvantage = entry.category === DISADVANTAGES;
		const validCost = validateDisAdvantages(negativeCost, ap, dependent, entryType, isDisadvantage);
		if (!validCost[0]) {
			alert(translate('notenoughap.title'), translate('notenoughap.content'));
			return;
		}
		else if (!validCost[1]) {
			const type = isDisadvantage ? translate('reachedaplimit.disadvantages') : translate('reachedaplimit.advantages');
			alert(translate('reachedaplimit.title', type), translate('notenoughap.content', type));
			return;
		}
		else if (!validCost[2]) {
			const type = isDisadvantage ? entryType.isBlessed ? translate('reachedcategoryaplimit.blesseddisadvantages') : translate('reachedcategoryaplimit.magicaldisadvantages') : entryType.isBlessed ? translate('reachedcategoryaplimit.blessedadvantages') : translate('reachedcategoryaplimit.magicaladvantages');
			const ap = getAdvantagesDisadvantagesSubMax(dependent, entryType.isBlessed ? 2 : entryType.isMagical ? 1 : 0);
			alert(translate('reachedcategoryaplimit.title', type), translate('reachedcategoryaplimit.content', ap, type));
			return;
		}
		dispatch({
			type: ActionTypes.DEACTIVATE_DISADV,
			payload: {
				...args,
				cost: negativeCost,
				...entryType,
				isDisadvantage
			}
		} as DeactivateDisAdvAction);
	};
}

export interface SetDisAdvTierAction {
	type: ActionTypes.SET_DISADV_TIER;
	payload: {
		id: string;
		index: number;
		tier: number;
		cost: number;
		isBlessed: boolean;
		isMagical: boolean;
		isDisadvantage: boolean;
	};
}

export function _setTier(id: string, index: number, tier: number, cost: number): AsyncAction {
	return (dispatch, getState) => {
		const { ap, dependent } = getState().currentHero.present;
		const entry = get(dependent, id) as AdvantageInstance | DisadvantageInstance;
		const entryType = isMagicalOrBlessed(entry);
		const isDisadvantage = entry.category === DISADVANTAGES;
		const validCost = validateDisAdvantages(cost, ap, dependent, entryType, isDisadvantage);
		if (!validCost[0]) {
			alert(translate('notenoughap.title'), translate('notenoughap.content'));
			return;
		}
		else if (!validCost[1]) {
			const type = isDisadvantage ? translate('reachedaplimit.disadvantages') : translate('reachedaplimit.advantages');
			alert(translate('reachedaplimit.title', type), translate('notenoughap.content', type));
			return;
		}
		else if (!validCost[2]) {
			const type = isDisadvantage ? entryType.isBlessed ? translate('reachedcategoryaplimit.blesseddisadvantages') : translate('reachedcategoryaplimit.magicaldisadvantages') : entryType.isBlessed ? translate('reachedcategoryaplimit.blessedadvantages') : translate('reachedcategoryaplimit.magicaladvantages');
			const ap = getAdvantagesDisadvantagesSubMax(dependent, entryType.isBlessed ? 2 : entryType.isMagical ? 1 : 0);
			alert(translate('reachedcategoryaplimit.title', type), translate('reachedcategoryaplimit.content', ap, type));
			return;
		}
		dispatch({
			type: ActionTypes.SET_DISADV_TIER,
			payload: {
				id,
				tier,
				cost,
				index,
				...entryType,
				isDisadvantage
			}
		} as SetDisAdvTierAction);
	};
}

export interface SwitchDisAdvRatingVisibilityAction {
	type: ActionTypes.SWITCH_DISADV_RATING_VISIBILITY;
}

export function _switchRatingVisibility(): SwitchDisAdvRatingVisibilityAction {
	return {
		type: ActionTypes.SWITCH_DISADV_RATING_VISIBILITY
	};
}
