import * as ActionTypes from '../constants/ActionTypes';
import Store from './Store';

type Action = ReceiveLoginAction | ReceiveNewUsernameAction | ReceiveLogoutAction | ReceiveDataTablesAction;

let _name = '';
let _displayName = '';
let _email = '';
let _sessionToken: string | null = null;

function _update(name: string, displayName: string, email: string, sessionToken: string | null = null) {
	_name = name;
	_displayName = displayName;
	_email = email;
	_sessionToken = sessionToken;
}

function _updateName(name: string) {
	_name = name;
}

function _reset() {
	_name = '';
	_displayName = '';
	_email = '';
	_sessionToken = null;
}

class AuthStoreStatic extends Store {

	getAll() {
		return {
			name: _name,
			displayName: _displayName,
			sessionToken: _sessionToken,
			email: _email,
		};
	}

	getName() {
		return _name;
	}

	getDisplayName() {
		return _displayName;
	}

	getToken() {
		return _sessionToken;
	}
}

const AuthStore = new AuthStoreStatic((action: Action) => {
	switch(action.type) {
		// Testing purpose:
		case ActionTypes.RECEIVE_DATA_TABLES:
			_update('Elytherion', 'Elytherion', 'lukas.obermann@live.de');
			break;

		case ActionTypes.RECEIVE_LOGIN:
			_update(action.payload.name, action.payload.displayName, action.payload.email, action.payload.sessionToken);
			break;

		case ActionTypes.RECEIVE_NEW_USERNAME:
			_updateName(name);
			break;

		case ActionTypes.RECEIVE_LOGOUT:
			_reset();
			break;

		default:
			return true;
	}

	AuthStore.emitChange();
	return true;
});

export default AuthStore;
