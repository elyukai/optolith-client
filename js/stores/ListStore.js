import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import CultureStore from './CultureStore';
import ProfessionStore from './ProfessionStore';
import ProfessionVariantStore from './ProfessionVariantStore';
import RaceStore from './RaceStore';
import ActionTypes from '../constants/ActionTypes';
import Categories from '../constants/Categories';

var _list = {};

function _activate(id) {
	_list[id].active = true;
}

function _deactivate(id) {
	_list[id].active = false;
}

function _addPoint(id) {
	_list[id].value++;
}

function _removePoint(id) {
	_list[id].value--;
}

function _setValue(id, value) {
	_list[id].value = value;
}

function _addSR(id, amount) {
	_list[id].value += amount;
}

function _addDependencies(reqs, sel) {
	reqs.forEach(req => {
		let [ id, value, option ] = req;
		if (id === 'auto_req' || option === 'TAL_GR_2') return;
		else if (id === 'ATTR_PRIMARY') {
			id = this.getPrimaryAttrID(option);
			_list[id].dependencies.push(value);
		}
		else {
			let sid;
			if (typeof option !== 'undefined') {
				if (Number.isNaN(parseInt(option))) {
					if (option === 'sel') {
						sid = sel;
					} else {
						sid = option;
					}
				} else {
					sid = parseInt(option);
				}
			} else {
				sid = value;
			}
			_list[id].dependencies.push(sid);
		}
	});
}

function _removeDependencies(reqs, sel) {
	reqs.forEach(req => {
		let [ id, value, option ] = req;
		if (id === 'auto_req' || option === 'TAL_GR_2') return;
		else if (id === 'ATTR_PRIMARY') {
			id = this.getPrimaryAttrID(option);
			for (let i = 0; i < _list[id].dependencies.length; i++)
				if (_list[id].dependencies[i] === value) {
					_list[id].dependencies.splice(i, 1);
					break;
				}
		}
		else {
			let sid;
			if (typeof option !== 'undefined') {
				if (Number.isNaN(parseInt(option))) {
					if (option === 'sel') {
						sid = sel;
					} else {
						sid = option;
					}
				} else {
					sid = parseInt(option);
				}
			} else {
				sid = value;
			}
			for (let i = 0; i < _list[id].dependencies.length; i++)
				if (_list[id].dependencies[i] === sid) {
					_list[id].dependencies.splice(i, 1);
					break;
				}
		}
	});
}



function _init({ attributes, talents, combattech, spells, liturgies }) {
	for (let id in attributes) {
		_list[id] = attributes[id];
		_list[id].category = Categories.ATTRIBUTES;
		_list[id].dependencies = [];
	}
	for (let id in talents) {
		_list[id] = talents[id];
		_list[id].value = 0;
		_list[id].category = Categories.TALENTS;
		_list[id].dependencies = [];
	}
	for (let id in combattech) {
		_list[id] = combattech[id];
		_list[id].value = 6;
		_list[id].category = Categories.COMBAT_TECHNIQUES;
		_list[id].dependencies = [];
	}
	for (let id in spells) {
		_list[id] = spells[id];
		_list[id].value = 0;
		_list[id].check = _list[id].check.map((e,i) => i < 3 ? `ATTR_${e}` : e);
		_list[id].active = false;
		_list[id].category = Categories.SPELLS;
		_list[id].dependencies = [];
	}
	for (let id in liturgies) {
		_list[id] = liturgies[id];
		_list[id].value = 0;
		_list[id].check = _list[id].check.map((e,i) => i < 3 ? `ATTR_${e}` : e);
		_list[id].active = false;
		_list[id].category = Categories.CHANTS;
		_list[id].dependencies = [];
	}
}

function _updateAll({ attr, talents, ct, spells, chants }) {
	attr.values.forEach(e => {
		let [ id, value, mod ] = e;
		_setValue(id, value);
		_list[id].mod = mod;
	});
	talents.active.forEach(e => {
		_setValue(...e);
	});
	ct.active.forEach(e => {
		_setValue(...e);
	});
	spells.active.forEach(e => {
		_activate(e[0]);
		if (_list[e[0]].gr !== 5) {
			_setValue(...e);
		}
	});
	chants.active.forEach(e => {
		_activate(e[0]);
		if (_list[e[0]].gr !== 3) {
			_setValue(...e);
		}
	});
}

function _assignRCP(selections) {
	let currentRace = RaceStore.getCurrent() || {};
	_list[selections.attrSel].mod = currentRace.attr_sel[0] || 0;

	var addSRList = [];
	var addSRActivateList = [];

	if (selections.useCulturePackage) {
		addSRList.push(...CultureStore.getCurrent().talents);
	}
	if ([null, 'P_0'].indexOf(ProfessionStore.getCurrentID()) === -1) {
		addSRList.push(...ProfessionStore.getCurrent().talents);
		addSRList.push(...ProfessionStore.getCurrent().combattech);
		addSRActivateList.push(...ProfessionStore.getCurrent().spells);
		addSRActivateList.push(...ProfessionStore.getCurrent().chants);
	}
	if (ProfessionVariantStore.getCurrentID() !== null) {
		addSRList.push(...ProfessionVariantStore.getCurrent().talents);
		addSRList.push(...ProfessionVariantStore.getCurrent().combattech);
	}

	Array.from(selections.combattech).forEach(e => {
		addSRList.push([e, selections.map.get('ct')[1]]);
	});

	Array.from(selections.cantrips).forEach(e => {
		addSRList.push([e, null]);
	});

	Array.from(selections.curses).forEach(e => {
		addSRList.push(e);
	});

	addSRList.forEach(e => _addSR(...e));
	addSRActivateList.forEach(e => {
		_activate(e[0]);
		if (e[1] !== null) {
			_setValue(e[0], e[1]);
		}
	});
}

function _clear() {
	for (let id in _list) {
		let e = _list[id];
		switch (e.category) {
			case Categories.ATTRIBUTES:
				e.value = 8;
				e.value = 0;
				e.dependencies = [];
				break;
			case Categories.TALENTS:
				e.value = 0;
				e.dependencies = [];
				break;
			case Categories.COMBAT_TECHNIQUES:
				e.value = 6;
				e.dependencies = [];
				break;
			case Categories.SPELLS:
				e.active = false;
				e.value = 0;
				e.dependencies = [];
				break;
			case Categories.CHANTS:
				e.active = false;
				e.value = 0;
				e.dependencies = [];
				break;
		}
	}
}
	
var ListStore = Object.assign({}, EventEmitter.prototype, {
	
	init: function() {},
	
	emitChange: function() {
		this.emit('change');
	},

	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},

	addDependencies: function(...props) {
		_addDependencies(...props);
	},

	removeDependencies: function(...props) {
		_removeDependencies(...props);
	},

	get: function(id) {
		return _list[id];
	},

	getPrimaryAttrID: function(type) {
		var attr;
		if (type === 1 && this.get('SA_86')) {
			switch (this.get('SA_86').sid) {
				case 1:
					attr = 'ATTR_2';
					break;
				case 2:
					attr = 'ATTR_4';
					break;
				case 3:
					attr = 'ATTR_3';
					break;
			}
		} else if (type === 2 && this.get('SA_102')) {
			switch (this.get('SA_102').sid) {
				case 1:
					attr = 'ATTR_2';
					break;
				case 2:
					attr = 'ATTR_1';
					break;
				case 3:
					attr = 'ATTR_1';
					break;
				case 4:
					attr = 'ATTR_2';
					break;
				case 5:
					attr = 'ATTR_3';
					break;
				case 6:
					attr = 'ATTR_3';
					break;
			}
		}
		return attr || 'ATTR_0';
	},

	getPrimaryAttr: function(type) {
		return this.get(this.getPrimaryAttrID(type));
	},

	getAll: function() {
		return _list;
	},

	getAllByCategory: function(...categories) {
		var list = [];
		for (let id in _list) {
			if (categories.indexOf(_list[id].category) > -1) list.push(_list[id]);
		}
		return list;
	},

	getObjByCategory: function(...categories) {
		var list = {};
		for (let id in _list) {
			if (categories.indexOf(_list[id].category) > -1) list[id] = _list[id];
		}
		return list;
	},

	getAllByCategoryGroup: function(category, gr) {
		var list = [];
		for (let id in _list) {
			if (_list[id].category === category && _list[id].gr === gr) list.push(_list[id]);
		}
		return list;
	},

	getObjByCategoryGroup: function(category, ...gr) {
		var list = {};
		var grs = new Set(gr);
		for (let id in _list) {
			if (_list[id].category === category && grs.has(_list[id].gr)) list[id] = _list[id];
		}
		return list;
	}

});

ListStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {

		case ActionTypes.RECEIVE_RAW_LISTS:
			_init(payload);
			break;

		case ActionTypes.RECEIVE_HERO:
			_updateAll(payload);
			break;

		case ActionTypes.ASSIGN_RCP_ENTRIES:
			_assignRCP(payload.selections);
			break;

		case ActionTypes.CLEAR_HERO:
		case ActionTypes.CREATE_NEW_HERO:
			_clear();
			break;

		case ActionTypes.ACTIVATE_SPELL:
		case ActionTypes.ACTIVATE_LITURGY:
			_activate(payload.id);
			break;

		case ActionTypes.DEACTIVATE_SPELL:
		case ActionTypes.DEACTIVATE_LITURGY:
			_deactivate(payload.id);
			break;

		case ActionTypes.ADD_ATTRIBUTE_POINT:
		case ActionTypes.ADD_TALENT_POINT:
		case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
		case ActionTypes.ADD_SPELL_POINT:
		case ActionTypes.ADD_LITURGY_POINT:
			_addPoint(payload.id);
			break;

		case ActionTypes.REMOVE_ATTRIBUTE_POINT:
		case ActionTypes.REMOVE_TALENT_POINT:
		case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
		case ActionTypes.REMOVE_SPELL_POINT:
		case ActionTypes.REMOVE_LITURGY_POINT:
			_removePoint(payload.id);
			break;
		
		default:
			return true;
	}
	
	ListStore.emitChange();

	return true;

});

export default ListStore;
