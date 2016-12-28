import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import ActionTypes from '../constants/ActionTypes';

// EL = Experience Level

var _el = {};
var _start = 'EL_0';

function _init(el) {
	_el = el;
}

function _update(el) {
	_start = el;
}

function _clear() {
	_start = 'EL_0';
}

class _ELStore extends Store {

	get(id) {
		return _el[id];
	}

	getAll() {
		return _el;
	}

	getStartID() {
		return _start;
	}

	getStart() {
		return this.get(this.getStartID());
	}

}

const ELStore = new _ELStore();

ELStore.dispatchToken = AppDispatcher.register(payload => {

	switch( payload.actionType ) {

		case ActionTypes.CREATE_NEW_HERO:
			_update(payload.el);
			break;

		case ActionTypes.CLEAR_HERO:
			_clear();
			break;

		case ActionTypes.RECEIVE_HERO:
			_update(payload.el);
			break;

		case ActionTypes.RECEIVE_RAW_LISTS:
			_init(payload.el);
			break;

		default:
			return true;
	}

	ELStore.emitChange();

	return true;

});

export default ELStore;
