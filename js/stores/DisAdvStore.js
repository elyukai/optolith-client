import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import ListStore from './ListStore';
import ActionTypes from '../constants/ActionTypes';
import validate from '../utils/validate';

const CATEGORY_1 = 'adv';
const CATEGORY_2 = 'disadv';

var _filter = '';
var _showRating = true;

function _updateFilterText(text) {
	_filter = text;
}

function _updateRating() {
	_showRating = !_showRating;
}

function _activate(payload) {
	var { id, sel, input, tier } = payload;
	var obj = ListStore.get(id);
	var new_sid;
	if (obj.max !== null) {
		switch (id) {
			case 'ADV_4':
			case 'ADV_16':
			case 'DISADV_48':
				obj.active.push(sel);
				new_sid = sel;
				break;
			case 'ADV_28':
			case 'ADV_29':
				if (input[0] === '' && input[1] === '')
					obj.active.push(sel);
				else if (obj.active.filter(e => e[0] === input[0]).length === 0)
					obj.active.push(input);
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
	ListStore.addDependencies(obj.req, new_sid);
	ListStore.set(payload.id, obj);
}

function _deactivate(payload) {
	var { id, sid } = payload;
	var obj = ListStore.get(payload.id);
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
				} else
					obj.active.splice(obj.active.indexOf(sid), 1);
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
	ListStore.removeDependencies(obj.req, old_sid);
	ListStore.set(payload.id, obj);
}

function _updateTier(id, tier, sid) {
	var obj = ListStore.get(id);
	if (id === 'DISADV_1') {
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
	
var DisAdvStore = Object.assign({}, EventEmitter.prototype, {

	init: function(rawAdv, rawDisAdv) {
		for (let id in rawAdv) {
			rawAdv[id].active = rawAdv[id].max === null ? false : [];
			rawAdv[id].category = CATEGORY_1;
			rawAdv[id].dependencies = [];
			// if (id === 'ADV_50') rawAdv[id].active = true;
			if (['ADV_4','ADV_16','ADV_17','ADV_47'].indexOf(id) > -1) {
				rawAdv[id].sel = rawAdv[id].sel.map(e => e[0]);
				rawAdv[id].sel = ListStore.getAllByCategory(...rawAdv[id].sel).filter(e => {
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
				rawAdv[id].sel = rawAdv[id].sel.map(e => [ e.name, e.id ]);
			} else if (['ADV_28','ADV_29','ADV_32'].indexOf(id) > -1) {
				for (let i = 0; i < rawAdv[id].sel.length; i++) {
					let arr = [rawAdv[id].sel[i][0], i + 1];
					if (rawAdv[id].sel[i][1] !== null) arr[2] = rawAdv[id].sel[i][1];
					rawAdv[id].sel[i] = arr;
				}
			}
		}
		for (let id in rawDisAdv) {
			rawDisAdv[id].active = rawDisAdv[id].max === null ? false : [];
			rawDisAdv[id].category = CATEGORY_2;
			rawDisAdv[id].dependencies = [];
			if (rawDisAdv[id].sel.length > 0) {
				if (id === 'DISADV_48') {
					rawDisAdv[id].sel = rawDisAdv[id].sel.map(e => e[0]);
					rawDisAdv[id].sel = ListStore.getAllByCategory(...rawDisAdv[id].sel).filter(e => {
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
					rawDisAdv[id].sel = rawDisAdv[id].sel.map(e => [ e.name, e.id ]);
				} else {
					for (let i = 0; i < rawDisAdv[id].sel.length; i++) {
						let arr = [rawDisAdv[id].sel[i][0], i + 1];
						if (rawDisAdv[id].sel[i][1] !== null) arr[2] = rawDisAdv[id].sel[i][1];
						rawDisAdv[id].sel[i] = arr;
					}
				}
			}
			if (id === 'DISADV_34') {
				rawDisAdv[id].sel = [
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
			} else if (id === 'DISADV_50') {
				rawDisAdv[id].sel = [
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
		}
		ListStore.init(rawAdv, rawDisAdv);
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
		return ListStore.get(id);
	},

	getActiveForView: function(category) {
		category = category ? CATEGORY_1 : CATEGORY_2;
		var advsObj = ListStore.getObjByCategory(category), advs = [];
		for (let id in advsObj) {
			let adv = advsObj[id];
			let { active, name, sid, sel, tier, tiers, ap, dependencies } = adv;
			if (active === true) {
				let disabled = dependencies.length > 0;
				switch (id) {
					case 'ADV_47': {
						let skill = ListStore.get(adv.sid);
						advs.push({ id, name, sid, add: skill.name, ap: ap[skill.skt - 1], disabled });
						break;
					}
					case 'ADV_32':
					case 'DISADV_24':
					case 'DISADV_45':
						advs.push({ id, name, sid, add: typeof sid === 'number' ? sel[sid - 1][0] : sid, ap, disabled });
						break;
					default:
						if (adv.tiers !== null)
							advs.push({ id, name, tier, tiers, ap, disabled });
						else
							advs.push({ id, name, ap, disabled });
						break;
				}
			} else if (Array.isArray(active) && active.length > 0) {
				let disabled = dependencies.length > 0;
				for (let i = 0; i < active.length; i++) {
					let sid;
					let add;
					let tier;
					let tiers;
					let ap;
					switch (id) {
						case 'ADV_4':
						case 'ADV_16':
						case 'ADV_17':
						case 'DISADV_48':
							sid = adv.active[i];
							var skill = ListStore.get(sid);
							add = skill.name;
							ap = adv.ap[skill.skt - 1];
							break;
						case 'ADV_28':
						case 'ADV_29':
							if (typeof active[i] === 'number') {
								sid = active[i];
								add = sel[sid - 1][0];
								ap = sel[sid - 1][2];
							} else {
								sid = adv.active[i][0];
								add = sid;
								ap = parseInt(adv.active[i][1]) / 2;
							}
							break;
						case 'DISADV_1':
						case 'DISADV_34':
						case 'DISADV_50':
							sid = adv.active[i][0];
							add = typeof sid === 'number' ? adv.sel[sid - 1][0] : sid;
							tier = adv.active[i][1];
							tiers = adv.tiers;
							ap = adv.ap;
							break;
						case 'DISADV_33': {
							sid = Array.isArray(adv.active[i]) ? adv.active[i].join('&') : adv.active[i];
							let sid_alt = Array.isArray(adv.active[i]) ? adv.active[i][0] : sid;
							if (sid_alt === 7 && adv.active.filter(e => Array.isArray(e) && e[0] === 7).length > 1) {
								ap = 0;
							} else {
								ap = adv.sel[sid_alt - 1][2];
							}
							if ([7,8].indexOf(sid_alt) > -1) {
								add = `${adv.sel[sid_alt - 1][0]}: ${adv.active[i][1]}`;
							} else {
								add = adv.sel[sid_alt - 1][0];
							}
							if (Array.isArray(adv.active[i]) && (dependencies.indexOf(adv.active[i][0]) > -1 || dependencies.indexOf(adv.active[i].join('&')) > -1)) disabled = true;
							break;
						}
						case 'DISADV_36':
							sid = adv.active[i];
							add = typeof sid === 'number' ? adv.sel[sid - 1][0] : sid;
							ap = adv.active.length > 3 ? 0 : adv.ap;
							break;
						case 'DISADV_37':
						case 'DISADV_51':
							sid = adv.active[i];
							ap = adv.sel[sid - 1][2];
							add = adv.sel[sid - 1][0];
							break;
						default:
							if (adv.input !== null) {
								sid = adv.active[i];
								add = adv.active[i];
								ap = adv.ap;
							}
							break;
					}
					if (dependencies.indexOf(sid) > -1) disabled = true;
					advs.push({ id, name, sid, add, ap, tier, tiers, disabled });
				}
			}
		}
		if (_filter !== '') {
			let filter = _filter.toLowerCase();
			advs = advs.filter(obj => obj.name.toLowerCase().match(filter));
		}
		advs.sort((a, b) => {
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
		return advs;
	},

	getDeactiveForView: function(category) {
		category = category ? CATEGORY_1 : CATEGORY_2;
		var advsObj = ListStore.getObjByCategory(category), advs = [];
		for (let id in advsObj) {
			let adv = advsObj[id];
			let { name, sel, input, tiers, ap, dependencies, req } = adv;
			if (!validate(req, id) || dependencies.indexOf(false) > -1) continue;
			if (adv.active === false) {
				switch (id) {
					case 'ADV_47':
						advs.push({ id, name, sel, ap });
						break;
					case 'ADV_32': {
						let sel = adv.sel.filter(e => this.get('DISADV_24').sid !== e[1] && dependencies.indexOf(e[1]) === -1);
						advs.push({ id, name, sel, input, ap });
						break;
					}
					case 'DISADV_24': {
						let sel = adv.sel.filter(e => this.get('ADV_32').sid !== e[1] && dependencies.indexOf(e[1]) === -1);
						advs.push({ id, name, sel, input, ap });
						break;
					}
					case 'DISADV_45':
						advs.push({ id, name, sel, input, ap });
						break;
					default:
						if (adv.tiers !== null)
							advs.push({ id, name, tiers, ap });
						else
							advs.push({ id, name, ap });
						break;
				}
			} else if (adv.active.length === 0 || adv.max === false || (adv.active.length < adv.max)) {
				switch (id) {
					case 'ADV_4':
					case 'ADV_17': {
						let sel = adv.sel.filter(e => adv.active.indexOf(e[1]) === -1 && dependencies.indexOf(e[1]) === -1);
						advs.push({ id, name, sel, ap });
						break;
					}
					case 'ADV_16': {
						let sel = adv.sel.filter(e => adv.active.filter(c => c === e[1]).length < 2 && dependencies.indexOf(e[1]) === -1);
						advs.push({ id, name, sel, ap });
						break;
					}
					case 'ADV_28':
					case 'ADV_29': {
						let sel = adv.sel.filter(e => dependencies.indexOf(e[1]) === -1);
						advs.push({ id, name, sel });
						// advs.push({ id, name, sel, input });
						break;
					}
					case 'ADV_47': {
						let sel = adv.sel.filter(e => adv.active.indexOf(e[1]) === -1 && dependencies.indexOf(e[1]) === -1);
						advs.push({ id, name, sel, ap });
						break;
					}
					case 'DISADV_1': {
						let sel = adv.sel.map((e, index) => [e[0], index + 1]).filter(e => dependencies.indexOf(e[1]) === -1);
						advs.push({ id, name, tiers, sel, input, ap });
						break;
					}
					case 'DISADV_33':
					case 'DISADV_37':
					case 'DISADV_51': {
						let sel;
						if (adv.id === 'DISADV_33')
							sel = adv.sel.filter(e => ([7,8].indexOf(e[1]) > -1 || adv.active.indexOf(e[1]) === -1) && dependencies.indexOf(e[1]) === -1);
						else
							sel = adv.sel.filter(e => adv.active.indexOf(e[1]) === -1 && dependencies.indexOf(e[1]) === -1);
						advs.push({ id, name, sel, ap });
						break;
					}
					case 'DISADV_34':
					case 'DISADV_50': {
						let sel = adv.sel.filter(e => dependencies.indexOf(e[1]) === -1);
						advs.push({ id, name, tiers, sel, input, ap });
						break;
					}
					case 'DISADV_36': {
						let sel = adv.sel.filter(e => adv.active.indexOf(e[1]) === -1 && dependencies.indexOf(e[1]) === -1);
						advs.push({ id, name, sel, input, ap });
						break;
					}
					case 'DISADV_48': {
						let sel = adv.sel.filter(e => {
							if (this.get('ADV_40').active || this.get('ADV_46').active)
								if (this.get(e[1]).gr === 2)
									return false;
							return adv.active.indexOf(e[1]) === -1 && dependencies.indexOf(e[1]) === -1;
						});
						advs.push({ id, name, sel, ap });
						break;
					}
					default:
						if (adv.input !== null)
							advs.push({ id, name, input, ap });
						break;
				}
			}
		}
		if (_filter !== '') {
			let filter = _filter.toLowerCase();
			advs = advs.filter(obj => obj.name.toLowerCase().match(filter));
		}
		advs.sort((a, b) => {
			if (a.name < b.name) {
				return -1;
			} else if (a.name > b.name) {
				return 1;
			} else {
				return 0;
			}
		});
		return advs;
	},

	getFilter: function() {
		return _filter;
	},

	getRating: function() {
		return _showRating;
	}

});

DisAdvStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {

		case ActionTypes.FILTER_DISADV:
			_updateFilterText(payload.text);
			break;

		case ActionTypes.CHANGE_DISADV_RATING:
			_updateRating();
			break;

		case ActionTypes.ACTIVATE_DISADV:
			_activate(payload);
			break;

		case ActionTypes.DEACTIVATE_DISADV:
			_deactivate(payload);
			break;

		case ActionTypes.UPDATE_DISADV_TIER:
			_updateTier(payload.id, payload.tier, payload.sid);
			break;

		case ActionTypes.RECEIVE_RAW_LISTS:
			DisAdvStore.init(payload.adv, payload.disadv);
			break;
		
		default:
			return true;
	}
	
	DisAdvStore.emitChange();

	return true;

});

export default DisAdvStore;
