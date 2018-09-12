import { ActionTypes } from '../constants/ActionTypes';

export interface SwitchSheetAttributeValueVisibilityAction {
  type: ActionTypes.SWITCH_SHEET_ATTRIBUTE_VALUE_VISIBILITY;
}

export const switchAttributeValueVisibility = (): SwitchSheetAttributeValueVisibilityAction => ({
  type: ActionTypes.SWITCH_SHEET_ATTRIBUTE_VALUE_VISIBILITY
});
