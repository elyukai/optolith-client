import * as ActionTypes from '../constants/ActionTypes';

export interface Pact {
	category: number;
	level: number;
	type: number;
	domain: number | string;
	name: string;
}

export interface SetPactCategoryAction {
	type: ActionTypes.SET_PACT_CATEGORY;
	payload: {
		category: number | undefined;
	};
}

export function setPactCategory(category: number | undefined): SetPactCategoryAction {
	return {
		type: ActionTypes.SET_PACT_CATEGORY,
		payload: {
			category
		}
	};
}

export interface SetPactLevelAction {
	type: ActionTypes.SET_PACT_LEVEL;
	payload: {
		level: number;
	};
}

export function setPactLevel(level: number): SetPactLevelAction {
	return {
		type: ActionTypes.SET_PACT_LEVEL,
		payload: {
			level
		}
	};
}

export interface SetTargetTypeAction {
	type: ActionTypes.SET_TARGET_TYPE;
	payload: {
		type: number;
	};
}

export function setTargetType(type: number): SetTargetTypeAction {
	return {
		type: ActionTypes.SET_TARGET_TYPE,
		payload: {
			type
		}
	};
}

export interface SetTargetDomainAction {
	type: ActionTypes.SET_TARGET_DOMAIN;
	payload: {
		domain: number | string;
	};
}

export function setTargetDomain(domain: number | string): SetTargetDomainAction {
	return {
		type: ActionTypes.SET_TARGET_DOMAIN,
		payload: {
			domain
		}
	};
}

export interface SetTargetNameAction {
	type: ActionTypes.SET_TARGET_NAME;
	payload: {
		name: string;
	};
}

export function setTargetName(name: string): SetTargetNameAction {
	return {
		type: ActionTypes.SET_TARGET_NAME,
		payload: {
			name
		}
	};
}
