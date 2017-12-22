import * as ActionTypes from '../constants/ActionTypes';
import { getAvailableAdventurePoints } from '../selectors/adventurePointsSelectors';
import { getAdjustmentValue, getCurrentAdjustmentId } from '../selectors/attributeSelectors';
import { isInCharacterCreation } from '../selectors/phaseSelectors';
import { getAddedArcaneEnergyPoints, getAddedKarmaPoints, getAddedLifePoints, getAttributes, getLocaleMessages, getPermanentArcaneEnergyPoints, getPermanentKarmaPoints } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions.d';
import { validate } from '../utils/APUtils';
import { _translate } from '../utils/I18n';
import { getDecreaseAP, getIncreaseAP } from '../utils/ICUtils';
import { getDecreaseCost, getIncreaseCost } from '../utils/IncreasableUtils';
import { addAlert } from './AlertActions';

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
		const cost = getIncreaseCost(getAttributes(state).get(id)!, getAvailableAdventurePoints(state), isInCharacterCreation(state));
		const messages = getLocaleMessages(state);
		if (messages) {
			if (!cost) {
				dispatch(addAlert({
					title: _translate(messages, 'notenoughap.title'),
					message: _translate(messages, 'notenoughap.content'),
				}));
			}
			else {
				dispatch<AddAttributePointAction>({
					type: ActionTypes.ADD_ATTRIBUTE_POINT,
					payload: {
						id,
						cost
					}
				});
			}
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
		const cost = getDecreaseCost(getAttributes(getState()).get(id)!);
		dispatch<RemoveAttributePointAction>({
			type: ActionTypes.REMOVE_ATTRIBUTE_POINT,
			payload: {
				id,
				cost
			}
		});
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
		const cost = getIncreaseAP(4, getAddedLifePoints(state));
		const validCost = validate(cost, getAvailableAdventurePoints(state), isInCharacterCreation(state));
		const messages = getLocaleMessages(state);
		if (!validCost && messages) {
			dispatch(addAlert({
				title: _translate(messages, 'notenoughap.title'),
				message: _translate(messages, 'notenoughap.content'),
			}));
		}
		else {
			dispatch<AddLifePointAction>({
				type: ActionTypes.ADD_LIFE_POINT,
				payload: {
					cost
				}
			});
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
		const cost = getIncreaseAP(4, getAddedArcaneEnergyPoints(state));
		const validCost = validate(cost, getAvailableAdventurePoints(state), isInCharacterCreation(state));
		const messages = getLocaleMessages(state);
		if (!validCost && messages) {
			dispatch(addAlert({
				title: _translate(messages, 'notenoughap.title'),
				message: _translate(messages, 'notenoughap.content'),
			}));
		}
		else {
			dispatch<AddArcaneEnergyPointAction>({
				type: ActionTypes.ADD_ARCANE_ENERGY_POINT,
				payload: {
					cost
				}
			});
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
		const cost = getIncreaseAP(4, getAddedKarmaPoints(state));
		const validCost = validate(cost, getAvailableAdventurePoints(state), isInCharacterCreation(state));
		const messages = getLocaleMessages(state);
		if (!validCost && messages) {
			dispatch(addAlert({
				title: _translate(messages, 'notenoughap.title'),
				message: _translate(messages, 'notenoughap.content'),
			}));
		}
		else {
			dispatch<AddKarmaPointAction>({
				type: ActionTypes.ADD_KARMA_POINT,
				payload: {
					cost
				}
			});
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
		const cost = getDecreaseAP(4, getAddedLifePoints(state));
		dispatch<RemoveLifePointAction>({
			type: ActionTypes.REMOVE_LIFE_POINT,
			payload: {
				cost
			}
		});
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
		const cost = getDecreaseAP(4, getAddedArcaneEnergyPoints(state));
		dispatch<RemoveArcaneEnergyPointAction>({
			type: ActionTypes.REMOVE_ARCANE_ENERGY_POINT,
			payload: {
				cost
			}
		});
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
		const cost = getDecreaseAP(4, getAddedKarmaPoints(state));
		dispatch<RemoveKarmaPointAction>({
			type: ActionTypes.REMOVE_KARMA_POINT,
			payload: {
				cost
			}
		});
	};
}

export interface AddBoughtBackAEPointAction {
	type: ActionTypes.ADD_BOUGHT_BACK_AE_POINT;
}

export function _addBoughtBackAEPoint(): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const validCost = validate(2, getAvailableAdventurePoints(state), isInCharacterCreation(state));
		const messages = getLocaleMessages(state);
		if (!validCost && messages) {
			dispatch(addAlert({
				title: _translate(messages, 'notenoughap.title'),
				message: _translate(messages, 'notenoughap.content'),
			}));
		}
		else {
			dispatch<AddBoughtBackAEPointAction>({
				type: ActionTypes.ADD_BOUGHT_BACK_AE_POINT
			});
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
		const { lost, redeemed } = getPermanentArcaneEnergyPoints(getState());
		dispatch<RemoveLostAEPointAction>({
			type: ActionTypes.REMOVE_LOST_AE_POINT,
			payload: {
				cost: lost === redeemed ? -2 : 0
			}
		});
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
		const validCost = validate(2, getAvailableAdventurePoints(state), isInCharacterCreation(state));
		const messages = getLocaleMessages(state);
		if (!validCost && messages) {
			dispatch(addAlert({
				title: _translate(messages, 'notenoughap.title'),
				message: _translate(messages, 'notenoughap.content'),
			}));
		}
		else {
			dispatch<AddBoughtBackKPPointAction>({
				type: ActionTypes.ADD_BOUGHT_BACK_KP_POINT
			});
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
		const { lost, redeemed } = getPermanentKarmaPoints(getState());
		dispatch<RemoveLostKPPointAction>({
			type: ActionTypes.REMOVE_LOST_KP_POINT,
			payload: {
				cost: lost === redeemed ? -2 : 0
			}
		});
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
		if (typeof current === 'string' && typeof value === 'number') {
			dispatch<SetAdjustmentIdAction>({
				type: ActionTypes.SET_ATTRIBUTE_ADJUSTMENT_SELECTION_ID,
				payload: {
					current,
					next: id,
					value
				}
			});
		}
	};
}
