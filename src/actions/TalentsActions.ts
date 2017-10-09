import * as ActionTypes from '../constants/ActionTypes';
import { get } from '../selectors/dependentInstancesSelectors';
import { isInCharacterCreation } from '../selectors/phaseSelectors';
import { getLocaleMessages } from '../selectors/stateSelectors';
import { getTheme } from '../selectors/uisettingsSelectors';
import { AsyncAction } from '../types/actions.d';
import { TalentInstance } from '../types/data.d';
import { alert } from '../utils/alertNew';
import { _translate } from '../utils/I18n';
import { getDecreaseCost, getIncreaseCost } from '../utils/IncreasableUtils';

export interface AddTalentPointAction {
	type: ActionTypes.ADD_TALENT_POINT;
	payload: {
		id: string;
		cost: number;
	};
}

export function _addPoint(id: string): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const cost = getIncreaseCost(get(state.currentHero.present.dependent, id) as TalentInstance, state.currentHero.present.ap, isInCharacterCreation(state));
		const messages = getLocaleMessages(state);
		if (!cost && messages) {
			alert(_translate(messages, 'notenoughap.content'), getTheme(state), _translate(messages, 'notenoughap.title'));
			return;
		}
		dispatch({
			type: ActionTypes.ADD_TALENT_POINT,
			payload: {
				id,
				cost
			}
		} as AddTalentPointAction);
	};
}

export interface RemoveTalentPointAction {
	type: ActionTypes.REMOVE_TALENT_POINT;
	payload: {
		id: string;
		cost: number;
	};
}

export function _removePoint(id: string): AsyncAction {
	return (dispatch, getState) => {
		const cost = getDecreaseCost(get(getState().currentHero.present.dependent, id) as TalentInstance);
		dispatch({
			type: ActionTypes.REMOVE_TALENT_POINT,
			payload: {
				id,
				cost
			}
		} as RemoveTalentPointAction);
	};
}

export interface SetTalentsSortOrderAction {
	type: ActionTypes.SET_TALENTS_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export function _setSortOrder(sortOrder: string): SetTalentsSortOrderAction {
	return {
		type: ActionTypes.SET_TALENTS_SORT_ORDER,
		payload: {
			sortOrder
		}
	};
}

export interface SwitchTalentRatingVisibilityAction {
	type: ActionTypes.SWITCH_TALENT_RATING_VISIBILITY;
}

export function _switchRatingVisibility(): SwitchTalentRatingVisibilityAction {
	return {
		type: ActionTypes.SWITCH_TALENT_RATING_VISIBILITY
	};
}
