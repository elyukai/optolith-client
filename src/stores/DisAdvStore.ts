import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import { default as ListStore } from './ListStore';
import Store from './Store';

type Action = ReceiveHeroDataAction | SwitchDisAdvRatingVisibilityAction | ActivateDisAdvAction | DeactivateDisAdvAction | SetDisAdvTierAction | UndoTriggerActions;

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
						break;

					default:
						return true;
				}
			}
			else {
				switch (action.type) {
					case ActionTypes.RECEIVE_HERO_DATA:
						this.updateAll(action.payload.data.disadv);
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

	private updateAll(disadv: { ratingVisible: boolean; }) {
		this.showRating = disadv.ratingVisible;
	}
}

const DisAdvStore = new DisAdvStoreStatic();

export default DisAdvStore;
