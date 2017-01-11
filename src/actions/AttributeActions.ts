import { ADD_ATTRIBUTE_POINT, REMOVE_ATTRIBUTE_POINT, ADD_LIFE_POINT, ADD_ARCANE_ENERGY_POINT, ADD_KARMA_POINT } from '../constants/ActionTypes';

export interface AddAttributePointAction {
	type: ADD_ATTRIBUTE_POINT;
	payload: {
		id: string;
	};
}

export const addPoint = (id: string): AddAttributePointAction => ({
	type: ADD_ATTRIBUTE_POINT,
	payload: {
		id
	}
});

export interface RemoveAttributePointAction {
	type: REMOVE_ATTRIBUTE_POINT;
	payload: {
		id: string;
	};
}

export const removePoint = (id: string): RemoveAttributePointAction => ({
	type: REMOVE_ATTRIBUTE_POINT,
	payload: {
		id
	}
});

export interface AddLifePointAction {
	type: ADD_LIFE_POINT;
}

export const addLifePoint = (id: string): AddLifePointAction => ({
	type: ADD_LIFE_POINT
});

export interface AddArcaneEnergyPointAction {
	type: ADD_ARCANE_ENERGY_POINT;
}

export const addArcaneEnergyPoint = (id: string): AddArcaneEnergyPointAction => ({
	type: ADD_ARCANE_ENERGY_POINT
});

export interface AddKarmaPointAction {
	type: ADD_KARMA_POINT;
}

export const addKarmaPoint = (id: string): AddKarmaPointAction => ({
	type: ADD_KARMA_POINT
});
