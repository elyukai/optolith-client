import * as Categories from '../constants/Categories';
import CultureStore from '../stores/CultureStore';
import { get, getAllByCategoryGroup, getPrimaryAttrID } from '../stores/ListStore';
import ProfessionStore from '../stores/ProfessionStore';
import RaceStore from '../stores/RaceStore';
import { getSids, isActive } from '../utils/ActivatableUtils';

export function validateInstanceRequirementObject(req: 'RCP' | RequirementObject, sourceId: string): boolean {
	if (req === 'RCP') {
		const currentRace = RaceStore.getCurrent()!;
		const currentCulture = CultureStore.getCurrent()!;
		const currentProfession = ProfessionStore.getCurrent()!;

		const array = [
			...currentRace.importantAdvantages,
			...currentRace.importantDisadvantages,
			...currentRace.typicalAdvantages,
			...currentRace.typicalDisadvantages,
			...currentCulture.typicalAdvantages,
			...currentCulture.typicalDisadvantages,
			...currentProfession.typicalAdvantages,
			...currentProfession.typicalDisadvantages,
		];

		return array.includes(sourceId);
	} else {
		let id: string | string[] | undefined = req.id;
		if (Array.isArray(id)) {
			const resultOfAll = id.map(e => validateInstanceRequirementObject({ ...req, id: e }, sourceId));
			return resultOfAll.includes(true);
		}
		else if (id === 'RACE') {
			return (req.sid as number[]).map(e => `R_${e}`).includes(RaceStore.getCurrentID() as string);
		}
		else if (req.id === 'ATTR_PRIMARY') {
			id = getPrimaryAttrID(req.type as 1 | 2);
			if (id) {
				return true;
			}
		}
		else if (req.sid === 'sel') {
			return true;
		}
		else if (req.sid === 'GR') {
			const gr = req.sid2 as number;
			const arr = getAllByCategoryGroup(Categories.TALENTS, gr).map(e => e.id);
			for (const e of getSids(get(id) as ActivatableInstance)) {
				if (arr.includes(e as string)) {
					return false;
				}
			}
			return true;
		}
		if (id) {
			const a = get(id);
			switch (a.category) {
				case Categories.ATTRIBUTES:
				case Categories.COMBAT_TECHNIQUES:
				case Categories.LITURGIES:
				case Categories.SPELLS:
				case Categories.TALENTS:
					if (typeof a.value === 'number') {
						return a.value >= req.value!;
					}
					break;

				case Categories.ADVANTAGES:
				case Categories.DISADVANTAGES:
				case Categories.SPECIAL_ABILITIES:
					if (req.sid) {
						return req.active === getSids(a).includes(req.sid as string | number);
					}
					return isActive(a) === req.active;
			}
		}
	}
	return false;
}

export default function validateInstance (reqs: Array<'RCP' | RequirementObject>, id: string): boolean {
	return reqs.every(req => validateInstanceRequirementObject(req, id));
}
