import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	filter(text: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.FILTER_DISADV,
			text
		});
	},
	changeRating(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.CHANGE_DISADV_RATING
		});
	},
	addToList(args): void {
		args.type = ActionTypes.ACTIVATE_DISADV;
		AppDispatcher.dispatch(args);
	},
	removeFromList(args): void {
		args.type = ActionTypes.DEACTIVATE_DISADV;
		AppDispatcher.dispatch(args);
	},
	updateTier(id: string, tier: number, cost: number, sid: number | string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_DISADV_TIER,
			id, tier, cost, sid
		});
	}
};
