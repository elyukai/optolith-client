import { ActionTypes } from '../constants/ActionTypes';

export interface SwitchEnableActiveItemHintsAction {
  type: ActionTypes.SWITCH_ENABLE_ACTIVE_ITEM_HINTS;
}

export const switchEnableActiveItemHints = (): SwitchEnableActiveItemHintsAction => ({
  type: ActionTypes.SWITCH_ENABLE_ACTIVE_ITEM_HINTS,
});

export interface SetThemeAction {
  type: ActionTypes.SET_THEME;
  payload: {
    theme: string;
  };
}

export const setTheme = (theme: string): SetThemeAction => ({
  type: ActionTypes.SET_THEME,
  payload: {
    theme,
  },
});

export interface SwitchEnableEditingHeroAfterCreationPhaseAction {
  type: ActionTypes.SWITCH_ENABLE_EDITING_HERO_AFTER_CREATION_PHASE;
}

export const switchEnableEditingHeroAfterCreationPhase =
  (): SwitchEnableEditingHeroAfterCreationPhaseAction => ({
    type: ActionTypes.SWITCH_ENABLE_EDITING_HERO_AFTER_CREATION_PHASE,
  });

export interface SwitchEnableAnimationsAction {
  type: ActionTypes.SWITCH_ENABLE_ANIMATIONS;
}

export const switchEnableAnimations = (): SwitchEnableAnimationsAction => ({
  type: ActionTypes.SWITCH_ENABLE_ANIMATIONS,
});
