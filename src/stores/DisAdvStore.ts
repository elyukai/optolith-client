import { ActivateDisAdvAction, DeactivateDisAdvAction, SetDisAdvTierAction, SwitchDisAdvRatingVisibilityAction } from '../actions/DisAdvActions';
import { ReceiveInitialDataAction } from '../actions/FileActions';
import { UndoTriggerActions } from '../actions/HistoryActions';
import * as ActionTypes from '../constants/ActionTypes';

import { ListStore } from './ListStore';
import { Store } from './Store';

type Action = SwitchDisAdvRatingVisibilityAction | ActivateDisAdvAction | DeactivateDisAdvAction | SetDisAdvTierAction | UndoTriggerActions | ReceiveInitialDataAction;

class DisAdvStoreStatic extends Store {
	private showRating = true;
	readonly dispatchToken: string;

	getRating() {
		return this.showRating;
	}

	private updateRating() {
		this.showRating = !this.showRating;
	}
}

export const DisAdvStore = new DisAdvStoreStatic();
