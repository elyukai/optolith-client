import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';

export interface SwitchEnableActiveItemHintsAction extends Action {
	type: ActionTypes.SWITCH_ENABLE_ACTIVE_ITEM_HINTS;
}

export const switchEnableActiveItemHints = () => AppDispatcher.dispatch<SwitchEnableActiveItemHintsAction>({
	type: ActionTypes.SWITCH_ENABLE_ACTIVE_ITEM_HINTS
});

export function _switchEnableActiveItemHints(): SwitchEnableActiveItemHintsAction {
	return {
		type: ActionTypes.SWITCH_ENABLE_ACTIVE_ITEM_HINTS
	};
}
