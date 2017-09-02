import * as ActionTypes from '../constants/ActionTypes';

export interface SwitchEnableActiveItemHintsAction {
	type: ActionTypes.SWITCH_ENABLE_ACTIVE_ITEM_HINTS;
}

export function _switchEnableActiveItemHints(): SwitchEnableActiveItemHintsAction {
	return {
		type: ActionTypes.SWITCH_ENABLE_ACTIVE_ITEM_HINTS
	};
}
