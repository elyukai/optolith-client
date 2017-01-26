import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import * as ActionTypes from '../constants/ActionTypes';

let _id: string | null = null;
let _session: string | null = null;
let _displayName = '';
let _name = '';

function _update(id: string, name: string, session: string | null = null) {
	_id = id;
	_session = session;
	_name = name;
}

function _updateDisplayName(displayName: string) {
	_displayName = displayName;
}

function _updateName(name: string) {
	_name = name;
}

function _reset() {
	_id = null;
	_session = null;
	_displayName = '';
	_name = '';
}

class AuthStoreStatic extends Store {

	getAll() {
		return {
			id: _id,
			session: _session,
			displayName: _displayName,
			name: _name
		};
	}

	getID() {
		return _id;
	}

	getName() {
		return _name;
	}

	getSessionID() {
		return _session;
	}
}

const AuthStore = new AuthStoreStatic(payload => {

	const { id, session, name } = payload;

	switch( payload.type ) {

		case ActionTypes.RECEIVE_ACCOUNT:
			_update(id, name, session);
			break;

		case ActionTypes.UPDATE_USERNAME:
			_updateName(name);
			break;

		case ActionTypes.LOGOUT_SUCCESS:
			_reset();
			break;

		// Testing purpose:
		case ActionTypes.RECEIVE_RAW_LISTS:
			_update('USER_4', 'Elytherion');
			break;

		default:
			return true;
	}

	AuthStore.emitChange();

	return true;

});

export default AuthStore;
