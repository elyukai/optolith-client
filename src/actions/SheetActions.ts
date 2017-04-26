import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';

export interface SwitchSheetAttributeValueVisibilityAction extends Action {
	type: ActionTypes.SWITCH_SHEET_ATTRIBUTE_VALUE_VISIBILITY;
}

export const switchAttributeValueVisibility = () => AppDispatcher.dispatch<SwitchSheetAttributeValueVisibilityAction>({
	type: ActionTypes.SWITCH_SHEET_ATTRIBUTE_VALUE_VISIBILITY
});
