import { ActionTypes } from '../Constants/ActionTypes';

export interface SetHigherParadeValuesAction {
  type: ActionTypes.SET_HIGHER_PARADE_VALUES;
  payload: {
    value: number;
  };
}

export const setHigherParadeValues = (value: number): SetHigherParadeValuesAction => ({
  type: ActionTypes.SET_HIGHER_PARADE_VALUES,
  payload: {
    value,
  },
});

export interface SwitchAttributeValueLimitAction {
  type: ActionTypes.SWITCH_ATTRIBUTE_VALUE_LIMIT;
}

export const switchAttributeValueLimit = (): SwitchAttributeValueLimitAction => ({
  type: ActionTypes.SWITCH_ATTRIBUTE_VALUE_LIMIT,
});

export interface SwitchEnableAllRuleBooksAction {
  type: ActionTypes.SWITCH_ENABLE_ALL_RULE_BOOKS;
}

export const switchEnableAllRuleBooks = (): SwitchEnableAllRuleBooksAction => ({
  type: ActionTypes.SWITCH_ENABLE_ALL_RULE_BOOKS,
});

export interface SwitchEnableRuleBookAction {
  type: ActionTypes.SWITCH_ENABLE_RULE_BOOK;
  payload: {
    id: string;
  };
}

export const switchEnableRuleBook = (id: string): SwitchEnableRuleBookAction => ({
  type: ActionTypes.SWITCH_ENABLE_RULE_BOOK,
  payload: {
    id,
  },
});

export interface SwitchEnableLanguageSpecializationsAction {
  type: ActionTypes.SWITCH_ENABLE_LANGUAGE_SPECIALIZATIONS;
}

export const switchEnableLanguageSpecializations =
  (): SwitchEnableLanguageSpecializationsAction => ({
    type: ActionTypes.SWITCH_ENABLE_LANGUAGE_SPECIALIZATIONS,
  });
