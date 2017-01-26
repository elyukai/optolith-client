import { ACTIVATE_DISADV, DEACTIVATE_DISADV, SET_DISADV_TIER, SWITCH_DISADV_RATING_VISIBILITY } from '../constants/ActionTypes';

interface ActivateArgs {
    id: string;
    sel?: string | number;
    sel2?: string | number;
    input?: string;
    tier?: number
}

export interface ActivateDisAdvAction {
    type: ACTIVATE_DISADV;
    payload: ActivateArgs;
}

export const addToList = (args: ActivateArgs): ActivateDisAdvAction => ({
    type: ACTIVATE_DISADV,
    payload: args
});

interface DeactivateArgs {
    id: string;
    tier?: number;
    cost: number;
    sid?: number | string;
}

export interface DeactivateDisAdvAction {
    type: DEACTIVATE_DISADV;
    payload: DeactivateArgs;
}

export const removeFromList = (args: DeactivateArgs): DeactivateDisAdvAction => ({
    type: DEACTIVATE_DISADV,
    payload: args
});

export interface SetDisAdvTierAction {
    type: SET_DISADV_TIER;
    payload: {
        id: string;
        tier: number;
        cost: number;
        sid: number | string;
    };
}

export const setTier = (id: string, tier: number, cost: number, sid: number | string): SetDisAdvTierAction => ({
    type: SET_DISADV_TIER,
    payload: {
        id,
        tier,
        cost,
        sid
    }
});

export interface SwitchRatingVisibilityAction {
    type: SWITCH_DISADV_RATING_VISIBILITY;
    payload: {
        id: string;
    };
}

export const switchRatingVisibility = (id: string): SwitchRatingVisibilityAction => ({
    type: SWITCH_DISADV_RATING_VISIBILITY,
    payload: {
        id
    }
});
