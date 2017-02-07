import { get } from '../../stores/ListStore';
import * as Categories from '../../constants/Categories';
import * as DisAdvActions from '../../actions/DisAdvActions';
import * as React from 'react';
import IconButton from '../../components/IconButton';
import Dropdown from '../../components/Dropdown';
import ELStore from '../../stores/ELStore';

interface Active {
	id: string;
	active: ActiveObject;
	index: number;
}

interface RemoveObject {
	id: string;
	cost: number;
	index?: number;
}

interface Props {
	item: Active;
	phase: number;
}

export default class DisAdvRemoveListItem extends React.Component<Props, undefined> {
	handleSelectTier = (selectedTier: number) => {
		const { id, active: { sid, tier } } = this.props.item;
		const { cost, category } = get(id) as Advantage | Disadvantage;
		const finalCost = (selectedTier - tier) * (cost as number) * (category === Categories.DISADVANTAGES ? -1 : 1);
		DisAdvActions.setTier(id, selectedTier, finalCost, sid as string | number);
	};
	removeFromList = (args: RemoveObject) => DisAdvActions.removeFromList(args);

	render() {
		const { id, active: activeObject, index } = this.props.item;
		const { sid, sid2, tier } = activeObject;
		const a = get(id) as Advantage | Disadvantage;
		const { tiers, cost, category, sel, dependencies, active, input } = a;
		let disabled = false;
		let add = '';
		let currentCost: number | undefined = undefined;
		const args: RemoveObject = { id, index, cost: 0 };

		switch (id) {
			case 'ADV_4':
			case 'ADV_47':
			case 'DISADV_48': {
				const { name, ic } = (get(sid as string)) as CombatTechnique | Liturgy | Spell | Talent;
				add = name;
				currentCost = (cost as number[])[ic - 1];
				break;
			}
			case 'ADV_16': {
				const { name, ic, value } = (get(sid as string)) as Liturgy | Spell | Talent;
				const counter = a.active.reduce((e, obj) => obj.sid === sid ? e + 1 : e, 0);
				add = name;
				currentCost = (cost as number[])[ic - 1];
				disabled = disabled || ELStore.getStart().maxSkillRating + counter === value;
				break;
			}
			case 'ADV_17': {
				const { name, ic, value } = (get(sid as string)) as CombatTechnique;
				add = name;
				currentCost = (cost as number[])[ic - 1];
				disabled = disabled || ELStore.getStart().maxCombatTechniqueRating + 1 === value;
				break;
			}
			case 'ADV_28':
			case 'ADV_29':
				add = sel[sid as number - 1][0] as string;
				currentCost = sel[sid as number - 1][2] as number;
				break;
			case 'ADV_32':
			case 'DISADV_1':
			case 'DISADV_24':
			case 'DISADV_45':
				add = typeof sid === 'number' ? sel[sid - 1][0] as string : sid as string;
				break;
			case 'DISADV_34':
			case 'DISADV_50': {
				const maxCurrentTier = active.reduce((a,b) => b.tier > a ? b.tier as number : a, 0);
				const subMaxCurrentTier = active.reduce((a,b) => b.tier > a && b.tier < maxCurrentTier ? b.tier as number : a, 0);
				add = typeof sid === 'number' ? sel[sid - 1][0] as string : sid as string;
				currentCost = maxCurrentTier > tier || active.filter(e => e.tier === tier).length > 1 ? 0 : (cost as number) * (tier - subMaxCurrentTier);
				break;
			}
			case 'DISADV_33': {
				if (sid === 7 && active.filter(e => e.sid === 7).length > 1) {
					currentCost = 0;
				} else {
					currentCost = sel[sid as number - 1][2] as number;
				}
				if ([7,8].includes(sid as number)) {
					add = `${sel[sid as number - 1][0]}: ${sid2}`;
				} else {
					add = sel[sid as number - 1][0] as string;
				}
				break;
			}
			case 'DISADV_36':
				add = typeof sid === 'number' ? sel[sid - 1][0] as string : sid as string;
				currentCost = active.length > 3 ? 0 : cost as number;
				break;
			case 'DISADV_37':
			case 'DISADV_51':
				add = sel[sid as number - 1][0] as string;
				currentCost = sel[sid as number - 1][2] as number;
				break;
			default:
				if (input) {
					add = sid as string;
				}
				break;
		}

		let tierElement;
		const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
		if (tiers && !['DISADV_34','DISADV_50'].includes(id)) {
			const array = Array.from(Array(tiers).keys()).map(e => [roman[e], e + 1] as [string, number]);
			tierElement = (
				<Dropdown
					className="tiers"
					value={tier as number}
					onChange={this.handleSelectTier}
					options={array} />
			);
			currentCost = (cost as number) * tier;
		}

		let { name } = a;
		if (['ADV_28','ADV_29'].includes(id)) {
			name = `Immunität gegen ${add}`;
		}
		else if (id === 'DISADV_1') {
			name = `Angst vor ${add}`;
		}
		else if (['DISADV_34','DISADV_50'].includes(id)) {
			name  += ` ${roman[tier - 1]} (${add})`;
		}
		else if (add) {
			name += ` (${add})`;
		}

		if (!currentCost) {
			currentCost = cost as number;
		}
		if (category === Categories.DISADVANTAGES) {
			currentCost = -currentCost;
		}
		args.cost = -currentCost;

		if (active.some(e => Object.keys(activeObject).every((key: keyof ActiveObject) => activeObject[key] === e[key]) && Object.keys(activeObject).length === Object.keys(e).length) || dependencies.includes(true) && active.length === 1) {
			disabled = true;
		}

		return (
			<div className="list-item">
				<div className="name">
					<p className="title">{name}</p>
				</div>
				<div className="selections">
					{tierElement}
				</div>
				<div className="hr"></div>
				<div className="values">
					<div className="cost">{currentCost}</div>
				</div>
				<div className="btns">
					<IconButton icon="&#xE15B;" onClick={this.removeFromList.bind(null, args)} disabled={disabled} flat />
					<IconButton icon="&#xE88F;" flat disabled />
				</div>
			</div>
		);
	}
}

// import { get, getAllByCategory, getObjByCategory } from './ListStore';
// import * as ActionTypes from '../constants/ActionTypes';
// import * as Categories from '../constants/Categories';
// import ELStore from './ELStore';
// import Store from './Store';
// import validate from '../utils/validate';

// type Action = ReceiveHeroDataAction | SwitchDisAdvRatingVisibilityAction | ActivateDisAdvAction | DeactivateDisAdvAction | SetDisAdvTierAction;

// const CATEGORY_1 = Categories.ADVANTAGES;
// const CATEGORY_2 = Categories.DISADVANTAGES;

// let _showRating = true;

// function _updateRating() {
// 	_showRating = !_showRating;
// }

// function _updateAll(disadv: { showRating: boolean; }) {
// 	_showRating = disadv.showRating;
// }

// class DisAdvStoreStatic extends Store {

// 	getForSave() {
// 		const result = new Map();
// 		[ ...getAllByCategory(CATEGORY_1) as Advantage[], ...getAllByCategory(CATEGORY_2) as Disadvantage[] ].forEach(e => {
// 			let { active, id, sid, tier } = e;
// 			if (typeof active === 'boolean' && active) {
// 				result.set(id, { sid, tier });
// 			} else if (e.isMultiselect) {
// 				result.set(id, active);
// 			}
// 		});
// 		return {
// 			active: Array.from(result),
// 			showRating: _showRating
// 		};
// 	}

// 	getActiveForView(category: ADVANTAGES | DISADVANTAGES) {
// 		category = category ? CATEGORY_1 : CATEGORY_2;
// 		const advsObj = getObjByCategory(category) as { [id: string]: Advantage } | { [id: string]: Disadvantage };
// 		const advs = [];
// 		for (const id in advsObj) {
// 			const adv = advsObj[id];
// 			const { active, name, sel, tiers, cost, dependencies } = adv;
// 			if (active.length > 0) {
// 				const disabled = dependencies.length > 0;
// 				switch (id) {
// 					case 'ADV_47': {
// 						const skill = get(active[0].sid as string) as CombatTechnique;
// 						advs.push({ id, name, sid, add: skill.name, cost: (cost as number[])[skill.ic - 1], disabled });
// 						break;
// 					}
// 					case 'ADV_32':
// 					case 'DISADV_24':
// 					case 'DISADV_45':
// 						advs.push({ id, name, sid, add: typeof sid === 'number' ? sel[sid - 1][0] : sid, cost, disabled });
// 						break;
// 					default:
// 						if (adv.tiers !== null)
// 							advs.push({ id, name, tier, tiers, cost, disabled });
// 						else
// 							advs.push({ id, name, cost, disabled });
// 						break;
// 				}
// 			} else if (adv.isMultiselect) {
// 				let disabled = dependencies.length > 0;
// 				for (let i = 0; i < active.length; i++) {
// 					let sid;
// 					let add;
// 					let tier;
// 					let tiers;
// 					let cost;
// 					switch (id) {
// 						case 'ADV_4':
// 						case 'DISADV_48': {
// 							sid = adv.active[i];
// 							let skill = get(sid);
// 							add = skill.name;
// 							cost = adv.cost[skill.ic - 1];
// 							break;
// 						}
// 						case 'ADV_16':
// 						case 'ADV_17': {
// 							sid = adv.active[i];
// 							let skill = get(sid);
// 							let counter = 0;
// 							active.forEach(e => {
// 								if (e === sid) counter++;
// 							});
// 							add = skill.name;
// 							cost = adv.cost[skill.ic - 1];
// 							disabled = ELStore.getStart().max_skill + counter === skill.fw;
// 							break;
// 						}
// 						case 'ADV_28':
// 						case 'ADV_29':
// 							if (typeof active[i] === 'number') {
// 								sid = active[i];
// 								add = sel[sid - 1][0];
// 								cost = sel[sid - 1][2];
// 							} else {
// 								sid = adv.active[i][0];
// 								add = sid;
// 								cost = parseInt(adv.active[i][1]) / 2;
// 							}
// 							break;
// 						case 'DISADV_1':
// 							sid = adv.active[i][0];
// 							add = typeof sid === 'number' ? adv.sel[sid - 1][0] : sid;
// 							tier = adv.active[i][1];
// 							tiers = adv.tiers;
// 							cost = adv.cost;
// 							break;
// 						case 'DISADV_34':
// 						case 'DISADV_50': {
// 							let maxCurrentTier = active.reduce((a,b) => b[1] > a ? b[1] : a, 0);
// 							let subMaxCurrentTier = active.reduce((a,b) => b[1] > a && b[1] < maxCurrentTier ? b[1] : a, 0);
// 							sid = adv.active[i][0];
// 							add = typeof sid === 'number' ? adv.sel[sid - 1][0] : sid;
// 							tier = adv.active[i][1];
// 							tiers = adv.tiers;
// 							cost = maxCurrentTier > tier || active.filter(e => e[1] === tier).length > 1 ? 0 : adv.cost * (tier - subMaxCurrentTier);
// 							break;
// 						}
// 						case 'DISADV_33': {
// 							sid = Array.isArray(adv.active[i]) ? adv.active[i].join('&') : adv.active[i];
// 							let sid_alt = Array.isArray(adv.active[i]) ? adv.active[i][0] : sid;
// 							if (sid_alt === 7 && adv.active.filter(e => Array.isArray(e) && e[0] === 7).length > 1) {
// 								cost = 0;
// 							} else {
// 								cost = adv.sel[sid_alt - 1][2];
// 							}
// 							if ([7,8].indexOf(sid_alt) > -1) {
// 								add = `${adv.sel[sid_alt - 1][0]}: ${adv.active[i][1]}`;
// 							} else {
// 								add = adv.sel[sid_alt - 1][0];
// 							}
// 							if (Array.isArray(adv.active[i]) && (dependencies.includes(adv.active[i][0]) || dependencies.includes(adv.active[i].join('&')))) disabled = true;
// 							break;
// 						}
// 						case 'DISADV_36':
// 							sid = adv.active[i];
// 							add = typeof sid === 'number' ? adv.sel[sid - 1][0] : sid;
// 							cost = adv.active.length > 3 ? 0 : adv.cost;
// 							break;
// 						case 'DISADV_37':
// 						case 'DISADV_51':
// 							sid = adv.active[i];
// 							cost = adv.sel[sid - 1][2];
// 							add = adv.sel[sid - 1][0];
// 							break;
// 						default:
// 							if (adv.input !== null) {
// 								sid = adv.active[i];
// 								add = adv.active[i];
// 								cost = adv.cost;
// 							}
// 							break;
// 					}
// 					if (dependencies.includes(sid)) disabled = true;
// 					advs.push({ id, name, sid, add, cost, tier, tiers, disabled });
// 				}
// 			}
// 		}
// 		return advs;
// 	}

// 	getDeactiveForView(category) {
// 		category = category ? CATEGORY_1 : CATEGORY_2;
// 		let advsObj = getObjByCategory(category), advs = [];
// 		for (let id in advsObj) {
// 			let adv = advsObj[id];
// 			let { name, sel, input, tiers, cost, dependencies, reqs } = adv;
// 			if (!validate(reqs, id) || dependencies.includes(false)) continue;
// 			if (adv.active === false) {
// 				switch (id) {
// 					case 'ADV_47':
// 						advs.push({ id, name, sel, cost });
// 						break;
// 					case 'ADV_32': {
// 						let sel = adv.sel.filter(e => get('DISADV_24').sid !== e[1] && !dependencies.includes(e[1]));
// 						advs.push({ id, name, sel, input, cost });
// 						break;
// 					}
// 					case 'DISADV_24': {
// 						let sel = adv.sel.filter(e => get('ADV_32').sid !== e[1] && !dependencies.includes(e[1]));
// 						advs.push({ id, name, sel, input, cost });
// 						break;
// 					}
// 					case 'DISADV_45':
// 						advs.push({ id, name, sel, input, cost });
// 						break;
// 					default:
// 						if (adv.tiers !== null)
// 							advs.push({ id, name, tiers, cost });
// 						else
// 							advs.push({ id, name, cost });
// 						break;
// 				}
// 			} else if (adv.active.length === 0 || adv.max === false || adv.active.length < adv.max) {
// 				switch (id) {
// 					case 'ADV_4':
// 					case 'ADV_17': {
// 						let sel = adv.sel.filter(e => !adv.active.includes(e[1]) && !dependencies.includes(e[1]));
// 						advs.push({ id, name, sel, cost });
// 						break;
// 					}
// 					case 'ADV_16': {
// 						let sel = adv.sel.filter(e => adv.active.filter(c => c === e[1]).length < 2 && !dependencies.includes(e[1]));
// 						advs.push({ id, name, sel, cost });
// 						break;
// 					}
// 					case 'ADV_28':
// 					case 'ADV_29': {
// 						let sel = adv.sel.filter(e => !dependencies.includes(e[1]));
// 						advs.push({ id, name, sel });
// 						// advs.push({ id, name, sel, input });
// 						break;
// 					}
// 					case 'ADV_47': {
// 						let sel = adv.sel.filter(e => !adv.active.includes(e[1]) && !dependencies.includes(e[1]));
// 						advs.push({ id, name, sel, cost });
// 						break;
// 					}
// 					case 'DISADV_1': {
// 						let sel = adv.sel.map((e, index) => [e[0], index + 1]).filter(e => !dependencies.includes(e[1]));
// 						advs.push({ id, name, tiers, sel, input, cost });
// 						break;
// 					}
// 					case 'DISADV_33':
// 					case 'DISADV_37':
// 					case 'DISADV_51': {
// 						let sel;
// 						if (adv.id === 'DISADV_33')
// 							sel = adv.sel.filter(e => ([7,8].includes(e[1]) || !adv.active.includes(e[1])) && !dependencies.includes(e[1]));
// 						else
// 							sel = adv.sel.filter(e => !adv.active.includes(e[1]) && !dependencies.includes(e[1]));
// 						advs.push({ id, name, sel, cost });
// 						break;
// 					}
// 					case 'DISADV_34':
// 					case 'DISADV_50': {
// 						let sel = adv.sel.filter(e => !dependencies.includes(e[1]));
// 						advs.push({ id, name, tiers, sel, input, cost });
// 						break;
// 					}
// 					case 'DISADV_36': {
// 						let sel = adv.sel.filter(e => !adv.active.includes(e[1]) && !dependencies.includes(e[1]));
// 						advs.push({ id, name, sel, input, cost });
// 						break;
// 					}
// 					case 'DISADV_48': {
// 						let sel = adv.sel.filter(e => {
// 							if (this.get('ADV_40').active || this.get('ADV_46').active)
// 								if (this.get(e[1]).gr === 2)
// 									return false;
// 							return !adv.active.includes(e[1]) && !dependencies.includes(e[1]);
// 						});
// 						advs.push({ id, name, sel, cost });
// 						break;
// 					}
// 					default:
// 						if (adv.input !== null)
// 							advs.push({ id, name, input, cost });
// 						break;
// 				}
// 			}
// 		}
// 		return advs;
// 	}

// 	getRating() {
// 		return _showRating;
// 	}

// }

// const DisAdvStore = new DisAdvStoreStatic((action: Action) => {
// 	switch(action.type) {
// 		case ActionTypes.RECEIVE_HERO_DATA:
// 			_updateAll(action.payload.data.disadv);
// 			break;

// 		case ActionTypes.SWITCH_DISADV_RATING_VISIBILITY:
// 			_updateRating();
// 			break;

// 		case ActionTypes.ACTIVATE_DISADV:
// 		case ActionTypes.DEACTIVATE_DISADV:
// 		case ActionTypes.SET_DISADV_TIER:
// 			break;

// 		default:
// 			return true;
// 	}

// 	DisAdvStore.emitChange();
// 	return true;
// });

// export default DisAdvStore;

