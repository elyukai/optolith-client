import { isEqual } from 'lodash';
import { CreateHeroAction } from '../actions/HerolistActions';
import { SetSelectionsAction } from '../actions/ProfessionActions';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import { get, getLatest } from '../selectors/dependentInstancesSelectors';
import { getStart } from '../selectors/elSelectors';
import * as Data from '../types/data.d';
import * as Reusable from '../types/reusable.d';
import { getSelectionItem, isActive } from '../utils/ActivatableUtils';
import * as DependentUtils from '../utils/DependentUtils';
import { getDecreaseRangeAP, getIncreaseRangeAP } from '../utils/ICUtils';
import { mergeIntoOptionalState, mergeIntoState, setNewStateItem, setStateItem } from '../utils/ListUtils';
import * as RequirementUtils from '../utils/RequirementUtils';
import { CurrentHeroInstanceState } from './currentHero';
import { DependentInstancesState } from './dependentInstances';

type Action = CreateHeroAction | SetSelectionsAction;

export function currentHeroPost(state: CurrentHeroInstanceState, action: Action): CurrentHeroInstanceState {
	switch (action.type) {
		case ActionTypes.CREATE_HERO:
			return {
				...state,
				ap: {
					total: getStart(state.el).ap,
					spent: 0,
					adv: [0, 0, 0],
					disadv: [0, 0, 0]
				}
			};

		case ActionTypes.ASSIGN_RCP_OPTIONS: {
			const { dependent, el, rcp } = state;

			const race = rcp.race && get(dependent, rcp.race) as Data.RaceInstance;
			const culture = rcp.culture && get(dependent, rcp.culture) as Data.CultureInstance;
			const profession = rcp.profession && get(dependent, rcp.profession) as Data.ProfessionInstance;
			const professionVariant = rcp.professionVariant && get(dependent, rcp.professionVariant) as Data.ProfessionVariantInstance;

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

			if (typeof race === 'object') {
				race.attributeAdjustments.forEach(e => {
					const [ mod, id ] = e;
					(get(dependent, id) as Data.AttributeInstance).mod += mod;
				});
				race.automaticAdvantages.forEach(e => activatable.add({ id: e, active: true }));
				(get(dependent, action.payload.attrSel) as Data.AttributeInstance).mod = race.attributeAdjustmentsSelection[0];
			}

			// Culture selections:

			if (typeof culture === 'object') {
				if (action.payload.useCulturePackage) {
					culture.talents.forEach(([ key, value ]) => {
						skillRatingList.set(key, value);
					});
				}

				const motherTongueId = culture.languages.length > 1 ? action.payload.lang : culture.languages[0];
				languages.set(motherTongueId, 4);

				if (action.payload.buyLiteracy) {
					const motherTongueScriptId = culture.scripts.length > 1 ? action.payload.litc : culture.scripts[0];
					scripts.add(motherTongueScriptId);
				}
			}

			// Profession selections:

			if (typeof profession === 'object') {
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

			if (typeof professionVariant === 'object') {
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

			if (action.payload.map.has('SPECIALISATION')) {
				const talentId = (action.payload.map.get('SPECIALISATION') as Data.SpecialisationSelection).sid;
				if (Array.isArray(talentId)) {
					activatable.add({
						id: 'SA_10',
						active: true,
						sid: action.payload.specTalentId,
						sid2: action.payload.spec,
					});
				}
				else {
					activatable.add({
						id: 'SA_10',
						active: true,
						sid: talentId,
						sid2: action.payload.spec,
					});
				}
			}

			action.payload.langLitc.forEach((value, key) => {
				const [ category, id ] = key.split('_');
				if (category === 'LANG') {
					languages.set(Number.parseInt(id), value / 2);
				} else {
					scripts.add(Number.parseInt(id));
				}
			});

			action.payload.combattech.forEach(e => {
				addToSkillRatingList(e, (action.payload.map.get('COMBAT_TECHNIQUES') as Data.CombatTechniquesSelection).value);
			});

			action.payload.combatTechniquesSecond.forEach(e => {
				addToSkillRatingList(e, (action.payload.map.get('COMBAT_TECHNIQUES_SECOND') as Data.CombatTechniquesSelection).value);
			});

			action.payload.cantrips.forEach(e => {
				skillActivateList.add(e);
			});

			action.payload.curses.forEach((value, key) => {
				skillRatingList.set(key, value);
			});

			action.payload.skills.forEach((value, key) => {
				const skill = get(dependent, key) as Data.TalentInstance;
				if (skill !== undefined) {
					addToSkillRatingList(key, value / skill.ic);
				}
			});

			// Apply:

			let newlist: Data.ToOptionalKeys<DependentInstancesState> = {};

			const addValue = (instance: Data.SkillishInstance, value: number): Data.SkillishInstance => ({
				...instance,
				value: instance.value + value
			});

			for (const [id, value] of skillRatingList) {
				newlist = setNewStateItem(newlist, id, addValue(getLatest(dependent, newlist, id) as Data.SkillishInstance, value));
			}

			const activate = (instance: Data.ActivatableSkillishInstance): Data.ActivatableSkillishInstance => ({
				...instance,
				active: true
			});

			for (const id of skillActivateList) {
				newlist = setNewStateItem(newlist, id, activate(getLatest(dependent, newlist, id) as Data.ActivatableSkillishInstance));
			}

			for (const req of activatable) {
				const { id, sid, sid2, tier } = req;
				const entry = getLatest(dependent, newlist, id as string) as Data.ActivatableInstance;
				let obj;
				const add: (Reusable.RequiresActivatableObject | Reusable.RequiresIncreasableObject)[] = [];
				switch (id) {
					case 'SA_10':
						obj = {...entry, active: [...entry.active, { sid: sid as string, sid2 }]};
						add.push({ id: sid as string, value: obj.active.filter(e => e.sid === sid).length * 6 });
						break;
					case 'SA_97':
						obj = {...entry, active: [...entry.active, { sid: sid as string }]};
						add.push({ id: 'SA_88', active: true, sid: sid as string });
						break;
					case 'SA_484': {
						obj = {...entry, active: [...entry.active, { sid: sid as string }]};
						const selectionItem = getSelectionItem(obj, sid as string) as Data.SelectionObject & { req: Data.RequirementObject[], target: string; tier: number; };
						add.push({ id: selectionItem.target, value: selectionItem.tier * 4 + 4 });
						break;
					}

					default:
						if (!Array.isArray(sid)) {
							obj = {...entry, active: [...entry.active, { sid, sid2, tier }]};
						}
						break;
				}
				if (obj) {
					newlist = mergeIntoOptionalState(newlist, DependentUtils.addDependencies(mergeIntoState(dependent, newlist), obj, add));
				}
			}

			const SA_28 = getLatest(dependent, newlist, 'SA_28') as Data.SpecialAbilityInstance;
			const SA_30 = getLatest(dependent, newlist, 'SA_30') as Data.SpecialAbilityInstance;

			newlist = setNewStateItem(newlist, 'SA_28', {
				...SA_28,
				active: [ ...SA_28.active, ...Array.from(scripts.values(), sid => ({ sid }))]
			});
			newlist = setNewStateItem(newlist, 'SA_30', {
				...SA_30,
				active: [ ...SA_30.active, ...Array.from(languages.entries(), ([sid, tier]) => ({ sid, tier }))]
			});

			let fulllist = mergeIntoState(dependent, newlist);

			// AP

			let ap;
			let professionName;
			let permanentArcaneEnergyLoss = 0;

			if (race && culture && profession) {
				ap = {
					spent: state.ap.spent,
					adv: race.automaticAdvantagesCost,
					disadv: [0, 0, 0] as [number, number, number]
				};

				if (action.payload.useCulturePackage === true) {
					ap.spent += culture.ap;
				}

				if (action.payload.buyLiteracy) {
					const id = culture.scripts.length > 1 ? action.payload.litc : culture.scripts[0];
					const selectionItem = getSelectionItem(get(fulllist, 'SA_28') as Data.SpecialAbilityInstance, id);
					ap.spent += selectionItem && selectionItem.cost || 0;
				}

				if (profession && profession.id !== 'P_0') {
					const requires = [ ...profession.requires ];

					if (professionVariant) {
						requires.push(...professionVariant.requires);
					}

					// Assign profession requirements

					ap = requires.reduce((final, req) => {
						if (RequirementUtils.isRequiringIncreasable(req)) {
							const { id, value } = req;
							if (typeof id === 'string') {
								const obj = get(fulllist, id) as Data.AttributeInstance | Data.TalentInstance;
								switch (obj.category) {
									case Categories.ATTRIBUTES: {
										if (typeof value === 'number') {
											fulllist = setStateItem(fulllist, id, { ...obj, value });
											return { ...final, spent: final.spent + getIncreaseRangeAP(5, 8, value)};
										}
										return final;
									}
									case Categories.TALENTS: {
										if (typeof value === 'number') {
											fulllist = setStateItem(fulllist, id, { ...obj, value });
											return { ...final, spent: final.spent + getIncreaseRangeAP(obj.ic, obj.value, value)};
										}
										return final;
									}
								}
							}
						}
						else {
							const { id, sid, sid2, tier } = req;
							if (typeof id === 'string') {
								const obj = get(fulllist, id) as Data.ActivatableInstance & { tiers?: number };
								let cost;
								const activeObject = { sid: sid as string | number | undefined, sid2, tier };

								const checkIfActive = (e: Data.ActiveObject) => isEqual(activeObject, e);

								if (!obj.active.find(checkIfActive)) {
									(get(fulllist, id as string) as Data.ActivatableInstance).active.push(activeObject);
									fulllist = mergeIntoState(fulllist, DependentUtils.addDependencies(fulllist, obj));
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
											spent: obj.category === Categories.DISADVANTAGES ? -cost : cost,
										};

										if (obj.category === Categories.ADVANTAGES) {
											cost.adv[0] = cost.spent;
											if (index > 0) {
												cost.adv[index] = cost.spent;
											}
										}
										else {
											cost.disadv[0] = -cost.spent;
											if (index > 0) {
												cost.disadv[index] = -cost.spent;
											}
										}
									}
									if (typeof cost === 'object') {
										return {
											adv: cost.adv.map((e, i) => e + final.adv[i]) as [number, number, number],
											disadv: cost.disadv.map((e, i) => e + final.disadv[i]) as [number, number, number],
											spent: final.spent + cost.spent
										};
									}
									if (typeof cost === 'number') {
										return { ...final, spent: final.spent + cost};
									}
								}
								return final;
							}
						}
						return final;
					}, ap);

					// Lower Combat Techniques with a too high CTR

					const maxCombatTechniqueRating = getStart(el).maxCombatTechniqueRating;
					const valueTooHigh = [...fulllist.combatTechniques.values()].filter(e => e.value > maxCombatTechniqueRating);

					ap.spent += valueTooHigh.reduce<number>((ap, instance) => {
						return ap + getDecreaseRangeAP(instance.ic, instance.value, maxCombatTechniqueRating);
					}, 0);

					for (const combatTechnique of valueTooHigh) {
						fulllist = setStateItem(fulllist, combatTechnique.id, { ...combatTechnique, value: maxCombatTechniqueRating });
					}

					if (rcp.profession === 'P_0') {
						professionName = 'Eigene Profession';
					}

					if (isActive(get(fulllist, 'SA_92') as Data.SpecialAbilityInstance)) {
						permanentArcaneEnergyLoss += 2;
					}
				}
			}

			return {
				...state,
				dependent: fulllist,
				ap: {
					...state.ap,
					...ap
				},
				energies: {
					...state.energies,
					permanentArcaneEnergy: {
						...state.energies.permanentArcaneEnergy,
						lost: state.energies.permanentArcaneEnergy.lost + permanentArcaneEnergyLoss
					}
				},
				profile: {
					...state.profile,
					professionName
				}
			};
		}

		default:
			return state;
	}
}
