import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import ActionTypes from '../constants/ActionTypes';

var _requestsOpen = false;

class _GroupsStore extends Store {

	getRequestsSlideinState() {
		return _requestsOpen;
	}

}

const GroupsStore = new _GroupsStore();

GroupsStore.dispatchToken = AppDispatcher.register(payload => {

	switch( payload.actionType ) {
		case ActionTypes.SHOW_MASTER_REQUESTED_LIST:
			_requestsOpen = true;
			break;

		case ActionTypes.HIDE_MASTER_REQUESTED_LIST:
			_requestsOpen = false;
			break;

		default:
			return true;
	}

	GroupsStore.emitChange();

	return true;

});

export default GroupsStore;
