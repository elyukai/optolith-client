import { SWITCH_SHEET_ATTR_VALUE_VISIBILITY, SWITCH_SHEET_USE_PARCHMENT, SWITCH_SHEET_GENERATE_NOTES, SET_SHEET_ZOOM_FACTOR } from "../Constants/ActionTypes"

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

export interface SwitchSheetGenerateNotesAction {
  type: SWITCH_SHEET_GENERATE_NOTES
}

export const switchGenerateNotes = (): SwitchSheetGenerateNotesAction => ({
  type: SWITCH_SHEET_GENERATE_NOTES,
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
