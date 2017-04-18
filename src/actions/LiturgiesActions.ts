import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const addToList = (id: string) => AppDispatcher.dispatch<ActivateLiturgyAction>({
	type: ActionTypes.ACTIVATE_LITURGY,
	payload: {
		id
	}
});

export const removeFromList = (id: string) => AppDispatcher.dispatch<DeactivateLiturgyAction>({
	type: ActionTypes.DEACTIVATE_LITURGY,
	payload: {
		id
	}
});

export const addPoint = (id: string) => AppDispatcher.dispatch<AddLiturgyPointAction>({
	type: ActionTypes.ADD_LITURGY_POINT,
	payload: {
		id
	}
});

export const removePoint = (id: string) => AppDispatcher.dispatch<RemoveLiturgyPointAction>({
	type: ActionTypes.REMOVE_LITURGY_POINT,
	payload: {
		id
	}
});

export const setSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetLiturgiesSortOrderAction>({
	type: ActionTypes.SET_LITURGIES_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export const switchEnableActiveItemHints = () => AppDispatcher.dispatch<SwitchEnableActiveItemHintsAction>({
	type: ActionTypes.SWITCH_ENABLE_ACTIVE_ITEM_HINTS
});
