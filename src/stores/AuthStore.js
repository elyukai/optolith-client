import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import ActionTypes from '../constants/ActionTypes';

var _id = null;
var _session = null;
var _name = '';

function _update(id, name, session = null) {
	_id = id;
	_session = session;
	_name = name;
}

function _updateName(name) {
	_name = name;
}

function _reset() {
	_id = null;
	_name = '';
}

class _AuthStore extends Store {
	
	getAll() {
		return {
			id: _id,
			session: _session,
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

const AuthStore = new _AuthStore();

AuthStore.dispatchToken = AppDispatcher.register(payload => {

	const { id, session, name } = payload;

	switch( payload.actionType ) {
			
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
			_update(4, 'Elytherion');
			break;
			
		default:
			return true;
	}
	
	AuthStore.emitChange();

	return true;

});

export default AuthStore;
