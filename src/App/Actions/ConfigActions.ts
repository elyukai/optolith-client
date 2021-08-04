import * as ActionTypes from "../Constants/ActionTypes"
import { Theme } from "../Models/Config"

export interface SwitchEnableActiveItemHintsAction {
  type: ActionTypes.SWITCH_ENABLE_ACTIVE_ITEM_HINTS
}

export const switchEnableActiveItemHints = (): SwitchEnableActiveItemHintsAction => ({
  type: ActionTypes.SWITCH_ENABLE_ACTIVE_ITEM_HINTS,
})

export interface SetThemeAction {
  type: ActionTypes.SET_THEME
  payload: {
    theme: Theme
  }
}

export const setTheme = (theme: Theme): SetThemeAction => ({
  type: ActionTypes.SET_THEME,
  payload: {
    theme,
  },
})

export interface SwitchEnableEditingHeroAfterCreationPhaseAction {
  type: ActionTypes.SWITCH_ENABLE_EDIT_AFTER_CREATION
}

export const switchEnableEditingHeroAfterCreationPhase =
  (): SwitchEnableEditingHeroAfterCreationPhaseAction => ({
    type: ActionTypes.SWITCH_ENABLE_EDIT_AFTER_CREATION,
  })

export interface SwitchEnableAnimationsAction {
  type: ActionTypes.SWITCH_ENABLE_ANIMATIONS
}

export const switchEnableAnimations = (): SwitchEnableAnimationsAction => ({
  type: ActionTypes.SWITCH_ENABLE_ANIMATIONS,
})

export interface GetZoomLevelAction {
  type: ActionTypes.GET_ZOOM_LEVEL
  payload: {
    zoomLevel: number
  }
}

export const getZoomLevel = (zoomLevel: number): GetZoomLevelAction => ({
  type: ActionTypes.GET_ZOOM_LEVEL,
  payload: {
    zoomLevel,
  },
})

export interface SetZoomLevelAction {
  type: ActionTypes.SET_ZOOM_LEVEL
  payload: {
    zoomLevel: number
  }
}

export const setZoomLevel = (zoomLevel: number): SetZoomLevelAction => ({
  type: ActionTypes.SET_ZOOM_LEVEL,
  payload: {
    zoomLevel,
  },
})

export interface MoveZoomLevelAction {
  type: ActionTypes.MOVE_ZOOM_LEVEL
  payload: {
    zoom: "in" | "out"
  }
}

export const zoomInAction = (): MoveZoomLevelAction => ({
  type: ActionTypes.MOVE_ZOOM_LEVEL,
  payload: {
    zoom: "in",
  },
})

export const zoomOutAction = (): MoveZoomLevelAction => ({
  type: ActionTypes.MOVE_ZOOM_LEVEL,
  payload: {
    zoom: "out",
  },
})