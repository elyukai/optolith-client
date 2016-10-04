import AppDispatcher from '../../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import RaceStore from './RaceStore';
import ActionTypes from '../../constants/ActionTypes';

var _currentID = 'C_8';
var _cultures = {};

var _filter = '';
var _sortOrder = 'name';
var _showValues = true;
var _showAll = false;
var _package = true;
var _literacy = false;

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

function _changeView(view) {
	_showAll = view;
}

function _changePackage() {
	_package = !_package;
}

function _changeLiteracy() {
	_literacy = !_literacy;
}

var CultureStore = Object.assign({}, EventEmitter.prototype, {

	init: function(rawCultures) {
		for (let id in rawCultures) {
			let obj = rawCultures[id];

			obj.typ_prof = obj.typ_prof.map(e => `P_${e}`);
			obj.typ_adv = obj.typ_adv.map(e => `ADV_${e}`);
			obj.typ_dadv = obj.typ_dadv.map(e => `DISADV_${e}`);
			obj.untyp_adv = obj.untyp_adv.map(e => `ADV_${e}`);
			obj.untyp_dadv = obj.untyp_dadv.map(e => `DISADV_${e}`);
			obj.typ_talents = obj.typ_talents.map(e => `TAL_${e}`);
			obj.untyp_talents = obj.untyp_talents.map(e => `TAL_${e}`);
			obj.talents = obj.talents.map(e => {
				e[0] = `TAL_${e[0]}`;
				return e;
			});

			rawCultures[id] = obj;
		}
		_cultures = rawCultures;
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
		return _cultures[id];
	},

	getAll: function() {
		return _cultures;
	},

	getAllForView: function() {
		var cultures = [];
		let raceID = RaceStore.getCurrentID();
		if (raceID !== null && !_showAll && _filter !== '') {
			let race = RaceStore.getCurrent();
			let filter = _filter.toLowerCase();
			for (let id in _cultures) {
				if (_cultures[id].name.toLowerCase().match(filter) && race.typ_cultures.indexOf(id) > -1) {
					cultures.push(_cultures[id]);
				}
			}
		} else if (_filter !== '') {
			let filter = _filter.toLowerCase();
			for (let id in _cultures) {
				if (_cultures[id].name.toLowerCase().match(filter)) {
					cultures.push(_cultures[id]);
				}
			}
		} else if (raceID !== null && !_showAll) {
			let race = RaceStore.getCurrent();
			for (let id in _cultures) {
				if (race.typ_cultures.indexOf(id) > -1) {
					cultures.push(_cultures[id]);
				}
			}
		} else {
			for (let id in _cultures) {
				cultures.push(_cultures[id]);
			}
		}
		if (_sortOrder == 'name') {
			cultures.sort((a, b) => {
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
			cultures.sort((a, b) => {
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
		return cultures;
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
	},

	areAllVisible: function() {
		return _showAll;
	},

	isPackageUsed: function() {
		return _package;
	},

	isLiteracyUsed: function() {
		return _literacy;
	}

});

CultureStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {

		case ActionTypes.SELECT_RACE:
			_updateCurrentID(null);
			break;

		case ActionTypes.SELECT_CULTURE:
			_updateCurrentID(payload.cultureID);
			break;

		case ActionTypes.FILTER_CULTURES:
			_updateFilterText(payload.text);
			break;

		case ActionTypes.SORT_CULTURES:
			_updateSortOrder(payload.option);
			break;

		case ActionTypes.CHANGE_CULTURE_VALUE_VISIBILITY:
			_changeValueVisibility();
			break;

		case ActionTypes.CHANGE_CULTURE_VIEW:
			_changeView(payload.view);
			break;

		case ActionTypes.CHANGE_CULTURE_PACKAGE:
			_changePackage();
			break;

		case ActionTypes.CHANGE_CULTURE_LITERACY:
			_changeLiteracy();
			break;

		case ActionTypes.RECEIVE_RAW_LISTS:
			CultureStore.init(payload.cultures);
			break;

		default:
			return true;
	}

	CultureStore.emitChange();

	return true;

});

export default CultureStore;
