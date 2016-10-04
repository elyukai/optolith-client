var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes');

var InventoryStore = Object.assign({}, EventEmitter.prototype, {

	emitChange: function() {
		this.emit('change');
	},

	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	}
});

InventoryStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {
			
		case 'TEST':
			break;
		
		default:
			return true;
	}
	
	InventoryStore.emitChange();

	return true;

});

module.exports = InventoryStore;
