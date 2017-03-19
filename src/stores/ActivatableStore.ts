import * as Categories from '../constants/Categories';
import { getDSids, getSids, isActivatable, isActive } from '../utils/ActivatableUtils';
import validate from '../utils/validate';
import { get, getAllByCategory, getAllByCategoryGroup, getObjByCategory } from './ListStore';

export const getForSave = (): { [id: string]: ActiveObject[] } => {
	const allEntries = [
		...getAllByCategory(Categories.ADVANTAGES) as AdvantageInstance[],
		...getAllByCategory(Categories.DISADVANTAGES) as DisadvantageInstance[],
		...getAllByCategory(Categories.SPECIAL_ABILITIES) as SpecialAbilityInstance[],
	];
	return allEntries.filter(e => isActive(e)).reduce((a, b) => ({ ...a, [b.id]: b.active }), {});
};

export const getActiveForView = (category: ADVANTAGES | DISADVANTAGES | SPECIAL_ABILITIES) => {
	const allEntries = getAllByCategory(category) as Array<ActivatableInstance & { gr?: number; }>;
	const filteredEntries = allEntries.filter(e => isActive(e));
	const convert = (id: string, active: ActiveObject[], gr?: number) => active.map((active, index) => ({ id, active, index, gr }));
	return filteredEntries.reduce((a, { id, active, gr }) => a.concat(convert(id, active, gr)), [] as ActiveViewObject[]);
};

export const getDeactiveForView = (category: ADVANTAGES | DISADVANTAGES | SPECIAL_ABILITIES) => {
	const allEntries = getObjByCategory(category) as {
		[id: string]: AdvantageInstance;
	} | {
		[id: string]: DisadvantageInstance;
	} | {
		[id: string]: SpecialAbilityInstance;
	};
	const finalEntries: Array<ToOptionalKeys<ActivatableInstance>> = [];
	for (const id in allEntries) {
		if (allEntries.hasOwnProperty(id)) {
			const a = allEntries[id] as ActivatableInstance & { tiers?: number; gr?: number; };
			const { cost, max, active, name, input, tiers, dependencies, gr } = a;
			if (!isActivatable(a) || dependencies.includes(false)) {
				continue;
			}
			if (max === null || active.length < max) {
				switch (id) {
					case 'ADV_4':
					case 'ADV_17':
					case 'ADV_47': {
						const sel = a.sel.filter(e => !getSids(a).includes(e.id) && !getDSids(a).includes(e.id));
						finalEntries.push({ id, name, sel, cost });
						break;
					}
					case 'ADV_16': {
						const sel = a.sel.filter(e => getSids(a).filter(d => d === e.id).length < 2 && !getDSids(a).includes(e.id));
						finalEntries.push({ id, name, sel, cost });
						break;
					}
					case 'ADV_28':
					case 'ADV_29': {
						const sel = a.sel.filter(e => !getDSids(a).includes(e.id));
						finalEntries.push({ id, name, sel });
						// advs.push({ id, name, sel, input });
						break;
					}
					case 'ADV_32': {
						const sel = a.sel.filter(e => !getSids(get('DISADV_24') as DisadvantageInstance).includes(e.id) && !getDSids(a).includes(e.id));
						finalEntries.push({ id, name, sel, input, cost });
						break;
					}
					case 'DISADV_1':
					case 'DISADV_34':
					case 'DISADV_50': {
						const sel = a.sel.filter(e => !getDSids(a).includes(e.id));
						finalEntries.push({ id, name, tiers, sel, input, cost });
						break;
					}
					case 'DISADV_24': {
						const sel = a.sel.filter(e => !getSids(get('ADV_32') as AdvantageInstance).includes(e.id) && !getDSids(a).includes(e.id));
						finalEntries.push({ id, name, sel, input, cost });
						break;
					}
					case 'DISADV_33':
					case 'DISADV_37':
					case 'DISADV_51': {
						let sel;
						if (a.id === 'DISADV_33') {
							sel = a.sel.filter(e => ([7, 8].includes(e.id as number) || !getSids(a).includes(e.id)) && !getDSids(a).includes(e.id));
						}
						else {
							sel = a.sel.filter(e => !getSids(a).includes(e.id) && !getDSids(a).includes(e.id));
						}
						finalEntries.push({ id, name, sel, cost });
						break;
					}
					case 'DISADV_36': {
						const sel = a.sel.filter(e => !getSids(a).includes(e.id) && !getDSids(a).includes(e.id));
						finalEntries.push({ id, name, sel, input, cost });
						break;
					}
					case 'DISADV_48': {
						const sel = a.sel.filter(e => {
							if ((get('ADV_40') as AdvantageInstance).active.length > 0 || (get('ADV_46') as AdvantageInstance).active.length > 0) {
								if ((get(e.id as string) as LiturgyInstance | SpellInstance | TalentInstance).gr === 2) {
									return false;
								}
							}
							return !getSids(a).includes(e.id) && !getDSids(a).includes(e.id);
						});
						finalEntries.push({ id, name, sel, cost });
						break;
					}
					case 'SA_18': {
						const sum = (get('TAL_51') as TalentInstance).value + (get('TAL_55') as TalentInstance).value;
						if (sum >= 12) {
							finalEntries.push({ id, name, cost, gr });
						}
						break;
					}
					case 'SA_19':
						if ((getAllByCategoryGroup(Categories.COMBAT_TECHNIQUES, 2) as CombatTechniqueInstance[]).filter(e => e.value >= 10).length > 0) {
							finalEntries.push({ id, name, cost, gr });
						}
						break;
					case 'SA_3': {
						const sel = (a.sel as Array<SelectionObject & { req: RequirementObject[] }>).filter(e => !active.includes(e.id) && validate(e.req) && !getDSids(a).includes(e.id));
						if (sel.length > 0) {
							finalEntries.push({ id, name, sel, cost, gr });
						}
						break;
					}
					case 'SA_10': {
						const counter = active.reduce((map, obj) => {
							const sid = obj.sid as string;
							const sid2 = obj.sid2 as string | number;
							if (map.has(sid)) {
								map.set(sid, [ ...(map.get(sid) as Array<number | string>), sid2]);
							}
							else {
								map.set(sid, [ sid2 ]);
							}
							return map;
						}, new Map<string, Array<number | string>>());
						type Sel = Array<SelectionObject & { specialisation: string[] | null; specialisationInput: string | null }>;
						const sel = (a.sel as Sel).filter(e => {
							const id = e.id as string;
							if (getDSids(a).includes(id)) {
								return false;
							}
							else if (counter.has(id)) {
								const arr = counter.get(id);
								return arr && arr.length < 3 && (get(id) as TalentInstance).value >= 6 * (arr.length + 1);
							}
							else {
								return (get(id) as TalentInstance).value >= 6;
							}
						}).map(e => {
							const id = e.id as string;
							const arr = counter.get(id);
							if (arr) {
								e.cost = e.cost! * arr.length + 1;
							}
							e.specialisation = e.specialisation && e.specialisation.filter(n => {
								return !!counter.get(id) || (arr && !arr.includes(n[1]) || !arr);
							});
							return e;
						}).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
						if (sel.length > 0) {
							finalEntries.push({ id, name, sel, cost, gr });
						}
						break;
					}
					case 'SA_29': {
						type Sel = Array<SelectionObject & { talent: [string, number]; }>;
						const sel = (a.sel as Sel).filter(e => {
							if (getDSids(a).includes(e.id)) {
								return false;
							}
							else {
								return !active.includes(e.id) && (get(e.talent[0]) as TalentInstance).value >= e.talent[1];
							}
						});
						if (sel.length > 0) {
							finalEntries.push({ id, name, sel, cost, gr });
						}
						break;
					}
					case 'SA_30': {
						const sel = a.sel.filter(e => active.every(n => n.sid !== e.id) && !getDSids(a).includes(e.id));
						sel.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
						if (sel.length > 0) {
							finalEntries.push({ id, name, sel, cost, tiers: 3, gr });
						}
						break;
					}
					case 'SA_88': {
						const spellsAbove10 = (getAllByCategory(Categories.SPELLS) as SpellInstance[]).filter(e => e.value >= 10);
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
						const sel = a.sel.filter(e => counter.get(e.id as number)! >= 3 && !getSids(a).includes(e.id) && !getDSids(a).includes(e.id)).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
						if (sel.length > 0) {
							const apArr = [10, 20, 40];
							const cost = apArr[active.length];
							finalEntries.push({ id, name, sel, cost, gr });
						}
						break;
					}
					case 'SA_103': {
						const liturgiesAbove10 = (getAllByCategory(Categories.LITURGIES) as LiturgyInstance[]).filter(e => e.value >= 10);
						const counter = liturgiesAbove10.reduce((map, obj) => {
							const aspect = obj.aspects;
							aspect.forEach(e => {
								if (map.has(e)) {
									map.set(e, map.get(e)! + 1);
								}
								else {
									map.set(e, 1);
								}
							});
							return map;
						}, new Map<number, number>());
						const sel = a.sel.filter(e => counter.get(e.id as number)! >= 3 && !getSids(a).includes(e.id) && !getDSids(a).includes(e.id)).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
						if (sel.length > 0) {
							const apArr = [15, 25, 45];
							const cost = apArr[active.length];
							finalEntries.push({ id, name, sel, cost, gr });
						}
						break;
					}

					default: {
						const tiers = a.tiers !== null ? a.tiers : undefined;
						const input = a.input !== null ? a.input : undefined;
						let sel = a.sel.length > 0 ? a.sel.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0) : undefined;
						if (cost === 'sel' && sel) {
							sel = sel.filter(e => !getSids(a).includes(e.id) && !getDSids(a).includes(e.id));
						}
						finalEntries.push({ id, name, cost, tiers, input, sel, gr });
						break;
					}
				}
			}
		}
	}
	return finalEntries as ActivatableInstance[];
};
