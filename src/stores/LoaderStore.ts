import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ListStore from './ListStore';
import Store from './Store';

type Action = ReceiveDataTablesAction | RequestHeroAvatarAction | ReceiveHeroAvatarAction | RequestHeroDataAction | ReceiveHeroDataAction | RequestHerolistAction | ReceiveHerolistAction | RequestLoginAction | ReceiveLoginAction | RequestLogoutAction | ReceiveLogoutAction | RequestNewUsernameAction | ReceiveNewUsernameAction | RequestUserDeletionAction | ReceiveUserDeletionAction | RequestRegistrationAction | ReceiveRegistrationAction;

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
		case ActionTypes.REQUEST_HERO_AVATAR:
		case ActionTypes.REQUEST_HERO_DATA:
		case ActionTypes.REQUEST_HEROLIST:
		case ActionTypes.REQUEST_LOGIN:
		case ActionTypes.REQUEST_LOGOUT:
		case ActionTypes.REQUEST_NEW_USERNAME:
		case ActionTypes.REQUEST_REGISTRATION:
		case ActionTypes.REQUEST_USER_DELETION:
			_startLoading();
			break;

		case ActionTypes.RECEIVE_DATA_TABLES:
			AppDispatcher.waitFor([ListStore.dispatchToken]);
			_stopLoading();
			break;

		case ActionTypes.RECEIVE_HERO_AVATAR:
		case ActionTypes.RECEIVE_HERO_DATA:
		case ActionTypes.RECEIVE_HEROLIST:
		case ActionTypes.RECEIVE_LOGIN:
		case ActionTypes.RECEIVE_LOGOUT:
		case ActionTypes.RECEIVE_NEW_USERNAME:
		case ActionTypes.RECEIVE_REGISTRATION:
		case ActionTypes.RECEIVE_USER_DELETION:
			_stopLoading();
			break;

		default:
			return true;
	}

	LoaderStore.emitChange();
	return true;
});

export default LoaderStore;
