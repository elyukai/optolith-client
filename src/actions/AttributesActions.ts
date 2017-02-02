import { ADD_ATTRIBUTE_POINT, REMOVE_ATTRIBUTE_POINT, ADD_LIFE_POINT, ADD_ARCANE_ENERGY_POINT, ADD_KARMA_POINT } from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const addPoint = (id: string): void => AppDispatcher.dispatch(<AddAttributePointAction>{
	type: ADD_ATTRIBUTE_POINT,
	payload: {
		id
	}
});

export const removePoint = (id: string): void => AppDispatcher.dispatch(<RemoveAttributePointAction>{
	type: REMOVE_ATTRIBUTE_POINT,
	payload: {
		id
	}
});

export const addLifePoint = (id: string): void => AppDispatcher.dispatch(<AddLifePointAction>{
	type: ADD_LIFE_POINT
});

export const addArcaneEnergyPoint = (id: string): void => AppDispatcher.dispatch(<AddArcaneEnergyPointAction>{
	type: ADD_ARCANE_ENERGY_POINT
});

export const addKarmaPoint = (id: string): void => AppDispatcher.dispatch(<AddKarmaPointAction>{
	type: ADD_KARMA_POINT
});
