import AppDispatcher from '../../dispatcher/AppDispatcher';
import CultureStore from './CultureStore';
import { EventEmitter } from 'events';
import ActionTypes from '../../constants/ActionTypes';

var _currentID = 'P_16';
var _professions = {};

var _filter = '';
var _sortOrder = 'name';
var _showAll = false;

function _updateCurrentID(id) {
	_currentID = id;
}

function _updateFilterText(text) {
	_filter = text;
}

function _updateSortOrder(option) {
	_sortOrder = option;
}

function _changeView(view) {
	_showAll = view;
}

var ProfessionStore = Object.assign({}, EventEmitter.prototype, {

	init: function(rawProfessions) {
		for (let id in rawProfessions) {
			let obj = rawProfessions[id];

			obj.sa = obj.sa.map(e => {
				e[0] = `SA_${e[0]}`;
				return e;
			});
			obj.combattech = obj.combattech.map(e => {
				e[0] = `CT_${e[0]}`;
				return e;
			});
			obj.talents = obj.talents.map(e => {
				e[0] = `TAL_${e[0]}`;
				return e;
			});
			obj.spells = obj.spells.map(e => {
				e[0] = `SPELL_${e[0]}`;
				return e;
			});
			obj.chants = obj.chants.map(e => {
				e[0] = `LITURGY_${e[0]}`;
				return e;
			});

			obj.sel = obj.sel.map(e => do {
				if (e[0] === 'ct') {
					e[3] = e[3].split(',').map(e => `CT_${e}`);
					e;
				} else if (e[0] === 'cantrips') {
					e[2] = e[2].split(',').map(e => parseInt(e));
					e;
				} else e;
			});

			obj.typ_adv = obj.typ_adv.map(e => `ADV_${e}`);
			obj.typ_dadv = obj.typ_dadv.map(e => `DISADV_${e}`);
			obj.untyp_adv = obj.untyp_adv.map(e => `ADV_${e}`);
			obj.untyp_dadv = obj.untyp_dadv.map(e => `DISADV_${e}`);
			obj.vars = obj.vars.map(e => `PV_${e}`);

			rawProfessions[id] = obj;
		}
		_professions = rawProfessions;
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
		return _professions[id];
	},

	getAll: function() {
		return _professions;
	},

	getAllForView: function() {
		var array = [{
			id: 'P_0',
			name: 'Eigene Profession',
			subname: '',
			ap: 0,
			vars: []
		}];
		for (let id in _professions) {
			array.push(_professions[id]);
		}
		if (_filter !== '') {
			let filter = _filter.toLowerCase();
			array = array.filter(obj => obj.name.toLowerCase().match(filter) || obj.name.toLowerCase().match(filter));
		}
		let cultureID = CultureStore.getCurrentID();
		if (cultureID !== null && !_showAll) {
			let currentCulture = CultureStore.getCurrent();
			array = array.filter(obj => currentCulture.typ_prof.indexOf(obj.id) > -1 || obj.id === 'P_0');
		}
		if (_sortOrder == 'name') {
			array.sort((a, b) => {
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
			array.sort((a, b) => {
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
		return array;
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

	areAllVisible: function() {
		return _showAll;
	}

});

ProfessionStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {

		case ActionTypes.SELECT_RACE:
		case ActionTypes.SELECT_CULTURE:
			_updateCurrentID(null);
			break;

		case ActionTypes.SELECT_PROFESSION:
			_updateCurrentID(payload.professionID);
			break;

		case ActionTypes.FILTER_PROFESSIONS:
			_updateFilterText(payload.text);
			break;

		case ActionTypes.SORT_PROFESSIONS:
			_updateSortOrder(payload.option);
			break;

		case ActionTypes.CHANGE_PROFESSION_VIEW:
			_changeView(payload.view);
			break;

		case ActionTypes.RECEIVE_RAW_LISTS:
			ProfessionStore.init(payload.professions);
			break;

		default:
			return true;
	}

	ProfessionStore.emitChange();

	return true;

});

export default ProfessionStore;
