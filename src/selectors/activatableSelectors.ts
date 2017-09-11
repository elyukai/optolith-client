import { last } from 'lodash';
import { createSelector } from 'reselect';
import * as Categories from '../constants/Categories';
import { DependentInstancesState } from '../reducers/dependentInstances';
import * as Data from '../types/data.d';
import * as Reusable from '../types/reusable.d';
import { getDSids, getSecondSidMap, getSelectionItem, getSelectionName, getSids, isActivatable, isActive, isDeactivatable } from '../utils/ActivatableUtils';
import { sortObjects } from '../utils/FilterSortUtils';
import { _translate } from '../utils/I18n';
import { getTraditionOfAspect } from '../utils/LiturgyUtils';
import { validate } from '../utils/RequirementUtils';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { get, getAllByCategory, getAllByCategoryGroup, getMapByCategory } from './dependentInstancesSelectors';
import { getStart } from './elSelectors';
import { getMessages } from './localeSelectors';
import { getCultureAreaKnowledge } from './profileSelectors';
import { getCurrentCulture, getCurrentProfession, getCurrentRace } from './rcpSelectors';
import { getAdvantages, getCurrentHeroPresent, getDisadvantages, getLocaleMessages, getSpecialAbilities } from './stateSelectors';

export function getForSave(state: DependentInstancesState): { [id: string]: Data.ActiveObject[] } {
	const allEntries = [
		...getAllByCategory(state, Categories.ADVANTAGES) as Data.AdvantageInstance[],
		...getAllByCategory(state, Categories.DISADVANTAGES) as Data.DisadvantageInstance[],
		...getAllByCategory(state, Categories.SPECIAL_ABILITIES) as Data.SpecialAbilityInstance[],
	];
	return allEntries.filter(e => isActive(e)).reduce((a, b) => ({ ...a, [b.id]: b.active }), {});
}

export const getActiveForView = (category: Categories.ACTIVATABLE) => {
	return createSelector(
		getAdvantages,
		getDisadvantages,
		getSpecialAbilities,
		getCurrentHeroPresent,
		getLocaleMessages,
		(advantages, disadvantages, specialAbilities, state, locale) => {
			const { dependent, el } = state;
			const allEntries = (category === Categories.ADVANTAGES ? advantages : category === Categories.DISADVANTAGES ? disadvantages : specialAbilities) as Map<string, Data.ActivatableInstance & { gr?: number; tiers?: number; }>;
			const finalEntries: Data.ActiveViewObject[] = [];

			allEntries.forEach(entry => {
				if (isActive(entry)) {
					const { id } = entry;
					const a = get(dependent, id) as Data.ActivatableInstance & { tiers?: number; gr?: number; };
					const { cost, category, sel, dependencies, input, gr, name, active } = a;
					let { tiers } = a;

					active.forEach((current, index) => {
						const { sid, sid2, tier } = current;
						let disabled = !isDeactivatable(state, a, sid);
						let add: string | undefined;
						let currentCost: number | undefined;
						const activeObject: Data.ActiveViewObject & { [id: string]: object | string | number | boolean | undefined; } = {
							id,
							index,
							name,
							cost: 0,
							gr,
							disabled: false,
							instance: entry
						};

						switch (id) {
							case 'ADV_4':
							case 'ADV_47':
							case 'DISADV_48': {
								const { name, ic } = (get(dependent, sid as string)) as Data.SkillishInstance;
								add = name;
								currentCost = (cost as number[])[ic - 1];
								break;
							}
							case 'ADV_16': {
								const { name, ic, value } = (get(dependent, sid as string)) as Data.SkillInstance;
								const counter = a.active.reduce((e, obj) => obj.sid === sid ? e + 1 : e, 0);
								add = name;
								currentCost = (cost as number[])[ic - 1];
								disabled = disabled || getStart(el).maxSkillRating + counter === value;
								break;
							}
							case 'ADV_17': {
								const { name, ic, value } = (get(dependent, sid as string)) as Data.CombatTechniqueInstance;
								add = name;
								currentCost = (cost as number[])[ic - 1];
								disabled = disabled || getStart(el).maxCombatTechniqueRating + 1 === value;
								break;
							}
							case 'ADV_28':
							case 'ADV_29': {
								const selectionItem = getSelectionItem(a, sid);
								add = selectionItem && selectionItem.name;
								currentCost = selectionItem && selectionItem.cost;
								break;
							}
							case 'ADV_32':
							case 'DISADV_1':
							case 'DISADV_24':
							case 'DISADV_45':
								add = typeof sid === 'number' ? getSelectionName(a, sid) : sid;
								break;
							case 'ADV_58': {
								const activeSpells = (getAllByCategory(dependent, Categories.SPELLS) as Data.SpellInstance[]).reduce((n, e) => e.active ? n + 1 : n, 0);
								if (activeSpells > 3) {
									activeObject.minTier = activeSpells - 3;
								}
								break;
							}
							case 'ADV_68': {
								const selectionItem = getSelectionItem(a, sid);
								add = selectionItem && `${sid2} (${selectionItem.name})`;
								currentCost = selectionItem && selectionItem.cost;
								break;
							}
							case 'DISADV_34':
							case 'DISADV_50': {
								const maxCurrentTier = active.reduce((a, b) => (b.tier as number) > a ? b.tier as number : a, 0);
								const subMaxCurrentTier = active.reduce((a, b) => (b.tier as number) > a && (b.tier as number) < maxCurrentTier ? b.tier as number : a, 0);
								add = typeof sid === 'number' ? getSelectionName(a, sid) : sid;
								currentCost = maxCurrentTier > (tier as number) || active.filter(e => e.tier === tier).length > 1 ? 0 : (cost as number) * ((tier as number) - subMaxCurrentTier);
								break;
							}
							case 'DISADV_33': {
								const selectionItem = getSelectionItem(a, sid);
								if (sid === 7 && active.filter(e => e.sid === 7).length > 1) {
									currentCost = 0;
								} else {
									currentCost = selectionItem && selectionItem.cost as number;
								}
								if ([7, 8].includes(sid as number)) {
									add = `${selectionItem && selectionItem.name}: ${sid2}`;
								} else {
									add = selectionItem && selectionItem.name;
								}
								break;
							}
							case 'DISADV_36':
								add = typeof sid === 'number' ? getSelectionName(a, sid) : sid as string;
								currentCost = active.length > 3 ? 0 : cost as number;
								break;
							case 'DISADV_37':
							case 'DISADV_51': {
								const selectionItem = getSelectionItem(a, sid);
								add = selectionItem && selectionItem.name;
								currentCost = selectionItem && selectionItem.cost as number;
								break;
							}
							case 'DISADV_59': {
								const activeSpells = (getAllByCategory(dependent, Categories.SPELLS) as Data.SpellInstance[]).reduce((n, e) => e.active ? n + 1 : n, 0);
								if (activeSpells < 3) {
									activeObject.maxTier = 3 - activeSpells;
								}
								break;
							}
							case 'SA_10': {
								const counter = (get(dependent, id) as Data.SpecialAbilityInstance).active.reduce((c, obj) => obj.sid === sid ? c + 1 : c, 0);
								const skill = get(dependent, sid as string) as Data.TalentInstance;
								let name;
								if (typeof sid2 === 'string') {
									name = sid2;
								}
								else {
									const selectedApplication = skill.applications && skill.applications.find(e => e.id === sid2);
									if (typeof selectedApplication === 'undefined') {
										return;
									}
									name = selectedApplication.name;
								}
								currentCost = skill.ic * counter;
								add = `${skill.name}: ${name}`;
								break;
							}
							case 'SA_30':
								tiers = 3;
								add = getSelectionName(a, sid);
								break;
							case 'SA_86': {
								if ((getAllByCategory(dependent, Categories.SPELLS) as Data.SpellInstance[]).some(e => e.active)) {
									disabled = true;
								}
								const selectionItem = getSelectionItem(a, sid);
								add = selectionItem && selectionItem.name;
								currentCost = selectionItem && selectionItem.cost as number;
								if (typeof add === 'string' && sid === 9 && typeof sid2 === 'string') {
									const entry = get(dependent, sid2) as Data.TalentInstance;
									if (entry) {
										add += `: ${entry.name}`;
									}
								}
								else if (typeof add === 'string' && sid === 6) {
									const musictraditionIds = [1, 2, 3];
									const musictraditionLabels = _translate(locale, 'musictraditions');
									if (musictraditionLabels) {
										add += `: ${musictraditionLabels[musictraditionIds.findIndex(e => e === sid2)]}`;
									}
								}
								else if (typeof add === 'string' && sid === 7) {
									const dancetraditionIds = [4, 5, 6, 7];
									const dancetraditionLabels = _translate(locale, 'dancetraditions');
									if (dancetraditionLabels) {
										add += `: ${dancetraditionLabels[dancetraditionIds.findIndex(e => e === sid2)]}`;
									}
								}
								break;
							}
							case 'SA_88': {
								const apArr = [10, 20, 40];
								currentCost = apArr[active.length - 1];
								add = getSelectionName(a, sid);
								break;
							}
							case 'SA_102': {
								if ((getAllByCategory(dependent, Categories.LITURGIES) as Data.LiturgyInstance[]).some(e => e.active)) {
									disabled = true;
								}
								const selectionItem = getSelectionItem(a, sid);
								add = selectionItem && selectionItem.name;
								currentCost = selectionItem && selectionItem.cost as number;
								break;
							}
							case 'SA_103': {
								const apArr = [15, 25, 45];
								currentCost = apArr[active.length - 1];
								add = getSelectionName(a, sid);
								break;
							}
							case 'SA_252': {
								const { name, ic } = get(dependent, sid as string) as Data.SpellInstance;
								add = name;
								currentCost = (cost as number[])[ic - 1];
								break;
							}
							case 'SA_273': {
								const { name, ic } = get(dependent, sid as string) as Data.SpellInstance;
								add = name;
								currentCost = (cost as number[])[ic - 1];
								break;
							}
							case 'SA_484': {
								const selectionItem = getSelectionItem(a, sid) as (Data.SelectionObject & { req: Data.RequirementObject[], target: string; tier: number; }) | undefined;
								add = selectionItem && `${(get(dependent, selectionItem.target) as Data.SpellInstance).name}: ${selectionItem.name}`;
								currentCost = selectionItem && selectionItem.cost;
								break;
							}

							default:
								if (typeof input === 'string') {
									add = sid as string;
								}
								else if (Array.isArray(sel) && cost === 'sel') {
									const selectionItem = getSelectionItem(a, sid);
									add = selectionItem && selectionItem.name;
									currentCost = selectionItem && selectionItem.cost;
								}
								else if (Array.isArray(sel) && typeof cost === 'number') {
									add = getSelectionName(a, sid);
								}
								break;
						}

						const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

						if (['ADV_28', 'ADV_29'].includes(id)) {
							activeObject.name = `${_translate(locale, 'activatable.view.immunityto')} ${add}`;
						}
						else if (id === 'DISADV_1') {
							activeObject.name = `${_translate(locale, 'activatable.view.afraidof')} ${add}`;
						}
						else if (id === 'ADV_68') {
							activeObject.name = `${_translate(locale, 'activatable.view.hatredof')} ${add}`;
						}
						else if (['DISADV_34', 'DISADV_50'].includes(id)) {
							activeObject.name  += ` ${roman[(tier as number) - 1]} (${add})`;
						}
						else if (add) {
							activeObject.name += ` (${add})`;
						}

						if (!currentCost) {
							currentCost = cost as number;
						}
						if (category === Categories.DISADVANTAGES) {
							currentCost = -currentCost;
						}

						activeObject.cost = currentCost;

						if (typeof tiers === 'number') {
							activeObject.tiers = tiers;
							activeObject.tier = tier;
							if (activeObject.minTier) {
								disabled = true;
							}
						}

						if (!disabled && dependencies.some(e => typeof e === 'boolean' ? e && active.length === 1 : Object.keys(e).every((key: keyof Data.ActiveObject) => activeObject[key] === e[key]) && Object.keys(activeObject).length === Object.keys(e).length)) {
							disabled = true;
						}

						activeObject.disabled = disabled;

						finalEntries.push(activeObject);
					});
				}
			});
			return finalEntries;
		}
	);
};

export const getDeactiveForView = (category: Categories.ACTIVATABLE) => {
	return createSelector(
		getCurrentHeroPresent,
		getLocaleMessages,
		(state, locale) => {
			const { ap, dependent } = state;
			const allEntries = getMapByCategory(dependent, category) as Map<string, Data.AdvantageInstance | Data.DisadvantageInstance | Data.SpecialAbilityInstance>;
			const finalEntries: Data.DeactiveViewObject[] = [];
			if (locale) {
				allEntries.forEach(entry => {
					const a = entry as Data.ActivatableInstance & { tiers?: number; gr?: number; };
					const { id, cost, max, active, name, input, tiers, dependencies, gr } = a;
					if (isActivatable(state, a) && !dependencies.includes(false) && (max === undefined || active.length < max)) {
						switch (id) {
							case 'ADV_4':
							case 'ADV_17':
							case 'ADV_47':
							case 'SA_273': {
								const activeIds = getSids(a);
								const sel = a.sel!.filter(e => !activeIds.includes(e.id) && !getDSids(a).includes(e.id));
								if (a.category === Categories.SPECIAL_ABILITIES) {
									finalEntries.push({ id, name, sel, cost, gr, instance: entry });
								}
								else {
									finalEntries.push({ id, name, sel, cost, instance: entry });
								}
								break;
							}
							case 'ADV_16': {
								const activeIds = getSids(a);
								const sel = a.sel!.filter(e => activeIds.filter(d => d === e.id).length < 2 && !getDSids(a).includes(e.id));
								finalEntries.push({ id, name, sel, cost, instance: entry });
								break;
							}
							case 'ADV_28':
							case 'ADV_29': {
								const sel = a.sel!.filter(e => !getDSids(a).includes(e.id));
								finalEntries.push({ id, name, sel, instance: entry });
								// advs.push({ id, name, sel, input });
								break;
							}
							case 'ADV_32': {
								const sel = a.sel!.filter(e => !getSids(get(dependent, 'DISADV_24') as Data.DisadvantageInstance).includes(e.id) && !getDSids(a).includes(e.id));
								finalEntries.push({ id, name, sel, input, cost, instance: entry });
								break;
							}
							case 'ADV_58': {
								const activeSpells = (getAllByCategory(dependent, Categories.SPELLS) as Data.SpellInstance[]).reduce((n, e) => e.active ? n + 1 : n, 0);
								if (activeSpells > 3) {
									finalEntries.push({ id, name, cost, tiers, minTier: activeSpells - 3, instance: entry });
								}
								break;
							}
							case 'DISADV_1':
							case 'DISADV_34':
							case 'DISADV_50': {
								const sel = a.sel!.filter(e => !getDSids(a).includes(e.id));
								finalEntries.push({ id, name, tiers, sel, input, cost, instance: entry });
								break;
							}
							case 'DISADV_24': {
								const sel = a.sel!.filter(e => !getSids(get(dependent, 'ADV_32') as Data.AdvantageInstance).includes(e.id) && !getDSids(a).includes(e.id));
								finalEntries.push({ id, name, sel, input, cost, instance: entry });
								break;
							}
							case 'DISADV_33':
							case 'DISADV_37':
							case 'DISADV_51': {
								let sel;
								const activeIds = getSids(a);
								if (a.id === 'DISADV_33') {
									sel = a.sel!.filter(e => ([7, 8].includes(e.id as number) || !activeIds.includes(e.id)) && !getDSids(a).includes(e.id));
								}
								else {
									sel = a.sel!.filter(e => !activeIds.includes(e.id) && !getDSids(a).includes(e.id));
								}
								finalEntries.push({ id, name, sel, cost, instance: entry });
								break;
							}
							case 'DISADV_36': {
								const activeIds = getSids(a);
								const sel = a.sel!.filter(e => !activeIds.includes(e.id) && !getDSids(a).includes(e.id));
								finalEntries.push({ id, name, sel, input, cost, instance: entry });
								break;
							}
							case 'DISADV_48': {
								const activeIds = getSids(a);
								const sel = a.sel!.filter(e => {
									if ((get(dependent, 'ADV_40') as Data.AdvantageInstance).active.length > 0 || (get(dependent, 'ADV_46') as Data.AdvantageInstance).active.length > 0) {
										if ((get(dependent, e.id as string) as Data.SkillInstance).gr === 2) {
											return false;
										}
									}
									return !activeIds.includes(e.id) && !getDSids(a).includes(e.id);
								});
								finalEntries.push({ id, name, sel, cost, instance: entry });
								break;
							}
							case 'DISADV_59': {
								const activeSpells = (getAllByCategory(dependent, Categories.SPELLS) as Data.SpellInstance[]).reduce((n, e) => e.active ? n + 1 : n, 0);
								if (activeSpells < 3) {
									finalEntries.push({ id, name, cost, tiers, maxTier: 3 - activeSpells, instance: entry });
								}
								break;
							}
							case 'SA_18': {
								const sum = (get(dependent, 'TAL_51') as Data.TalentInstance).value + (get(dependent, 'TAL_55') as Data.TalentInstance).value;
								if (sum >= 12) {
									finalEntries.push({ id, name, cost, gr, instance: entry });
								}
								break;
							}
							case 'SA_19':
								if ((getAllByCategoryGroup(dependent, Categories.COMBAT_TECHNIQUES, 2) as Data.CombatTechniqueInstance[]).filter(e => e.value >= 10).length > 0) {
									finalEntries.push({ id, name, cost, gr, instance: entry });
								}
								break;
							case 'SA_3': {
								const activeIds = getSids(a);
								const sel = (a.sel as Array<Data.SelectionObject & { req: Reusable.AllRequirementTypes[] }>).filter(e => !activeIds.includes(e.id) && validate(state, e.req, id) && !getDSids(a).includes(e.id));
								if (sel.length > 0) {
									finalEntries.push({ id, name, sel, cost, gr, instance: entry });
								}
								break;
							}
							case 'SA_10': {
								const counter = getSecondSidMap(a);
								type Sel = Array<Data.SelectionObject & { applications?: Data.Application[]; applicationsInput?: string }>;
								const filtered = (a.sel as Sel).filter(e => {
									const id = e.id as string;
									if (getDSids(a).includes(id)) {
										return false;
									}
									else if (counter.has(id)) {
										const arr = counter.get(id);
										return arr && arr.length < 3 && (get(dependent, id) as Data.TalentInstance).value >= 6 * (arr.length + 1);
									}
									return (get(dependent, id) as Data.TalentInstance).value >= 6;
								});
								const mapped = filtered.map(e => {
									const id = e.id as string;
									const arr = counter.get(id);
									if (arr) {
										e.cost = e.cost! * arr.length + 1;
									}
									e.applications = e.applications && e.applications.filter(n => {
										return !arr || !arr.includes(n.id);
									});
									return e;
								});
								const sel = sortObjects(mapped, locale.id);
								if (sel.length > 0) {
									finalEntries.push({ id, name, sel, cost, gr, instance: entry });
								}
								break;
							}
							case 'SA_29': {
								type Sel = Array<Data.SelectionObject & { talent: [string, number]; }>;
								const activeIds = getSids(a);
								const sel = (a.sel as Sel).filter(e => {
									if (getDSids(a).includes(e.id)) {
										return false;
									}
									else {
										return !activeIds.includes(e.id) && (get(dependent, e.talent[0]) as Data.TalentInstance).value >= e.talent[1];
									}
								});
								if (sel.length > 0) {
									finalEntries.push({ id, name, sel, cost, gr, instance: entry });
								}
								break;
							}
							case 'SA_30': {
								const sel = sortObjects(a.sel!.filter(e => active.every(n => n.sid !== e.id) && !getDSids(a).includes(e.id)), locale.id);
								if (sel.length > 0) {
									finalEntries.push({ id, name, sel, cost, tiers: 3, gr, instance: entry });
								}
								break;
							}
							case 'SA_86': {
								const { adv, disadv } = ap;
								const sel = a.sel && sortObjects(a.sel.filter(e => e.id < 6 && e.id > 9 || adv[1] <= 25 && disadv[1] <= 25), locale.id);
								if (Array.isArray(sel) && sel.length > 0) {
									finalEntries.push({ id, name, sel, cost, gr, instance: entry });
								}
								break;
							}
							case 'SA_88': {
								const spellsAbove10 = [...dependent.spells.values()].filter(e => e.value >= 10);
								const counter = spellsAbove10.reduce((map, obj) => {
									const property = obj.property;
									if (map.has(property)) {
										map.set(property, map.get(property)! + 1);
									}
									else {
										map.set(property, 1);
									}
									return map;
								}, new Map<number, number>());
								const activeIds = getSids(a);
								const sel = a.sel!.filter(e => {
									const spellsAbove10WithProperty = counter.get(e.id as number);
									return spellsAbove10WithProperty && spellsAbove10WithProperty >= 3 && !activeIds.includes(e.id) && !getDSids(a).includes(e.id);
								}).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
								if (sel.length > 0) {
									const apArr = [10, 20, 40];
									const cost = apArr[active.length];
									finalEntries.push({ id, name, sel, cost, gr, instance: entry });
								}
								break;
							}
							case 'SA_97': {
								const activeIds = getSids(a);
								const sel = sortObjects(a.sel!.filter(e => getSids(get(dependent, 'SA_88') as Data.SpecialAbilityInstance).includes(e.id) && !activeIds.includes(e.id)), locale.id);
								if (sel.length > 0) {
									finalEntries.push({ id, name, sel, cost, gr, instance: entry });
								}
								break;
							}
							case 'SA_103': {
								const liturgiesAbove10 = [...dependent.liturgies.values()].filter(e => e.value >= 10);
								const counter = liturgiesAbove10.reduce((map, obj) => {
									obj.aspects.forEach(e => {
										if (map.has(e)) {
											map.set(e, map.get(e)! + 1);
										}
										else {
											map.set(e, 1);
										}
									});
									return map;
								}, new Map<number, number>());
								const activeIds = getSids(a);
								const activeTradition = last(getSids(get(dependent, 'SA_102') as Data.SpecialAbilityInstance));
								const sel = sortObjects(a.sel!.filter(e => getTraditionOfAspect(e.id as number) === activeTradition && counter.get(e.id as number)! >= 3 && !activeIds.includes(e.id) && !getDSids(a).includes(e.id)), locale.id);
								if (sel.length > 0) {
									const apArr = [15, 25, 45];
									const cost = apArr[active.length];
									finalEntries.push({ id, name, sel, cost, gr, instance: entry });
								}
								break;
							}
							case 'SA_252': {
								const activeIds = getSids(a);
								const sel = a.sel!.filter(e => !activeIds.includes(e.id) && !getDSids(a).includes(e.id) && (get(dependent, id) as Data.SpellInstance).value >= 10);
								if (sel.length > 0) {
									finalEntries.push({ id, name, sel, cost, gr, instance: entry });
								}
								break;
							}
							case 'SA_368': {
								type EnhancedSelectionObject = Data.SelectionObject & { gr: number; tier: number; };
								let sel = a.sel as EnhancedSelectionObject[];
								if (isActive(a)) {
									const selectedPath = (getSelectionItem(a, a.active[0].sid) as EnhancedSelectionObject).gr;
									const lastTier = (getSelectionItem(a, a.active[a.active.length - 1].sid) as EnhancedSelectionObject).tier;
									sel = sel.filter(e => e.gr === selectedPath && e.tier === lastTier + 1);
								}
								else {
									sel = sel.filter(e => e.tier === 1);
								}
								if (sel.length > 0) {
									finalEntries.push({ id, name, sel, cost, gr, instance: entry });
								}
								break;
							}
							case 'SA_484': {
								const activeIds = getSids(a);
								const sel = (a.sel as Array<Data.SelectionObject & { req: Reusable.AllRequirementTypes[], target: string; tier: number; }>).filter(e => !activeIds.includes(e.id) && validate(state, e.req, id) && !getDSids(a).includes(e.id) && (get(dependent, e.target) as Data.SpellInstance).value > e.tier * 4 + 4).map(e => {
									const { name, target, ...other } = e;
									return { name: `${(get(dependent, target) as Data.SpellInstance).name}: ${name}`, target, ...other };
								});
								if (sel.length > 0) {
									finalEntries.push({ id, name, sel, cost, gr, instance: entry });
								}
								break;
							}

							default: {
								let sel = Array.isArray(a.sel) ? a.sel.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0) : undefined;
								if (cost === 'sel' && sel) {
									const activeIds = getSids(a);
									sel = sel.filter(e => !activeIds.includes(e.id) && !getDSids(a).includes(e.id));
								}
								finalEntries.push({ id, name, cost, tiers, input, sel, gr, instance: entry });
								if (id === 'SA_261') {
									console.log({ id, name, cost, tiers, input, sel, gr });
								}
								break;
							}
						}
					}
				});
			}
			return finalEntries;
		}
	);
};

export const getAdvantagesRating = createSelector(
	getCurrentRace,
	getCurrentCulture,
	getCurrentProfession,
	(race, culture, profession) => {
		const rating: Data.ToListById<string> = {};

		if (race && culture && profession) {
			race.commonAdvantages.forEach(e => { rating[e] = 'TYP'; });
			race.uncommonAdvantages.forEach(e => { rating[e] = 'UNTYP'; });
			culture.typicalAdvantages.forEach(e => { rating[e] = 'TYP'; });
			culture.untypicalAdvantages.forEach(e => { rating[e] = 'UNTYP'; });
			profession.typicalAdvantages.forEach(e => { rating[e] = 'TYP'; });
			profession.untypicalAdvantages.forEach(e => { rating[e] = 'UNTYP'; });
			race.stronglyRecommendedAdvantages.forEach(e => { rating[e] = 'IMP'; });
		}

		return rating;
	}
);

export const getDisadvantagesRating = createSelector(
	getCurrentRace,
	getCurrentCulture,
	getCurrentProfession,
	(race, culture, profession) => {
		const rating: Data.ToListById<string> = {};

		if (race && culture && profession) {
			race.commonDisadvantages.forEach(e => { rating[e] = 'TYP'; });
			race.uncommonDisadvantages.forEach(e => { rating[e] = 'UNTYP'; });
			culture.typicalDisadvantages.forEach(e => { rating[e] = 'TYP'; });
			culture.untypicalDisadvantages.forEach(e => { rating[e] = 'UNTYP'; });
			profession.typicalDisadvantages.forEach(e => { rating[e] = 'TYP'; });
			profession.untypicalDisadvantages.forEach(e => { rating[e] = 'UNTYP'; });
			race.stronglyRecommendedDisadvantages.forEach(e => { rating[e] = 'IMP'; });
		}

		return rating;
	}
);

export const getAdvantagesForSheet = createSelector(
	getActiveForView(Categories.ADVANTAGES),
	active => active
);

export const getDeactiveAdvantages = createSelector(
	getDeactiveForView(Categories.ADVANTAGES),
	active => active
);

export const getDisadvantagesForSheet = createSelector(
	getActiveForView(Categories.DISADVANTAGES),
	active => active
);

export const getDeactiveDisadvantages = createSelector(
	getDeactiveForView(Categories.DISADVANTAGES),
	active => active
);

export const getSpecialAbilitiesForSheet = createSelector(
	getActiveForView(Categories.SPECIAL_ABILITIES),
	active => active
);

export const getDeactiveSpecialAbilities = createSelector(
	getDeactiveForView(Categories.SPECIAL_ABILITIES),
	active => active
);

export const getGeneralSpecialAbilitiesForSheet = createSelector(
	[ getSpecialAbilitiesForSheet, getMessages, getCultureAreaKnowledge ],
	(specialAbilities, messages, cultureAreaKnowledge = '') => {
		return [
			...specialAbilities.filter(e => [1, 2].includes(e.gr!)),
			_translate(messages!, 'charactersheet.main.generalspecialabilites.areaknowledge', cultureAreaKnowledge)
		];
	}
);

export const getCombatSpecialAbilitiesForSheet = createSelector(
	[ getSpecialAbilitiesForSheet ],
	specialAbilities => {
		return specialAbilities.filter(e => [3, 9, 10, 11, 12].includes(e.gr!));
	}
);

export const getMagicalSpecialAbilitiesForSheet = createSelector(
	[ getSpecialAbilitiesForSheet ],
	specialAbilities => {
		return specialAbilities.filter(e => [4, 5, 6].includes(e.gr!));
	}
);

export const getBlessedSpecialAbilitiesForSheet = createSelector(
	[ getSpecialAbilitiesForSheet ],
	specialAbilities => {
		return specialAbilities.filter(e => [7].includes(e.gr!));
	}
);

export const getFatePointsModifier = createSelector(
	[ mapGetToSlice(getAdvantages, 'ADV_14'), mapGetToSlice(getDisadvantages, 'DISADV_31') ],
	(luck, badLuck) => {
		const luckActive = luck && luck.active[0];
		const badLuckActive = badLuck && badLuck.active[0];
		if (luckActive) {
			return luckActive.tier!;
		}
		if (badLuckActive) {
			return badLuckActive.tier!;
		}
		return 0;
	}
);

export const getMagicalTraditionForSheet = createSelector(
	[ mapGetToSlice(getSpecialAbilities, 'SA_86') ],
	tradition =>  getSelectionName(tradition!, last(getSids(tradition!)))!
);

export const getPropertyKnowledgesForSheet = createSelector(
	[ mapGetToSlice(getSpecialAbilities, 'SA_88') ],
	propertyKnowledge => getSids(propertyKnowledge!).map(e => getSelectionName(propertyKnowledge!, e)!)
);

export const getBlessedTraditionForSheet = createSelector(
	[ mapGetToSlice(getSpecialAbilities, 'SA_102') ],
	tradition =>  getSelectionName(tradition!, last(getSids(tradition!)))!
);

export const getAspectKnowledgesForSheet = createSelector(
	[ mapGetToSlice(getSpecialAbilities, 'SA_103') ],
	aspectKnowledge => getSids(aspectKnowledge!).map(e => getSelectionName(aspectKnowledge!, e)!)
);

export const getInitialStartingWealth = createSelector(
	[ mapGetToSlice(getAdvantages, 'ADV_36'), mapGetToSlice(getDisadvantages, 'DISADV_2') ],
	(rich, poor) => {
		if (rich && isActive(rich)) {
			return 750 + rich.active[0]!.tier! * 250;
		}
		else if (poor && isActive(poor)) {
			return 750 - poor.active[0]!.tier! * 250;
		}
		return 750;
	}
);
