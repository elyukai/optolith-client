import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const switchAttributeValueVisibility = () => AppDispatcher.dispatch<SwitchSheetAttributeValueVisibilityAction>({
	type: ActionTypes.SWITCH_SHEET_ATTRIBUTE_VALUE_VISIBILITY
});
