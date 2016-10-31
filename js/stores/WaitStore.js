import AppDispatcher from '../../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import ActionTypes from '../../constants/ActionTypes';

var _waiting = true;

function startWaiting() {
	_waiting = true;
}

function stopWaiting() {
	_waiting = false;
}

var WaitStore = Object.assign({}, EventEmitter.prototype, {
	
	emitChange: function() {
		this.emit('change');
	},

	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},
	
	getWaiting: function() {
		return _waiting;
	}
	
});

WaitStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {
		
		case ActionTypes.WAIT_START:
			startWaiting();
			break;

		case ActionTypes.WAIT_END:
		case ActionTypes.REGISTRATION_SUCCESS:
		case ActionTypes.RECEIVE_ACCOUNT:
		case ActionTypes.LOGOUT_SUCCESS:
		case ActionTypes.CLEAR_ACCOUNT:
		case ActionTypes.UPDATE_USERNAME:
		case ActionTypes.RECEIVE_RAW_HEROES:
		case ActionTypes.CREATE_HERO:
		case ActionTypes.RECEIVE_HERO:
		case ActionTypes.RECEIVE_RAW_LISTS:
		case ActionTypes.SAVE_HERO_SUCCESS:
		case ActionTypes.UPDATE_HERO_AVATAR:
			stopWaiting();
			break;
			
		default:
			return true;
	}
	
	WaitStore.emitChange();

	return true;

});

export default WaitStore;
