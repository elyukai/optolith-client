import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import ListStore from './ListStore';
import PhaseStore from './PhaseStore';
import ActionTypes from '../constants/ActionTypes';
import Categories from '../constants/Categories';
import validate from '../utils/validate';

const CATEGORY = Categories.SPECIAL_ABILITIES;
// const GROUPS = ['Allgemein', 'Schicksal', 'Kampf', 'Magisch', 'Magisch (Stab)', 'Magisch (Hexe)', 'Geweiht'];

var _filter = '';
var _sortOrder = 'groups';

function _updateFilterText(text) {
	_filter = text;
}

function _updateSortOrder(option) {
	_sortOrder = option;
}

var SpecialAbilitiesStore = Object.assign({}, EventEmitter.prototype, {
	
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

		case ActionTypes.FILTER_SPECIALABILITIES:
			_updateFilterText(payload.text);
			break;

		case ActionTypes.SORT_SPECIALABILITIES:
			_updateSortOrder(payload.option);
			break;
			
		case ActionTypes.ACTIVATE_SPECIALABILITY:
		case ActionTypes.DEACTIVATE_SPECIALABILITY:
		case ActionTypes.UPDATE_SPECIALABILITY_TIER:
			break;
		
		default:
			return true;
	}
	
	SpecialAbilitiesStore.emitChange();

	return true;

});

export default SpecialAbilitiesStore;
