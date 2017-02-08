import { get, getAllByCategory, getObjByCategory } from './ListStore';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
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
			const { active, id } = e;
			result.set(id, active);
		});
		return {
			active: Array.from(result),
			showRating: _showRating
		};
	}

	getActiveForView(category: ADVANTAGES | DISADVANTAGES) {
		const advsObj = getObjByCategory(category) as { [id: string]: Advantage } | { [id: string]: Disadvantage };
		const advs: {
			id: string;
			active: ActiveObject;
			index: number;
		}[] = [];
		for (const id in advsObj) {
			const adv = advsObj[id];
			const { active } = adv;
			active.forEach((e, index) => advs.push({ id, active: e, index }));
		}
		return advs;
	}

	getDeactiveForView(category: ADVANTAGES | DISADVANTAGES) {
		const advsObj = getObjByCategory(category) as { [id: string]: Advantage } | { [id: string]: Disadvantage };
		const advs: any[] = [];
		for (const id in advsObj) {
			const adv = advsObj[id];
			const { max, active, name, sel, input, tiers, cost, dependencies, reqs } = adv;
			// if (!validate(reqs, id) || dependencies.includes(false)) {
			// 	continue;
			// }
			if (max === null || active.length < max) {
				switch (id) {
					case 'ADV_4':
					case 'ADV_17': {
						const sel = adv.sel.filter(e => !adv.sid.includes(e[1]) && !dependencies.includes(e[1]));
						advs.push({ id, name, sel, cost });
						break;
					}
					case 'ADV_16': {
						const sel = adv.sel.filter(e => adv.sid.filter(d => d === e[1]).length < 2 && !dependencies.includes(e[1]));
						advs.push({ id, name, sel, cost });
						break;
					}
					case 'ADV_28':
					case 'ADV_29': {
						const sel = adv.sel.filter(e => !dependencies.includes(e[1]));
						advs.push({ id, name, sel });
						// advs.push({ id, name, sel, input });
						break;
					}
					case 'ADV_32': {
						const sel = adv.sel.filter(e => !(get('DISADV_24') as Disadvantage).sid.includes(e[1]) && !dependencies.includes(e[1]));
						advs.push({ id, name, sel, input, cost });
						break;
					}
					case 'ADV_47': {
						const sel = adv.sel.filter(e => !adv.sid.includes(e[1]) && !dependencies.includes(e[1]));
						advs.push({ id, name, sel, cost });
						break;
					}
					case 'DISADV_1': {
						const sel = adv.sel.map((e, index) => [e[0], index + 1]).filter(e => !dependencies.includes(e[1]));
						advs.push({ id, name, tiers, sel, input, cost });
						break;
					}
					case 'DISADV_24': {
						const sel = adv.sel.filter(e => !(get('ADV_32') as Advantage).sid.includes(e[1]) && !dependencies.includes(e[1]));
						advs.push({ id, name, sel, input, cost });
						break;
					}
					case 'DISADV_33':
					case 'DISADV_37':
					case 'DISADV_51': {
						let sel;
						if (adv.id === 'DISADV_33') {
							sel = adv.sel.filter(e => ([7,8].includes(e[1] as number) || !adv.sid.includes(e[1])) && !dependencies.includes(e[1]));
						}
						else {
							sel = adv.sel.filter(e => !adv.sid.includes(e[1]) && !dependencies.includes(e[1]));
						}
						advs.push({ id, name, sel, cost });
						break;
					}
					case 'DISADV_34':
					case 'DISADV_50': {
						const sel = adv.sel.filter(e => !dependencies.includes(e[1]));
						advs.push({ id, name, tiers, sel, input, cost });
						break;
					}
					case 'DISADV_36': {
						const sel = adv.sel.filter(e => !adv.sid.includes(e[1]) && !dependencies.includes(e[1]));
						advs.push({ id, name, sel, input, cost });
						break;
					}
					case 'DISADV_48': {
						const sel = adv.sel.filter(e => {
							if ((get('ADV_40') as Advantage).active.length > 0 || (get('ADV_46') as Advantage).active.length > 0) {
								if ((get(e[1] as string) as Liturgy | Spell | Talent).gr === 2) {
									return false;
								}
							}
							return !adv.sid.includes(e[1]) && !dependencies.includes(e[1]);
						});
						advs.push({ id, name, sel, cost });
						break;
					}
					case 'DISADV_45':
						advs.push({ id, name, sel, input, cost });
						break;

					default: {
						const tiers = adv.tiers !== null ? adv.tiers : undefined;
						const input = adv.input !== null ? adv.input : undefined;
						const sel = adv.sel.length > 0 ? adv.sel : undefined;
						advs.push({ id, name, cost, tiers, input, sel });
						break;
					}
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
