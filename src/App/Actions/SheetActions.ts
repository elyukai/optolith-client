import { SWITCH_SHEET_ATTR_VALUE_VISIBILITY } from "../Constants/ActionTypes"

export interface SwitchSheetAttributeValueVisibilityAction {
  type: SWITCH_SHEET_ATTR_VALUE_VISIBILITY
}

export const switchAttributeValueVisibility = (): SwitchSheetAttributeValueVisibilityAction => ({
  type: SWITCH_SHEET_ATTR_VALUE_VISIBILITY,
})
