import * as ActionTypes from '../constants/ActionTypes';
import { get } from '../reducers/dependentInstances';
import { store } from '../stores/AppStore';
import { TalentInstance } from '../types/data.d';
import { alert } from '../utils/alert';
import { translate } from '../utils/I18n';
import { getDecreaseCost, getIncreaseCost } from '../utils/IncreasableUtils';

export interface AddTalentPointAction {
	type: ActionTypes.ADD_TALENT_POINT;
	payload: {
		id: string;
		cost: number;
	};
}

export const addPoint = (id: string) => AppDispatcher.dispatch<AddTalentPointAction>({
	type: ActionTypes.ADD_TALENT_POINT,
	payload: {
		id
	}
});

export function _addPoint(id: string): AddTalentPointAction | undefined {
	const state = store.getState();
	const cost = getIncreaseCost(get(state.currentHero.present.dependent, id) as TalentInstance, state.currentHero.present.ap);
	if (!cost) {
		alert(translate('notenoughap.title'), translate('notenoughap.content'));
		return;
	}
	return {
		type: ActionTypes.ADD_TALENT_POINT,
		payload: {
			id,
			cost
		}
	};
}

export interface RemoveTalentPointAction {
	type: ActionTypes.REMOVE_TALENT_POINT;
	payload: {
		id: string;
		cost: number;
	};
}

export const removePoint = (id: string) => AppDispatcher.dispatch<RemoveTalentPointAction>({
	type: ActionTypes.REMOVE_TALENT_POINT,
	payload: {
		id
	}
});

export function _removePoint(id: string): RemoveTalentPointAction {
	const state = store.getState();
	const cost = getDecreaseCost(get(state.currentHero.present.dependent, id) as TalentInstance);
	return {
		type: ActionTypes.REMOVE_TALENT_POINT,
		payload: {
			id,
			cost
		}
	};
}

export interface SetTalentsSortOrderAction {
	type: ActionTypes.SET_TALENTS_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const setSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetTalentsSortOrderAction>({
	type: ActionTypes.SET_TALENTS_SORT_ORDER,
	payload: {
		sortOrder
	}
});

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

export const switchRatingVisibility = () => AppDispatcher.dispatch<SwitchTalentRatingVisibilityAction>({
	type: ActionTypes.SWITCH_TALENT_RATING_VISIBILITY
});

export function _switchRatingVisibility(): SwitchTalentRatingVisibilityAction {
	return {
		type: ActionTypes.SWITCH_TALENT_RATING_VISIBILITY
	};
}
