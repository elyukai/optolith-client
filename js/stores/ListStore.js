import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import CultureStore from './CultureStore';
import ProfessionStore from './ProfessionStore';
import ProfessionVariantStore from './ProfessionVariantStore';
import RaceStore from './RaceStore';
import ActionTypes from '../constants/ActionTypes';
import Categories from '../constants/Categories';
import iccalc from '../utils/iccalc';

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

function _activateDASA(payload) {
	const { id, sel, sel2, input, tier } = payload;
	var obj = _list[id];
	var addreq = [];
	var new_sid;
	if (obj.max !== null) {
		switch (id) {
			case 'ADV_4':
			case 'ADV_16':
			case 'DISADV_48':
				obj.active.push(sel);
				new_sid = sel;
				break;
			case 'DISADV_1':
			case 'DISADV_34':
			case 'DISADV_50':
				if (input === '')
					obj.active.push([sel, tier]);
				else if (obj.active.filter(e => e[0] === input).length === 0)
					obj.active.push([input, tier]);
				break;
			case 'DISADV_33':
				if ([7,8].indexOf(sel) > -1 && input !== '') {
					if (obj.active.filter(e => e[1] === input).length === 0)
						obj.active.push([sel, input]);
				} else
					obj.active.push(sel);
				break;
			case 'DISADV_36':
				if (input === '')
					obj.active.push(sel);
				else if (obj.active.filter(e => e === input).length === 0)
					obj.active.push(input);
				break;
			case 'SA_10':
				if (input === '') {
					obj.active.push([sel, sel2]);
					addreq.push([sel, obj.active.filter(e => e[0] === sel).length * 6]);
				} else if (obj.active.filter(e => e[0] === input).length === 0) {
					obj.active.push([sel, input]);
					addreq.push([sel, obj.active.filter(e => e[0] === sel).length * 6]);
				}
				break;
			case 'SA_30':
				obj.active.push([sel, tier]);
				break;
			default:
				if (payload.hasOwnProperty('sel'))
					obj.active.push(sel);
				else if (payload.hasOwnProperty('input') && obj.active.filter(e => e === input).length === 0)
					obj.active.push(input);
				break;
		}
	} else {
		obj.active = true;
		if (payload.hasOwnProperty('tier')) {
			obj.tier = tier;
		}
		if (obj.hasOwnProperty('sel')) {
			if (obj.hasOwnProperty('input') && input !== '' && input !== undefined) {
				obj.sid = input;
			} else {
				obj.sid = sel;
			}
		}
	}
	_addDependencies(obj.req.concat(addreq), new_sid);
}

function _deactivateDASA(payload) {
	var { id, sid } = payload;
	var obj = _list[id];
	var addreq = [];
	var old_sid;
	if (obj.max !== null) {
		switch (id) {
			case 'ADV_4':
			case 'ADV_16':
			case 'DISADV_48':
				obj.active.splice(obj.active.indexOf(sid), 1);
				old_sid = sid;
				break;
			case 'ADV_28':
			case 'ADV_29':
				if (typeof sid === 'number')
					obj.active.splice(obj.active.indexOf(sid), 1);
				else
					obj.active = obj.active.filter(e => e[0] !== sid);
				break;
			case 'DISADV_1':
			case 'DISADV_34':
			case 'DISADV_50':
				obj.active = obj.active.filter(e => e[0] !== sid);
				break;
			case 'DISADV_33':
				if (typeof sid === 'string') {
					let arr = sid.split('&');
					arr = [parseInt(arr.shift()), arr.join('&')];
					for (let i = 0; i < obj.active.length; i++) {
						if (obj.active[i][0] === arr[0] && obj.active[i][1] === arr[1]) {
							obj.active.splice(i, 1);
							break;
						}
					}
				} else {
					obj.active.splice(obj.active.indexOf(sid), 1);
				}
				break;
			case 'SA_10': {
				let arr = payload.sid.split('&');
				arr = [arr.shift(), arr.join('&')];
				for (let i = 0; i < obj.active.length; i++) {
					if (obj.active[i][0] === arr[0] && (obj.active[i][1] === arr[1] || obj.active[i][1] === parseInt(arr[1]))) {
						addreq.push([arr[0], obj.active.filter(e => e[0] === arr[0]).length * 6]);
						obj.active.splice(i, 1);
						break;
					}
				}
				break;
			}
			case 'SA_30':
				obj.active = obj.active.filter(e => e[0] !== payload.sid);
				break;
			default:
				if (payload.hasOwnProperty('sid'))
					obj.active.splice(obj.active.indexOf(sid), 1);
				break;
		}
	} else {
		obj.active = false;
		if (payload.hasOwnProperty('tier')) {
			delete obj.tier;
		}
		if (obj.hasOwnProperty('sid')) {
			delete obj.sid;
		}
	}
	_removeDependencies(obj.req.concat(addreq), old_sid);
}

function _updateTier(id, tier, sid) {
	var obj = _list[id];
	switch (id) {
		case 'DISADV_1':
		case 'SA_30':
			for (let i = 0; i < obj.active.length; i++) {
				if (obj.active[i][0] === sid) {
					obj.active[i][1] = tier;
					break;
				}
			}
			break;
		default:
			obj.tier = tier;
			break;
	}
}

function _init({ attributes, adv, disadv, talents, combattech, spells, liturgies, specialabilities }) {
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
	for (let id in adv) {
		adv[id].category = Categories.ADVANTAGES;
	}
	for (let id in disadv) {
		disadv[id].category = Categories.DISADVANTAGES;
	}
	for (let id in specialabilities) {
		specialabilities[id].category = Categories.SPECIAL_ABILITIES;
	}
	let adsa = Object.assign({}, adv, disadv, specialabilities);
	for (let id in adsa) {
		_list[id] = adsa[id];
		_list[id].active = _list[id].max === null ? false : [];
		_list[id].dependencies = [];
		if (['ADV_4','ADV_16','ADV_17','ADV_47','DISADV_48'].indexOf(id) > -1) {
			_list[id].sel = _list[id].sel.map(e => e[0]);
			_list[id].sel = ListStore.getAllByCategory(...(_list[id].sel)).filter(e => {
				return !((e.category === 'spells' && e.gr === 5) || (e.category === 'liturgies' && e.gr === 3));
			}).sort((a, b) => {
				if (a.name < b.name) {
					return -1;
				} else if (a.name > b.name) {
					return 1;
				} else {
					return 0;
				}
			});
			_list[id].sel = _list[id].sel.map(e => [ e.name, e.id ]);
		} else if (id === 'SA_72') {
			_list[id].sel = _list[id].sel.map((e,i) => [ListStore.get(e[0]).name, i + 1, e[1]]);
		} else if (id === 'SA_10') {
			_list[id].sel = ListStore.getAllByCategory('talents').map(e => [e.name, e.id, e.skt, e.spec === null ? [] : e.spec.map((n, index) => [n, index + 1]), e.spec_input]);
		} else if (['ADV_28','ADV_29','ADV_32'].indexOf(id) > -1 ||
			_list[id].category === Categories.DISADVANTAGES ||
			(_list[id].category === Categories.SPECIAL_ABILITIES && ['SA_3', 'SA_28', 'SA_30'].indexOf(id) === -1)) {
			for (let i = 0; i < _list[id].sel.length; i++) {
				let arr = [_list[id].sel[i][0], i + 1];
				if (_list[id].sel[i][1] !== null) arr[2] = _list[id].sel[i][1];
				_list[id].sel[i] = arr;
			}
		}
	}
	_list['DISADV_34'].sel = [
		['99 Gesetze', 1, 1],
		['Moralkodex der Hesindekirche', 2, 1],
		['Moralkodex der Phexkirche', 3, 1],
		['Moralkodex der Perainekirche', 4, 1],
		['99 Gesetze (streng)', 5, 2],
		['Ehrenkodex der Krieger', 6, 2],
		['Ehrenkodex der Ritter', 7, 2],
		['Elfische Weltsicht', 8, 2],
		['Moralkodex der Boronkirche', 9, 2],
		['Moralkodex der Praioskirche', 10, 2],
		['Moralkodex der Rondrakirche', 11, 2],
		['Zwergischer Ehrenkodex', 12, 2],
		['99 Gesetze (radikal)', 13, 3],
		['Pazifismus', 14, 3]
	];
	_list['DISADV_50'].sel = [
		['Sippenmitglied gegenüber der Sippe', 1, 1],
		['Verschuldeter Held', 2, 1],
		['Adliger gegenüber seinem Lehnsherrn', 3, 2],
		['Geweihter gegenüber seinem Tempel', 5, 2],
		['Geweihter gegenüber seiner Kirche', 4, 2],
		['Magier gegenüber seinem Lehrmeister', 6, 2],
		['Magier gegenüber seiner Akademie', 7, 2],
		['Magier gegenüber seiner Gilde', 8, 2],
		['Mitglied einer radikalen Sekte gegenüber den Anführern der Gruppe', 9, 3]
	];
}

function _updateAll({ attr, talents, ct, spells, chants, disadv, sa }) {
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
	[].concat(disadv.active, sa.active).forEach(e => {
		let [ id, options ] = e;
		var obj = _list[id];
		if (obj.max !== null) {
			obj.active = options;
			switch (id) {
				case 'ADV_4':
				case 'ADV_16':
				case 'DISADV_48':
					options.forEach(p => _addDependencies(obj.req, p));
					break;
				case 'SA_10': {
					let counter = new Map();
					options.forEach(p => {
						if (counter.has(p[0])) {
							counter.set(p[0], counter.get(p[0]) + 1);
						} else {
							counter.set(p[0], 1);
						}
						_addDependencies(obj.req.concat([[p[0], counter.get(p[0]) * 6]]));
					});
					break;
				}
				default:
					options.forEach(() => _addDependencies(obj.req));
			}
		} else {
			_activate(id);
			_addDependencies(obj.req);
			for (let property in options) {
				obj[property] = options[property];
			}
		}
	});
}

function _assignRCP(selections) {
	const race = RaceStore.getCurrent();
	const culture = CultureStore.getCurrent();
	const profession = ProfessionStore.getCurrent();
	const professionVariant = ProfessionVariantStore.getCurrent();

	var addSRList = [];
	var addSRActivateList = [];
	var disadvs = new Set();
	var sas = new Set();
	var langs = new Map();
	var litcs = new Set();

	const addSA = e => {
		let [ id, value, ...options ] = e;
		if (!value) {
			sas = new Set([...sas].filter(e => e[0] !== id));
		} else {
			sas.add([ id, ...options ]);
		}
	};
	
	if (selections.useCulturePackage) {
		addSRList.push(...culture.talents);
	}
	if (selections.spec !== null) {
		sas.add([ 'SA_10', selections.map.get('spec')[0], selections.spec ]);
	}
	langs.set(culture.lang.length > 1 ? selections.lang : culture.lang[0], 4);
	if (selections.buyLiteracy) {
		litcs.add(culture.literacy.length > 1 ? selections.litc : culture.literacy[0]);
	}
	selections.langLitc.forEach((value, key) => {
		let [ category, id ] = key.split('_');
		if (category === 'LANG') {
			langs.set(parseInt(id), value / 2);
		} else {
			litcs.add(parseInt(id));
		}
	});
	if (race) {
		race.auto_adv.forEach(e => {
			let [ id ] = e;
			disadvs.add(id);
		});
	}
	if (profession) {
		addSRList.push(...profession.talents);
		addSRList.push(...profession.combattech);
		addSRActivateList.push(...profession.spells);
		addSRActivateList.push(...profession.chants);
		profession.sa.forEach(addSA);
	}
	if (professionVariant) {
		addSRList.push(...professionVariant.talents);
		addSRList.push(...professionVariant.combattech);
		professionVariant.sa.forEach(addSA);
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
	
	_list[selections.attrSel].mod = race.attr_sel[0] || 0;
	addSRList.forEach(e => _addSR(...e));
	addSRActivateList.forEach(e => {
		_activate(e[0]);
		if (e[1] !== null) {
			_setValue(e[0], e[1]);
		}
	});
	disadvs.forEach(id => {
		_activate(id);
		_addDependencies(_list[id].req);
	});
	sas.forEach(e => {
		let [ id, ...options ] = e;
		let obj = _list[id];
		let addreq = [];

		if (options.length === 0) {
			_activate(id);
		} else {
			if (obj.tiers !== null && obj.tiers) {
				if (obj.max === null) {
					_activate(id);
					obj.tier = options[0];
				} else {
					obj.active.push(options.reverse());
				}
			} else if (obj.sel.length > 0) {
				if (obj.max === null) {
					_activate(id);
					obj.sid = options[0];
				} else if (obj.id === 'SA_10') {
					obj.active.push([options[0], Number.isInteger(options[1]) ? options[1] + 1 : options[1]]);
					addreq.push([options[0], obj.active.filter(e => e[0] === options[0]).length * 6]);
				} else if (options.length > 1) {
					obj.active.push(options.reverse());
				} else {
					obj.active.push(options[0]);
				}
			}
		}
		_addDependencies(obj.req.concat(addreq));
	});
	_list['SA_28'].active.push(...litcs);
	_list['SA_30'].active.push(...langs);
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
			case Categories.ADVANTAGES:
			case Categories.DISADVANTAGES:
			case Categories.SPECIAL_ABILITIES:
				e.active = e.max === null ? false : [];
				delete e.sid;
				delete e.tier;
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
			if (iccalc(_list[payload.id].skt, 0)) {
				_activate(payload.id);
			}
			break;
		
		case ActionTypes.DEACTIVATE_SPELL:
		case ActionTypes.DEACTIVATE_LITURGY:
			_deactivate(payload.id);
			break;

		case ActionTypes.ACTIVATE_DISADV:
		case ActionTypes.ACTIVATE_SPECIALABILITY:
			if (iccalc(payload.costs)) {
				_activateDASA(payload);
			}
			break;

		case ActionTypes.DEACTIVATE_DISADV:
		case ActionTypes.DEACTIVATE_SPECIALABILITY:
			_deactivateDASA(payload);
			break;

		case ActionTypes.UPDATE_DISADV_TIER:
		case ActionTypes.UPDATE_SPECIALABILITY_TIER:
			if (iccalc(payload.costs)) {
				_updateTier(payload.id, payload.tier, payload.sid);
			}
			break;

		case ActionTypes.ADD_ATTRIBUTE_POINT:
		case ActionTypes.ADD_TALENT_POINT:
		case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
		case ActionTypes.ADD_SPELL_POINT:
		case ActionTypes.ADD_LITURGY_POINT:
			if (iccalc(_list[payload.id].skt, _list[payload.id].value + 1)) {
				_activate(payload.id);
			}
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
