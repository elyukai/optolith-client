import { get, getAllByCategory, getObjByCategory } from './ListStore';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import validate from '../utils/validate';

export const getForSave = (): { [id: string]: ActiveObject[] } => {
	const allEntries = [
		...getAllByCategory(Categories.ADVANTAGES) as AdvantageInstance[],
		...getAllByCategory(Categories.DISADVANTAGES) as DisadvantageInstance[],
		...getAllByCategory(Categories.SPECIAL_ABILITIES) as SpecialAbilityInstance[]
	];
	return allEntries.filter(e => e.isActive).reduce((a, b) => ({ ...a, [b.id]: b.active }), {});
};

interface ActiveViewObject {
	id: string;
	active: ActiveObject;
	index: number;
}

export const getActiveForView = (category: ADVANTAGES | DISADVANTAGES | SPECIAL_ABILITIES) => {
	const allEntries = getAllByCategory(category) as (AdvantageInstance | DisadvantageInstance | SpecialAbilityInstance)[];
	const filteredEntries = allEntries.filter(e => e.isActive);
	const convert = (id: string, active: ActiveObject[]) => active.map((active, index) => ({ id, active, index }));
	return filteredEntries.reduce((a, { id, active }) => a.concat(convert(id, active)), [] as ActiveViewObject[]);
};

export const getDeactiveForView = (category: ADVANTAGES | DISADVANTAGES | SPECIAL_ABILITIES) => {
	const advsObj = getObjByCategory(category) as {
		[id: string]: AdvantageInstance;
	} | {
		[id: string]: DisadvantageInstance;
	} | {
		[id: string]: SpecialAbilityInstance;
	};
	const advs: any[] = [];
	for (const id in advsObj) {
		const adv = advsObj[id];
		const { max, active, name, cost, dependencies, reqs } = adv;
		let { sel, input, tiers } = adv;
		if (!validate(reqs, id) || dependencies.includes(false)) {
			continue;
		}
		if (max === null || active.length < max) {
			switch (id) {
				case 'ADV_4':
				case 'ADV_17':
				case 'ADV_47':
					sel = sel.filter(e => !adv.sid.includes(e.id) && !dependencies.includes(e.id));
					break;
				case 'ADV_16':
					sel = sel.filter(e => adv.sid.filter(d => d === e.id).length < 2 && !dependencies.includes(e.id));
					break;
				case 'ADV_28':
				case 'ADV_29':
				case 'DISADV_1':
				case 'DISADV_34':
				case 'DISADV_50':
					sel = sel.filter(e => !dependencies.includes(e.id));
					break;
				case 'ADV_32':
					sel = sel.filter(e => !(get('DISADV_24') as DisadvantageInstance).sid.includes(e.id) && !dependencies.includes(e.id));
					break;
				case 'DISADV_24':
					sel = sel.filter(e => !(get('ADV_32') as AdvantageInstance).sid.includes(e.id) && !dependencies.includes(e.id));
					break;
				case 'DISADV_33':
					sel = sel.filter(e => ([7,8].includes(e.id as number) || !adv.sid.includes(e.id)) && !dependencies.includes(e.id));
					break;
				case 'DISADV_37':
				case 'DISADV_51':
					sel = sel.filter(e => !adv.sid.includes(e.id) && !dependencies.includes(e.id));
					break;
				case 'DISADV_48':
					sel = sel.filter(e => {
						if ((get('ADV_40') as AdvantageInstance).active.length > 0 || (get('ADV_46') as AdvantageInstance).active.length > 0) {
							if ((get(e.id as string) as LiturgyInstance | SpellInstance | TalentInstance).gr === 2) {
								return false;
							}
						}
						return !adv.sid.includes(e.id) && !dependencies.includes(e.id);
					});
					break;
			}
			const newTiers = tiers !== null ? tiers : undefined;
			const newInput = input !== null ? input : undefined;
			const newSel = sel.length > 0 ? sel : undefined;
			advs.push({ id, name, cost, tiers: newTiers, input: newInput, sel: newSel });
		}
	}
	return advs;
};
