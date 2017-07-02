import * as ActionTypes from '../constants/ActionTypes';
import { LITURGIES } from '../constants/Categories';
import { get } from '../reducers/dependentInstances';
import { store } from '../stores/AppStore';
import { BlessingInstance, LiturgyInstance } from '../types/data.d';
import { alert } from '../utils/alert';
import { validate } from '../utils/APUtils';
import { translate } from '../utils/I18n';
import { getDecreaseAP, getIncreaseAP } from '../utils/ICUtils';
import { getDecreaseCost, getIncreaseCost } from '../utils/IncreasableUtils';

export interface ActivateLiturgyAction {
	type: ActionTypes.ACTIVATE_LITURGY;
	payload: {
		id: string;
		cost: number;
	};
}

export const addToList = (id: string) => AppDispatcher.dispatch<ActivateLiturgyAction>({
	type: ActionTypes.ACTIVATE_LITURGY,
	payload: {
		id
	}
});

export function _addToList(id: string): ActivateLiturgyAction | undefined {
	const state = store.getState();
	const entry = get(state.currentHero.present.dependent, id) as LiturgyInstance | BlessingInstance;
	const cost = entry.category === LITURGIES ? getIncreaseAP(entry.ic) : 1;
	const validCost = validate(cost, state.currentHero.present.ap);
	if (!validCost) {
		alert(translate('notenoughap.title'), translate('notenoughap.content'));
		return;
	}
	return {
		type: ActionTypes.ACTIVATE_LITURGY,
		payload: {
			id,
			cost
		}
	};
}

export interface DeactivateLiturgyAction {
	type: ActionTypes.DEACTIVATE_LITURGY;
	payload: {
		id: string;
		cost: number;
	};
}

export const removeFromList = (id: string) => AppDispatcher.dispatch<DeactivateLiturgyAction>({
	type: ActionTypes.DEACTIVATE_LITURGY,
	payload: {
		id
	}
});

export function _removeFromList(id: string): DeactivateLiturgyAction {
	const state = store.getState();
	const entry = get(state.currentHero.present.dependent, id) as LiturgyInstance | BlessingInstance;
	const cost = entry.category === LITURGIES ? getDecreaseAP(entry.ic) : 1;
	return {
		type: ActionTypes.DEACTIVATE_LITURGY,
		payload: {
			id,
			cost
		}
	};
}

export interface AddLiturgyPointAction {
	type: ActionTypes.ADD_LITURGY_POINT;
	payload: {
		id: string;
		cost: number;
	};
}

export const addPoint = (id: string) => AppDispatcher.dispatch<AddLiturgyPointAction>({
	type: ActionTypes.ADD_LITURGY_POINT,
	payload: {
		id
	}
});

export function _addPoint(id: string): AddLiturgyPointAction | undefined {
	const state = store.getState();
	const cost = getIncreaseCost(get(state.currentHero.present.dependent, id) as LiturgyInstance, state.currentHero.present.ap);
	if (!cost) {
		alert(translate('notenoughap.title'), translate('notenoughap.content'));
		return;
	}
	return {
		type: ActionTypes.ADD_LITURGY_POINT,
		payload: {
			id,
			cost
		}
	};
}

export interface RemoveLiturgyPointAction {
	type: ActionTypes.REMOVE_LITURGY_POINT;
	payload: {
		id: string;
		cost: number;
	};
}

export const removePoint = (id: string) => AppDispatcher.dispatch<RemoveLiturgyPointAction>({
	type: ActionTypes.REMOVE_LITURGY_POINT,
	payload: {
		id
	}
});

export function _removePoint(id: string): RemoveLiturgyPointAction {
	const state = store.getState();
	const cost = getDecreaseCost(get(state.currentHero.present.dependent, id) as LiturgyInstance);
	return {
		type: ActionTypes.REMOVE_LITURGY_POINT,
		payload: {
			id,
			cost
		}
	};
}

export interface SetLiturgiesSortOrderAction {
	type: ActionTypes.SET_LITURGIES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const setSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetLiturgiesSortOrderAction>({
	type: ActionTypes.SET_LITURGIES_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export function _setSortOrder(sortOrder: string): SetLiturgiesSortOrderAction {
	return {
		type: ActionTypes.SET_LITURGIES_SORT_ORDER,
		payload: {
			sortOrder
		}
	};
}
