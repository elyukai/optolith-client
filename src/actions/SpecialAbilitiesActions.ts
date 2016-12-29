import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	filter(text: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.FILTER_SPECIALABILITIES,
			text
		});
	},
	sort(option: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SORT_SPECIALABILITIES,
			option
		});
	},
	changeView(option: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_SPECIALABILITY_VIEW,
			option
		});
	},
	addToList(args): void {
		args.actionType = ActionTypes.ACTIVATE_SPECIALABILITY;
		AppDispatcher.dispatch(args);
	},
	removeFromList(args): void {
		args.actionType = ActionTypes.DEACTIVATE_SPECIALABILITY;
		AppDispatcher.dispatch(args);
	},
	updateTier(id: string, tier: number, costs: number, sid: number | string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_SPECIALABILITY_TIER,
			id, tier, costs, sid
		});
	}
};
