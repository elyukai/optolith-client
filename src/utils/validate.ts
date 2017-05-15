import * as Categories from '../constants/Categories';
import { CultureStore } from '../stores/CultureStore';
import { get, getAllByCategoryGroup, getPrimaryAttrID } from '../stores/ListStore';
import { ProfessionStore } from '../stores/ProfessionStore';
import { ProfileStore } from '../stores/ProfileStore';
import { RaceStore } from '../stores/RaceStore';
import { ActivatableInstance, AllRequirementObjects, CultureRequirement, ProfessionDependencyObject, RaceRequirement, RequirementObject, SexRequirement } from '../types/data.d';
import { getSids, isActive } from './ActivatableUtils';

export function validateInstanceRequirementObject(req: AllRequirementObjects, sourceId: string): boolean {
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
		if (isSexRequirement(req)) {
			return ProfileStore.getSex() === req.value;
		}
		else if (isRaceRequirement(req)) {
			const race = RaceStore.getCurrentID();
			if (Array.isArray(req.value)) {
				return !!race && req.value.map(e => `R_${e}`).includes(race);
			}
			return !!race && race === req.value;
		}
		else if (isCultureRequirement(req)) {
			const culture = CultureStore.getCurrentID();
			if (Array.isArray(req.value)) {
				return !!culture && req.value.includes(culture);
			}
			return !!culture && culture === req.value;
		}
		else if (Array.isArray(id)) {
			const resultOfAll = id.map(e => validateInstanceRequirementObject({ ...req, id: e }, sourceId));
			return resultOfAll.includes(true);
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
			if (a === undefined) {
				return false;
			}
			switch (a.category) {
				case Categories.ATTRIBUTES:
				case Categories.COMBAT_TECHNIQUES:
				case Categories.LITURGIES:
				case Categories.SPELLS:
				case Categories.TALENTS:
					if (typeof a.value === 'number' && typeof req.value === 'number') {
						return a.value >= req.value;
					}
					break;

				case Categories.ADVANTAGES:
				case Categories.DISADVANTAGES:
				case Categories.SPECIAL_ABILITIES:
					if (req.sid) {
						if (Array.isArray(req.sid)) {
							const activeSids = getSids(a);
							return req.active === req.sid.some(e => activeSids.includes(e));
						}
						return req.active === getSids(a).includes(req.sid);
					}
					return isActive(a) === req.active;
			}
		}
	}
	return false;
}

export function validateInstance (reqs: AllRequirementObjects[], id: string): boolean {
	return reqs.every(req => validateInstanceRequirementObject(req, id));
}

function isSexRequirement(req: RequirementObject | ProfessionDependencyObject): req is SexRequirement {
	return req.id === 'SEX';
}

function isRaceRequirement(req: RequirementObject | ProfessionDependencyObject): req is RaceRequirement {
	return req.id === 'RACE';
}

function isCultureRequirement(req: RequirementObject | ProfessionDependencyObject): req is CultureRequirement {
	return req.id === 'CULTURE';
}
