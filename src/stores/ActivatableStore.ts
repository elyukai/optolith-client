import { last } from 'lodash';
import * as Categories from '../constants/Categories';
import * as Data from '../types/data.d';
import * as Reusable from '../types/reusable.d';
import { getDSids, getSecondSidMap, getSelectionItem, getSelectionName, getSids, isActivatable, isActive, isDeactivatable } from '../utils/ActivatableUtils';
import { translate } from '../utils/I18n';
import { sort } from '../utils/ListUtils';
import { getTraditionOfAspect } from '../utils/LiturgyUtils';
import { validate } from '../utils/RequirementUtils';
import { APStore } from './APStore';
import { ELStore } from './ELStore';
import { get, getAllByCategory, getAllByCategoryGroup, getObjByCategory } from './ListStore';

export function getForSave(): { [id: string]: Data.ActiveObject[] } {
	const allEntries = [
		...getAllByCategory(Categories.ADVANTAGES) as Data.AdvantageInstance[],
		...getAllByCategory(Categories.DISADVANTAGES) as Data.DisadvantageInstance[],
		...getAllByCategory(Categories.SPECIAL_ABILITIES) as Data.SpecialAbilityInstance[],
	];
	return allEntries.filter(e => isActive(e)).reduce((a, b) => ({ ...a, [b.id]: b.active }), {});
}

export function getActiveForView(category: Categories.ACTIVATABLE): Data.ActiveViewObject[] {
	const allEntries = getObjByCategory(category) as Map<string, Data.ActivatableInstance & { gr?: number; tiers?: number; }>;
	const finalEntries: Data.ActiveViewObject[] = [];

	allEntries.forEach(entry => {
		if (isActive(entry)) {
			const { id } = entry;
			const a = get(id) as Data.ActivatableInstance & { tiers?: number; gr?: number; };
			const { cost, category, sel, dependencies, input, gr, name, active } = a;
			let { tiers } = a;

			active.forEach((current, index) => {
				const { sid, sid2, tier } = current;
				let disabled = !isDeactivatable(a, sid);
				let add: string | undefined;
				let currentCost: number | undefined;
				const activeObject: Data.ActiveViewObject & { [id: string]: object | string | number | boolean | undefined; } = {
					id,
					index,
					name,
					cost: 0,
					gr,
					disabled: false,
				};

				switch (id) {
					case 'ADV_4':
					case 'ADV_47':
					case 'DISADV_48': {
						const { name, ic } = (get(sid as string)) as Data.SkillishInstance;
						add = name;
						currentCost = (cost as number[])[ic - 1];
						break;
					}
					case 'ADV_16': {
						const { name, ic, value } = (get(sid as string)) as Data.SkillInstance;
						const counter = a.active.reduce((e, obj) => obj.sid === sid ? e + 1 : e, 0);
						add = name;
						currentCost = (cost as number[])[ic - 1];
						disabled = disabled || ELStore.getStart().maxSkillRating + counter === value;
						break;
					}
					case 'ADV_17': {
						const { name, ic, value } = (get(sid as string)) as Data.CombatTechniqueInstance;
						add = name;
						currentCost = (cost as number[])[ic - 1];
						disabled = disabled || ELStore.getStart().maxCombatTechniqueRating + 1 === value;
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
						const activeSpells = (getAllByCategory(Categories.SPELLS) as Data.SpellInstance[]).reduce((n, e) => e.active ? n + 1 : n, 0);
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
						const activeSpells = (getAllByCategory(Categories.SPELLS) as Data.SpellInstance[]).reduce((n, e) => e.active ? n + 1 : n, 0);
						if (activeSpells < 3) {
							activeObject.maxTier = 3 - activeSpells;
						}
						break;
					}
					case 'SA_10': {
						const counter = (get(id) as Data.SpecialAbilityInstance).active.reduce((c, obj) => obj.sid === sid ? c + 1 : c, 0);
						const skill = get(sid as string) as Data.TalentInstance;
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
						if ((getAllByCategory(Categories.SPELLS) as Data.SpellInstance[]).some(e => e.active)) {
							disabled = true;
						}
						const selectionItem = getSelectionItem(a, sid);
						add = selectionItem && selectionItem.name;
						currentCost = selectionItem && selectionItem.cost as number;
						if (typeof add === 'string' && sid === 9 && typeof sid2 === 'string') {
							const entry = get(sid2) as Data.TalentInstance;
							if (entry) {
								add += `: ${entry.name}`;
							}
						}
						else if (typeof add === 'string' && sid === 6) {
							const musictraditionIds = [1, 2, 3];
							add += `: ${translate('musictraditions')[musictraditionIds.findIndex(e => e === sid2)]}`;
						}
						else if (typeof add === 'string' && sid === 7) {
							const dancetraditionIds = [4, 5, 6, 7];
							add += `: ${translate('dancetraditions')[dancetraditionIds.findIndex(e => e === sid2)]}`;
						}
						break;
					}
					case 'SA_102': {
						if ((getAllByCategory(Categories.LITURGIES) as Data.LiturgyInstance[]).some(e => e.active)) {
							disabled = true;
						}
						const selectionItem = getSelectionItem(a, sid);
						add = selectionItem && selectionItem.name;
						currentCost = selectionItem && selectionItem.cost as number;
						break;
					}
					case 'SA_252': {
						const { name, ic } = (get(sid as string)) as Data.SpellInstance;
						add = name;
						currentCost = (cost as number[])[ic - 1];
						break;
					}
					case 'SA_273': {
						const { name, ic } = (get(sid as string)) as Data.SpellInstance;
						add = name;
						currentCost = (cost as number[])[ic - 1];
						break;
					}
					case 'SA_484': {
						const selectionItem = getSelectionItem(a, sid) as (Data.SelectionObject & { req: Data.RequirementObject[], target: string; tier: number; }) | undefined;
						add = selectionItem && `${(get(selectionItem.target) as Data.SpellInstance).name}: ${selectionItem.name}`;
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
					activeObject.name = `${translate('activatable.view.immunityto')} ${add}`;
				}
				else if (id === 'DISADV_1') {
					activeObject.name = `${translate('activatable.view.afraidof')} ${add}`;
				}
				else if (id === 'ADV_68') {
					activeObject.name = `${translate('activatable.view.hatredof')} ${add}`;
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

export function getDeactiveForView(category: Categories.ACTIVATABLE): Data.DeactiveViewObject[] {
	const allEntries = getObjByCategory(category) as Map<string, Data.AdvantageInstance | Data.DisadvantageInstance | Data.SpecialAbilityInstance>;
	const finalEntries: Data.DeactiveViewObject[] = [];
	allEntries.forEach(entry => {
		const a = entry as Data.ActivatableInstance & { tiers?: number; gr?: number; };
		const { id, cost, max, active, name, input, tiers, dependencies, gr } = a;
		if (isActivatable(a) && !dependencies.includes(false) && (max === undefined || active.length < max)) {
			switch (id) {
				case 'ADV_4':
				case 'ADV_17':
				case 'ADV_47':
				case 'SA_273': {
					const sel = a.sel!.filter(e => !getSids(a).includes(e.id) && !getDSids(a).includes(e.id));
					if (a.category === Categories.SPECIAL_ABILITIES) {
						finalEntries.push({ id, name, sel, cost, gr });
					}
					else {
						finalEntries.push({ id, name, sel, cost });
					}
					break;
				}
				case 'ADV_16': {
					const sel = a.sel!.filter(e => getSids(a).filter(d => d === e.id).length < 2 && !getDSids(a).includes(e.id));
					finalEntries.push({ id, name, sel, cost });
					break;
				}
				case 'ADV_28':
				case 'ADV_29': {
					const sel = a.sel!.filter(e => !getDSids(a).includes(e.id));
					finalEntries.push({ id, name, sel });
					// advs.push({ id, name, sel, input });
					break;
				}
				case 'ADV_32': {
					const sel = a.sel!.filter(e => !getSids(get('DISADV_24') as Data.DisadvantageInstance).includes(e.id) && !getDSids(a).includes(e.id));
					finalEntries.push({ id, name, sel, input, cost });
					break;
				}
				case 'ADV_58': {
					const activeSpells = (getAllByCategory(Categories.SPELLS) as Data.SpellInstance[]).reduce((n, e) => e.active ? n + 1 : n, 0);
					if (activeSpells > 3) {
						finalEntries.push({ id, name, cost, tiers, minTier: activeSpells - 3 });
					}
					break;
				}
				case 'DISADV_1':
				case 'DISADV_34':
				case 'DISADV_50': {
					const sel = a.sel!.filter(e => !getDSids(a).includes(e.id));
					finalEntries.push({ id, name, tiers, sel, input, cost });
					break;
				}
				case 'DISADV_24': {
					const sel = a.sel!.filter(e => !getSids(get('ADV_32') as Data.AdvantageInstance).includes(e.id) && !getDSids(a).includes(e.id));
					finalEntries.push({ id, name, sel, input, cost });
					break;
				}
				case 'DISADV_33':
				case 'DISADV_37':
				case 'DISADV_51': {
					let sel;
					if (a.id === 'DISADV_33') {
						sel = a.sel!.filter(e => ([7, 8].includes(e.id as number) || !getSids(a).includes(e.id)) && !getDSids(a).includes(e.id));
					}
					else {
						sel = a.sel!.filter(e => !getSids(a).includes(e.id) && !getDSids(a).includes(e.id));
					}
					finalEntries.push({ id, name, sel, cost });
					break;
				}
				case 'DISADV_36': {
					const sel = a.sel!.filter(e => !getSids(a).includes(e.id) && !getDSids(a).includes(e.id));
					finalEntries.push({ id, name, sel, input, cost });
					break;
				}
				case 'DISADV_48': {
					const sel = a.sel!.filter(e => {
						if ((get('ADV_40') as Data.AdvantageInstance).active.length > 0 || (get('ADV_46') as Data.AdvantageInstance).active.length > 0) {
							if ((get(e.id as string) as Data.SkillInstance).gr === 2) {
								return false;
							}
						}
						return !getSids(a).includes(e.id) && !getDSids(a).includes(e.id);
					});
					finalEntries.push({ id, name, sel, cost });
					break;
				}
				case 'DISADV_59': {
					const activeSpells = (getAllByCategory(Categories.SPELLS) as Data.SpellInstance[]).reduce((n, e) => e.active ? n + 1 : n, 0);
					if (activeSpells < 3) {
						finalEntries.push({ id, name, cost, tiers, maxTier: 3 - activeSpells });
					}
					break;
				}
				case 'SA_18': {
					const sum = (get('TAL_51') as Data.TalentInstance).value + (get('TAL_55') as Data.TalentInstance).value;
					if (sum >= 12) {
						finalEntries.push({ id, name, cost, gr });
					}
					break;
				}
				case 'SA_19':
					if ((getAllByCategoryGroup(Categories.COMBAT_TECHNIQUES, 2) as Data.CombatTechniqueInstance[]).filter(e => e.value >= 10).length > 0) {
						finalEntries.push({ id, name, cost, gr });
					}
					break;
				case 'SA_3': {
					const sel = (a.sel as Array<Data.SelectionObject & { req: Reusable.AllRequirementTypes[] }>).filter(e => !active.includes(e.id) && validate(e.req, id) && !getDSids(a).includes(e.id));
					if (sel.length > 0) {
						finalEntries.push({ id, name, sel, cost, gr });
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
							return arr && arr.length < 3 && (get(id) as Data.TalentInstance).value >= 6 * (arr.length + 1);
						}
						return (get(id) as Data.TalentInstance).value >= 6;
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
					const sel = sort(mapped);
					if (sel.length > 0) {
						finalEntries.push({ id, name, sel, cost, gr });
					}
					break;
				}
				case 'SA_29': {
					type Sel = Array<Data.SelectionObject & { talent: [string, number]; }>;
					const sel = (a.sel as Sel).filter(e => {
						if (getDSids(a).includes(e.id)) {
							return false;
						}
						else {
							return !active.includes(e.id) && (get(e.talent[0]) as Data.TalentInstance).value >= e.talent[1];
						}
					});
					if (sel.length > 0) {
						finalEntries.push({ id, name, sel, cost, gr });
					}
					break;
				}
				case 'SA_30': {
					const sel = sort(a.sel!.filter(e => active.every(n => n.sid !== e.id) && !getDSids(a).includes(e.id)), 'name');
					if (sel.length > 0) {
						finalEntries.push({ id, name, sel, cost, tiers: 3, gr });
					}
					break;
				}
				case 'SA_86': {
					const { adv, disadv } = APStore.getForDisAdv();
					const sel = a.sel && sort(a.sel.filter(e => e.id < 6 && e.id > 9 || adv[1] <= 25 && disadv[1] <= 25));
					if (Array.isArray(sel) && sel.length > 0) {
						finalEntries.push({ id, name, sel, cost, gr });
					}
					break;
				}
				case 'SA_88': {
					const spellsAbove10 = (getAllByCategory(Categories.SPELLS) as Data.SpellInstance[]).filter(e => e.value >= 10);
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
					const sel = a.sel!.filter(e => counter.get(e.id as number)! >= 3 && !getSids(a).includes(e.id) && !getDSids(a).includes(e.id)).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
					if (sel.length > 0) {
						const apArr = [10, 20, 40];
						const cost = apArr[active.length];
						finalEntries.push({ id, name, sel, cost, gr });
					}
					break;
				}
				case 'SA_97': {
					const sel = sort(a.sel!.filter(e => getSids(get('SA_88') as Data.SpecialAbilityInstance).includes(e.id) && !getSids(a).includes(e.id)), 'name');
					if (sel.length > 0) {
						finalEntries.push({ id, name, sel, cost, gr });
					}
					break;
				}
				case 'SA_103': {
					const liturgiesAbove10 = (getAllByCategory(Categories.LITURGIES) as Data.LiturgyInstance[]).filter(e => e.value >= 10);
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
					const activeTradition = last(getSids(get('SA_102') as Data.SpecialAbilityInstance));
					const sel = sort(a.sel!.filter(e => getTraditionOfAspect(e.id as number) === activeTradition && counter.get(e.id as number)! >= 3 && !getSids(a).includes(e.id) && !getDSids(a).includes(e.id)));
					if (sel.length > 0) {
						const apArr = [15, 25, 45];
						const cost = apArr[active.length];
						finalEntries.push({ id, name, sel, cost, gr });
					}
					break;
				}
				case 'SA_252': {
					const sel = a.sel!.filter(e => !getSids(a).includes(e.id) && !getDSids(a).includes(e.id) && (get(id) as Data.SpellInstance).value >= 10);
					if (sel.length > 0) {
						finalEntries.push({ id, name, sel, cost, gr });
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
						finalEntries.push({ id, name, sel, cost, gr });
					}
					break;
				}
				case 'SA_484': {
					const sel = (a.sel as Array<Data.SelectionObject & { req: Reusable.AllRequirementTypes[], target: string; tier: number; }>).filter(e => !getSids(a).includes(e.id) && validate(e.req, id) && !getDSids(a).includes(e.id) && (get(e.target) as Data.SpellInstance).value > e.tier * 4 + 4).map(e => {
						const { name, target, ...other } = e;
						return { name: `${(get(target) as Data.SpellInstance).name}: ${name}`, target, ...other };
					});
					if (sel.length > 0) {
						finalEntries.push({ id, name, sel, cost, gr });
					}
					break;
				}

				default: {
					let sel = Array.isArray(a.sel) ? a.sel.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0) : undefined;
					if (cost === 'sel' && sel) {
						sel = sel.filter(e => !getSids(a).includes(e.id) && !getDSids(a).includes(e.id));
					}
					finalEntries.push({ id, name, cost, tiers, input, sel, gr });
					if (id === 'SA_261') {
						console.log({ id, name, cost, tiers, input, sel, gr });
					}
					break;
				}
			}
		}
	});
	return finalEntries;
}
