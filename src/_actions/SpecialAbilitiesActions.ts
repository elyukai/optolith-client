import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	filter(text: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.FILTER_SPECIALABILITIES,
			text
		});
	},
	sort(option: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.SORT_SPECIALABILITIES,
			option
		});
	},
	changeView(option: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_SPECIALABILITY_VIEW,
			option
		});
	},
	addToList(args) {
		args.type = ActionTypes.ACTIVATE_SPECIALABILITY;
		AppDispatcher.dispatch(args);
	},
	removeFromList(args) {
		args.type = ActionTypes.DEACTIVATE_SPECIALABILITY;
		AppDispatcher.dispatch(args);
	},
	updateTier(id: string, tier: number, cost: number, sid: number | string) {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_SPECIALABILITY_TIER,
			id, tier, cost, sid
		});
	}
};
