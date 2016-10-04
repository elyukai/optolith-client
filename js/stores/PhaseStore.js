import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import ActionTypes from '../constants/ActionTypes';

var _phase = 4;

function _update(phase) {
	_phase = phase;
}

function _increase() {
	_phase++;
}

var PhaseStore = Object.assign({}, EventEmitter.prototype, {

	emitChange: function() {
		this.emit('change');
	},

	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},

	get: function() {
		return _phase;
	}

});

PhaseStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {

		case ActionTypes.CREATE_HERO:
		case ActionTypes.CLEAR_HERO:
			_update(1);
			break;

		case ActionTypes.ASSIGN_RCP_ENTRIES:
			_update(2);
			break;

		case ActionTypes.INCREASE_PHASE:
			_increase();
			break;

		case ActionTypes.RESET_PHASE:
			_update(1);
			break;

		default:
			return true;
	}

	PhaseStore.emitChange();

	return true;

});

export default PhaseStore;
