import { last } from 'lodash';
import { AddAttributePointAction, RemoveAttributePointAction } from '../actions/AttributesActions';
import { AddCombatTechniquePointAction, RemoveCombatTechniquePointAction } from '../actions/CombatTechniquesActions';
import { ActivateDisAdvAction, DeactivateDisAdvAction, SetDisAdvTierAction } from '../actions/DisAdvActions';
import { ReceiveInitialDataAction } from '../actions/FileActions';
import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import { ActivateLiturgyAction, AddLiturgyPointAction, DeactivateLiturgyAction, RemoveLiturgyPointAction } from '../actions/LiturgiesActions';
import { SetSelectionsAction } from '../actions/ProfessionActions';
import { ActivateSpecialAbilityAction, DeactivateSpecialAbilityAction, SetSpecialAbilityTierAction } from '../actions/SpecialAbilitiesActions';
import { ActivateSpellAction, AddSpellPointAction, DeactivateSpellAction, RemoveSpellPointAction } from '../actions/SpellsActions';
import { AddTalentPointAction, RemoveTalentPointAction } from '../actions/TalentsActions';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import { AppDispatcher } from '../dispatcher/AppDispatcher';
import * as Data from '../types/data.d';
import { RawLocaleList, RawTables } from '../types/rawdata.d';
import * as ActivatableUtils from '../utils/ActivatableUtils';
import * as AttributeUtils from '../utils/AttributeUtils';
import * as CombatTechniqueUtils from '../utils/CombatTechniqueUtils';
import * as DependentUtils from '../utils/DependentUtils';
import { final } from '../utils/iccalc';
import * as IncreasableUtils from '../utils/IncreasableUtils';
import { init } from '../utils/init';
import * as LiturgyUtils from '../utils/LiturgyUtils';
import * as SpellUtils from '../utils/SpellUtils';
import * as TalentUtils from '../utils/TalentUtils';
import { CultureStore } from './CultureStore';
import { ELStore } from './ELStore';
import { LocaleStore } from './LocaleStore';
import { ProfessionStore } from './ProfessionStore';
import { ProfessionVariantStore } from './ProfessionVariantStore';
import { RaceStore } from './RaceStore';
import { RequirementsStore } from './RequirementsStore';
import { Store } from './Store';

type Action = ReceiveInitialDataAction | LoadHeroAction | CreateHeroAction | AddAttributePointAction | RemoveAttributePointAction | AddCombatTechniquePointAction | RemoveCombatTechniquePointAction | ActivateDisAdvAction | DeactivateDisAdvAction | SetDisAdvTierAction | ActivateLiturgyAction | AddLiturgyPointAction | DeactivateLiturgyAction | RemoveLiturgyPointAction | ActivateSpecialAbilityAction | DeactivateSpecialAbilityAction | SetSpecialAbilityTierAction | ActivateSpellAction | AddSpellPointAction | DeactivateSpellAction | RemoveSpellPointAction | AddTalentPointAction | RemoveTalentPointAction | SetSelectionsAction;

class ListStoreStatic extends Store {
	readonly dispatchToken: string;
	private byId: Data.ToListById<Data.Instance> = {};
	private allIds: string[] = [];

	constructor() {
		super();

		this.dispatchToken = AppDispatcher.register((action: Action) => {
			AppDispatcher.waitFor([RequirementsStore.dispatchToken]);
			if (action.undo) {
				switch (action.type) {
					case ActionTypes.ACTIVATE_SPELL:
						this.deactivateSpell(action.payload.id);
						break;

					case ActionTypes.ACTIVATE_LITURGY:
						this.deactivate(action.payload.id);
						break;

					case ActionTypes.DEACTIVATE_SPELL:
						this.activateSpell(action.payload.id);
						break;

					case ActionTypes.DEACTIVATE_LITURGY:
						this.activate(action.payload.id);
						break;

					case ActionTypes.ACTIVATE_DISADV:
					case ActionTypes.ACTIVATE_SPECIALABILITY:
						const id = action.payload.id;
						const index = action.payload.index;
						const active = action.payload.activeObject;
						if (index && active) {
							const adds = [];
							let sid;
							switch (id) {
								case 'ADV_4':
								case 'ADV_16':
								case 'DISADV_48':
									sid = active.sid as string;
									break;
								case 'SA_10':
									adds.push({ id: active.sid as string, value: (this.byId[id] as Data.ActivatableInstance).active.filter(e => e.sid === active.sid).length * 6 });
									break;
							}
							DependentUtils.removeDependencies(this.byId[id] as Data.ActivatableInstance, adds, sid);
							(this.byId[id] as Data.ActivatableInstance).active.splice(index, 1);
						}
						break;

					case ActionTypes.DEACTIVATE_DISADV:
					case ActionTypes.DEACTIVATE_SPECIALABILITY: {
						const id = action.payload.id;
						const index = action.payload.index;
						const active = action.payload.activeObject;
						if (active) {
							(this.byId[id] as Data.ActivatableInstance).active.splice(index, 0, active);
							const adds = [];
							let sid;
							switch (id) {
								case 'ADV_4':
								case 'ADV_16':
								case 'DISADV_48':
									sid = active.sid as string;
									break;
								case 'SA_10':
									adds.push({ id: active.sid as string, value: (this.byId[id] as Data.ActivatableInstance).active.filter(e => e.sid === active.sid).length * 6 });
									break;
							}
							DependentUtils.addDependencies(this.byId[id] as Data.ActivatableInstance, adds, sid);
						}
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
						this.init(action.payload.tables, action.payload.locales);
						break;

					case ActionTypes.LOAD_HERO:
						this.clear();
						this.updateAll(action.payload.data);
						break;

					case ActionTypes.ASSIGN_RCP_OPTIONS:
						this.assignRCP(action.payload);
						break;

					case ActionTypes.CREATE_HERO:
						this.clear();
						break;

					case ActionTypes.ACTIVATE_SPELL:
						if (RequirementsStore.isValid()) {
							this.activateSpell(action.payload.id);
						}
						break;

					case ActionTypes.ACTIVATE_LITURGY:
						if (RequirementsStore.isValid()) {
							this.activate(action.payload.id);
						}
						break;

					case ActionTypes.DEACTIVATE_SPELL:
						if (RequirementsStore.isValid()) {
							this.deactivateSpell(action.payload.id);
						}
						break;

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

	getObjByCategory(...categories: Categories.Category[]) {
		const list: { [id: string]: Data.Instance } = {};
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

	getObjByCategoryGroup(category: Categories.Category, ...gr: number[]) {
		const list: Data.ToListById<Data.Instance> = {};
		for (const id in this.byId) {
			if (this.byId.hasOwnProperty(id)) {
				const obj = this.byId[id] as Data.SkillishInstance | Data.SpecialAbilityInstance;
				if (obj.category === category && gr.includes(obj.gr)) {
					list[id] = obj;
				}
			}
		}
		return list;
	}

	getAllByCategory(...categories: Categories.Category[]) {
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

	getAllByCategoryGroup(category: Categories.Category, ...gr: number[]) {
		const list = [];
		for (const id in this.byId) {
			if (this.byId.hasOwnProperty(id)) {
				const obj = this.byId[id] as Data.SkillishInstance | Data.SpecialAbilityInstance;
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
			const tradition = get('SA_86') as Data.SpecialAbilityInstance;
			switch (last(ActivatableUtils.getSids(tradition))) {
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
		} else if (type === 2) {
			const tradition = get('SA_102') as Data.SpecialAbilityInstance;
			switch (last(ActivatableUtils.getSids(tradition))) {
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
		return attr;
	}

	getPrimaryAttr(type: 1 | 2) {
		const id = getPrimaryAttrID(type);
		if (id) {
			return get(id) as Data.AttributeInstance;
		}
		return;
	}

	getCostListForProfessionDependencies(reqs: Data.RequirementObject[]) {
		const totalCost = reqs.map<number | Data.ProfessionDependencyCost>(req => {
			const { id, sid, sid2, tier, value } = req;
			const obj = get(id as string) as Data.Instance & { tiers?: number };

			switch (obj.category) {
				case Categories.ATTRIBUTES: {
					if (typeof value === 'number') {
						const values: number[] = Array.from({ length: value - 8 }, (_, i) => i + 8);
						this.byId[id as string] = IncreasableUtils.set(obj, value);
						return values.map(e => final(5, e)).reduce((a, b) => a + b, 0);
					}
					return 0;
				}

				case Categories.TALENTS: {
					if (typeof value === 'number') {
						const values: number[] = Array.from({ length: value - obj.value }, (_, i) => i + obj.value);
						this.byId[id as string] = IncreasableUtils.set(obj, value);
						return values.map(e => final(obj.ic, e)).reduce((a, b) => a + b, 0);
					}
					return 0;
				}

				case Categories.ADVANTAGES:
				case Categories.DISADVANTAGES:
				case Categories.SPECIAL_ABILITIES: {
					let cost;
					const activeObject = { sid: sid as string | number | undefined, sid2, tier };

					const checkIfActive = (e: Data.ActiveObject) => Object.keys(activeObject).every((key: keyof Data.ActiveObject) => {
						return activeObject[key] === e[key];
					});

					if (!obj.active.find(checkIfActive)) {
						(this.byId[id as string] as Data.ActivatableInstance).active.push(activeObject);
						this.byId = {
							...this.byId,
							...DependentUtils.addDependencies(obj),
						};
						if (obj.tiers && tier) {
							cost = (obj.cost as number) * tier;
						}
						else if (Array.isArray(obj.sel)) {
							cost = obj.sel[(sid as number) - 1].cost;
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
							} as Data.ProfessionDependencyCost;

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
		const allCombatTechniques = this.getAllByCategory(Categories.COMBAT_TECHNIQUES) as Data.CombatTechniqueInstance[];
		const combatTechniqueValueMax = ELStore.getStart().maxCombatTechniqueRating;
		const valueTooHigh = allCombatTechniques.filter(e => e.value > combatTechniqueValueMax);
		valueTooHigh.forEach(e => {
			this.byId[e.id] = IncreasableUtils.set(e, combatTechniqueValueMax);
		});
		return valueTooHigh.reduce<number>((ap, instance) => {
			const values: number[] = Array.from({ length: instance.value - combatTechniqueValueMax }, (_, i) => i + combatTechniqueValueMax + 1);
			return ap + values.map(e => final(instance.ic, e)).reduce((a, b) => a + b, 0);
		}, 0);
	}

	private activate(id: string) {
		(this.byId[id] as Data.LiturgyInstance | Data.SpellInstance | Data.CantripInstance | Data.BlessingInstance).active = true;
	}

	private activateSpell(id: string) {
		if (this.byId[id].category === Categories.CANTRIPS) {
			this.activateCantrip(id);
		}
		else {
			this.mergeIntoList(SpellUtils.activate(this.byId[id] as Data.SpellInstance));
		}
	}

	private activateCantrip(id: string) {
		this.mergeIntoList(SpellUtils.activateCantrip(this.byId[id] as Data.CantripInstance));
	}

	private deactivate(id: string) {
		(this.byId[id] as Data.LiturgyInstance | Data.SpellInstance | Data.CantripInstance | Data.BlessingInstance).active = false;
	}

	private deactivateSpell(id: string) {
		if (this.byId[id].category === Categories.CANTRIPS) {
			this.deactivateCantrip(id);
		}
		else {
			this.mergeIntoList(SpellUtils.deactivate(this.byId[id] as Data.SpellInstance));
		}
	}

	private deactivateCantrip(id: string) {
		this.mergeIntoList(SpellUtils.deactivateCantrip(this.byId[id] as Data.CantripInstance));
	}

	private addPoint(id: string) {
		this.byId[id] = IncreasableUtils.addPoint(this.byId[id] as Data.IncreasableInstance);
	}

	private removePoint(id: string) {
		this.byId[id] = IncreasableUtils.removePoint(this.byId[id] as Data.IncreasableInstance);
	}

	private setValue(id: string, value: number) {
		this.byId[id] = IncreasableUtils.set(this.byId[id] as Data.IncreasableInstance, value);
	}

	private addSR(id: string, value: number) {
		this.byId[id] = IncreasableUtils.add(this.byId[id] as Data.IncreasableInstance, value);
	}

	private activateDASA(id: string, args: Data.ActivateArgs) {
		this.mergeIntoList(ActivatableUtils.activate(this.byId[id] as Data.ActivatableInstance, args));
	}

	private deactivateDASA(id: string, index: number) {
		this.mergeIntoList(ActivatableUtils.deactivate(this.byId[id] as Data.ActivatableInstance, index));
		if (id === 'SA_125') {
			this.setValue('CT_17', 6);
		}
	}

	private updateTier(id: string, index: number, tier: number) {
		this.byId[id] = ActivatableUtils.setTier(this.byId[id] as Data.ActivatableInstance, index, tier);
	}

	private mergeIntoList(list: Data.ToListById<Data.Instance>) {
		this.byId = {
			...this.byId,
			...list,
		};
	}

	private init(data: RawTables, locales: RawLocaleList) {
		AppDispatcher.waitFor([LocaleStore.dispatchToken]);
		const locale = LocaleStore.getLocale();
		if (locale) {
			this.byId = init(data, locales[locale]);
			this.allIds = Object.keys(this.byId);
		}
	}

	private updateAll({ attr, talents, ct, spells, blessings, cantrips, liturgies, activatable }: Data.Hero) {
		attr.values.forEach(e => {
			const [ id, value, mod ] = e;
			this.setValue(id, value);
			(this.byId[id] as Data.AttributeInstance).mod = mod;
		});
		const flatSkills = { ...talents, ...ct };
		Object.keys(flatSkills).forEach(id => {
			this.setValue(id, flatSkills[id]);
		});
		const activateSkills = { ...spells, ...liturgies };
		Object.keys(activateSkills).forEach(id => {
			const value = activateSkills[id];
			this.activate(id);
			this.setValue(id, value);
		});
		const activateBlessingsLiturgies = [ ...blessings, ...cantrips ];
		activateBlessingsLiturgies.forEach(id => {
			this.activate(id);
		});
		Object.keys(activatable).forEach(id => {
			const values = activatable[id];
			(this.byId[id] as Data.ActivatableInstance).active = [ ...values.map(e => ({ ...e })) ];
			switch (id) {
				case 'ADV_4':
				case 'ADV_16':
				case 'DISADV_48':
					values.forEach(p => {
						const list = DependentUtils.addDependencies(this.byId[id] as Data.ActivatableInstance, [], p.sid as string);
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
						const addRequire = { id: p.sid, value: counter.get(p.sid) * 6 } as Data.RequirementObject;
						const list = DependentUtils.addDependencies(this.byId[id] as Data.ActivatableInstance, [addRequire]);
						this.mergeIntoList(list);
					});
					break;
				}
				default:
					values.forEach(() => {
						const list = DependentUtils.addDependencies(this.byId[id] as Data.ActivatableInstance);
						this.mergeIntoList(list);
					});
			}
		});
	}

	private assignRCP(selections: Data.Selections) {
		const race = RaceStore.getCurrent();
		const culture = CultureStore.getCurrent();
		const profession = ProfessionStore.getCurrent();
		const professionVariant = ProfessionVariantStore.getCurrent();

		const skillRatingList = new Map<string, number>();
		const addToSkillRatingList = (id: string, value: number) => {
			const currentValue = skillRatingList.get(id);
			if (currentValue) {
				skillRatingList.set(id, currentValue + value);
			}
			else {
				skillRatingList.set(id, value);
			}
		};
		const skillActivateList = new Set<string>();
		const activatable = new Set<Data.RequirementObject>();
		const languages = new Map<number, number>();
		const scripts = new Set<number>();

		// Race selections:

		if (race) {
			race.attributes.forEach(e => {
				const [ mod, id ] = e;
				(this.byId[id] as Data.AttributeInstance).mod += mod;
			});
			race.autoAdvantages.forEach(e => activatable.add({ id: e }));
			(this.byId[selections.attrSel] as Data.AttributeInstance).mod = race.attributeSelection[0];
		}

		// Culture selections:

		if (culture) {
			if (selections.useCulturePackage) {
				culture.talents.forEach(([ key, value ]) => {
					skillRatingList.set(key, value);
				});
			}

			const motherTongueId = culture.languages.length > 1 ? selections.lang : culture.languages[0];
			languages.set(motherTongueId, 4);

			if (selections.buyLiteracy) {
				const motherTongueScriptId = culture.scripts.length > 1 ? selections.litc : culture.scripts[0];
				scripts.add(motherTongueScriptId);
			}
		}

		// Profession selections:

		if (profession) {
			[ ...profession.talents, ...profession.combatTechniques ].forEach(([ key, value ]) => {
				addToSkillRatingList(key, value);
			});
			[ ...profession.spells, ...profession.liturgies ].forEach(([ key, value ]) => {
				skillActivateList.add(key);
				if (typeof value === 'number') {
					addToSkillRatingList(key, value);
				}
			});
			profession.blessings.forEach(e => skillActivateList.add(e));
			profession.specialAbilities.forEach(e => activatable.add(e));
		}

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

		if (selections.map.has('SPECIALISATION')) {
			const talentId = (selections.map.get('SPECIALISATION') as Data.SpecialisationSelection).sid;
			if (Array.isArray(talentId)) {
				activatable.add({
					id: 'SA_10',
					sid: selections.specTalentId,
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
			addToSkillRatingList(e, (selections.map.get('COMBAT_TECHNIQUES') as Data.CombatTechniquesSelection).value);
		});

		selections.combatTechniquesSecond.forEach(e => {
			addToSkillRatingList(e, (selections.map.get('COMBAT_TECHNIQUES_SECOND') as Data.CombatTechniquesSelection).value);
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
			const obj = get(id as string) as Data.ActivatableInstance;
			const add: Data.RequirementObject[] = [];
			switch (id) {
				case 'SA_10':
					obj.active.push({ sid: sid as string, sid2 });
					add.push({ id: sid as string, value: (obj.active.filter(e => e.sid === sid).length + 1) * 6 });
					break;
				case 'SA_97':
					obj.active.push({ sid: sid as string });
					add.push({ id: 'SA_88', active: true, sid: sid as string });
					break;
				case 'SA_484': {
					obj.active.push({ sid: sid as string });
					const selectionItem = ActivatableUtils.getSelectionItem(obj, sid as string) as Data.SelectionObject & { req: Data.RequirementObject[], target: string; tier: number; };
					add.push({ id: selectionItem.target, value: selectionItem.tier * 4 + 4 });
					break;
				}

				default:
					obj.active.push({ sid: sid as string | number | undefined, sid2, tier });
					break;
			}
			DependentUtils.addDependencies(obj, add);
		});
		(this.byId.SA_28 as Data.SpecialAbilityInstance).active.push(...Array.from(scripts.values()).map(sid => ({ sid })));
		(this.byId.SA_30 as Data.SpecialAbilityInstance).active.push(...Array.from(languages.entries()).map(([sid, tier]) => ({ sid, tier })));
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
				else if (e.category === Categories.BLESSINGS) {
					this.byId[id] = LiturgyUtils.resetBlessing(e);
				}
				else if (e.category === Categories.CANTRIPS) {
					this.byId[id] = SpellUtils.resetCantrip(e);
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

export const ListStore = new ListStoreStatic();

export const get = (id: string) => ListStore.get(id);

export const getObjByCategory = (...categories: Categories.Category[]) => ListStore.getObjByCategory(...categories);

export const getObjByCategoryGroup = (category: Categories.Category, ...gr: number[]) => ListStore.getObjByCategoryGroup(category, ...gr);

export const getAllByCategory = (...categories: Categories.Category[]) => ListStore.getAllByCategory(...categories);

export const getAllByCategoryGroup = (category: Categories.Category, ...gr: number[]) => ListStore.getAllByCategoryGroup(category, ...gr);

export const getPrimaryAttrID = (type: 1 | 2) => ListStore.getPrimaryAttrID(type);

export const getPrimaryAttr = (type: 1 | 2) => ListStore.getPrimaryAttr(type);
