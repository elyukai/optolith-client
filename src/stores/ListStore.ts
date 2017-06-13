import { isEqual } from 'lodash';
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
import { HistoryStore } from '../stores/HistoryStore';
import * as Data from '../types/data.d';
import { RawLocaleList, RawTables } from '../types/rawdata.d';
import * as Reusable from '../types/reusable.d';
import * as ActivatableUtils from '../utils/ActivatableUtils';
import * as AttributeUtils from '../utils/AttributeUtils';
import * as CombatTechniqueUtils from '../utils/CombatTechniqueUtils';
import * as DependentUtils from '../utils/DependentUtils';
import { getIncreaseRangeAP } from '../utils/ICUtils';
import * as IncreasableUtils from '../utils/IncreasableUtils';
import { init } from '../utils/init';
import * as LiturgyUtils from '../utils/LiturgyUtils';
import * as RequirementUtils from '../utils/RequirementUtils';
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
	private byId = new Map<string, Data.Instance>();

	constructor() {
		super();

		this.dispatchToken = AppDispatcher.register((action: Action) => {
			AppDispatcher.waitFor([RequirementsStore.dispatchToken]);
			if (action.undo === true) {
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
						const { id, index, activeObject } = action.payload;
						this.undoActivatableActivation(id, index, activeObject);
						break;

					case ActionTypes.DEACTIVATE_DISADV:
					case ActionTypes.DEACTIVATE_SPECIALABILITY: {
						const { id, index, activeObject } = action.payload;
						this.undoActivatableDeactivation(id, index, activeObject);
						break;
					}

					case ActionTypes.SET_DISADV_TIER:
					case ActionTypes.SET_SPECIALABILITY_TIER: {
						const { id, index } = action.payload;
						const { tier } = action.prevState;
						this.updateTier(id, index, tier);
						break;
					}

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
							this.activateActivatable(action.payload.id, action.payload);
						}
						break;

					case ActionTypes.DEACTIVATE_DISADV:
					case ActionTypes.DEACTIVATE_SPECIALABILITY:
						if (RequirementsStore.isValid()) {
							AppDispatcher.waitFor([HistoryStore.dispatchToken]);
							this.deactivateActivatable(action.payload.id, action.payload.index);
						}
						break;

					case ActionTypes.SET_DISADV_TIER:
					case ActionTypes.SET_SPECIALABILITY_TIER:
						if (RequirementsStore.isValid()) {
							AppDispatcher.waitFor([HistoryStore.dispatchToken]);
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
		return this.byId.get(AttributeUtils.convertId(id));
	}

	getObjByCategory(...categories: Categories.Category[]) {
		return new Map([...this.byId].filter(e => categories.includes(e[1].category)));
	}

	getObjByCategoryGroup(category: Categories.Category, ...gr: number[]) {
		return new Map([...this.byId].filter(e => category === e[1].category && gr.includes((e[1] as Data.SkillishInstance | Data.SpecialAbilityInstance).gr)));
	}

	getAllByCategory(...categories: Categories.Category[]) {
		return [...this.byId.values()].filter(e => categories.includes(e.category));
	}

	getAllByCategoryGroup(category: Categories.Category, ...gr: number[]) {
		return [...this.byId.values()].filter(e => category === e.category && gr.includes((e as Data.SkillishInstance | Data.SpecialAbilityInstance).gr));
	}

	getPrimaryAttrID(type: 1 | 2) {
		return AttributeUtils.getPrimaryAttributeId(type);
	}

	getPrimaryAttr(type: 1 | 2) {
		const id = AttributeUtils.getPrimaryAttributeId(type);
		if (id) {
			return get(id) as Data.AttributeInstance;
		}
		return;
	}

	getCostListForProfessionDependencies(reqs: (Reusable.RequiresActivatableObject | Reusable.RequiresIncreasableObject)[]) {
		const totalCost = reqs.map<number | Data.ProfessionDependencyCost>(req => {
			if (RequirementUtils.isRequiringIncreasable(req)) {
				const { id, value } = req;
				if (typeof id === 'string') {
					const obj = get(id) as Data.AttributeInstance | Data.TalentInstance;
					switch (obj.category) {
						case Categories.ATTRIBUTES: {
							if (typeof value === 'number') {
								this.byId.set(id, { ...obj, value });
								return getIncreaseRangeAP(5, 8, value);
							}
							return 0;
						}
						case Categories.TALENTS: {
							if (typeof value === 'number') {
								this.byId.set(id, { ...obj, value });
								return getIncreaseRangeAP(obj.ic, obj.value, value);
							}
							return 0;
						}
					}
				}
			}
			else {
				const { id, sid, sid2, tier } = req;
				if (typeof id === 'string') {
					const obj = get(id) as Data.ActivatableInstance & { tiers?: number };
					let cost;
					const activeObject = { sid: sid as string | number | undefined, sid2, tier };

					const checkIfActive = (e: Data.ActiveObject) => isEqual(activeObject, e);

					if (!obj.active.find(checkIfActive)) {
						(this.byId.get(id as string) as Data.ActivatableInstance).active.push(activeObject);
						this.mergeIntoList(DependentUtils.addDependencies(obj));
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
							const isKar = obj.reqs.some(e => e !== 'RCP' && e.id === 'ADV_12' && RequirementUtils.isRequiringActivatable(e) && e.active);
							const isMag = obj.reqs.some(e => e !== 'RCP' && e.id === 'ADV_50' && RequirementUtils.isRequiringActivatable(e) && e.active);
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
		const maxCombatTechniqueRating = ELStore.getStart().maxCombatTechniqueRating;
		const valueTooHigh = allCombatTechniques.filter(e => e.value > maxCombatTechniqueRating);
		valueTooHigh.forEach(e => {
			this.byId.set(e.id, IncreasableUtils.set(e, maxCombatTechniqueRating));
		});
		return valueTooHigh.reduce<number>((ap, instance) => {
			return ap + getIncreaseRangeAP(instance.ic, maxCombatTechniqueRating, instance.value);
		}, 0);
	}

	private activate(id: string) {
		(this.byId.get(id) as Data.LiturgyInstance | Data.SpellInstance | Data.CantripInstance | Data.BlessingInstance).active = true;
	}

	private activateSpell(id: string) {
		const entry = this.byId.get(id);
		if (entry) {
			if (entry.category === Categories.CANTRIPS) {
				this.activateCantrip(id);
			}
			else {
				this.mergeIntoList(SpellUtils.activate(entry as Data.SpellInstance));
			}
		}
	}

	private activateCantrip(id: string) {
		this.mergeIntoList(SpellUtils.activateCantrip(this.byId.get(id) as Data.CantripInstance));
	}

	private deactivate(id: string) {
		(this.byId.get(id) as Data.LiturgyInstance | Data.SpellInstance | Data.CantripInstance | Data.BlessingInstance).active = false;
	}

	private deactivateSpell(id: string) {
		const entry = this.byId.get(id);
		if (entry) {
			if (entry.category === Categories.CANTRIPS) {
				this.deactivateCantrip(id);
			}
			else {
				this.mergeIntoList(SpellUtils.deactivate(entry as Data.SpellInstance));
			}
		}
	}

	private deactivateCantrip(id: string) {
		this.mergeIntoList(SpellUtils.deactivateCantrip(this.byId.get(id) as Data.CantripInstance));
	}

	private addPoint(id: string) {
		this.byId.set(id, IncreasableUtils.addPoint(this.byId.get(id) as Data.IncreasableInstance));
	}

	private removePoint(id: string) {
		this.byId.set(id, IncreasableUtils.removePoint(this.byId.get(id) as Data.IncreasableInstance));
	}

	private setValue(id: string, value: number) {
		this.byId.set(id, IncreasableUtils.set(this.byId.get(id) as Data.IncreasableInstance, value));
	}

	private addSR(id: string, value: number) {
		this.byId.set(id, IncreasableUtils.add(this.byId.get(id) as Data.IncreasableInstance, value));
	}

	private undoActivatableActivation(id: string, index?: number, active?: Data.ActiveObject) {
		if (typeof index === 'number' && active !== undefined) {
			const target = this.byId.get(id) as Data.ActivatableInstance;
			const adds = [];
			let sel;
			switch (id) {
				case 'ADV_4':
				case 'ADV_16':
				case 'DISADV_48':
					sel = active.sid as string;
					break;
				case 'SA_10':
					adds.push({ id: active.sid as string, value: (this.byId.get(id) as Data.ActivatableInstance).active.filter(e => e.sid === active.sid).length * 6 });
					break;
				case 'SA_97':
					adds.push({ id: 'SA_88', active: true, sid: active.sid });
					break;
				case 'SA_484': {
					const selectionItem = ActivatableUtils.getSelectionItem(target, active.sid) as Data.SelectionObject & { req: Data.RequirementObject[], target: string; tier: number; };
					adds.push({ id: selectionItem.target, value: selectionItem.tier * 4 + 4 });
					break;
				}
			}
			target.active.splice(index, 1);
			this.mergeIntoList(DependentUtils.removeDependencies(target, adds, sel));
		}
	}

	private undoActivatableDeactivation(id: string, index: number, active?: Data.ActiveObject) {
		if (active !== undefined) {
			const target = this.byId.get(id) as Data.ActivatableInstance;
			target.active.splice(index, 0, active);
			const adds = [];
			let sid;
			switch (id) {
				case 'ADV_4':
				case 'ADV_16':
				case 'DISADV_48':
					sid = active.sid as string;
					break;
				case 'SA_10': {
					const value = target.active.filter(e => e.sid === active.sid).length * 6;
					adds.push({ id: active.sid as string, value });
					break;
				}
				case 'SA_97':
					adds.push({ id: 'SA_88', active: true, sid: active.sid });
					break;
				case 'SA_484': {
					const selectionItem = ActivatableUtils.getSelectionItem(target, active.sid) as Data.SelectionObject & { req: Data.RequirementObject[], target: string; tier: number; };
					adds.push({ id: selectionItem.target, value: selectionItem.tier * 4 + 4 });
					break;
				}
			}
			this.mergeIntoList(DependentUtils.addDependencies(target, adds, sid));
		}
	}

	private activateActivatable(id: string, args: Data.ActivateArgs) {
		this.mergeIntoList(ActivatableUtils.activate(this.byId.get(id) as Data.ActivatableInstance, args));
	}

	private deactivateActivatable(id: string, index: number) {
		this.mergeIntoList(ActivatableUtils.deactivate(this.byId.get(id) as Data.ActivatableInstance, index));
		if (id === 'SA_125') {
			this.setValue('CT_17', 6);
		}
	}

	private updateTier(id: string, index: number, tier: number) {
		this.byId.set(id, ActivatableUtils.setTier(this.byId.get(id) as Data.ActivatableInstance, index, tier));
	}

	private mergeIntoList(list: Map<string, Data.Instance>) {
		this.byId = new Map([...this.byId, ...list]);
	}

	private init(data: RawTables, locales: RawLocaleList) {
		AppDispatcher.waitFor([LocaleStore.dispatchToken]);
		const locale = LocaleStore.getLocale();
		if (locale) {
			this.byId = init(data, locales[locale]);
		}
	}

	private updateAll({ attr, talents, ct, spells, blessings, cantrips, liturgies, activatable }: Data.Hero) {
		attr.values.forEach(e => {
			const [ id, value, mod ] = e;
			this.setValue(id, value);
			(this.byId.get(id) as Data.AttributeInstance).mod = mod;
		});
		const flatSkills = { ...talents, ...ct };
		Object.keys(flatSkills).forEach(id => {
			this.setValue(id, flatSkills[id]);
		});
		const activateSkills = { ...spells, ...liturgies };
		Object.keys(activateSkills).forEach(id => {
			const value = activateSkills[id];
			const entry = this.byId.get(id);
			if (entry && entry.category === Categories.SPELLS) {
				const list = DependentUtils.addDependencies({ ...entry, active: true, value });
				this.mergeIntoList(list);
			}
			else if (entry && entry.category === Categories.LITURGIES) {
				this.byId.set(id, { ...entry, active: true, value });
			}
		});
		const activateBlessingsLiturgies = [ ...blessings, ...cantrips ];
		activateBlessingsLiturgies.forEach(id => {
			const entry = this.byId.get(id);
			if (entry && (entry.category === Categories.BLESSINGS || entry.category === Categories.CANTRIPS)) {
				const list = DependentUtils.addDependencies({ ...entry, active: true });
				this.mergeIntoList(list);
			}
		});
		Object.keys(activatable).forEach(id => {
			const values = activatable[id];
			(this.byId.get(id) as Data.ActivatableInstance).active = [ ...values.map(e => ({ ...e })) ];
			switch (id) {
				case 'ADV_4':
				case 'ADV_16':
				case 'DISADV_48':
					values.forEach(p => {
						const list = DependentUtils.addDependencies(this.byId.get(id) as Data.ActivatableInstance, [], p.sid as string);
						this.mergeIntoList(list);
					});
					break;
				case 'SA_10': {
					const counter = new Map<string, number>();
					values.forEach(p => {
						if (typeof p.sid === 'string') {
							const current = counter.get(p.sid);
							if (current) {
								counter.set(p.sid, current + 1);
							} else {
								counter.set(p.sid, 1);
							}
							const addRequire: Reusable.RequiresIncreasableObject = { id: p.sid, value: counter.get(p.sid)! * 6 };
							const list = DependentUtils.addDependencies(this.byId.get(id) as Data.ActivatableInstance, [addRequire]);
							this.mergeIntoList(list);
						}
					});
					break;
				}
				default:
					values.forEach(() => {
						const list = DependentUtils.addDependencies(this.byId.get(id) as Data.ActivatableInstance);
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
		const activatable = new Set<Reusable.RequiresActivatableObject>();
		const languages = new Map<number, number>();
		const scripts = new Set<number>();

		// Race selections:

		if (race) {
			race.attributes.forEach(e => {
				const [ mod, id ] = e;
				(this.byId.get(id) as Data.AttributeInstance).mod += mod;
			});
			race.autoAdvantages.forEach(e => activatable.add({ id: e, active: true }));
			(this.byId.get(selections.attrSel) as Data.AttributeInstance).mod = race.attributeSelection[0];
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
			[ ...professionVariant.spells, ...professionVariant.liturgies ].forEach(([ key, value ]) => {
				skillActivateList.add(key);
				if (typeof value === 'number') {
					addToSkillRatingList(key, value);
				}
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
					active: true,
					sid: selections.specTalentId,
					sid2: selections.spec,
				});
			}
			else {
				activatable.add({
					id: 'SA_10',
					active: true,
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

		selections.skills.forEach((value, key) => {
			const skill = this.get(key) as Data.TalentInstance;
			if (skill !== undefined) {
				addToSkillRatingList(key, value / skill.ic);
			}
		});

		// Apply:

		skillRatingList.forEach((value, key) => this.addSR(key, value));
		skillActivateList.forEach(e => this.activate(e));

		activatable.forEach(req => {
			const { id, sid, sid2, tier } = req;
			const obj = get(id as string) as Data.ActivatableInstance;
			const add: (Reusable.RequiresActivatableObject | Reusable.RequiresIncreasableObject)[] = [];
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
					if (!Array.isArray(sid)) {
						obj.active.push({ sid, sid2, tier });
					}
					break;
			}
			this.mergeIntoList(DependentUtils.addDependencies(obj, add));
		});

		const SA_28 = this.byId.get('SA_28') as Data.SpecialAbilityInstance;
		const SA_30 = this.byId.get('SA_30') as Data.SpecialAbilityInstance;
		this.byId.set('SA_28', { ...SA_28, active: [ ...SA_28.active, ...Array.from(scripts.values()).map(sid => ({ sid }))]});
		this.byId.set('SA_30', { ...SA_30, active: [ ...SA_30.active, ...Array.from(languages.entries()).map(([sid, tier]) => ({ sid, tier }))]});
	}

	private clear() {
		this.byId = new Map([...this.byId].map((e): [string, Data.Instance] => {
			const entry = e[1];
			if (entry.category === Categories.ATTRIBUTES) {
				return [e[0], AttributeUtils.reset(entry)];
			}
			else if (entry.category === Categories.COMBAT_TECHNIQUES) {
				return [e[0], CombatTechniqueUtils.reset(entry)];
			}
			else if (entry.category === Categories.LITURGIES) {
				return [e[0], LiturgyUtils.reset(entry)];
			}
			else if (entry.category === Categories.SPELLS) {
				return [e[0], SpellUtils.reset(entry)];
			}
			else if (entry.category === Categories.BLESSINGS) {
				return [e[0], LiturgyUtils.resetBlessing(entry)];
			}
			else if (entry.category === Categories.CANTRIPS) {
				return [e[0], SpellUtils.resetCantrip(entry)];
			}
			else if (entry.category === Categories.TALENTS) {
				return [e[0], TalentUtils.reset(entry)];
			}
			else if (entry.category === Categories.ADVANTAGES || entry.category === Categories.DISADVANTAGES || entry.category === Categories.SPECIAL_ABILITIES) {
				return [e[0], ActivatableUtils.reset(entry)];
			}
			return e;
		}));
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
