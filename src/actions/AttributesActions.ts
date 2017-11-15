import * as ActionTypes from '../constants/ActionTypes';
import { get } from '../selectors/dependentInstancesSelectors';
import { isInCharacterCreation } from '../selectors/phaseSelectors';
import { getLocaleMessages } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions.d';
import { AttributeInstance } from '../types/data.d';
import { validate } from '../utils/APUtils';
import { _translate } from '../utils/I18n';
import { getDecreaseAP, getIncreaseAP } from '../utils/ICUtils';
import { getDecreaseCost, getIncreaseCost } from '../utils/IncreasableUtils';
import { addAlert } from './AlertActions';
import { getCurrentAdjustmentId, getAdjustmentValue } from '../selectors/attributeSelectors';

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
		const cost = getIncreaseCost(get(state.currentHero.present.dependent, id) as AttributeInstance, state.currentHero.present.ap, isInCharacterCreation(state));
		const messages = getLocaleMessages(state);
		if (!cost && messages) {
			dispatch(addAlert({
				title: _translate(messages, 'notenoughap.title'),
				message: _translate(messages, 'notenoughap.content'),
			}));
		}
		else {
			dispatch({
				type: ActionTypes.ADD_ATTRIBUTE_POINT,
				payload: {
					id,
					cost
				}
			} as AddAttributePointAction);
		}
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
		const validCost = validate(cost, state.currentHero.present.ap, isInCharacterCreation(state));
		const messages = getLocaleMessages(state);
		if (!validCost && messages) {
			dispatch(addAlert({
				title: _translate(messages, 'notenoughap.title'),
				message: _translate(messages, 'notenoughap.content'),
			}));
		}
		else {
			dispatch({
				type: ActionTypes.ADD_LIFE_POINT,
				payload: {
					cost
				}
			} as AddLifePointAction);
		}
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
		const validCost = validate(cost, state.currentHero.present.ap, isInCharacterCreation(state));
		const messages = getLocaleMessages(state);
		if (!validCost && messages) {
			dispatch(addAlert({
				title: _translate(messages, 'notenoughap.title'),
				message: _translate(messages, 'notenoughap.content'),
			}));
		}
		else {
			dispatch({
				type: ActionTypes.ADD_ARCANE_ENERGY_POINT,
				payload: {
					cost
				}
			} as AddArcaneEnergyPointAction);
		}
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
		const validCost = validate(cost, state.currentHero.present.ap, isInCharacterCreation(state));
		const messages = getLocaleMessages(state);
		if (!validCost && messages) {
			dispatch(addAlert({
				title: _translate(messages, 'notenoughap.title'),
				message: _translate(messages, 'notenoughap.content'),
			}));
		}
		else {
			dispatch({
				type: ActionTypes.ADD_KARMA_POINT,
				payload: {
					cost
				}
			} as AddKarmaPointAction);
		}
	};
}

export interface RemoveLifePointAction {
	type: ActionTypes.REMOVE_LIFE_POINT;
	payload: {
		cost: number;
	};
}

export function removeLifePoint(): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const cost = getDecreaseAP(4, state.currentHero.present.energies.addedLifePoints);
		dispatch({
			type: ActionTypes.REMOVE_LIFE_POINT,
			payload: {
				cost
			}
		} as RemoveLifePointAction);
	};
}

export interface RemoveArcaneEnergyPointAction {
	type: ActionTypes.REMOVE_ARCANE_ENERGY_POINT;
	payload: {
		cost: number;
	};
}

export function removeArcaneEnergyPoint(): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const cost = getDecreaseAP(4, state.currentHero.present.energies.addedArcaneEnergy);
		dispatch({
			type: ActionTypes.REMOVE_ARCANE_ENERGY_POINT,
			payload: {
				cost
			}
		} as RemoveArcaneEnergyPointAction);
	};
}

export interface RemoveKarmaPointAction {
	type: ActionTypes.REMOVE_KARMA_POINT;
	payload: {
		cost: number;
	};
}

export function removeKarmaPoint(): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const cost = getDecreaseAP(4, state.currentHero.present.energies.addedKarmaPoints);
		dispatch({
			type: ActionTypes.REMOVE_KARMA_POINT,
			payload: {
				cost
			}
		} as RemoveKarmaPointAction);
	};
}

export interface AddBoughtBackAEPointAction {
	type: ActionTypes.ADD_BOUGHT_BACK_AE_POINT;
}

export function _addBoughtBackAEPoint(): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const validCost = validate(2, state.currentHero.present.ap, isInCharacterCreation(state));
		const messages = getLocaleMessages(state);
		if (!validCost && messages) {
			dispatch(addAlert({
				title: _translate(messages, 'notenoughap.title'),
				message: _translate(messages, 'notenoughap.content'),
			}));
		}
		else {
			dispatch({
				type: ActionTypes.ADD_BOUGHT_BACK_AE_POINT
			} as AddBoughtBackAEPointAction);
		}
	};
}

export interface AddLostLPPointAction {
	type: ActionTypes.ADD_LOST_LP_POINT;
}

export function _addLostLPPoint(): AddLostLPPointAction {
	return {
		type: ActionTypes.ADD_LOST_LP_POINT
	};
}

export interface RemoveLostLPPointAction {
	type: ActionTypes.REMOVE_LOST_LP_POINT;
}

export function _removeLostLPPoint(): RemoveLostLPPointAction {
	return {
		type: ActionTypes.REMOVE_LOST_LP_POINT
	};
}

export interface AddLostLPPointsAction {
	type: ActionTypes.ADD_LOST_LP_POINTS;
	payload: {
		value: number;
	};
}

export function _addLostLPPoints(value: number): AddLostLPPointsAction {
	return {
		type: ActionTypes.ADD_LOST_LP_POINTS,
		payload: {
			value
		}
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
		const state = getState();
		const validCost = validate(2, state.currentHero.present.ap, isInCharacterCreation(state));
		const messages = getLocaleMessages(state);
		if (!validCost && messages) {
			dispatch(addAlert({
				title: _translate(messages, 'notenoughap.title'),
				message: _translate(messages, 'notenoughap.content'),
			}));
		}
		else {
			dispatch({
				type: ActionTypes.ADD_BOUGHT_BACK_KP_POINT
			} as AddBoughtBackKPPointAction);
		}
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

export interface SetAdjustmentIdAction {
	type: ActionTypes.SET_ATTRIBUTE_ADJUSTMENT_SELECTION_ID;
	payload: {
		current: string;
		next: string;
		value: number;
	};
}

export function setAdjustmentId(id: string): AsyncAction {
	return (dispatch, getState) => {
		const current = getCurrentAdjustmentId(getState());
		const value = getAdjustmentValue(getState());
		dispatch({
			type: ActionTypes.SET_ATTRIBUTE_ADJUSTMENT_SELECTION_ID,
			payload: {
				current,
				next: id,
				value
			}
		} as SetAdjustmentIdAction);
	};
}
