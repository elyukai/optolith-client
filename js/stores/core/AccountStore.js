import AppDispatcher from '../../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import ActionTypes from '../../constants/ActionTypes';

var _id = 4;
var _name = 'Elytherion';

function updateName(name) {
	_name = name;
}

function updateAll(id, name) {
	_id = id;
	_name = name;
}

function reset() {
	_id = 0;
	_name = '';
}

var AccountStore = Object.assign({}, EventEmitter.prototype, {
	
	emitChange: function() {
		this.emit('change');
	},

	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},
	
	getAll: function() {
		return {
			id: _id,
			name: _name
		};
	},
	
	getID: function() {
		return _id;
	},
	
	getName: function() {
		return _name;
	}

});

AccountStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {
			
		case ActionTypes.RECEIVE_ACCOUNT:
			updateAll(payload.userid, payload.username);
			break;
			
		case ActionTypes.UPDATE_USERNAME:
			updateName(payload.username);
			break;

		case ActionTypes.CLEAR_ACCOUNT:
			reset();
			break;
			
		default:
			return true;
	}
	
	AccountStore.emitChange();

	return true;

});

export default AccountStore;
