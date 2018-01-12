import * as ActionTypes from '../constants/ActionTypes';

export interface SetHigherParadeValuesAction {
	type: ActionTypes.SET_HIGHER_PARADE_VALUES;
	payload: {
		value: number;
	};
}

export function _setHigherParadeValues(value: number): SetHigherParadeValuesAction {
	return {
		type: ActionTypes.SET_HIGHER_PARADE_VALUES,
		payload: {
			value
		}
	};
}

export interface SwitchAttributeValueLimitAction {
	type: ActionTypes.SWITCH_ATTRIBUTE_VALUE_LIMIT;
}

export function _switchAttributeValueLimit(): SwitchAttributeValueLimitAction {
	return {
		type: ActionTypes.SWITCH_ATTRIBUTE_VALUE_LIMIT
	};
}

export interface SwitchEnableAllRuleBooksAction {
	type: ActionTypes.SWITCH_ENABLE_ALL_RULE_BOOKS;
}

export function switchEnableAllRuleBooks(): SwitchEnableAllRuleBooksAction {
	return {
		type: ActionTypes.SWITCH_ENABLE_ALL_RULE_BOOKS
	};
}

export interface SwitchEnableRuleBookAction {
	type: ActionTypes.SWITCH_ENABLE_RULE_BOOK;
	payload: {
		id: string;
	};
}

export function switchEnableRuleBook(id: string): SwitchEnableRuleBookAction {
	return {
		type: ActionTypes.SWITCH_ENABLE_RULE_BOOK,
		payload: {
			id
		}
	};
}

export interface SwitchEnableLanguageSpecializationsAction {
	type: ActionTypes.SWITCH_ENABLE_LANGUAGE_SPECIALIZATIONS;
}

export function switchEnableLanguageSpecializations(): SwitchEnableLanguageSpecializationsAction {
	return {
		type: ActionTypes.SWITCH_ENABLE_LANGUAGE_SPECIALIZATIONS
	};
}
