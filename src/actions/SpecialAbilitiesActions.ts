import { ACTIVATE_SPECIALABILITY, DEACTIVATE_SPECIALABILITY, SET_SPECIALABILITY_TIER, SET_SPECIALABILITIES_SORT_ORDER } from '../constants/ActionTypes';

interface ActivateArgs {
    id: string;
    sel?: string | number;
    sel2?: string | number;
    input?: string;
    tier?: number
}

export interface ActivateSpecialAbilityAction {
    type: ACTIVATE_SPECIALABILITY;
    payload: ActivateArgs;
}

export const addToList = (args: ActivateArgs): ActivateSpecialAbilityAction => ({
    type: ACTIVATE_SPECIALABILITY,
    payload: args
});

export interface DeactivateSpecialAbilityPointAction {
    type: DEACTIVATE_SPECIALABILITY;
    payload: {};
}

export const removeFromList = (args: {}): DeactivateSpecialAbilityPointAction => ({
    type: DEACTIVATE_SPECIALABILITY,
    payload: args
});

export interface SetSpecialAbilityTierAction {
    type: SET_SPECIALABILITY_TIER;
    payload: {
        id: string;
        tier: number;
        cost: number;
        sid: number | string;
    };
}

export const setTier = (id: string, tier: number, cost: number, sid: number | string): SetSpecialAbilityTierAction => ({
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
