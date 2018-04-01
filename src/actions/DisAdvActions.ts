import { ActionTypes } from '../constants/ActionTypes';
import { Categories } from '../constants/Categories';
import { getAdventurePointsObject } from '../selectors/adventurePointsSelectors';
import { get } from '../selectors/dependentInstancesSelectors';
import { isInCharacterCreation } from '../selectors/phaseSelectors';
import { getLocaleMessages, getWiki } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions.d';
import { ActivateArgs, AdvantageInstance, DeactivateArgs, DisadvantageInstance } from '../types/data.d';
import { convertPerTierCostToFinalCost, getNameCost, isMagicalOrBlessed } from '../utils/ActivatableUtils';
import { getAdvantagesDisadvantagesSubMax, validateDisAdvantages } from '../utils/APUtils';
import { _translate } from '../utils/I18n';
import { addAlert } from './AlertActions';
import { getCurrentRace, getCurrentRaceVariant } from '../selectors/rcpSelectors';

interface ActivateArgsWithEntryType extends ActivateArgs {
	isBlessed: boolean;
	isMagical: boolean;
	isDisadvantage: boolean;
	hairColor?: number;
	eyeColor?: number;
}

export interface ActivateDisAdvAction {
	type: ActionTypes.ACTIVATE_DISADV;
	payload: ActivateArgsWithEntryType;
}

export function _addToList(args: ActivateArgs): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const locale = getLocaleMessages(state);
		const { dependent } = state.currentHero.present;
		const { id, cost, ...other } = args;
		const entry = get(dependent, id) as AdvantageInstance | DisadvantageInstance;
		const entryType = isMagicalOrBlessed(entry);
		const isDisadvantage = entry.category === Categories.DISADVANTAGES;
		const validCost = validateDisAdvantages(cost, getAdventurePointsObject(state), dependent, entryType, isDisadvantage, isInCharacterCreation(state));
		if (!validCost[0] && locale) {
			dispatch(addAlert({
				title: _translate(locale, 'notenoughap.title'),
				message: _translate(locale, 'notenoughap.content'),
			}));
		}
		else if (!validCost[1] && locale) {
			const type = isDisadvantage ? _translate(locale, 'reachedaplimit.disadvantages') : _translate(locale, 'reachedaplimit.advantages');
			if (type) {
				dispatch(addAlert({
					title: _translate(locale, 'reachedaplimit.title', type),
					message: _translate(locale, 'reachedaplimit.content', type),
				}));
			}
		}
		else if (!validCost[2] && locale) {
			const type = isDisadvantage ? entryType.isBlessed ? _translate(locale, 'reachedcategoryaplimit.blesseddisadvantages') : _translate(locale, 'reachedcategoryaplimit.magicaldisadvantages') : entryType.isBlessed ? _translate(locale, 'reachedcategoryaplimit.blessedadvantages') : _translate(locale, 'reachedcategoryaplimit.magicaladvantages');
			const ap = getAdvantagesDisadvantagesSubMax(dependent, entryType.isBlessed ? 2 : entryType.isMagical ? 1 : 0);
			if (type) {
				dispatch(addAlert({
					title: _translate(locale, 'reachedcategoryaplimit.title', type),
					message: _translate(locale, 'reachedcategoryaplimit.content', ap, type),
				}));
			}
		}
		else {
			let hairColor;
			let eyeColor;

			if (id === 'DISADV_45' && args.sel === 1) {
				hairColor = 24;
				eyeColor = 19;
			}

			dispatch({
				type: ActionTypes.ACTIVATE_DISADV,
				payload: {
					id,
					cost,
					...other,
					...entryType,
					isDisadvantage,
					hairColor,
					eyeColor,
				}
			} as ActivateDisAdvAction);
		}
	};
}

interface DeactivateArgsWithEntryType extends DeactivateArgs {
	isBlessed: boolean;
	isMagical: boolean;
	isDisadvantage: boolean;
	hairColor?: number;
	eyeColor?: number;
}

export interface DeactivateDisAdvAction {
	type: ActionTypes.DEACTIVATE_DISADV;
	payload: DeactivateArgsWithEntryType;
}

export function _removeFromList(args: DeactivateArgs): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const locale = getLocaleMessages(state);
		const { dependent } = state.currentHero.present;
		const { id, cost } = args;
		const negativeCost = cost * -1; // the entry should be removed
		const entry = get(dependent, id) as AdvantageInstance | DisadvantageInstance;
		const entryType = isMagicalOrBlessed(entry);
		const isDisadvantage = entry.category === Categories.DISADVANTAGES;
		const validCost = validateDisAdvantages(negativeCost, getAdventurePointsObject(state), dependent, entryType, isDisadvantage, isInCharacterCreation(state));
		if (!validCost[0] && locale) {
			dispatch(addAlert({
				title: _translate(locale, 'notenoughap.title'),
				message: _translate(locale, 'notenoughap.content'),
			}));
		}
		else if (!validCost[1] && locale) {
			const type = isDisadvantage ? _translate(locale, 'reachedaplimit.disadvantages') : _translate(locale, 'reachedaplimit.advantages');
			if (type) {
				dispatch(addAlert({
					title: _translate(locale, 'reachedaplimit.title', type),
					message: _translate(locale, 'reachedaplimit.content', type),
				}));
			}
		}
		else if (!validCost[2] && locale) {
			const type = isDisadvantage ? entryType.isBlessed ? _translate(locale, 'reachedcategoryaplimit.blesseddisadvantages') : _translate(locale, 'reachedcategoryaplimit.magicaldisadvantages') : entryType.isBlessed ? _translate(locale, 'reachedcategoryaplimit.blessedadvantages') : _translate(locale, 'reachedcategoryaplimit.magicaladvantages');
			const ap = getAdvantagesDisadvantagesSubMax(dependent, entryType.isBlessed ? 2 : entryType.isMagical ? 1 : 0);
			if (type) {
				dispatch(addAlert({
					title: _translate(locale, 'reachedcategoryaplimit.title', type),
					message: _translate(locale, 'reachedcategoryaplimit.content', ap, type),
				}));
			}
		}
		else {
			let hairColor;
			let eyeColor;

			if (id === 'DISADV_45' && entry.active[args.index].sid === 1) {
				const raceVariant = getCurrentRaceVariant(state);
				const {
					hairColors = raceVariant!.hairColors!,
					eyeColors = raceVariant!.eyeColors!
				} = getCurrentRace(state)!;
				hairColor = hairColors[0];
				eyeColor = eyeColors[0];
			}

			dispatch({
				type: ActionTypes.DEACTIVATE_DISADV,
				payload: {
					...args,
					cost: negativeCost,
					...entryType,
					isDisadvantage,
					hairColor,
					eyeColor,
				}
			} as DeactivateDisAdvAction);
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

export function _setTier(id: string, index: number, tier: number): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const locale = getLocaleMessages(state);
		const { dependent } = state.currentHero.present;
		const entry = get(dependent, id) as AdvantageInstance | DisadvantageInstance;
		const activeObjectWithId = { id, index, ...entry.active[index] };
		const previousCost = convertPerTierCostToFinalCost(getNameCost(activeObjectWithId, getWiki(state), dependent, false)).currentCost;
		const nextCost = convertPerTierCostToFinalCost(getNameCost({ ...activeObjectWithId, tier }, getWiki(state), dependent, true)).currentCost;
		const cost = nextCost - previousCost;
		const entryType = isMagicalOrBlessed(entry);
		const isDisadvantage = entry.category === Categories.DISADVANTAGES;
		const validCost = validateDisAdvantages(cost, getAdventurePointsObject(state), dependent, entryType, isDisadvantage, isInCharacterCreation(state));
		if (!validCost[0] && locale) {
			dispatch(addAlert({
				title: _translate(locale, 'notenoughap.title'),
				message: _translate(locale, 'notenoughap.content'),
			}));
		}
		else if (!validCost[1] && locale) {
			const type = isDisadvantage ? _translate(locale, 'reachedaplimit.disadvantages') : _translate(locale, 'reachedaplimit.advantages');
			if (type) {
				dispatch(addAlert({
					title: _translate(locale, 'reachedaplimit.title', type),
					message: _translate(locale, 'reachedaplimit.content', type),
				}));
			}
		}
		else if (!validCost[2] && locale) {
			const type = isDisadvantage ? entryType.isBlessed ? _translate(locale, 'reachedcategoryaplimit.blesseddisadvantages') : _translate(locale, 'reachedcategoryaplimit.magicaldisadvantages') : entryType.isBlessed ? _translate(locale, 'reachedcategoryaplimit.blessedadvantages') : _translate(locale, 'reachedcategoryaplimit.magicaladvantages');
			const ap = getAdvantagesDisadvantagesSubMax(dependent, entryType.isBlessed ? 2 : entryType.isMagical ? 1 : 0);
			if (type) {
				dispatch(addAlert({
					title: _translate(locale, 'reachedcategoryaplimit.title', type),
					message: _translate(locale, 'reachedcategoryaplimit.content', ap, type),
				}));
			}
		}
		else {
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
		}
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

export interface SetActiveAdvantagesFilterTextAction {
	type: ActionTypes.SET_ADVANTAGES_FILTER_TEXT;
	payload: {
		filterText: string;
	};
}

export function setActiveAdvantagesFilterText(filterText: string): SetActiveAdvantagesFilterTextAction {
	return {
		type: ActionTypes.SET_ADVANTAGES_FILTER_TEXT,
		payload: {
			filterText
		}
	};
}

export interface SetInactiveAdvantagesFilterTextAction {
	type: ActionTypes.SET_INACTIVE_ADVANTAGES_FILTER_TEXT;
	payload: {
		filterText: string;
	};
}

export function setInactiveAdvantagesFilterText(filterText: string): SetInactiveAdvantagesFilterTextAction {
	return {
		type: ActionTypes.SET_INACTIVE_ADVANTAGES_FILTER_TEXT,
		payload: {
			filterText
		}
	};
}

export interface SetActiveDisadvantagesFilterTextAction {
	type: ActionTypes.SET_DISADVANTAGES_FILTER_TEXT;
	payload: {
		filterText: string;
	};
}

export function setActiveDisadvantagesFilterText(filterText: string): SetActiveDisadvantagesFilterTextAction {
	return {
		type: ActionTypes.SET_DISADVANTAGES_FILTER_TEXT,
		payload: {
			filterText
		}
	};
}

export interface SetInactiveDisadvantagesFilterTextAction {
	type: ActionTypes.SET_INACTIVE_DISADVANTAGES_FILTER_TEXT;
	payload: {
		filterText: string;
	};
}

export function setInactiveDisadvantagesFilterText(filterText: string): SetInactiveDisadvantagesFilterTextAction {
	return {
		type: ActionTypes.SET_INACTIVE_DISADVANTAGES_FILTER_TEXT,
		payload: {
			filterText
		}
	};
}
