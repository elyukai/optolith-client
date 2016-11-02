import AppDispatcher from '../dispatcher/AppDispatcher';
import EventEmitter from 'events';
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

var ELStore = Object.assign({}, EventEmitter.prototype, {

	emitChange: function() {
		this.emit('change');
	},

	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},

	get: function(id) {
		return _el[id];
	},

	getAll: function() {
		return _el;
	},

	getStartID: function() {
		return _start;
	},

	getStart: function() {
		return this.get(this.getStartID());
	}

});

ELStore.dispatchToken = AppDispatcher.register( function( payload ) {

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
