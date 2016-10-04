import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import ActionTypes from '../constants/ActionTypes';
import HeroesStore from './core/HeroesStore';

var _id = 'h0';
var _name = '';
var _group = 0;

function create(id, name) {
	_id = id;
	_name = name;
	_group = 1;
}

function receiveNew(id) {
	let core = HeroesStore.getHeroByID(id);
	_id = id;
	_name = core.name;
	_group = parseInt(core.group);
}

function updateName(name) {
	_name = name;
}

function reset() {
	_id = 'h0';
	_name = '';
	_group = 0;
}

var HeroStore = Object.assign({}, EventEmitter.prototype, {

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
			name: _name,
			group: _group
		};
	},

	getID: function() {
		return _id;
	},

	getName: function() {
		return _name;
	},

	getGroup: function() {
		return _group;
	}

});

HeroStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {

		case ActionTypes.CREATE_HERO:
			create(payload.heroid, payload.heroname);
			break;

		case ActionTypes.RECEIVE_HERO:
			receiveNew(payload.id);
			break;

		case ActionTypes.UPDATE_HERONAME:
			updateName(payload.heroname);
			break;

		case ActionTypes.CLEAR_HERO:
			reset();
			break;

		default:
			return true;
	}

	HeroStore.emitChange();

	return true;

});

export default HeroStore;
