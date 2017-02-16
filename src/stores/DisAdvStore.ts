import * as ActionTypes from '../constants/ActionTypes';
import Store from './Store';

type Action = ReceiveHeroDataAction | SwitchDisAdvRatingVisibilityAction | ActivateDisAdvAction | DeactivateDisAdvAction | SetDisAdvTierAction | UndoTriggerActions;

let _showRating = true;

function _updateRating() {
	_showRating = !_showRating;
}

function _updateAll(disadv: { ratingVisible: boolean; }) {
	_showRating = disadv.ratingVisible;
}

class DisAdvStoreStatic extends Store {
	getRating() {
		return _showRating;
	}

}

const DisAdvStore = new DisAdvStoreStatic((action: Action) => {
	if (action.undo) {
		switch(action.type) {
			case ActionTypes.ACTIVATE_DISADV:
			case ActionTypes.ACTIVATE_SPECIALABILITY:
			case ActionTypes.DEACTIVATE_DISADV:
			case ActionTypes.DEACTIVATE_SPECIALABILITY:
				break;

			default:
				return true;
		}
	}
	else {
		switch(action.type) {
			case ActionTypes.RECEIVE_HERO_DATA:
				_updateAll(action.payload.data.disadv);
				break;

			case ActionTypes.SWITCH_DISADV_RATING_VISIBILITY:
				_updateRating();
				break;

			case ActionTypes.ACTIVATE_DISADV:
			case ActionTypes.DEACTIVATE_DISADV:
			case ActionTypes.SET_DISADV_TIER:
				break;

			default:
				return true;
		}
	}

	DisAdvStore.emitChange();
	return true;
});

export default DisAdvStore;
