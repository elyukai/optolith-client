import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';

class GroupsStoreStatic extends Store {
	private requestsOpen = false;
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			// switch( action.type ) {
			// 	case ActionTypes.SHOW_MASTER_REQUESTED_LIST:
			// 		_requestsOpen = true;
			// 		break;

			// 	case ActionTypes.HIDE_MASTER_REQUESTED_LIST:
			// 		_requestsOpen = false;
			// 		break;

			// 	default:
			// 		return true;
			// }
			this.emitChange();
			return true;
		});
	}

	getRequestsSlideinState() {
		return this.requestsOpen;
	}

}

const GroupsStore = new GroupsStoreStatic();

export default GroupsStore;
