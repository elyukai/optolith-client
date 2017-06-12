import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';

export interface AddAttributePointAction extends Action {
	type: ActionTypes.ADD_ATTRIBUTE_POINT;
	payload: {
		id: string;
	};
}

export const addPoint = (id: string) => AppDispatcher.dispatch<AddAttributePointAction>({
	type: ActionTypes.ADD_ATTRIBUTE_POINT,
	payload: {
		id
	}
});

export interface RemoveAttributePointAction extends Action {
	type: ActionTypes.REMOVE_ATTRIBUTE_POINT;
	payload: {
		id: string;
	};
}

export const removePoint = (id: string) => AppDispatcher.dispatch<RemoveAttributePointAction>({
	type: ActionTypes.REMOVE_ATTRIBUTE_POINT,
	payload: {
		id
	}
});

export interface AddLifePointAction extends Action {
	type: ActionTypes.ADD_LIFE_POINT;
}

export const addLifePoint = () => AppDispatcher.dispatch<AddLifePointAction>({
	type: ActionTypes.ADD_LIFE_POINT
});

export interface AddArcaneEnergyPointAction extends Action {
	type: ActionTypes.ADD_ARCANE_ENERGY_POINT;
}

export const addArcaneEnergyPoint = () => AppDispatcher.dispatch<AddArcaneEnergyPointAction>({
	type: ActionTypes.ADD_ARCANE_ENERGY_POINT
});

export interface AddKarmaPointAction extends Action {
	type: ActionTypes.ADD_KARMA_POINT;
}

export const addKarmaPoint = () => AppDispatcher.dispatch<AddKarmaPointAction>({
	type: ActionTypes.ADD_KARMA_POINT
});

export interface AddBoughtBackAEPointAction extends Action {
	type: ActionTypes.ADD_BOUGHT_BACK_AE_POINT;
}

export const addBoughtBackAEPoint = () => AppDispatcher.dispatch<AddBoughtBackAEPointAction>({
	type: ActionTypes.ADD_BOUGHT_BACK_AE_POINT
});

export interface RemoveBoughtBackAEPointAction extends Action {
	type: ActionTypes.REMOVE_BOUGHT_BACK_AE_POINT;
}

export const removeBoughtBackAEPoint = () => AppDispatcher.dispatch<RemoveBoughtBackAEPointAction>({
	type: ActionTypes.REMOVE_BOUGHT_BACK_AE_POINT
});

export interface AddLostAEPointAction extends Action {
	type: ActionTypes.ADD_LOST_AE_POINT;
}

export const addLostAEPoint = () => AppDispatcher.dispatch<AddLostAEPointAction>({
	type: ActionTypes.ADD_LOST_AE_POINT
});

export interface RemoveLostAEPointAction extends Action {
	type: ActionTypes.REMOVE_LOST_AE_POINT;
}

export const removeLostAEPoint = () => AppDispatcher.dispatch<RemoveLostAEPointAction>({
	type: ActionTypes.REMOVE_LOST_AE_POINT
});

export interface AddLostAEPointsAction extends Action {
	type: ActionTypes.ADD_LOST_AE_POINTS;
	payload: {
		value: number;
	};
}

export const addLostAEPoints = (value: number) => AppDispatcher.dispatch<AddLostAEPointsAction>({
	type: ActionTypes.ADD_LOST_AE_POINTS,
	payload: {
		value
	}
});

export interface AddBoughtBackKPPointAction extends Action {
	type: ActionTypes.ADD_BOUGHT_BACK_KP_POINT;
}

export const addBoughtBackKPPoint = () => AppDispatcher.dispatch<AddBoughtBackKPPointAction>({
	type: ActionTypes.ADD_BOUGHT_BACK_KP_POINT
});

export interface RemoveBoughtBackKPPointAction extends Action {
	type: ActionTypes.REMOVE_BOUGHT_BACK_KP_POINT;
}

export const removeBoughtBackKPPoint = () => AppDispatcher.dispatch<RemoveBoughtBackKPPointAction>({
	type: ActionTypes.REMOVE_BOUGHT_BACK_KP_POINT
});

export interface AddLostKPPointAction extends Action {
	type: ActionTypes.ADD_LOST_KP_POINT;
}

export const addLostKPPoint = () => AppDispatcher.dispatch<AddLostKPPointAction>({
	type: ActionTypes.ADD_LOST_KP_POINT
});

export interface RemoveLostKPPointAction extends Action {
	type: ActionTypes.REMOVE_LOST_KP_POINT;
}

export const removeLostKPPoint = () => AppDispatcher.dispatch<RemoveLostKPPointAction>({
	type: ActionTypes.REMOVE_LOST_KP_POINT
});

export interface AddLostKPPointsAction extends Action {
	type: ActionTypes.ADD_LOST_KP_POINTS;
	payload: {
		value: number;
	};
}

export const addLostKPPoints = (value: number) => AppDispatcher.dispatch<AddLostKPPointsAction>({
	type: ActionTypes.ADD_LOST_KP_POINTS,
	payload: {
		value
	}
});
