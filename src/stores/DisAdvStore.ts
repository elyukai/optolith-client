import { ActivateDisAdvAction, DeactivateDisAdvAction, SetDisAdvTierAction, SwitchDisAdvRatingVisibilityAction } from '../actions/DisAdvActions';
import { ReceiveInitialDataAction } from '../actions/FileActions';
import { UndoTriggerActions } from '../actions/HistoryActions';
import * as ActionTypes from '../constants/ActionTypes';
import { AppDispatcher } from '../dispatcher/AppDispatcher';
import { ListStore } from './ListStore';
import { Store } from './Store';

type Action = SwitchDisAdvRatingVisibilityAction | ActivateDisAdvAction | DeactivateDisAdvAction | SetDisAdvTierAction | UndoTriggerActions | ReceiveInitialDataAction;

class DisAdvStoreStatic extends Store {
	private showRating = true;
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			AppDispatcher.waitFor([ListStore.dispatchToken]);
			if (action.undo) {
				switch (action.type) {
					case ActionTypes.ACTIVATE_DISADV:
					case ActionTypes.DEACTIVATE_DISADV:
					case ActionTypes.SET_DISADV_TIER:
						break;

					default:
						return true;
				}
			}
			else {
				switch (action.type) {
					case ActionTypes.RECEIVE_INITIAL_DATA:
						this.showRating = action.payload.config.advantagesDisadvantagesCultureRatingVisibility;
						break;

					case ActionTypes.SWITCH_DISADV_RATING_VISIBILITY:
						this.updateRating();
						break;

					case ActionTypes.ACTIVATE_DISADV:
					case ActionTypes.DEACTIVATE_DISADV:
					case ActionTypes.SET_DISADV_TIER:
						break;

					default:
						return true;
				}
			}
			this.emitChange();
			return true;
		});
	}

	getRating() {
		return this.showRating;
	}

	private updateRating() {
		this.showRating = !this.showRating;
	}
}

export const DisAdvStore = new DisAdvStoreStatic();
