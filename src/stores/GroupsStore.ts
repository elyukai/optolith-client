import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import * as ActionTypes from '../constants/ActionTypes';

let _requestsOpen = false;

class GroupsStoreStatic extends Store {

	getRequestsSlideinState() {
		return _requestsOpen;
	}

}

const GroupsStore = new GroupsStoreStatic(action => {
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

	// GroupsStore.emitChange();

	return true;

});

export default GroupsStore;
