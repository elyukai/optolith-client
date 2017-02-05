import { get, getAllByCategory, getObjByCategory } from './ListStore';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import ELStore from './ELStore';
import Store from './Store';
import validate from '../utils/validate';

type Action = ReceiveHeroDataAction | SwitchDisAdvRatingVisibilityAction | ActivateDisAdvAction | DeactivateDisAdvAction | SetDisAdvTierAction;

const CATEGORY_1 = Categories.ADVANTAGES;
const CATEGORY_2 = Categories.DISADVANTAGES;

let _showRating = true;

function _updateRating() {
	_showRating = !_showRating;
}

function _updateAll(disadv: { showRating: boolean; }) {
	_showRating = disadv.showRating;
}

class DisAdvStoreStatic extends Store {

	getForSave() {
		const result = new Map();
		[ ...getAllByCategory(CATEGORY_1) as Advantage[], ...getAllByCategory(CATEGORY_2) as Disadvantage[] ].forEach(e => {
			let { active, id, sid, tier } = e;
			if (typeof active === 'boolean' && active) {
				result.set(id, { sid, tier });
			} else if (e.isMultiselect) {
				result.set(id, active);
			}
		});
		return {
			active: Array.from(result),
			showRating: _showRating
		};
	}

	getActiveForView(category: ADVANTAGES | DISADVANTAGES) {
		category = category ? CATEGORY_1 : CATEGORY_2;
		const advsObj = getObjByCategory(category) as { [id: string]: Advantage } | { [id: string]: Disadvantage };
		const advs = [];
		for (const id in advsObj) {
			const adv = advsObj[id];
			const { active, name, sel, tiers, cost, dependencies } = adv;
			if (active.length > 0) {
				const disabled = dependencies.length > 0;
				switch (id) {
					case 'ADV_47': {
						const skill = get(active[0].sid as string) as CombatTechnique;
						advs.push({ id, name, sid, add: skill.name, cost: (cost as number[])[skill.ic - 1], disabled });
						break;
					}
					case 'ADV_32':
					case 'DISADV_24':
					case 'DISADV_45':
						advs.push({ id, name, sid, add: typeof sid === 'number' ? sel[sid - 1][0] : sid, cost, disabled });
						break;
					default:
						if (adv.tiers !== null)
							advs.push({ id, name, tier, tiers, cost, disabled });
						else
							advs.push({ id, name, cost, disabled });
						break;
				}
			} else if (adv.isMultiselect) {
				let disabled = dependencies.length > 0;
				for (let i = 0; i < active.length; i++) {
					let sid;
					let add;
					let tier;
					let tiers;
					let cost;
					switch (id) {
						case 'ADV_4':
						case 'DISADV_48': {
							sid = adv.active[i];
							let skill = get(sid);
							add = skill.name;
							cost = adv.cost[skill.ic - 1];
							break;
						}
						case 'ADV_16':
						case 'ADV_17': {
							sid = adv.active[i];
							let skill = get(sid);
							let counter = 0;
							active.forEach(e => {
								if (e === sid) counter++;
							});
							add = skill.name;
							cost = adv.cost[skill.ic - 1];
							disabled = ELStore.getStart().max_skill + counter === skill.fw;
							break;
						}
						case 'ADV_28':
						case 'ADV_29':
							if (typeof active[i] === 'number') {
								sid = active[i];
								add = sel[sid - 1][0];
								cost = sel[sid - 1][2];
							} else {
								sid = adv.active[i][0];
								add = sid;
								cost = parseInt(adv.active[i][1]) / 2;
							}
							break;
						case 'DISADV_1':
							sid = adv.active[i][0];
							add = typeof sid === 'number' ? adv.sel[sid - 1][0] : sid;
							tier = adv.active[i][1];
							tiers = adv.tiers;
							cost = adv.cost;
							break;
						case 'DISADV_34':
						case 'DISADV_50': {
							let maxCurrentTier = active.reduce((a,b) => b[1] > a ? b[1] : a, 0);
							let subMaxCurrentTier = active.reduce((a,b) => b[1] > a && b[1] < maxCurrentTier ? b[1] : a, 0);
							sid = adv.active[i][0];
							add = typeof sid === 'number' ? adv.sel[sid - 1][0] : sid;
							tier = adv.active[i][1];
							tiers = adv.tiers;
							cost = maxCurrentTier > tier || active.filter(e => e[1] === tier).length > 1 ? 0 : adv.cost * (tier - subMaxCurrentTier);
							break;
						}
						case 'DISADV_33': {
							sid = Array.isArray(adv.active[i]) ? adv.active[i].join('&') : adv.active[i];
							let sid_alt = Array.isArray(adv.active[i]) ? adv.active[i][0] : sid;
							if (sid_alt === 7 && adv.active.filter(e => Array.isArray(e) && e[0] === 7).length > 1) {
								cost = 0;
							} else {
								cost = adv.sel[sid_alt - 1][2];
							}
							if ([7,8].indexOf(sid_alt) > -1) {
								add = `${adv.sel[sid_alt - 1][0]}: ${adv.active[i][1]}`;
							} else {
								add = adv.sel[sid_alt - 1][0];
							}
							if (Array.isArray(adv.active[i]) && (dependencies.includes(adv.active[i][0]) || dependencies.includes(adv.active[i].join('&')))) disabled = true;
							break;
						}
						case 'DISADV_36':
							sid = adv.active[i];
							add = typeof sid === 'number' ? adv.sel[sid - 1][0] : sid;
							cost = adv.active.length > 3 ? 0 : adv.cost;
							break;
						case 'DISADV_37':
						case 'DISADV_51':
							sid = adv.active[i];
							cost = adv.sel[sid - 1][2];
							add = adv.sel[sid - 1][0];
							break;
						default:
							if (adv.input !== null) {
								sid = adv.active[i];
								add = adv.active[i];
								cost = adv.cost;
							}
							break;
					}
					if (dependencies.includes(sid)) disabled = true;
					advs.push({ id, name, sid, add, cost, tier, tiers, disabled });
				}
			}
		}
		return advs;
	}

	getDeactiveForView(category) {
		category = category ? CATEGORY_1 : CATEGORY_2;
		let advsObj = getObjByCategory(category), advs = [];
		for (let id in advsObj) {
			let adv = advsObj[id];
			let { name, sel, input, tiers, cost, dependencies, reqs } = adv;
			if (!validate(reqs, id) || dependencies.includes(false)) continue;
			if (adv.active === false) {
				switch (id) {
					case 'ADV_47':
						advs.push({ id, name, sel, cost });
						break;
					case 'ADV_32': {
						let sel = adv.sel.filter(e => get('DISADV_24').sid !== e[1] && !dependencies.includes(e[1]));
						advs.push({ id, name, sel, input, cost });
						break;
					}
					case 'DISADV_24': {
						let sel = adv.sel.filter(e => get('ADV_32').sid !== e[1] && !dependencies.includes(e[1]));
						advs.push({ id, name, sel, input, cost });
						break;
					}
					case 'DISADV_45':
						advs.push({ id, name, sel, input, cost });
						break;
					default:
						if (adv.tiers !== null)
							advs.push({ id, name, tiers, cost });
						else
							advs.push({ id, name, cost });
						break;
				}
			} else if (adv.active.length === 0 || adv.max === false || adv.active.length < adv.max) {
				switch (id) {
					case 'ADV_4':
					case 'ADV_17': {
						let sel = adv.sel.filter(e => !adv.active.includes(e[1]) && !dependencies.includes(e[1]));
						advs.push({ id, name, sel, cost });
						break;
					}
					case 'ADV_16': {
						let sel = adv.sel.filter(e => adv.active.filter(c => c === e[1]).length < 2 && !dependencies.includes(e[1]));
						advs.push({ id, name, sel, cost });
						break;
					}
					case 'ADV_28':
					case 'ADV_29': {
						let sel = adv.sel.filter(e => !dependencies.includes(e[1]));
						advs.push({ id, name, sel });
						// advs.push({ id, name, sel, input });
						break;
					}
					case 'ADV_47': {
						let sel = adv.sel.filter(e => !adv.active.includes(e[1]) && !dependencies.includes(e[1]));
						advs.push({ id, name, sel, cost });
						break;
					}
					case 'DISADV_1': {
						let sel = adv.sel.map((e, index) => [e[0], index + 1]).filter(e => !dependencies.includes(e[1]));
						advs.push({ id, name, tiers, sel, input, cost });
						break;
					}
					case 'DISADV_33':
					case 'DISADV_37':
					case 'DISADV_51': {
						let sel;
						if (adv.id === 'DISADV_33')
							sel = adv.sel.filter(e => ([7,8].includes(e[1]) || !adv.active.includes(e[1])) && !dependencies.includes(e[1]));
						else
							sel = adv.sel.filter(e => !adv.active.includes(e[1]) && !dependencies.includes(e[1]));
						advs.push({ id, name, sel, cost });
						break;
					}
					case 'DISADV_34':
					case 'DISADV_50': {
						let sel = adv.sel.filter(e => !dependencies.includes(e[1]));
						advs.push({ id, name, tiers, sel, input, cost });
						break;
					}
					case 'DISADV_36': {
						let sel = adv.sel.filter(e => !adv.active.includes(e[1]) && !dependencies.includes(e[1]));
						advs.push({ id, name, sel, input, cost });
						break;
					}
					case 'DISADV_48': {
						let sel = adv.sel.filter(e => {
							if (this.get('ADV_40').active || this.get('ADV_46').active)
								if (this.get(e[1]).gr === 2)
									return false;
							return !adv.active.includes(e[1]) && !dependencies.includes(e[1]);
						});
						advs.push({ id, name, sel, cost });
						break;
					}
					default:
						if (adv.input !== null)
							advs.push({ id, name, input, cost });
						break;
				}
			}
		}
		return advs;
	}

	getRating() {
		return _showRating;
	}

}

const DisAdvStore = new DisAdvStoreStatic((action: Action) => {
	switch(action.type) {
		case ActionTypes.RECEIVE_HERO_DATA:
			_updateAll(action.payload.data.disadv);
			break;

		case ActionTypes.SWITCH_DISADV_RATING_VISIBILITY:
			_updateRating();
			break;

		case ActionTypes.ACTIVATE_DISADV:
		case ActionTypes.DEACTIVATE_DISADV:
		case ActionTypes.SET_DISADV_TIER:
			break;

		default:
			return true;
	}

	DisAdvStore.emitChange();
	return true;
});

export default DisAdvStore;
