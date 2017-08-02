import { SwitchEnableActiveItemHintsAction } from '../actions/ConfigActions';
import { ReceiveInitialDataAction } from '../actions/FileActions';
import * as ActionTypes from '../constants/ActionTypes';

import { Store } from './Store';

type Action = ReceiveInitialDataAction | SwitchEnableActiveItemHintsAction;

class ConfigStoreStatic extends Store {
	private enableActiveItemHints: boolean;
	readonly dispatchToken: string;

	getActiveItemHintsVisibility() {
		return this.enableActiveItemHints;
	}

	private updateActiveItemHintsVisibility() {
		this.enableActiveItemHints = !this.enableActiveItemHints;
	}
}

export const ConfigStore = new ConfigStoreStatic();
