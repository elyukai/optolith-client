import { SWITCH_SHEET_ATTR_VALUE_VISIBILITY, SWITCH_SHEET_USE_PARCHMENT, SET_SHEET_ZOOM_FACTOR } from "../Constants/ActionTypes"

export interface SwitchSheetAttributeValueVisibilityAction {
  type: SWITCH_SHEET_ATTR_VALUE_VISIBILITY
}

export const switchAttributeValueVisibility = (): SwitchSheetAttributeValueVisibilityAction => ({
  type: SWITCH_SHEET_ATTR_VALUE_VISIBILITY,
})

export interface SwitchSheetUseParchmentAction {
  type: SWITCH_SHEET_USE_PARCHMENT
}

export const switchUseParchment = (): SwitchSheetUseParchmentAction => ({
  type: SWITCH_SHEET_USE_PARCHMENT,
})

export interface SetSheetZoomFactor {
  type: SET_SHEET_ZOOM_FACTOR
  payload: {
    zoomFactor: number
  }
}

export const setSheetZoomFactor = (zoomFactor: number): SetSheetZoomFactor => ({
  type: SET_SHEET_ZOOM_FACTOR,
  payload: {
    zoomFactor,
  },
})
