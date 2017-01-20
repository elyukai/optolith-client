/// <reference path="../data.d.ts" />

import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import { ReceiveDataTablesAction, ReceiveHeroDataAction } from '../actions/ServerActions';
import { AddAttributePointAction, RemoveAttributePointAction } from '../actions/AttributesActions';
import { AddCombatTechniquePointAction, RemoveCombatTechniquePointAction } from '../actions/CombatTechniquesActions';
import { ActivateDisAdvAction, DeactivateDisAdvPointAction, SetDisAdvTierAction } from '../actions/DisAdvActions';
import { ActivateLiturgyAction, AddLiturgyPointAction, DeactivateLiturgyPointAction, RemoveLiturgyPointAction } from '../actions/LiturgiesActions';
import { ActivateSpecialAbilityAction, DeactivateSpecialAbilityPointAction, SetSpecialAbilityTierAction } from '../actions/SpecialAbilitiesActions';
import { ActivateSpellAction, AddSpellPointAction, DeactivateSpellPointAction, RemoveSpellPointAction } from '../actions/SpellsActions';
import { AddTalentPointAction, RemoveTalentPointAction } from '../actions/TalentsActions';
import { ValidationResult } from './RequirementsReducer';
import { getPrimaryAttrID } from '../utils/AbilityUtils';
import RaceReducer, { RaceState } from './RaceReducer';
import CultureReducer, { CultureState } from './CultureReducer';
import ProfessionReducer, { ProfessionState } from './ProfessionReducer';
import ProfessionVariantReducer, { ProfessionVariantState } from './ProfessionVariantReducer';
import rinit from '../utils/rinit';
import RequirementsReducer from './RequirementsReducer';

type Action = ReceiveDataTablesAction | ReceiveHeroDataAction | AddAttributePointAction | RemoveAttributePointAction | AddCombatTechniquePointAction | RemoveCombatTechniquePointAction | ActivateDisAdvAction | DeactivateDisAdvPointAction | SetDisAdvTierAction | ActivateLiturgyAction | AddLiturgyPointAction | DeactivateLiturgyPointAction | RemoveLiturgyPointAction | ActivateSpecialAbilityAction | DeactivateSpecialAbilityPointAction | SetSpecialAbilityTierAction | ActivateSpellAction | AddSpellPointAction | DeactivateSpellPointAction | RemoveSpellPointAction | AddTalentPointAction | RemoveTalentPointAction;

export interface AbilitiesState {
	readonly byId: {
		[id: string]: Advantage | Disadvantage | SpecialAbility | Attribute | CombatTechnique | Liturgy | Spell | Talent;
	};
	readonly allIds: string[];
	readonly attributes: string[];
	readonly combatTechniques: string[];
	readonly disAdvantages: string[];
	readonly liturgies: string[];
	readonly specialAbilities: string[];
	readonly spells: string[];
	readonly talents: string[];
}

type IncreasableType = Attribute | CombatTechnique | Liturgy | Spell | Talent;

const initialState = <AbilitiesState>{};

export default (state: AbilitiesState = initialState, action: Action, valid: ValidationResult): AbilitiesState => {
	switch (action.type) {
		case ActionTypes.RECEIVE_DATA_TABLES: {
			const { byId, allIds, byCategory } = rinit(action.payload.data);
			return { ...state, byId, allIds, ...byCategory };
		}

		case ActionTypes.RECEIVE_HERO_DATA:
			return state;

		case ActionTypes.ACTIVATE_SPELL:
		case ActionTypes.ACTIVATE_LITURGY:
			if (valid) {
				const id = action.payload.id;
				return { ...state, byId: { ...state.byId, [id]: { ...state.byId[id], active: true }}};
			}
			return state;

		case ActionTypes.DEACTIVATE_SPELL:
		case ActionTypes.DEACTIVATE_LITURGY:
			if (valid) {
				const id = action.payload.id;
				return { ...state, byId: { ...state.byId, [id]: { ...state.byId[id], active: false }}};
			}
			return state;

		case ActionTypes.ACTIVATE_DISADV:
		case ActionTypes.ACTIVATE_SPECIALABILITY:
			if (valid) {
				const { id, sel, sel2, input, tier } = action.payload;
				const obj = { ...state.byId[id] } as Advantage | Disadvantage | SpecialAbility;
				const adds = [];
				const newState: { [id: string]: Advantage | Disadvantage | SpecialAbility } = {};
				let new_sid: string | number;
				if (Array.isArray(obj.active)) {
					switch (id) {
						case 'ADV_4':
						case 'ADV_16':
						case 'DISADV_48':
							(obj.active as string[]).push(sel as string);
							new_sid = sel as string;
							break;
						case 'DISADV_1':
						case 'DISADV_34':
						case 'DISADV_50':
							if (input === '') {
								obj.active.push([sel as number, tier as number]);
							}
							else if (!obj.active.includes(input as string)) {
								obj.active.push([input as string, tier as number]);
							}
							break;
						case 'DISADV_33':
							if ([7,8].includes(sel as number) && input !== '') {
								if (!obj.active.includes(input as string)) {
									obj.active.push([sel as number, input as string]);
								}
							} else {
								obj.active.push(sel as number);
							}
							break;
						case 'DISADV_36':
							if (input === '') {
								obj.active.push(sel as number);
							}
							else if (obj.active.filter(e => e === input).length === 0) {
								obj.active.push(input as string);
							}
							break;
						case 'SA_10':
							if (!input) {
								obj.active.push([sel as string, sel2 as number]);
								adds.push([sel, obj.active.filter((e: (string | number | boolean)[]) => e[0] === sel).length * 6] as [string, number, undefined]);
							} else if (obj.active.filter((e: (string | number | boolean)[]) => e[0] === input).length === 0) {
								obj.active.push([sel as string, input]);
								adds.push([sel, obj.active.filter((e: (string | number | boolean)[]) => e[0] === sel).length * 6] as [string, number, undefined]);
							}
							break;
						case 'SA_30':
							obj.active.push([sel as number, tier as number]);
							break;
						default:
							if (sel)
								obj.active.push(sel);
							else if (input && obj.active.filter(e => e === input).length === 0)
								obj.active.push(input);
							break;
					}
				} else {
					if (tier) {
						newState[id] = { ...obj, active: true, tier };
					}
					if (sel) {
						if (obj.input && input) {
							newState[id] = { ...obj, active: true, sid: input };
						} else {
							newState[id] = { ...obj, active: true, sid: sel };
						}
					}
				}
				const reqObjects = obj.reqs.concat(adds).map((req: [string, string | number | boolean, string | number | boolean | undefined]) => {
					let id = req[0];
					const value = req[1];
					const option = req[2];
					if (id === 'auto_req' || option === 'TAL_GR_2') {
						return;
					}
					if (id === 'ATTR_PRIMARY') {
						id = getPrimaryAttrID(option as 1 | 2);
						return { ...state.byId[id], dependencies: [ ...state.byId[id].dependencies, value ] };
					}
					else {
						let sid;
						if (typeof option !== 'undefined') {
							if (typeof option !== 'number' && (typeof option === 'boolean' || Number.isNaN(parseInt(option)))) {
								if (option === 'sel') {
									sid = new_sid;
								} else {
									sid = option;
								}
							} else {
								sid = typeof option === 'number' ? option : parseInt(option);
							}
						} else {
							sid = value;
						}
						return { ...state.byId[id], sid, dependencies: [ ...state.byId[id].dependencies, value ] };
					}
				});

				// addDependencies(adds = [], sel) {
				// 	[].concat(this.reqs, adds).forEach(req => {
				// 		let [ id, value, option ] = req;
				// 		if (id === 'auto_req' || option === 'TAL_GR_2') {
				// 			return;
				// 		}
				// 		if (id === 'ATTR_PRIMARY') {
				// 			id = getPrimaryAttrID(option);
				// 			get(id).addDependency(value);
				// 		}
				// 		else {
				// 			let sid;
				// 			if (typeof option !== 'undefined') {
				// 				if (Number.isNaN(parseInt(option))) {
				// 					if (option === 'sel') {
				// 						sid = sel;
				// 					} else {
				// 						sid = option;
				// 					}
				// 				} else {
				// 					sid = parseInt(option);
				// 				}
				// 			} else {
				// 				sid = value;
				// 			}
				// 			get(id).addDependency(sid);
				// 		}
				// 	});
				// }
			}
			return state;

		case ActionTypes.DEACTIVATE_DISADV:
		case ActionTypes.DEACTIVATE_SPECIALABILITY:
			if (valid) {

				deactivate({ sid, tier }) {
					const adds = [];
					let old_sid;
					if (Array.isArray(this.active)) {
						switch (this.id) {
							case 'ADV_4':
							case 'ADV_16':
							case 'DISADV_48':
								this.active.splice(this.active.indexOf(sid), 1);
								old_sid = sid;
								break;
							case 'ADV_28':
							case 'ADV_29':
								if (typeof sid === 'number')
									this.active.splice(this.active.indexOf(sid), 1);
								else
									this.active = this.active.filter(e => e[0] !== sid);
								break;
							case 'DISADV_1':
							case 'DISADV_34':
							case 'DISADV_50':
								this.active = this.active.filter(e => e[0] !== sid);
								break;
							case 'DISADV_33':
								if (typeof sid === 'string') {
									const rawArr: string[] = sid.split('&');
									const arr: [number | string] = [parseInt(rawArr.shift()), rawArr.join('&')];
									for (let i = 0; i < this.active.length; i++) {
										if (this.active[i][0] === arr[0] && this.active[i][1] === arr[1]) {
											this.active.splice(i, 1);
											break;
										}
									}
								} else {
									this.active.splice(this.active.indexOf(sid), 1);
								}
								break;
							case 'SA_10': {
								let arr = sid.split('&');
								arr = [arr.shift(), arr.join('&')];
								for (let i = 0; i < this.active.length; i++) {
									if (this.active[i][0] === arr[0] && (this.active[i][1] === arr[1] || this.active[i][1] === parseInt(arr[1]))) {
										adds.push([arr[0], this.active.filter(e => e[0] === arr[0]).length * 6]);
										this.active.splice(i, 1);
										break;
									}
								}
								break;
							}
							case 'SA_30':
								this.active = this.active.filter(e => e[0] !== sid);
								break;
							default:
								if (sid)
									this.active.splice(this.active.indexOf(sid), 1);
								break;
						}
					} else {
						this.active = false;
						if (tier) {
							delete this.tier;
						}
						if (this.sid) {
							delete this.sid;
						}
					}
					this.removeDependencies(adds, old_sid);
				}


				removeDependencies(adds = [], sel) {
					[].concat(this.reqs, adds).forEach(req => {
						let [ id, value, option ] = req;
						if (id === 'auto_req' || option === 'TAL_GR_2') {
							return;
						}
						if (id === 'ATTR_PRIMARY') {
							id = getPrimaryAttrID(option);
							get(id).removeDependency(value);
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
							get(id).removeDependency(sid);
						}
					});
				}
			}
			return state;

		case ActionTypes.SET_DISADV_TIER:
		case ActionTypes.SET_SPECIALABILITY_TIER:
			if (valid) {
				const id = action.payload.id;
				const sid = action.payload.sid;
				const tier = action.payload.tier;
				const ability = state.byId[id] as Disadvantage | SpecialAbility;
				if (sid) {
					switch (id) {
						case 'DISADV_1':
						case 'SA_30':
							return { ...state, byId: { ...state.byId, [id]: { ...ability, active: [
								...(ability.active as (string | number | boolean)[][]).map(e => {
									if (e[0] === sid) {
										return e.splice(1, 1, tier);
									}
									return e;
								})
							]}}};

						default:
							return { ...state, byId: { ...state.byId, [id]: { ...ability, tier }}};
					}
				}
				else {
					return { ...state, byId: { ...state.byId, [id]: { ...ability, tier }}};
				}
			}
			return state;

		case ActionTypes.ADD_ATTRIBUTE_POINT:
		case ActionTypes.ADD_TALENT_POINT:
		case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
		case ActionTypes.ADD_SPELL_POINT:
		case ActionTypes.ADD_LITURGY_POINT:
			if (valid) {
				const id = action.payload.id;
				return { ...state, byId: { ...state.byId, [id]: { ...state.byId[id], value: (state.byId[id] as IncreasableType).value + 1 }}};
			}
			return state;

		case ActionTypes.REMOVE_ATTRIBUTE_POINT:
		case ActionTypes.REMOVE_TALENT_POINT:
		case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
		case ActionTypes.REMOVE_SPELL_POINT:
		case ActionTypes.REMOVE_LITURGY_POINT:
			if (valid) {
				const id = action.payload.id;
				return { ...state, byId: { ...state.byId, [id]: { ...state.byId[id], value: (state.byId[id] as IncreasableType).value - 1 }}};
			}
			return state;

		default:
			return state;
	}
	// if (action.type === ActionTypes.RECEIVE_DATA_TABLES) {
	// 	return { ...state, ...init(action.payload.data) as HeroState };
	// }
	// else if (action.type === ActionTypes.FETCH_CHARACTER_DATA) {
	// 	_updateAll(payload);
	// }
	// else if (action.type === ActionTypes.ASSIGN_RCP_ENTRIES) {
	// 	_assignRCP(payload.selections);
	// }
	// else if (action.type === ActionTypes.CLEAR_HERO || action.type === ActionTypes.CREATE_NEW_HERO) {
	// 	_assignRCP(payload.selections);
	// }
}
