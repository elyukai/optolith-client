import { ACTIVATE_SPECIALABILITY, DEACTIVATE_SPECIALABILITY, SET_SPECIALABILITY_TIER, SET_SPECIALABILITIES_SORT_ORDER } from '../constants/ActionTypes';

export interface ActivateDisAdvAction {
    type: ACTIVATE_SPECIALABILITY;
    payload: {};
}

export const addToList = (args: {}): ActivateDisAdvAction => ({
    type: ACTIVATE_SPECIALABILITY,
    payload: args
});

export interface DeactivateDisAdvPointAction {
    type: DEACTIVATE_SPECIALABILITY;
    payload: {};
}

export const removeFromList = (args: {}): DeactivateDisAdvPointAction => ({
    type: DEACTIVATE_SPECIALABILITY,
    payload: args
});

export interface SetDisAdvTierAction {
    type: SET_SPECIALABILITY_TIER;
    payload: {
        id: string;
        tier: number;
        cost: number;
        sid: number | string;
    };
}

export const setTier = (id: string, tier: number, cost: number, sid: number | string): SetDisAdvTierAction => ({
    type: SET_SPECIALABILITY_TIER,
    payload: {
        id,
        tier,
        cost,
        sid
    }
});

export interface SetSpecialabilitiesSortOrderAction {
    type: SET_SPECIALABILITIES_SORT_ORDER;
    payload: {
        sortOrder: string;
    };
}

export const setSortOrder = (sortOrder: string): SetSpecialabilitiesSortOrderAction => ({
    type: SET_SPECIALABILITIES_SORT_ORDER,
    payload: {
        sortOrder
    }
});
