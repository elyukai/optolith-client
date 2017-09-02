import * as ActionTypes from '../constants/ActionTypes';
import { get } from '../selectors/dependentInstancesSelectors';
import { AsyncAction } from '../stores/AppStore';
import { AttributeInstance } from '../types/data.d';
import { alert } from '../utils/alert';
import { validate } from '../utils/APUtils';
import { translate } from '../utils/I18n';
import { getIncreaseAP } from '../utils/ICUtils';
import { getDecreaseCost, getIncreaseCost } from '../utils/IncreasableUtils';

export interface AddAttributePointAction {
	type: ActionTypes.ADD_ATTRIBUTE_POINT;
	payload: {
		id: string;
		cost: number;
	};
}

export function _addPoint(id: string): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const cost = getIncreaseCost(get(state.currentHero.present.dependent, id) as AttributeInstance, state.currentHero.present.ap);
		if (!cost) {
			alert(translate('notenoughap.title'), translate('notenoughap.content'));
			return;
		}
		dispatch({
			type: ActionTypes.ADD_ATTRIBUTE_POINT,
			payload: {
				id,
				cost
			}
		} as AddAttributePointAction);
	};
}

export interface RemoveAttributePointAction {
	type: ActionTypes.REMOVE_ATTRIBUTE_POINT;
	payload: {
		id: string;
		cost: number;
	};
}

export function _removePoint(id: string): AsyncAction {
	return (dispatch, getState) => {
		const cost = getDecreaseCost(get(getState().currentHero.present.dependent, id) as AttributeInstance);
		dispatch({
			type: ActionTypes.REMOVE_ATTRIBUTE_POINT,
			payload: {
				id,
				cost
			}
		} as RemoveAttributePointAction);
	};
}

export interface AddLifePointAction {
	type: ActionTypes.ADD_LIFE_POINT;
	payload: {
		cost: number;
	};
}

export function _addLifePoint(): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const cost = getIncreaseAP(4, state.currentHero.present.energies.addedLifePoints);
		const validCost = validate(cost, state.currentHero.present.ap);
		if (!validCost) {
			alert(translate('notenoughap.title'), translate('notenoughap.content'));
			return;
		}
		dispatch({
			type: ActionTypes.ADD_LIFE_POINT,
			payload: {
				cost
			}
		} as AddLifePointAction);
	};
}

export interface AddArcaneEnergyPointAction {
	type: ActionTypes.ADD_ARCANE_ENERGY_POINT;
	payload: {
		cost: number;
	};
}

export function _addArcaneEnergyPoint(): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const cost = getIncreaseAP(4, state.currentHero.present.energies.addedArcaneEnergy);
		const validCost = validate(cost, state.currentHero.present.ap);
		if (!validCost) {
			alert(translate('notenoughap.title'), translate('notenoughap.content'));
			return;
		}
		dispatch({
			type: ActionTypes.ADD_ARCANE_ENERGY_POINT,
			payload: {
				cost
			}
		} as AddArcaneEnergyPointAction);
	};
}

export interface AddKarmaPointAction {
	type: ActionTypes.ADD_KARMA_POINT;
	payload: {
		cost: number;
	};
}

export function _addKarmaPoint(): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const cost = getIncreaseAP(4, state.currentHero.present.energies.addedKarmaPoints);
		const validCost = validate(cost, state.currentHero.present.ap);
		if (!validCost) {
			alert(translate('notenoughap.title'), translate('notenoughap.content'));
			return;
		}
		dispatch({
			type: ActionTypes.ADD_KARMA_POINT,
			payload: {
				cost
			}
		} as AddKarmaPointAction);
	};
}

export interface AddBoughtBackAEPointAction {
	type: ActionTypes.ADD_BOUGHT_BACK_AE_POINT;
}

export function _addBoughtBackAEPoint(): AsyncAction {
	return (dispatch, getState) => {
		const validCost = validate(2, getState().currentHero.present.ap);
		if (!validCost) {
			alert(translate('notenoughap.title'), translate('notenoughap.content'));
			return;
		}
		dispatch({
			type: ActionTypes.ADD_BOUGHT_BACK_AE_POINT
		} as AddBoughtBackAEPointAction);
	};
}

export interface RemoveBoughtBackAEPointAction {
	type: ActionTypes.REMOVE_BOUGHT_BACK_AE_POINT;
}

export function _removeBoughtBackAEPoint(): RemoveBoughtBackAEPointAction {
	return {
		type: ActionTypes.REMOVE_BOUGHT_BACK_AE_POINT
	};
}

export interface AddLostAEPointAction {
	type: ActionTypes.ADD_LOST_AE_POINT;
}

export function _addLostAEPoint(): AddLostAEPointAction {
	return {
		type: ActionTypes.ADD_LOST_AE_POINT
	};
}

export interface RemoveLostAEPointAction {
	type: ActionTypes.REMOVE_LOST_AE_POINT;
	payload: {
		cost: number;
	};
}

export function _removeLostAEPoint(): AsyncAction {
	return (dispatch, getState) => {
		const { lost, redeemed } = getState().currentHero.present.energies.permanentArcaneEnergy;
		dispatch({
			type: ActionTypes.REMOVE_LOST_AE_POINT,
			payload: {
				cost: lost === redeemed ? -2 : 0
			}
		} as RemoveLostAEPointAction);
	};
}

export interface AddLostAEPointsAction {
	type: ActionTypes.ADD_LOST_AE_POINTS;
	payload: {
		value: number;
	};
}

export function _addLostAEPoints(value: number): AddLostAEPointsAction {
	return {
		type: ActionTypes.ADD_LOST_AE_POINTS,
		payload: {
			value
		}
	};
}

export interface AddBoughtBackKPPointAction {
	type: ActionTypes.ADD_BOUGHT_BACK_KP_POINT;
}

export function _addBoughtBackKPPoint(): AsyncAction {
	return (dispatch, getState) => {
		const validCost = validate(2, getState().currentHero.present.ap);
		if (!validCost) {
			alert(translate('notenoughap.title'), translate('notenoughap.content'));
			return;
		}
		dispatch({
			type: ActionTypes.ADD_BOUGHT_BACK_KP_POINT
		} as AddBoughtBackKPPointAction);
	};
}

export interface RemoveBoughtBackKPPointAction {
	type: ActionTypes.REMOVE_BOUGHT_BACK_KP_POINT;
}

export function _removeBoughtBackKPPoint(): RemoveBoughtBackKPPointAction {
	return {
		type: ActionTypes.REMOVE_BOUGHT_BACK_KP_POINT
	};
}

export interface AddLostKPPointAction {
	type: ActionTypes.ADD_LOST_KP_POINT;
}

export function _addLostKPPoint(): AddLostKPPointAction {
	return {
		type: ActionTypes.ADD_LOST_KP_POINT
	};
}

export interface RemoveLostKPPointAction {
	type: ActionTypes.REMOVE_LOST_KP_POINT;
	payload: {
		cost: number;
	};
}

export function _removeLostKPPoint(): AsyncAction {
	return (dispatch, getState) => {
		const { lost, redeemed } = getState().currentHero.present.energies.permanentArcaneEnergy;
		dispatch({
			type: ActionTypes.REMOVE_LOST_KP_POINT,
			payload: {
				cost: lost === redeemed ? -2 : 0
			}
		} as RemoveLostKPPointAction);
	};
}

export interface AddLostKPPointsAction {
	type: ActionTypes.ADD_LOST_KP_POINTS;
	payload: {
		value: number;
	};
}

export function _addLostKPPoints(value: number): AddLostKPPointsAction {
	return {
		type: ActionTypes.ADD_LOST_KP_POINTS,
		payload: {
			value
		}
	};
}
