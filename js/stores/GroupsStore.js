import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import ActionTypes from '../constants/ActionTypes';

var _requestsOpen = false;

var GroupsStore = Object.assign({}, EventEmitter.prototype, {

	emitChange: function() {
		this.emit('change');
	},

	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},

	getRequestsSlideinState: function() {
		return _requestsOpen;
	}

});

GroupsStore.dispatchToken = AppDispatcher.register( function( payload ) {

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
