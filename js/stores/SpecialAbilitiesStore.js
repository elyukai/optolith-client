import AppDispatcher from '../dispatcher/AppDispatcher';
import CultureStore from './rcp/CultureStore';
import CombatTechniquesStore from './CombatTechniquesStore';
import { EventEmitter } from 'events';
import ListStore from './ListStore';
import PhaseStore from './PhaseStore';
import ProfessionStore from './rcp/ProfessionStore';
import ProfessionVariantStore from './rcp/ProfessionVariantStore';
import TalentsStore from './TalentsStore';
import ActionTypes from '../constants/ActionTypes';
import Categories from '../constants/Categories';
import validate from '../utils/validate';

const CATEGORY = Categories.SPECIAL_ABILITIES;
const GROUPS = ['Allgemein', 'Schicksal', 'Kampf', 'Magisch', 'Magisch (Stab)', 'Magisch (Hexe)', 'Geweiht'];

var _filter = '';
var _sortOrder = 'groups';

function _updateFilterText(text) {
	_filter = text;
}

function _updateSortOrder(option) {
	_sortOrder = option;
}

function _activate(payload) {
	var obj = ListStore.get(payload.id);
	var addreq = [];
	if (obj.max !== null) {
		if (obj.id === 'SA_10') {
			if (payload.input === '') {
				obj.active.push([payload.sel, payload.sel2]);
				addreq.push([payload.sel, obj.active.filter(e => e[0] === payload.sel).length * 6]);
			} else if (obj.active.filter(e => e[0] === payload.input).length === 0) {
				obj.active.push([payload.sel, payload.input]);
				addreq.push([payload.sel, obj.active.filter(e => e[0] === payload.sel).length * 6]);
			}
		} else if (obj.id === 'SA_30') {
			obj.active.push([payload.sel, payload.tier]);
		} else if (payload.hasOwnProperty('sel')) {
			obj.active.push(payload.sel);
		} else if (payload.hasOwnProperty('input')) {
			if (obj.active.filter(e => e === payload.input).length === 0) {
				obj.active.push(payload.input);
			}
		}
	} else {
		obj.active = true;
		if (payload.hasOwnProperty('tier')) {
			obj.tier = payload.tier;
		}
		if (obj.hasOwnProperty('sel')) {
			if (obj.hasOwnProperty('input') && payload.input !== '' && payload.input !== undefined) {
				obj.sid = payload.input;
			} else {
				obj.sid = payload.sel;
			}
		}
	}
	ListStore.addDependencies(obj.req.concat(addreq));
	ListStore.set(payload.id, obj);
}

function _deactivate(payload) {
	var obj = ListStore.get(payload.id);
	var addreq = [];
	if (obj.max !== null) {
		if (obj.id === 'SA_10') {
			let arr = payload.sid.split('&');
			arr = [arr.shift(), arr.join('&')];
			for (let i = 0; i < obj.active.length; i++) {
				if (obj.active[i][0] === arr[0] && (obj.active[i][1] === arr[1] || obj.active[i][1] === parseInt(arr[1]))) {
					addreq.push([arr[0], obj.active.filter(e => e[0] === arr[0]).length * 6]);
					obj.active.splice(i, 1);
					break;
				}
			}
		} else if (obj.id === 'SA_30') {
			obj.active = obj.active.filter(e => e[0] !== payload.sid);
		} else if (payload.hasOwnProperty('sid')) {
			obj.active.splice(obj.active.indexOf(payload.sid), 1);
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
	ListStore.removeDependencies(obj.req.concat(addreq));
	ListStore.set(payload.id, obj);
}

function _updateTier(id, tier, sid) {
	var obj = ListStore.get(id);
	if (id === 'SA_30') {
		for (let i = 0; i < obj.active.length; i++) {
			if (obj.active[i][0] === sid) {
				obj.active[i][1] = tier;
				break;
			}
		}
	} else {
		obj.tier = tier;
	}
	ListStore.set(id, obj);
}

function _clear() {
	ListStore.getAllByCategory(CATEGORY).forEach(e => {
		ListStore.setProperty(e.id, 'active', ListStore.get(e.id).max === null ? false : []);
		ListStore.setProperty(e.id, 'tier');
		ListStore.setProperty(e.id, 'sid');
		ListStore.setProperty(e.id, 'dependencies', []);
	});
}

function _updateAll(payload) {
	payload.active.forEach(e => {
		let [ id, options ] = e;
		var obj = ListStore.get(id);
		if (obj.max !== null) {
			ListStore.setProperty(id, 'active', options);
			switch (id) {
				case 'SA_10': {
					let counter = new Map();
					options.forEach(p => {
						if (counter.has(p[0])) {
							counter.set(p[0], counter.get(p[0]) + 1);
						} else {
							counter.set(p[0], 1);
						}
						ListStore.addDependencies(obj.req.concat([[p[0], counter.get(p[0]) * 6]]));
					});
					break;
				}
				default:
					options.forEach(() => {
						ListStore.addDependencies(obj.req);
					});
			}
		} else {
			ListStore.activate(id);
			ListStore.addDependencies(obj.req);
			for (let property in options) {
				ListStore.setProperty(id, property, options[property]);
			}
		}
	});
}

function _assignRCP(selections) {
	var list = new Set();

	if (selections.spec !== null)
		list.add([ 'SA_10', selections.map.get('spec')[0], selections.spec ]);

	if ([null, 'P_0'].indexOf(ProfessionStore.getCurrentID()) === -1)
		ProfessionStore.getCurrent().sa.forEach(e => {
			let [ id, value, ...options ] = e;
			if (!value) {
				list = new Set([...list].filter(e => e[0] !== id));
			} else {
				list.add([ id, ...options ]);
			}
		});
	if (ProfessionVariantStore.getCurrentID() !== null)
		ProfessionVariantStore.getCurrent().sa.forEach(e => {
			let [ id, value, ...options ] = e;
			if (!value) {
				list = new Set([...list].filter(e => e[0] !== id));
			} else {
				list.add([ id, ...options ]);
			}
		});

	list.forEach(e => {
		let [ id, ...options ] = e;
		let obj = ListStore.get(id);
		let addreq = [];

		if (options.length === 0) {
			ListStore.activate(id);
		} else {
			if (obj.tiers !== null && obj.tiers) {
				if (obj.max === null) {
					ListStore.activate(id);
					obj.tier = options[0];
				} else {
					obj.active.push(options.reverse());
				}
			} else if (obj.sel.length > 0) {
				if (obj.max === null) {
					ListStore.activate(id);
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
		ListStore.addDependencies(obj.req.concat(addreq));
	});

	const culture = CultureStore.getCurrent();
	var langs = new Map();
	var litcs = new Set();

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

	var SA_28 = ListStore.get('SA_28');
	var SA_30 = ListStore.get('SA_30');

	SA_28.active.push(...litcs);
	SA_30.active.push(...langs);
}

var SpecialAbilitiesStore = Object.assign({}, EventEmitter.prototype, {

	init: function(rawSA) {
		for (let id in rawSA) {
			rawSA[id].active = rawSA[id].max === null ? false : [];
			rawSA[id].category = CATEGORY;
			rawSA[id].dependencies = [];
			if (id === 'SA_72') {
				rawSA[id].sel = rawSA[id].sel.map((e,i) => [ListStore.get(e[0]).name, i + 1, e[1]]);
			} else if (id === 'SA_10') {
				rawSA[id].sel = ListStore.getAllByCategory('talents').map(e => [e.name, e.id, e.skt, e.spec === null ? [] : e.spec.map((n, index) => [n, index + 1]), e.spec_input]);
			} else if (rawSA[id].sel.length > 0 && ['SA_3', 'SA_28', 'SA_30'].indexOf(id) === -1) {
				for (let i = 0; i < rawSA[id].sel.length; i++) {
					let arr = [rawSA[id].sel[i][0], i + 1];
					if (rawSA[id].sel[i][1] !== null) arr[2] = rawSA[id].sel[i][1];
					rawSA[id].sel[i] = arr;
				}
			}
		}
		ListStore.init(rawSA);
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

	validate: function(id) {
		let obj = this.get(id);
		return validate(obj.req);
	},

	getForSave: function() {
		var all = ListStore.getAllByCategory(CATEGORY);
		var result = new Map();
		all.forEach(e => {
			let { active, id, sid, tier } = e;
			if (typeof active === 'boolean' && active) {
				result.set(id, { sid, tier });
			} else if (Array.isArray(active) && active.length > 0) {
				result.set(id, active);
			}
		});
		return {
			active: Array.from(result)
		};
	},

	get: function(id) {
		return ListStore.get(id);
	},

	getActiveForView: function(...cgr) {
		var sasObj;
		if (cgr.length > 0) {
			sasObj = ListStore.getObjByCategoryGroup(CATEGORY, ...cgr);
		} else {
			sasObj = ListStore.getObjByCategory(CATEGORY);
		}
		var sas = [];
		for (let id in sasObj) {
			let sa = sasObj[id];
			let { name, active, ap, sid, sel, gr, dependencies } = sa;
			if (active === true) {
				let disabled = dependencies.length > 0;
				if (sel.length > 0 && ap === 'sel') {
					if (id === 'SA_86' && ListStore.getAllByCategory('spells').some(e => e.active)) {
						disabled = true;
					}
					if (id === 'SA_102' && ListStore.getAllByCategory('liturgies').some(e => e.active)) disabled = true; 
					sas.push({ id, name, add: sel[sid - 1][0], ap: sel[sid - 1][2], gr, disabled });
				} else {
					let phase = PhaseStore.get();
					if (id === 'SA_92' && phase < 3) {
						ap += 4;
					}
					sas.push({ id, name, ap, gr, disabled });
				}
			} else if (Array.isArray(active) && active.length > 0) {
				let disabled = dependencies.length > 0;
				let ap_default = ap;
				if (id === 'SA_10') {
					let counter = new Map();
					active.forEach(n => {
						if (!counter.has(n[0]))
							counter.set(n[0], 1);
						else
							counter.set(n[0], counter.get(n[0]) + 1);
					});
					active.forEach(n => {
						let sid = n.join('&');
						let tal = ListStore.get(n[0]);
						let ap = tal.skt * counter.get(n[0]);
						let add = `${tal.name}: ${typeof n[1] === 'number' ? tal.spec[n[1] - 1] : n[1]}`;
						sas.push({ id, name, sid, add, ap, gr, disabled });
					});
				} else for (let i = 0; i < active.length; i++) {
					let sid;
					let add;
					let tier;
					let tiers;
					let ap;
					if (id === 'SA_30') {
						sid = sa.active[i][0];
						ap = ap_default;
						tier = sa.active[i][1];
						tiers = 3;
						add = sa.sel[sid - 1][0];
					} else if (sel.length > 0 && ap_default === 'sel') {
						sid = sa.active[i];
						ap = sa.sel[sid - 1][2];
						add = sa.sel[sid - 1][0];
					} else if (sel.length > 0 && typeof ap_default === 'number') {
						sid = sa.active[i];
						ap = sa.ap;
						add = sa.sel[sid - 1][0];
					} else if (sa.input !== null) {
						sid = sa.active[i];
						add = sa.active[i];
						ap = sa.ap;
					}
					if (dependencies.indexOf(sid) > -1) disabled = true;
					sas.push({ id, name, sid, add, ap, tier, tiers, gr, disabled });
				}
			}
		}
		if (_filter !== '') {
			let filter = _filter.toLowerCase();
			sas = sas.filter(obj => obj.name.toLowerCase().match(filter));
		}
		if (_sortOrder == 'name') {
			sas.sort((a, b) => {
				if (a.name < b.name) {
					return -1;
				} else if (a.name > b.name) {
					return 1;
				} else {
					if (a.add < b.add) {
						return -1;
					} else if (a.add > b.add) {
						return 1;
					} else {
						return 0;
					}
				}
			});
		} else if (_sortOrder == 'groups') {
			sas.sort((a, b) => {
				// if (GROUPS[a.gr - 1] < GROUPS[b.gr - 1]) {
				// 	return -1;
				// } else if (GROUPS[a.gr - 1] > GROUPS[b.gr - 1]) {
				// 	return 1;
				if (a.gr < b.gr) {
					return -1;
				} else if (a.gr > b.gr) {
					return 1;
				} else {
					if (a.name < b.name) {
						return -1;
					} else if (a.name > b.name) {
						return 1;
					} else {
						if (a.add < b.add) {
							return -1;
						} else if (a.add > b.add) {
							return 1;
						} else {
							return 0;
						}
					}
				}
			});
		}
		return sas;
	},

	getDeactiveForView: function() {
		var sasObj = ListStore.getObjByCategory(CATEGORY), sas = [];
		for (let id in sasObj) {
			let sa = sasObj[id];
			let { name, active, ap, max, sel, input, gr, dependencies, req } = sa;
			if (!validate(req) || dependencies.indexOf(false) > -1) continue;
			if (active === false) {
				switch (id) {
					case 'SA_18': {
						let sum = ListStore.getAllByCategory('talents').filter(e => ['TAL_51','TAL_55'].indexOf(e.id) > -1).reduce((a,b) => a.fw + b.fw);
						if (sum >= 12)
							sas.push({ id, name, ap, gr });
						break;
					}
					case 'SA_19':
						if (ListStore.getAllByCategoryGroup('combattech', 2).filter(e => e.fw >= 10).length > 0)
							sas.push({ id, name, ap, gr });
						break;
					default:
						if (sel.length > 0 && ap === 'sel') {
							let _sel = sel.filter(e => dependencies.indexOf(e[1]) === -1);
							sas.push({ id, name, sel: _sel, ap, gr });
						} else {
							let phase = PhaseStore.get();
							if (id === 'SA_92' && phase < 3) {
								ap += 4;
							}
							sas.push({ id, name, ap, gr });
						}
						break;
				}
			} else if (active.length === 0 || max === false || (active.length < sa.max)) {
				switch (id) {
					case 'SA_3': {
						let _sel = sel.filter(e => active.indexOf(e[1]) === -1 && validate(e[3]) && dependencies.indexOf(e[1]) === -1);
						if (_sel.length > 0) {
							sas.push({ id, name, sel: _sel, ap, gr });
						}
						break;
					}
					case 'SA_10': {
						let counter = {};
						active.forEach(n => {
							if (!counter.hasOwnProperty(n[0])) {
								counter[n[0]] = [n[1]];
							} else {
								counter[n[0]].push(n[1]);
							}
						});
						let _sel = sel.filter(e => (
								(!counter.hasOwnProperty(e[1]) && this.get(e[1]).fw >= 6) ||
								(counter.hasOwnProperty(e[1]) && counter[e[1]].length < 3 && this.get(e[1]).fw >= 6 * (counter[e[1]].length + 1))
							) && dependencies.indexOf(e[1]) === -1).map(e => {
								if (counter[e[1]]) {
									e[2] *= counter[e[1]].length + 1;
								}
								e[3] = e[3].filter(n => {
									if (counter[e[1]] === undefined) {
										return true;
									} else {
										return counter[e[1]].indexOf(n[1]) === -1;
									}
								});
								return e;
							});
						_sel.sort((a,b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
						if (_sel.length > 0) {
							sas.push({ id, name, sel: _sel, ap, gr });
						}
						break;
					}
					case 'SA_29': {
						let _sel = sel.filter(e => active.indexOf(e[1]) === -1 && this.get(e[2][0]).fw >= e[2][1] && dependencies.indexOf(e[1]) === -1);
						if (_sel.length > 0) {
							sas.push({ id, name, sel: _sel, ap, gr });
						}
						break;
					}
					case 'SA_30': {
						let _sel = sel.filter(e => active.every(n => n[0] !== e[1]) && dependencies.indexOf(e[1]) === -1);
						_sel.sort((a,b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
						if (_sel.length > 0) {
							sas.push({ id, name, sel: _sel, ap, tiers: 3, gr });
						}
						break;
					}
					case 'SA_88': {
						let spellsAbove10 = ListStore.getAllByCategory('spells').filter(e => e.fw >= 10);
						let counter = {};
						for (let i = 0; i < spellsAbove10.length; i++) {
							let spell = spellsAbove10[i];
							if (!counter.hasOwnProperty(spell.merk))
								counter[spell.merk] = 1;
							else
								counter[spell.merk]++;
						}
						let newSel = [];
						for (let i = 0; i < sel.length; i++) {
							if (counter[sel[i][1]] >= 3 && active.indexOf(sel[i][1]) === -1 && dependencies.indexOf(sel[i][1]) === -1)
								newSel.push(sel[i]);
						}
						newSel.sort((a,b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
						if (newSel.length > 0) {
							let apArr = [10,20,40];
							let newAp = apArr[active.length];
							sas.push({ id, name, sel: newSel, ap: newAp, gr });
						}
						break;
					}
					case 'SA_103': {
						let liturgiesAbove10 = ListStore.getAllByCategory('liturgies').filter(e => e.fw >= 10);
						let counter = {};
						liturgiesAbove10.forEach(n => {
							n.aspc.forEach(e => {
								if (!counter.hasOwnProperty(e))
									counter[e] = 1;
								else
									counter[e]++;
							});
						});
						let newSel = [];
						for (let i = 0; i < sel.length; i++) {
							if (counter[sel[i][1]] >= 3 && active.indexOf(sel[i][1]) === -1 && dependencies.indexOf(sel[i][1]) === -1)
								newSel.push(sel[i]);
						}
						newSel.sort((a,b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
						if (newSel.length > 0) {
							let apArr = [15,25,45];
							let newAp = apArr[active.length];
							sas.push({ id, name, sel: newSel, ap: newAp, gr });
						}
						break;
					}
					default:
						if (sel.length > 0) {
							let _sel = sel.filter(e => active.indexOf(e[1]) === -1 && dependencies.indexOf(e[1]) === -1);
							_sel.sort((a,b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
							if (_sel.length > 0) {
								sas.push({ id, name, sel: _sel, ap, gr });
							}
						} else if (input !== null) {
							sas.push({ id, name, input, ap, gr });
						}
						break;
				}
			}
		}
		if (_filter !== '') {
			let filter = _filter.toLowerCase();
			sas = sas.filter(obj => obj.name.toLowerCase().match(filter));
		}
		if (_sortOrder == 'name') {
			sas.sort((a, b) => {
				if (a.name < b.name) {
					return -1;
				} else if (a.name > b.name) {
					return 1;
				} else {
					return 0;
				}
			});
		} else if (_sortOrder == 'groups') {
			sas.sort((a, b) => {
				// if (GROUPS[a.gr - 1] < GROUPS[b.gr - 1]) {
				// 	return -1;
				// } else if (GROUPS[a.gr - 1] > GROUPS[b.gr - 1]) {
				// 	return 1;
				if (a.gr < b.gr) {
					return -1;
				} else if (a.gr > b.gr) {
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
		return sas;
	},

	getFilter: function() {
		return _filter;
	},

	getSortOrder: function() {
		return _sortOrder;
	}

});

SpecialAbilitiesStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {

		case ActionTypes.CLEAR_HERO:
		case ActionTypes.CREATE_NEW_HERO:
			_clear();
			break;

		case ActionTypes.RECEIVE_HERO:
			_updateAll(payload.sa);
			break;

		case ActionTypes.FILTER_SPECIALABILITIES:
			_updateFilterText(payload.text);
			break;

		case ActionTypes.SORT_SPECIALABILITIES:
			_updateSortOrder(payload.option);
			break;

		case ActionTypes.ACTIVATE_SPECIALABILITY:
			_activate(payload);
			break;

		case ActionTypes.DEACTIVATE_SPECIALABILITY:
			_deactivate(payload);
			break;

		case ActionTypes.UPDATE_SPECIALABILITY_TIER:
			_updateTier(payload.id, payload.tier, payload.sid);
			break;

		case ActionTypes.ASSIGN_RCP_ENTRIES:
			_assignRCP(payload.selections);
			break;

		case ActionTypes.RECEIVE_RAW_LISTS:
			AppDispatcher.waitFor([CombatTechniquesStore.dispatchToken, TalentsStore.dispatchToken]);
			SpecialAbilitiesStore.init(payload.specialabilities);
			break;
		
		default:
			return true;
	}
	
	SpecialAbilitiesStore.emitChange();

	return true;

});

export default SpecialAbilitiesStore;
