import * as ActionTypes from '../constants/ActionTypes';
import { DISADVANTAGES } from '../constants/Categories';
import { get } from '../reducers/dependentInstances';
import { store } from '../stores/AppStore';
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

export const addToList = (args: UndoExtendedActivateArgs) => AppDispatcher.dispatch<ActivateDisAdvAction>({
	type: ActionTypes.ACTIVATE_DISADV,
	payload: args
});

export function _addToList(args: ActivateArgs): ActivateDisAdvAction | undefined {
	const { ap, dependent } = store.getState().currentHero.present;
	const { id, cost, ...other } = args;
	const entry = get(dependent, id) as AdvantageInstance | DisadvantageInstance;
	const entryType = isMagicalOrBlessed(dependent, entry);
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
	return {
		type: ActionTypes.ACTIVATE_DISADV,
		payload: {
			id,
			cost,
			...other,
			...entryType,
			isDisadvantage
		}
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

export const removeFromList = (args: UndoExtendedDeactivateArgs) => AppDispatcher.dispatch<DeactivateDisAdvAction>({
	type: ActionTypes.DEACTIVATE_DISADV,
	payload: args
});

export function _removeFromList(args: DeactivateArgs): DeactivateDisAdvAction | undefined {
	const { ap, dependent } = store.getState().currentHero.present;
	const { id, cost } = args;
	const entry = get(dependent, id) as AdvantageInstance | DisadvantageInstance;
	const entryType = isMagicalOrBlessed(dependent, entry);
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
	return {
		type: ActionTypes.DEACTIVATE_DISADV,
		payload: {
			...args,
			...entryType,
			isDisadvantage
		}
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

export const setTier = (id: string, index: number, tier: number, cost: number) => AppDispatcher.dispatch<SetDisAdvTierAction>({
	type: ActionTypes.SET_DISADV_TIER,
	payload: {
		id,
		tier,
		cost,
		index
	}
});

export function _setTier(id: string, index: number, tier: number, cost: number): SetDisAdvTierAction | undefined {
	const { ap, dependent } = store.getState().currentHero.present;
	const entry = get(dependent, id) as AdvantageInstance | DisadvantageInstance;
	const entryType = isMagicalOrBlessed(dependent, entry);
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
	return {
		type: ActionTypes.SET_DISADV_TIER,
		payload: {
			id,
			tier,
			cost,
			index,
			...entryType,
			isDisadvantage
		}
	};
}

export interface SwitchDisAdvRatingVisibilityAction {
	type: ActionTypes.SWITCH_DISADV_RATING_VISIBILITY;
}

export const switchRatingVisibility = () => AppDispatcher.dispatch<SwitchDisAdvRatingVisibilityAction>({
	type: ActionTypes.SWITCH_DISADV_RATING_VISIBILITY
});

export function _switchRatingVisibility(): SwitchDisAdvRatingVisibilityAction {
	return {
		type: ActionTypes.SWITCH_DISADV_RATING_VISIBILITY
	};
}
