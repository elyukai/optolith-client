/// <reference path="../actions/Actions.d.ts" />

import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import AppDispatcher from '../dispatcher/AppDispatcher';
import * as ActivatableUtils from '../utils/ActivatableUtils';
import * as AttributeUtils from '../utils/AttributeUtils';
import * as CombatTechniqueUtils from '../utils/CombatTechniqueUtils';
import { final } from '../utils/iccalc';
import * as IncreasableUtils from '../utils/IncreasableUtils';
import init from '../utils/init';
import * as LiturgyUtils from '../utils/LiturgyUtils';
import * as SpellUtils from '../utils/SpellUtils';
import * as TalentUtils from '../utils/TalentUtils';
import CultureStore from './CultureStore';
import ELStore from './ELStore';
import ProfessionStore from './ProfessionStore';
import ProfessionVariantStore from './ProfessionVariantStore';
import RaceStore from './RaceStore';
import RequirementsStore from './RequirementsStore';
import Store from './Store';

type Action = ReceiveInitialDataAction | ReceiveHeroDataAction | CreateHeroAction | AddAttributePointAction | RemoveAttributePointAction | AddCombatTechniquePointAction | RemoveCombatTechniquePointAction | ActivateDisAdvAction | DeactivateDisAdvAction | SetDisAdvTierAction | ActivateLiturgyAction | AddLiturgyPointAction | DeactivateLiturgyAction | RemoveLiturgyPointAction | ActivateSpecialAbilityAction | DeactivateSpecialAbilityAction | SetSpecialAbilityTierAction | ActivateSpellAction | AddSpellPointAction | DeactivateSpellAction | RemoveSpellPointAction | AddTalentPointAction | RemoveTalentPointAction | SetSelectionsAction;

class ListStoreStatic extends Store {
	readonly dispatchToken: string;
	private byId: ToListById<Instance> = {};
	private allIds: string[] = [];

	constructor() {
		super();

		this.dispatchToken = AppDispatcher.register((action: Action) => {
			AppDispatcher.waitFor([RequirementsStore.dispatchToken]);
			if (action.undo) {
				switch (action.type) {
					case ActionTypes.ACTIVATE_SPELL:
					case ActionTypes.ACTIVATE_LITURGY:
						this.deactivate(action.payload.id);
						break;

					case ActionTypes.DEACTIVATE_SPELL:
					case ActionTypes.DEACTIVATE_LITURGY:
						this.activate(action.payload.id);
						break;

					case ActionTypes.ACTIVATE_DISADV:
					case ActionTypes.ACTIVATE_SPECIALABILITY:
						const id = action.payload.id;
						const index = action.payload.index!;
						const active = action.payload.activeObject!;
						const adds = [];
						let sid;
						switch (id) {
							case 'ADV_4':
							case 'ADV_16':
							case 'DISADV_48':
								sid = active.sid as string;
								break;
							case 'SA_10':
								adds.push({ id: active.sid as string, value: (this.byId[id] as ActivatableInstance).active.filter(e => e.sid === active.sid).length * 6 });
								break;
						}
						ActivatableUtils.removeDependencies(this.byId[id] as ActivatableInstance, adds, sid);
						(this.byId[id] as ActivatableInstance).active.splice(index, 1);
						break;

					case ActionTypes.DEACTIVATE_DISADV:
					case ActionTypes.DEACTIVATE_SPECIALABILITY: {
						const id = action.payload.id;
						const index = action.payload.index;
						const active = action.payload.activeObject!;
						(this.byId[id] as ActivatableInstance).active.splice(index, 0, active);
						const adds = [];
						let sid;
						switch (id) {
							case 'ADV_4':
							case 'ADV_16':
							case 'DISADV_48':
								sid = active.sid as string;
								break;
							case 'SA_10':
								adds.push({ id: active.sid as string, value: (this.byId[id] as ActivatableInstance).active.filter(e => e.sid === active.sid).length * 6 });
								break;
						}
						ActivatableUtils.addDependencies(this.byId[id] as ActivatableInstance, adds, sid);
						break;
					}

					case ActionTypes.SET_DISADV_TIER:
					case ActionTypes.SET_SPECIALABILITY_TIER:
						this.updateTier(action.payload.id, action.payload.index, action.payload.tier);
						break;

					case ActionTypes.ADD_ATTRIBUTE_POINT:
					case ActionTypes.ADD_TALENT_POINT:
					case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
					case ActionTypes.ADD_SPELL_POINT:
					case ActionTypes.ADD_LITURGY_POINT:
						this.removePoint(action.payload.id);
						break;

					case ActionTypes.REMOVE_ATTRIBUTE_POINT:
					case ActionTypes.REMOVE_TALENT_POINT:
					case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
					case ActionTypes.REMOVE_SPELL_POINT:
					case ActionTypes.REMOVE_LITURGY_POINT:
						this.addPoint(action.payload.id);
						break;

					default:
						return true;
				}
			}
			else {
				switch (action.type) {
					case ActionTypes.RECEIVE_INITIAL_DATA:
						this.init(action.payload.tables);
						break;

					case ActionTypes.RECEIVE_HERO_DATA:
						this.updateAll(action.payload.data);
						break;

					case ActionTypes.ASSIGN_RCP_OPTIONS:
						this.assignRCP(action.payload);
						break;

					case ActionTypes.CREATE_HERO:
						this.clear();
						break;

					case ActionTypes.ACTIVATE_SPELL:
					case ActionTypes.ACTIVATE_LITURGY:
						if (RequirementsStore.isValid()) {
							this.activate(action.payload.id);
						}
						break;

					case ActionTypes.DEACTIVATE_SPELL:
					case ActionTypes.DEACTIVATE_LITURGY:
						if (RequirementsStore.isValid()) {
							this.deactivate(action.payload.id);
						}
						break;

					case ActionTypes.ACTIVATE_DISADV:
					case ActionTypes.ACTIVATE_SPECIALABILITY:
						if (RequirementsStore.isValid()) {
							this.activateDASA(action.payload.id, action.payload);
						}
						break;

					case ActionTypes.DEACTIVATE_DISADV:
					case ActionTypes.DEACTIVATE_SPECIALABILITY:
						if (RequirementsStore.isValid()) {
							this.deactivateDASA(action.payload.id, action.payload.index);
						}
						break;

					case ActionTypes.SET_DISADV_TIER:
					case ActionTypes.SET_SPECIALABILITY_TIER:
						if (RequirementsStore.isValid()) {
							this.updateTier(action.payload.id, action.payload.index, action.payload.tier);
						}
						break;

					case ActionTypes.ADD_ATTRIBUTE_POINT:
					case ActionTypes.ADD_TALENT_POINT:
					case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
					case ActionTypes.ADD_SPELL_POINT:
					case ActionTypes.ADD_LITURGY_POINT:
						if (RequirementsStore.isValid()) {
							this.addPoint(action.payload.id);
						}
						break;

					case ActionTypes.REMOVE_ATTRIBUTE_POINT:
					case ActionTypes.REMOVE_TALENT_POINT:
					case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
					case ActionTypes.REMOVE_SPELL_POINT:
					case ActionTypes.REMOVE_LITURGY_POINT:
						if (RequirementsStore.isValid()) {
							this.removePoint(action.payload.id);
						}
						break;

					default:
						return true;
				}
			}

			ListStore.emitChange();
			return true;
		});
	}

	get(id: string) {
		return this.byId[AttributeUtils.convertId(id)];
	}

	getObjByCategory(...categories: Category[]) {
		const list: { [id: string]: Instance } = {};
		for (const id in this.byId) {
			if (this.byId.hasOwnProperty(id)) {
				const obj = this.byId[id];
				if (categories.includes(obj.category)) {
					list[id] = obj;
				}
			}
		}
		return list;
	}

	getObjByCategoryGroup(category: Category, ...gr: number[]) {
		const list: ToListById<Instance> = {};
		for (const id in this.byId) {
			if (this.byId.hasOwnProperty(id)) {
				const obj = this.byId[id] as TalentInstance | CombatTechniqueInstance | SpellInstance | LiturgyInstance | SpecialAbilityInstance;
				if (obj.category === category && gr.includes(obj.gr)) {
					list[id] = obj;
				}
			}
		}
		return list;
	}

	getAllByCategory(...categories: Category[]) {
		const list = [];
		for (const id in this.byId) {
			if (this.byId.hasOwnProperty(id)) {
				const obj = this.byId[id];
				if (categories.includes(obj.category)) {
					list.push(obj);
				}
			}
		}
		return list;
	}

	getAllByCategoryGroup(category: Category, ...gr: number[]) {
		const list = [];
		for (const id in this.byId) {
			if (this.byId.hasOwnProperty(id)) {
				const obj = this.byId[id] as TalentInstance | CombatTechniqueInstance | SpellInstance | LiturgyInstance | SpecialAbilityInstance;
				if (obj.category === category && gr.includes(obj.gr)) {
					list.push(obj);
				}
			}
		}
		return list;
	}

	getPrimaryAttrID(type: 1 | 2) {
		let attr;
		if (type === 1) {
			const tradition = get('SA_86') as SpecialAbilityInstance;
			switch (ActivatableUtils.getSids(tradition)[0]) {
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
			const tradition = get('SA_102') as SpecialAbilityInstance;
			switch (ActivatableUtils.getSids(tradition)[0]) {
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
		return attr;
	}

	getPrimaryAttr(type: 1 | 2) {
		const id = getPrimaryAttrID(type);
		if (id) {
			return get(id) as AttributeInstance;
		}
		return;
	}

	getCostListForProfessionDependencies(reqs: RequirementObject[]) {
		const totalCost = reqs.map<number | ProfessionDependencyCost>(req => {
			const { id, sid, sid2, tier, value } = req;
			const obj = get(id as string) as Instance & { tiers?: number };

			switch (obj.category) {
				case Categories.ATTRIBUTES: {
					const values: number[] = Array.from({ length: value! - 8 }, ({}, i) => i + 8);
					this.byId[id as string] = IncreasableUtils.set(obj, value!);
					return values.map(e => final(5, e)).reduce((a, b) => a + b, 0);
				}

				case Categories.TALENTS: {
					const values: number[] = Array.from({ length: value! - obj.value }, ({}, i) => i + obj.value);
					this.byId[id as string] = IncreasableUtils.set(obj, value!);
					return values.map(e => final(obj.ic, e)).reduce((a, b) => a + b, 0);
				}

				case Categories.ADVANTAGES:
				case Categories.DISADVANTAGES:
				case Categories.SPECIAL_ABILITIES: {
					let cost;
					const activeObject = { sid: sid as string | number | undefined, sid2, tier };

					const checkIfActive = (e: ActiveObject) => Object.keys(activeObject).every((key: keyof ActiveObject) => {
						return activeObject[key] === e[key];
					});

					if (!obj.active.find(checkIfActive)) {
						(this.byId[id as string] as ActivatableInstance).active.push(activeObject);
						this.byId = {
							...this.byId,
							...ActivatableUtils.addDependencies(obj),
						};
						if (obj.tiers) {
							cost = (obj.cost as number) * tier!;
						}
						else if (obj.sel.length > 0) {
							cost = obj.sel[(sid as number) - 1].cost!;
						}
						else {
							cost = obj.cost as number;
						}
						if (cost && (obj.category === Categories.ADVANTAGES || obj.category === Categories.DISADVANTAGES)) {
							const isKar = obj.reqs.some(e => e !== 'RCP' && e.id === 'ADV_12' && !!e.active);
							const isMag = obj.reqs.some(e => e !== 'RCP' && e.id === 'ADV_50' && !!e.active);
							const index = isKar ? 2 : isMag ? 1 : 0;

							cost = {
								adv: [0, 0, 0],
								disadv: [0, 0, 0],
								total: obj.category === Categories.DISADVANTAGES ? -cost : cost,
							} as ProfessionDependencyCost;

							if (obj.category === Categories.ADVANTAGES) {
								cost.adv[0] = cost.total;
								if (index > 0) {
									cost.adv[index] = cost.total;
								}
							}
							else {
								cost.disadv[0] = -cost.total;
								if (index > 0) {
									cost.disadv[index] = -cost.total;
								}
							}
						}
					}
					return cost || 0;
				}
			}
			return 0;
		});
		return totalCost;
	}

	getSpareAPForCombatTechniques() {
		const allCombatTechniques = this.getAllByCategory(Categories.COMBAT_TECHNIQUES) as CombatTechniqueInstance[];
		const combatTechniqueValueMax = ELStore.getStart().maxCombatTechniqueRating;
		const valueTooHigh = allCombatTechniques.filter(e => e.value > combatTechniqueValueMax);
		valueTooHigh.forEach(e => {
			this.byId[e.id] = IncreasableUtils.set(e, combatTechniqueValueMax);
		});
		return valueTooHigh.reduce<number>((ap, instance) => {
			const values: number[] = Array.from({ length: instance.value - combatTechniqueValueMax }, ({}, i) => i + combatTechniqueValueMax + 1);
			return ap + values.map(e => final(instance.ic, e)).reduce((a, b) => a + b, 0);
		}, 0);
	}

	private activate(id: string) {
		(this.byId[id] as LiturgyInstance | SpellInstance).active = true;
	}

	private deactivate(id: string) {
		(this.byId[id] as LiturgyInstance | SpellInstance).active = false;
	}

	private addPoint(id: string) {
		this.byId[id] = IncreasableUtils.addPoint(this.byId[id] as IncreasableInstance);
	}

	private removePoint(id: string) {
		this.byId[id] = IncreasableUtils.removePoint(this.byId[id] as IncreasableInstance);
	}

	private setValue(id: string, value: number) {
		this.byId[id] = IncreasableUtils.set(this.byId[id] as IncreasableInstance, value);
	}

	private addSR(id: string, value: number) {
		this.byId[id] = IncreasableUtils.add(this.byId[id] as IncreasableInstance, value);
	}

	private activateDASA(id: string, args: ActivateArgs) {
		this.mergeIntoList(ActivatableUtils.activate(this.byId[id] as ActivatableInstance, args));
	}

	private deactivateDASA(id: string, index: number) {
		this.mergeIntoList(ActivatableUtils.deactivate(this.byId[id] as ActivatableInstance, index));
		if (id === 'SA_125') {
			this.setValue('CT_17', 6);
		}
	}

	private updateTier(id: string, index: number, tier: number) {
		this.byId[id] = ActivatableUtils.setTier(this.byId[id] as ActivatableInstance, index, tier);
	}

	private mergeIntoList(list: ToListById<Instance>) {
		this.byId = {
			...this.byId,
			...list,
		};
	}

	private init(data: RawTables) {
		this.byId = init(data);
		this.allIds = Object.keys(this.byId);
	}

	private updateAll({ attr, talents, ct, spells, chants, activatable }: Hero) {
		attr.values.forEach(e => {
			const [ id, value, mod ] = e;
			this.setValue(id, value);
			(this.byId[id] as AttributeInstance).mod = mod;
		});
		const flatSkills = { ...talents, ...ct };
		Object.keys(flatSkills).forEach(id => {
			this.setValue(id, flatSkills[id]);
		});
		const activateSkills = { ...spells, ...chants };
		Object.keys(activateSkills).forEach(id => {
			const value = activateSkills[id];
			this.activate(id);
			if (value !== null) {
				this.setValue(id, value);
			}
		});
		Object.keys(activatable).forEach(id => {
			const values = activatable[id];
			(this.byId[id] as ActivatableInstance).active = values;
			switch (id) {
				case 'ADV_4':
				case 'ADV_16':
				case 'DISADV_48':
					values.forEach(p => {
						const list = ActivatableUtils.addDependencies(this.byId[id] as ActivatableInstance, [], p.sid as string);
						this.mergeIntoList(list);
					});
					break;
				case 'SA_10': {
					const counter = new Map();
					values.forEach(p => {
						if (counter.has(p.sid)) {
							counter.set(p.sid, counter.get(p.sid) + 1);
						} else {
							counter.set(p.sid, 1);
						}
						const addRequire = { id: p.sid, value: counter.get(p.sid) * 6 } as RequirementObject;
						const list = ActivatableUtils.addDependencies(this.byId[id] as ActivatableInstance, [addRequire]);
						this.mergeIntoList(list);
					});
					break;
				}
				default:
					values.forEach(() => {
						const list = ActivatableUtils.addDependencies(this.byId[id] as ActivatableInstance);
						this.mergeIntoList(list);
					});
			}
		});
	}

	private assignRCP(selections: Selections) {
		const race = RaceStore.getCurrent();
		const culture = CultureStore.getCurrent();
		const profession = ProfessionStore.getCurrent();
		const professionVariant = ProfessionVariantStore.getCurrent();

		const skillRatingList = new Map<string, number>();
		const addToSkillRatingList = (id: string, value: number) => {
			if (skillRatingList.has(id)) {
				skillRatingList.set(id, skillRatingList.get(id)! + value);
			}
			else {
				skillRatingList.set(id, value);
			}
		};
		const skillActivateList = new Set<string>();
		const activatable = new Set<RequirementObject>();
		const languages = new Map<number, number>();
		const scripts = new Set<number>();

		// Race selections:

		race!.attributes.forEach(e => {
			const [ mod, id ] = e;
			(this.byId[id] as AttributeInstance).mod += mod;
		});
		race!.autoAdvantages.forEach(e => activatable.add({ id: e }));
		(this.byId[selections.attrSel] as AttributeInstance).mod = race!.attributeSelection[0];

		// Culture selections:

		if (selections.useCulturePackage) {
			culture!.talents.forEach(([ key, value ]) => {
				skillRatingList.set(key, value);
			});
		}

		const motherTongueId = culture!.languages.length > 1 ? selections.lang : culture!.languages[0];
		languages.set(motherTongueId, 4);

		if (selections.buyLiteracy) {
			const motherTongueScriptId = culture!.scripts.length > 1 ? selections.litc : culture!.scripts[0];
			scripts.add(motherTongueScriptId);
		}

		// Profession selections:

		[ ...profession!.talents, ...profession!.combatTechniques ].forEach(([ key, value ]) => {
			addToSkillRatingList(key, value);
		});
		[ ...profession!.spells, ...profession!.liturgies ].forEach(([ key, value ]) => {
			skillActivateList.add(key);
			if (typeof value === 'number') {
				addToSkillRatingList(key, value);
			}
		});
		profession!.specialAbilities.forEach(e => activatable.add(e));

		if (professionVariant) {
			[ ...professionVariant.talents, ...professionVariant.combatTechniques ].forEach(([ key, value ]) => {
				addToSkillRatingList(key, value);
			});
			professionVariant.specialAbilities.forEach(e => {
				if (e.active === false) {
					activatable.forEach(i => {
						if (i.id === e.id) {
							activatable.delete(i);
						}
					});
				}
				else {
					activatable.add(e);
				}
			});
		}

		if (selections.spec !== null) {
			const talentId = (selections.map.get('SPECIALISATION') as SpecialisationSelection).sid;
			if (Array.isArray(talentId)) {
				activatable.add({
					id: 'SA_10',
					sid: selections.specTalentId!,
					sid2: selections.spec,
				});
			}
			else {
				activatable.add({
					id: 'SA_10',
					sid: talentId,
					sid2: selections.spec,
				});
			}
		}

		selections.langLitc.forEach((value, key) => {
			const [ category, id ] = key.split('_');
			if (category === 'LANG') {
				languages.set(Number.parseInt(id), value / 2);
			} else {
				scripts.add(Number.parseInt(id));
			}
		});

		selections.combattech.forEach(e => {
			addToSkillRatingList(e, (selections.map.get('COMBAT_TECHNIQUES') as CombatTechniquesSelection).value);
		});

		selections.combatTechniquesSecond.forEach(e => {
			addToSkillRatingList(e, (selections.map.get('COMBAT_TECHNIQUES_SECOND') as CombatTechniquesSelection).value);
		});

		selections.cantrips.forEach(e => {
			skillActivateList.add(e);
		});

		selections.curses.forEach((value, key) => {
			skillRatingList.set(key, value);
		});

		// Apply:

		skillRatingList.forEach((value, key) => this.addSR(key, value));
		skillActivateList.forEach(e => this.activate(e));

		activatable.forEach(req => {
			const { id, sid, sid2, tier } = req;
			const obj = get(id as string) as ActivatableInstance;
			const add: RequirementObject[] = [];
			if (id === 'SA_10') {
				obj.active.push({ sid: sid as string, sid2 });
				add.push({ id: sid as string, value: (obj.active.filter(e => e.sid === sid).length + 1) * 6 });
			} else {
				obj.active.push({ sid: sid as string | number | undefined, sid2, tier });
			}
			ActivatableUtils.addDependencies(obj, add);
		});
		(this.byId.SA_28 as SpecialAbilityInstance).active.push(...Array.from(scripts.values()).map(sid => ({ sid })));
		(this.byId.SA_30 as SpecialAbilityInstance).active.push(...Array.from(languages.entries()).map(([sid, tier]) => ({ sid, tier })));
	}

	private clear() {
		for (const id in this.byId) {
			if (this.byId.hasOwnProperty(id)) {
				const e = this.byId[id];
				if (e.category === Categories.ATTRIBUTES) {
					this.byId[id] = AttributeUtils.reset(e);
				}
				else if (e.category === Categories.COMBAT_TECHNIQUES) {
					this.byId[id] = CombatTechniqueUtils.reset(e);
				}
				else if (e.category === Categories.LITURGIES) {
					this.byId[id] = LiturgyUtils.reset(e);
				}
				else if (e.category === Categories.SPELLS) {
					this.byId[id] = SpellUtils.reset(e);
				}
				else if (e.category === Categories.TALENTS) {
					this.byId[id] = TalentUtils.reset(e);
				}
				else if (e.category === Categories.ADVANTAGES || e.category === Categories.DISADVANTAGES || e.category === Categories.SPECIAL_ABILITIES) {
					this.byId[id] = ActivatableUtils.reset(e);
				}
			}
		}
	}
}

const ListStore = new ListStoreStatic();

export default ListStore;

export const get = (id: string) => ListStore.get(id);

export const getObjByCategory = (...categories: Category[]) => ListStore.getObjByCategory(...categories);

export const getObjByCategoryGroup = (category: Category, ...gr: number[]) => ListStore.getObjByCategoryGroup(category, ...gr);

export const getAllByCategory = (...categories: Category[]) => ListStore.getAllByCategory(...categories);

export const getAllByCategoryGroup = (category: Category, ...gr: number[]) => ListStore.getAllByCategoryGroup(category, ...gr);

export const getPrimaryAttrID = (type: 1 | 2) => ListStore.getPrimaryAttrID(type);

export const getPrimaryAttr = (type: 1 | 2) => ListStore.getPrimaryAttr(type);
