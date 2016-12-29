import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	filter(text: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.FILTER_DISADV,
			text
		});
	},
	changeRating(): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.CHANGE_DISADV_RATING
		});
	},
	addToList(args): void {
		args.actionType = ActionTypes.ACTIVATE_DISADV;
		AppDispatcher.dispatch(args);
	},
	removeFromList(args): void {
		args.actionType = ActionTypes.DEACTIVATE_DISADV;
		AppDispatcher.dispatch(args);
	},
	updateTier(id: string, tier: number, costs: number, sid: number | string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_DISADV_TIER,
			id, tier, costs, sid
		});
	}
};
