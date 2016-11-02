import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import ActionTypes from '../constants/ActionTypes';

var _currentID = 'R_1';
var _races = {};

var _filter = '';
var _sortOrder = 'name';
var _showValues = true;

function _updateCurrentID(id) {
	_currentID = id;
}

function _updateFilterText(text) {
	_filter = text;
}

function _updateSortOrder(option) {
	_sortOrder = option;
}

function _changeValueVisibility() {
	_showValues = !_showValues;
}

var RaceStore = Object.assign({}, EventEmitter.prototype, {

	init: function(rawRaces) {
		for (let id in rawRaces) {
			let race = rawRaces[id];

			race.attr = race.attr.map(e => {
				e[1] = `ATTR_${e[1]}`;
				return e;
			});
			race.attr_sel[1] = race.attr_sel[1].map(k => `ATTR_${k}`);

			race.typ_cultures = race.typ_cultures.map(e => `C_${e}`);

			race.auto_adv = race.auto_adv.map(e => {
				e[0] = `ADV_${e[0]}`;
				return e;
			});
			race.imp_adv = race.imp_adv.map(e => {
				e[0] = `ADV_${e[0]}`;
				return e;
			});
			race.imp_dadv = race.imp_dadv.map(e => {
				e[0] = `DISADV_${e[0]}`;
				return e;
			});

			race.typ_adv = race.typ_adv.map(e => `ADV_${e}`);
			race.typ_dadv = race.typ_dadv.map(e => `DISADV_${e}`);
			race.untyp_adv = race.untyp_adv.map(e => `ADV_${e}`);
			race.untyp_dadv = race.untyp_dadv.map(e => `DISADV_${e}`);

			rawRaces[id] = race;
		}
		_races = rawRaces;
	},

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
		return _races[id];
	},

	getAll: function() {
		return _races;
	},

	getAllForView: function() {
		var races = [];
		if (_filter !== '') {
			let filter = _filter.toLowerCase();
			for (let id in _races) {
				if (_races[id].name.toLowerCase().match(filter)) {
					races.push(_races[id]);
				}
			}
		} else {
			for (let id in _races) {
				races.push(_races[id]);
			}
		}
		if (_sortOrder == 'name') {
			races.sort((a, b) => {
				if (a.name < b.name) {
					return -1;
				} else if (a.name > b.name) {
					return 1;
				} else {
					return 0;
				}
			});
		}
		else if (_sortOrder == 'ap') {
			races.sort((a, b) => {
				if (a.ap < b.ap) {
					return -1;
				} else if (a.ap > b.ap) {
					return 1;
				} else {
					if (a.name < b.name) {
						return -1;
					} else if (a.name > b.name) {
						return 1;
					} else {
						return 0;
					}
				}
			});
		}
		return races;
	},

	getCurrentID: function() {
		return _currentID;
	},

	getCurrent: function() {
		return this.get(this.getCurrentID());
	},

	getCurrentName: function() {
		return this.getCurrent() !== undefined ? this.getCurrent().name : null;
	},

	getNameByID: function(id) {
		return this.get(id) !== undefined ? this.get(id).name : null;
	},

	getFilter: function() {
		return _filter;
	},

	getSortOrder: function() {
		return _sortOrder;
	},

	areValuesVisible: function() {
		return _showValues;
	}

});

RaceStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {

		case ActionTypes.RECEIVE_HERO:
			_updateCurrentID(payload.r);
			break;

		case ActionTypes.SELECT_RACE:
			_updateCurrentID(payload.raceID);
			break;

		case ActionTypes.FILTER_RACES:
			_updateFilterText(payload.text);
			break;

		case ActionTypes.SORT_RACES:
			_updateSortOrder(payload.option);
			break;

		case ActionTypes.CHANGE_RACE_VALUE_VISIBILITY:
			_changeValueVisibility();
			break;

		case ActionTypes.RECEIVE_RAW_LISTS:
			RaceStore.init(payload.races);
			break;

		default:
			return true;
	}

	RaceStore.emitChange();

	return true;

});

export default RaceStore;
