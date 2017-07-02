import * as ActionTypes from '../constants/ActionTypes';
import { get } from '../reducers/dependentInstances';
import { store } from '../stores/AppStore';
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

export const addPoint = (id: string) => AppDispatcher.dispatch<AddAttributePointAction>({
	type: ActionTypes.ADD_ATTRIBUTE_POINT,
	payload: {
		id,
		cost: 0
	}
});

export function _addPoint(id: string): AddAttributePointAction | undefined {
	const state = store.getState();
	const cost = getIncreaseCost(get(state.currentHero.present.dependent, id) as AttributeInstance, state.currentHero.present.ap);
	if (!cost) {
		alert(translate('notenoughap.title'), translate('notenoughap.content'));
		return;
	}
	return {
		type: ActionTypes.ADD_ATTRIBUTE_POINT,
		payload: {
			id,
			cost
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

export const removePoint = (id: string) => AppDispatcher.dispatch<RemoveAttributePointAction>({
	type: ActionTypes.REMOVE_ATTRIBUTE_POINT,
	payload: {
		id,
		cost: 0
	}
});

export function _removePoint(id: string): RemoveAttributePointAction {
	const state = store.getState();
	const cost = getDecreaseCost(get(state.currentHero.present.dependent, id) as AttributeInstance);
	return {
		type: ActionTypes.REMOVE_ATTRIBUTE_POINT,
		payload: {
			id,
			cost
		}
	};
}

export interface AddLifePointAction {
	type: ActionTypes.ADD_LIFE_POINT;
	payload: {
		cost: number;
	};
}

export const addLifePoint = () => AppDispatcher.dispatch<AddLifePointAction>({
	type: ActionTypes.ADD_LIFE_POINT,
	payload: {
		cost: 0
	}
});

export function _addLifePoint(): AddLifePointAction | undefined {
	const state = store.getState();
	const cost = getIncreaseAP(4, state.currentHero.present.energies.addedLifePoints);
	const validCost = validate(cost, state.currentHero.present.ap);
	if (!validCost) {
		alert(translate('notenoughap.title'), translate('notenoughap.content'));
		return;
	}
	return {
		type: ActionTypes.ADD_LIFE_POINT,
		payload: {
			cost
		}
	};
}

export interface AddArcaneEnergyPointAction {
	type: ActionTypes.ADD_ARCANE_ENERGY_POINT;
	payload: {
		cost: number;
	};
}

export const addArcaneEnergyPoint = () => AppDispatcher.dispatch<AddArcaneEnergyPointAction>({
	type: ActionTypes.ADD_ARCANE_ENERGY_POINT,
	payload: {
		cost: 0
	}
});

export function _addArcaneEnergyPoint(): AddArcaneEnergyPointAction | undefined {
	const state = store.getState();
	const cost = getIncreaseAP(4, state.currentHero.present.energies.addedArcaneEnergy);
	const validCost = validate(cost, state.currentHero.present.ap);
	if (!validCost) {
		alert(translate('notenoughap.title'), translate('notenoughap.content'));
		return;
	}
	return {
		type: ActionTypes.ADD_ARCANE_ENERGY_POINT,
		payload: {
			cost
		}
	};
}

export interface AddKarmaPointAction {
	type: ActionTypes.ADD_KARMA_POINT;
	payload: {
		cost: number;
	};
}

export const addKarmaPoint = () => AppDispatcher.dispatch<AddKarmaPointAction>({
	type: ActionTypes.ADD_KARMA_POINT,
	payload: {
		cost: 0
	}
});

export function _addKarmaPoint(): AddKarmaPointAction | undefined {
	const state = store.getState();
	const cost = getIncreaseAP(4, state.currentHero.present.energies.addedKarmaPoints);
	const validCost = validate(cost, state.currentHero.present.ap);
	if (!validCost) {
		alert(translate('notenoughap.title'), translate('notenoughap.content'));
		return;
	}
	return {
		type: ActionTypes.ADD_KARMA_POINT,
		payload: {
			cost
		}
	};
}

export interface AddBoughtBackAEPointAction {
	type: ActionTypes.ADD_BOUGHT_BACK_AE_POINT;
}

export const addBoughtBackAEPoint = () => AppDispatcher.dispatch<AddBoughtBackAEPointAction>({
	type: ActionTypes.ADD_BOUGHT_BACK_AE_POINT
});

export function _addBoughtBackAEPoint(): AddBoughtBackAEPointAction | undefined {
	const state = store.getState();
	const validCost = validate(2, state.currentHero.present.ap);
	if (!validCost) {
		alert(translate('notenoughap.title'), translate('notenoughap.content'));
		return;
	}
	return {
		type: ActionTypes.ADD_BOUGHT_BACK_AE_POINT
	};
}

export interface RemoveBoughtBackAEPointAction {
	type: ActionTypes.REMOVE_BOUGHT_BACK_AE_POINT;
}

export const removeBoughtBackAEPoint = () => AppDispatcher.dispatch<RemoveBoughtBackAEPointAction>({
	type: ActionTypes.REMOVE_BOUGHT_BACK_AE_POINT
});

export function _removeBoughtBackAEPoint(): RemoveBoughtBackAEPointAction {
	return {
		type: ActionTypes.REMOVE_BOUGHT_BACK_AE_POINT
	};
}

export interface AddLostAEPointAction {
	type: ActionTypes.ADD_LOST_AE_POINT;
}

export const addLostAEPoint = () => AppDispatcher.dispatch<AddLostAEPointAction>({
	type: ActionTypes.ADD_LOST_AE_POINT
});

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

export const removeLostAEPoint = () => AppDispatcher.dispatch<RemoveLostAEPointAction>({
	type: ActionTypes.REMOVE_LOST_AE_POINT
});

export function _removeLostAEPoint(): RemoveLostAEPointAction {
	const { lost, redeemed } = store.getState().currentHero.present.energies.permanentArcaneEnergy;
	return {
		type: ActionTypes.REMOVE_LOST_AE_POINT,
		payload: {
			cost: lost === redeemed ? -2 : 0
		}
	};
}

export interface AddLostAEPointsAction {
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

export const addBoughtBackKPPoint = () => AppDispatcher.dispatch<AddBoughtBackKPPointAction>({
	type: ActionTypes.ADD_BOUGHT_BACK_KP_POINT
});

export function _addBoughtBackKPPoint(): AddBoughtBackKPPointAction | undefined {
	const state = store.getState();
	const validCost = validate(2, state.currentHero.present.ap);
	if (!validCost) {
		alert(translate('notenoughap.title'), translate('notenoughap.content'));
		return;
	}
	return {
		type: ActionTypes.ADD_BOUGHT_BACK_KP_POINT
	};
}

export interface RemoveBoughtBackKPPointAction {
	type: ActionTypes.REMOVE_BOUGHT_BACK_KP_POINT;
}

export const removeBoughtBackKPPoint = () => AppDispatcher.dispatch<RemoveBoughtBackKPPointAction>({
	type: ActionTypes.REMOVE_BOUGHT_BACK_KP_POINT
});

export function _removeBoughtBackKPPoint(): RemoveBoughtBackKPPointAction {
	return {
		type: ActionTypes.REMOVE_BOUGHT_BACK_KP_POINT
	};
}

export interface AddLostKPPointAction {
	type: ActionTypes.ADD_LOST_KP_POINT;
}

export const addLostKPPoint = () => AppDispatcher.dispatch<AddLostKPPointAction>({
	type: ActionTypes.ADD_LOST_KP_POINT
});

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

export const removeLostKPPoint = () => AppDispatcher.dispatch<RemoveLostKPPointAction>({
	type: ActionTypes.REMOVE_LOST_KP_POINT
});

export function _removeLostKPPoint(): RemoveLostKPPointAction {
	const { lost, redeemed } = store.getState().currentHero.present.energies.permanentArcaneEnergy;
	return {
		type: ActionTypes.REMOVE_LOST_KP_POINT,
		payload: {
			cost: lost === redeemed ? -2 : 0
		}
	};
}

export interface AddLostKPPointsAction {
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

export function _addLostKPPoints(value: number): AddLostKPPointsAction {
	return {
		type: ActionTypes.ADD_LOST_KP_POINTS,
		payload: {
			value
		}
	};
}
