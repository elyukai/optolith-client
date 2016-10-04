var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes');

var HelpStore = Object.assign({}, EventEmitter.prototype, {

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

HelpStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {
			
		case 'TEST':
			break;
		
		default:
			return true;
	}
	
	HelpStore.emitChange();

	return true;

});

module.exports = HelpStore;
