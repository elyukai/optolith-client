import AppDispatcher from '../dispatcher/AppDispatcher';
import EventEmitter from 'events';
import ActionTypes from '../constants/ActionTypes';

// EL = Experience Level

var _el = {
	EL_1: {
		id: 'EL_1',
		name: 'Unerfahren',
		ap: 900,
		max_attr: 12,
		max_skill: 10,
		max_combattech: 8,
		max_attrsum: 95,
		max_spells_liturgies: 8,
		max_unfamiliar_spells: 0
	},
	EL_2: {
		id: 'EL_2',
		name: 'Durchschnittlich',
		ap: 1000,
		max_attr: 13,
		max_skill: 10,
		max_combattech: 10,
		max_attrsum: 98,
		max_spells_liturgies: 10,
		max_unfamiliar_spells: 1
	},
	EL_3: {
		id: 'EL_3',
		name: 'Erfahren',
		ap: 1100,
		max_attr: 14,
		max_skill: 10,
		max_combattech: 12,
		max_attrsum: 100,
		max_spells_liturgies: 12,
		max_unfamiliar_spells: 2
	},
	EL_4: {
		id: 'EL_4',
		name: 'Kompetent',
		ap: 1200,
		max_attr: 15,
		max_skill: 13,
		max_combattech: 14,
		max_attrsum: 102,
		max_spells_liturgies: 14,
		max_unfamiliar_spells: 3
	},
	EL_5: {
		id: 'EL_5',
		name: 'Meisterlich',
		ap: 1400,
		max_attr: 16,
		max_skill: 16,
		max_combattech: 16,
		max_attrsum: 105,
		max_spells_liturgies: 16,
		max_unfamiliar_spells: 4
	},
	EL_6: {
		id: 'EL_6',
		name: 'Brilliant',
		ap: 1700,
		max_attr: 17,
		max_skill: 19,
		max_combattech: 18,
		max_attrsum: 109,
		max_spells_liturgies: 18,
		max_unfamiliar_spells: 5
	},
	EL_7: {
		id: 'EL_7',
		name: 'Legendär',
		ap: 2100,
		max_attr: 18,
		max_skill: 20,
		max_combattech: 20,
		max_attrsum: 114,
		max_spells_liturgies: 20,
		max_unfamiliar_spells: 6
	}
};

var _start = 'EL_4';

function _update(el) {
	_start = el;
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
			_update('EL_1');
			break;

		default:
			return true;
	}

	ELStore.emitChange();

	return true;

});

export default ELStore;
