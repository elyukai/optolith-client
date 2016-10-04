var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/ActionTypes');

var SpecialAbilitiesStore = Object.assign({}, EventEmitter.prototype, {

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

SpecialAbilitiesStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {
			
		case 'TEST':
			break;
		
		default:
			return true;
	}
	
	SpecialAbilitiesStore.emitChange();

	return true;

});

module.exports = SpecialAbilitiesStore;
