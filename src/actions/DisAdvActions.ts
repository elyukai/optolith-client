import { ACTIVATE_DISADV, DEACTIVATE_DISADV, SET_DISADV_TIER, SWITCH_DISADV_RATING_VISIBILITY } from '../constants/ActionTypes';

export interface ActivateDisAdvAction {
    type: ACTIVATE_DISADV;
    payload: {};
}

export const addToList = (args: {}): ActivateDisAdvAction => ({
    type: ACTIVATE_DISADV,
    payload: args
});

export interface DeactivateDisAdvPointAction {
    type: DEACTIVATE_DISADV;
    payload: {};
}

export const removeFromList = (args: {}): DeactivateDisAdvPointAction => ({
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
