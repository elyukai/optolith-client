import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ListStore from './ListStore';
import Store from './Store';

type Action = ReceiveDataTablesAction;

let _loading = true;
let _loadingText = 'Lädt Datentabellen';

function _startLoading(text = '') {
	_loading = true;
	_loadingText = text;
}

function _stopLoading() {
	_loading = false;
	_loadingText = '';
}

class LoaderStoreStatic extends Store {

	isLoading() {
		return _loading;
	}

	getLoadingText() {
		return _loadingText;
	}

}

const LoaderStore = new LoaderStoreStatic((action: Action) => {
	switch(action.type) {
		// case ActionTypes.WAIT_START:
		// 	_startLoading(action.text);
		// 	break;

		case ActionTypes.RECEIVE_DATA_TABLES:
			AppDispatcher.waitFor([ListStore.dispatchToken]);
			_stopLoading();
			break;

		// case ActionTypes.WAIT_END:
		// case ActionTypes.REGISTRATION_SUCCESS:
		// case ActionTypes.RECEIVE_ACCOUNT:
		// case ActionTypes.LOGOUT_SUCCESS:
		// case ActionTypes.CLEAR_ACCOUNT:
		// case ActionTypes.UPDATE_USERNAME:
		// case ActionTypes.RECEIVE_RAW_HEROES:
		// case ActionTypes.CREATE_HERO:
		// case ActionTypes.RECEIVE_HERO:
		// case ActionTypes.SAVE_HERO_SUCCESS:
		// case ActionTypes.UPDATE_HERO_AVATAR:
		// 	_stopLoading();
		// 	break;

		default:
			return true;
	}

	LoaderStore.emitChange();
	return true;
});

export default LoaderStore;
