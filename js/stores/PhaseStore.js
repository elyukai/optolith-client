import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import ActionTypes from '../constants/ActionTypes';

var _phase = 1;

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

		case ActionTypes.RECEIVE_HERO:
			_update(payload.phase);
			break;

		case ActionTypes.CREATE_NEW_HERO:
			_update(1);
			break;

		case ActionTypes.ASSIGN_RCP_ENTRIES:
			_update(2);
			break;

		default:
			return true;
	}

	PhaseStore.emitChange();

	return true;

});

export default PhaseStore;
