import * as ActionTypes from '../constants/ActionTypes';

export interface SwitchSheetAttributeValueVisibilityAction {
	type: ActionTypes.SWITCH_SHEET_ATTRIBUTE_VALUE_VISIBILITY;
}

export const switchAttributeValueVisibility = () => AppDispatcher.dispatch<SwitchSheetAttributeValueVisibilityAction>({
	type: ActionTypes.SWITCH_SHEET_ATTRIBUTE_VALUE_VISIBILITY
});

export function _switchAttributeValueVisibility(): SwitchSheetAttributeValueVisibilityAction {
	return {
		type: ActionTypes.SWITCH_SHEET_ATTRIBUTE_VALUE_VISIBILITY
	};
}
