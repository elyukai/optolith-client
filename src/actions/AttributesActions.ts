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

export interface RedeemAEPointAction extends Action {
	type: ActionTypes.REDEEM_AE_POINT;
}

export const redeemAEPoint = () => AppDispatcher.dispatch<RedeemAEPointAction>({
	type: ActionTypes.REDEEM_AE_POINT
});

export interface RemoveRedeemedAEPointAction extends Action {
	type: ActionTypes.REMOVE_REDEEMED_AE_POINT;
}

export const removeRedeemedAEPoint = () => AppDispatcher.dispatch<RemoveRedeemedAEPointAction>({
	type: ActionTypes.REMOVE_REDEEMED_AE_POINT
});

export interface RemovePermanentAEPointAction extends Action {
	type: ActionTypes.REMOVE_PERMANENT_AE_POINTS;
	payload: {
		value: number;
	};
}

export const removePermanentAEPoint = (value: number) => AppDispatcher.dispatch<RemovePermanentAEPointAction>({
	type: ActionTypes.REMOVE_PERMANENT_AE_POINTS,
	payload: {
		value
	}
});

export interface RedeemKPPointAction extends Action {
	type: ActionTypes.REDEEM_KP_POINT;
}

export const redeemKPPoint = () => AppDispatcher.dispatch<RedeemKPPointAction>({
	type: ActionTypes.REDEEM_KP_POINT
});

export interface RemoveRedeemedKPPointAction extends Action {
	type: ActionTypes.REMOVE_REDEEMED_KP_POINT;
}

export const removeRedeemedKPPoint = () => AppDispatcher.dispatch<RemoveRedeemedKPPointAction>({
	type: ActionTypes.REMOVE_REDEEMED_KP_POINT
});

export interface RemovePermanentKPPointAction extends Action {
	type: ActionTypes.REMOVE_PERMANENT_KP_POINTS;
	payload: {
		value: number;
	};
}

export const removePermanentKPPoint = (value: number) => AppDispatcher.dispatch<RemovePermanentKPPointAction>({
	type: ActionTypes.REMOVE_PERMANENT_KP_POINTS,
	payload: {
		value
	}
});
