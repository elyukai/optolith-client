import * as Categories from '../constants/Categories';
import CultureStore from '../stores/CultureStore';
import ProfessionStore from '../stores/ProfessionStore';
import RaceStore from '../stores/RaceStore';
import { get, getPrimaryAttrID, getAllByCategoryGroup } from '../stores/ListStore';

export const fn = (req: 'RCP' | RequirementObject, id?: string) => {
	if (req === 'RCP') {
		const currentRace = RaceStore.getCurrent() || {};
		const currentCulture = CultureStore.getCurrent() || {};
		const currentProfession = ProfessionStore.getCurrent() || {};
		const array = [];

		array.push(...currentRace.importantAdvantages.map(e => e[0] as string));
		array.push(...currentRace.importantDisadvantages.map(e => e[0] as string));
		array.push(...currentRace.typicalAdvantages);
		array.push(...currentRace.typicalDisadvantages);
		array.push(...currentCulture.typicalAdvantages);
		array.push(...currentCulture.typicalDisadvantages);
		array.push(...currentProfession.typicalAdvantages);
		array.push(...currentProfession.typicalDisadvantages);

		return array.some(e => e === id);
	} else {
		let id = req.id;
		if (id === 'RACE') {
			return (req.sid as number[]).map(e => `R_${e}`).includes(RaceStore.getCurrentID() as string);
		}
		else if (req.id === 'ATTR_PRIMARY') {
			id = getPrimaryAttrID(req.type as 1 | 2);
			if (id === 'ATTR_0') {
				return true;
			}
		}
		else if (req.sid === 'sel') {
			return true;
		}
		else if (req.sid === 'GR') {
			const gr = req.sid2 as number;
			const arr = getAllByCategoryGroup(Categories.TALENTS, gr).map(e => e.id);
			for (const e of (get(id) as AdvantageInstance | DisadvantageInstance | SpecialAbilityInstance).sid) {
				if (arr.includes(e as string)) {
					return false;
				}
			}
			return true;
		}
		const a = get(id);
		switch (a.category) {
			case Categories.ATTRIBUTES:
			case Categories.COMBAT_TECHNIQUES:
			case Categories.LITURGIES:
			case Categories.SPELLS:
			case Categories.TALENTS:
				if (typeof a.value === 'number') {
					return a.value >= req.value;
				}
				break;

			case Categories.ADVANTAGES:
			case Categories.DISADVANTAGES:
			case Categories.SPECIAL_ABILITIES:
				if (req.sid) {
					return req.active === a.sid.includes(req.sid as string | number);
				}
				return a.active.length > 0 === req.active;
		}
	}
	return false;
};

export default (reqs: ('RCP' | RequirementObject)[], id?: string): boolean => reqs.every(req => fn(req, id));
