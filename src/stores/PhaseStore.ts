import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import ActionTypes from '../constants/ActionTypes';

var _phase = 1;

function _update(phase) {
	_phase = phase;
}

class _PhaseStore extends Store {

	get() {
		return _phase;
	}

}

const PhaseStore = new _PhaseStore();

PhaseStore.dispatchToken = AppDispatcher.register(payload => {

	switch( payload.actionType ) {

		case ActionTypes.RECEIVE_HERO:
			_update(payload.phase);
			break;

		case ActionTypes.CREATE_NEW_HERO:
			_update(1);
			break;

		case ActionTypes.ASSIGN_RCP_ENTRIES:
			_update(2);
			break;

		case ActionTypes.FINALIZE_CHARACTER_CREATION:
			_update(3);
			break;

		default:
			return true;
	}

	PhaseStore.emitChange();

	return true;

});

export default PhaseStore;
