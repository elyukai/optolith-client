import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import CultureStore from './CultureStore';
import HistoryStore from './HistoryStore';
import init from '../utils/init';
import ProfessionStore from './ProfessionStore';
import ProfessionVariantStore from './ProfessionVariantStore';
import RaceStore from './RaceStore';
import RequirementsStore from './RequirementsStore';
import ActionTypes from '../constants/ActionTypes';

var _list = {};

// function* __activate(id) {
// 	let validAP = yield;
// 	if (validAP) {
// 		_list[id].active = true;
// 	}
// 	return validAP;
// }

function _activate(id) {
	_list[id].active = true;
}

function _deactivate(id) {
	_list[id].active = false;
}

function _addPoint(id) {
	_list[id].addPoint();
}

function _removePoint(id) {
	_list[id].removePoint();
}

function _setValue(id, value) {
	_list[id].set(value);
}

function _addSR(id, amount) {
	_list[id].add(amount);
}

function _activateDASA(payload) {
	const { id, ...other } = payload;
	_list[id].activate(other);
}

function _deactivateDASA(payload) {
	var { id, ...other } = payload;
	_list[id].deactivate(other);
}

function _updateTier(id, tier, sid) {
	_list[id].tier = { sid, tier };
}

function _init(payload) {
	_list = init(payload);
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
					options.forEach(p => obj.addDependencies([], p));
					break;
				case 'SA_10': {
					let counter = new Map();
					options.forEach(p => {
						if (counter.has(p[0])) {
							counter.set(p[0], counter.get(p[0]) + 1);
						} else {
							counter.set(p[0], 1);
						}
						obj.addDependencies([[p[0], counter.get(p[0]) * 6]]);
					});
					break;
				}
				default:
					options.forEach(() => obj.addDependencies());
			}
		} else {
			_activate(id);
			obj.addDependencies();
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
	langs.set(culture.languages.length > 1 ? selections.lang : culture.languages[0], 4);
	if (selections.buyLiteracy) {
		litcs.add(culture.scripts.length > 1 ? selections.litc : culture.scripts[0]);
	}
	selections.langLitc.forEach((value, key) => {
		let [ category, id ] = key.split('_');
		if (category === 'LANG') {
			langs.set(parseInt(id), value / 2);
		} else {
			litcs.add(parseInt(id));
		}
	});
	race.attr.forEach(e => {
		let [ mod, id ] = e;
		_list[id].mod += mod;
	});
	race.auto_adv.forEach(e => {
		let [ id ] = e;
		disadvs.add(id);
	});
	addSRList.push(...profession.talents);
	addSRList.push(...profession.combattechniques);
	addSRActivateList.push(...profession.spells);
	addSRActivateList.push(...profession.liturgies);
	profession.specialabilities.forEach(addSA);
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
		_list[id].addDependencies();
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
		obj.addDependencies(addreq);
	});
	_list['SA_28'].active.push(...litcs);
	_list['SA_30'].active.push(...langs);
}

function _clear() {
	for (let id in _list) {
		let e = _list[id];
		if (e.reset) {
			e.reset();
		}
	}
}
	
const ListStore = new Store();

ListStore.dispatchToken = AppDispatcher.register(payload => {
	AppDispatcher.waitFor([RequirementsStore.dispatchToken, HistoryStore.dispatchToken]);

	if (payload.undoAction) {
		switch( payload.actionType ) {
			case ActionTypes.ACTIVATE_SPELL:
			case ActionTypes.ACTIVATE_LITURGY:
				_deactivate(payload.options.id);
				break;
			
			case ActionTypes.DEACTIVATE_SPELL:
			case ActionTypes.DEACTIVATE_LITURGY:
				_activate(payload.options.id);
				break;

			case ActionTypes.ACTIVATE_DISADV:
			case ActionTypes.ACTIVATE_SPECIALABILITY:
			case ActionTypes.DEACTIVATE_DISADV:
			case ActionTypes.DEACTIVATE_SPECIALABILITY:
				console.debug('UNDO for ' + payload.actionType + ' not yet implemented.\nFind a solution how to implement this feature. It has to be implemented for the first release.');
				break;

			case ActionTypes.UPDATE_DISADV_TIER:
			case ActionTypes.UPDATE_SPECIALABILITY_TIER:
				_updateTier(payload.options.id, payload.prevState.tier, payload.options.sid);
				break;

			case ActionTypes.ADD_ATTRIBUTE_POINT:
			case ActionTypes.ADD_TALENT_POINT:
			case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
			case ActionTypes.ADD_SPELL_POINT:
			case ActionTypes.ADD_LITURGY_POINT:
				_removePoint(payload.options.id);
				break;

			case ActionTypes.REMOVE_ATTRIBUTE_POINT:
			case ActionTypes.REMOVE_TALENT_POINT:
			case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
			case ActionTypes.REMOVE_SPELL_POINT:
			case ActionTypes.REMOVE_LITURGY_POINT:
				_addPoint(payload.options.id);
				break;
			
			default:
				return true;
		}
	}
	else {
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
				if (RequirementsStore.isValid()) {
					_activate(payload.id);
				}
				break;
			
			case ActionTypes.DEACTIVATE_SPELL:
			case ActionTypes.DEACTIVATE_LITURGY:
				if (RequirementsStore.isValid()) {
					_deactivate(payload.id);
				}
				break;

			case ActionTypes.ACTIVATE_DISADV:
			case ActionTypes.ACTIVATE_SPECIALABILITY:
				if (RequirementsStore.isValid()) {
					_activateDASA(payload);
				}
				break;

			case ActionTypes.DEACTIVATE_DISADV:
			case ActionTypes.DEACTIVATE_SPECIALABILITY:
				if (RequirementsStore.isValid()) {
					_deactivateDASA(payload);
				}
				break;

			case ActionTypes.UPDATE_DISADV_TIER:
			case ActionTypes.UPDATE_SPECIALABILITY_TIER:
				if (RequirementsStore.isValid()) {
					_updateTier(payload.id, payload.tier, payload.sid);
				}
				break;

			case ActionTypes.ADD_ATTRIBUTE_POINT:
			case ActionTypes.ADD_TALENT_POINT:
			case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
			case ActionTypes.ADD_SPELL_POINT:
			case ActionTypes.ADD_LITURGY_POINT:
				if (RequirementsStore.isValid()) {
					_addPoint(payload.id);
				}
				break;

			case ActionTypes.REMOVE_ATTRIBUTE_POINT:
			case ActionTypes.REMOVE_TALENT_POINT:
			case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
			case ActionTypes.REMOVE_SPELL_POINT:
			case ActionTypes.REMOVE_LITURGY_POINT:
				if (RequirementsStore.isValid()) {
					_removePoint(payload.id);
				}
				break;
			
			default:
				return true;
		}
	}
	
	ListStore.emitChange();

	return true;

});

export default ListStore;

export const get = id => {
	switch (id) {
		case 'COU':
			return _list['ATTR_1'];
		case 'SGC':
			return _list['ATTR_2'];
		case 'INT':
			return _list['ATTR_3'];
		case 'CHA':
			return _list['ATTR_4'];
		case 'DEX':
			return _list['ATTR_5'];
		case 'AGI':
			return _list['ATTR_6'];
		case 'CON':
			return _list['ATTR_7'];
		case 'STR':
			return _list['ATTR_8'];

		default: 
			return _list[id];
	}
};

export const getValue = id => get(id).value;

export const getObjByCategory = (...categories) => {
	let list = {};
	for (const id in _list) {
		const obj = _list[id];
		if (categories.includes(obj.category)) {
			list[id] = obj;
		}
	}
	return list;
};

export const getObjByCategoryGroup = (category, ...gr) => {
	let list = {};
	for (const id in _list) {
		const obj = _list[id];
		if (obj.category === category && gr.includes(obj.gr)) {
			list[id] = obj;
		}
	}
	return list;
};

export const getAllByCategory = (...categories) => {
	let list = [];
	for (const id in _list) {
		const obj = _list[id];
		if (categories.includes(obj.category)) {
			list.push(obj);
		}
	}
	return list;
};

export const getAllByCategoryGroup = (category, ...gr) => {
	let list = [];
	for (const id in _list) {
		const obj = _list[id];
		if (obj.category === category && gr.includes(obj.gr)) {
			list.push(obj);
		}
	}
	return list;
};

export const getPrimaryAttrID = type => {
	let attr;
	if (type === 1) {
		switch (get('SA_86').sid) {
			case 1:
				attr = 'SGC';
				break;
			case 2:
				attr = 'CHA';
				break;
			case 3:
				attr = 'INT';
				break;
		}
	} else if (type === 2) {
		switch (get('SA_102').sid) {
			case 1:
				attr = 'SGC';
				break;
			case 2:
				attr = 'COU';
				break;
			case 3:
				attr = 'COU';
				break;
			case 4:
				attr = 'SGC';
				break;
			case 5:
				attr = 'INT';
				break;
			case 6:
				attr = 'INT';
				break;
		}
	}
	return attr || 'ATTR_0';
};

export const getPrimaryAttr = type => get(getPrimaryAttrID(type));
