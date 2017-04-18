import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';

type Action = ReceiveInitialDataAction | SwitchEnableActiveItemHintsAction;

class ConfigStoreStatic extends Store {
	private enableActiveItemHints: boolean;
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.RECEIVE_INITIAL_DATA:
					this.enableActiveItemHints = action.payload.config.enableActiveItemHints;
					break;

				case ActionTypes.SWITCH_ENABLE_ACTIVE_ITEM_HINTS:
					this.updateActiveItemHintsVisibility();
					break;

				default:
					return true;
			}
			this.emitChange();
			return true;
		});
	}

	getActiveItemHintsVisibility() {
		return this.enableActiveItemHints;
	}

	private updateActiveItemHintsVisibility() {
		this.enableActiveItemHints = !this.enableActiveItemHints;
	}
}

const ConfigStore = new ConfigStoreStatic();

export default ConfigStore;
