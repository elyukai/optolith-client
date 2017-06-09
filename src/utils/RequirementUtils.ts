import * as Categories from '../constants/Categories';
import { CultureStore } from '../stores/CultureStore';
import { get, getAllByCategoryGroup, getPrimaryAttrID } from '../stores/ListStore';
import { ProfessionStore } from '../stores/ProfessionStore';
import { ProfileStore } from '../stores/ProfileStore';
import { RaceStore } from '../stores/RaceStore';
import { ActivatableInstance, AllRequirementObjects, AllRequirements, IncreasableInstance, Instance } from '../types/data.d';
import { CultureRequirement, RaceRequirement, RequiresActivatableObject, RequiresIncreasableObject, RequiresPrimaryAttribute, SexRequirement } from '../types/reusable.d';
import { getSids, isActive } from './ActivatableUtils';

/**
 * Checks if the requirement is fulfilled.
 * @param req A requirement object.
 * @param sourceId The id of the entry the requirement object belongs to.
 */
export function validateObject(req: AllRequirements, sourceId: string): boolean {
	if (req === 'RCP') {
		const array = [];
		const currentRace = RaceStore.getCurrent();
		const currentCulture = CultureStore.getCurrent();
		const currentProfession = ProfessionStore.getCurrent();

		if (typeof currentRace !== 'undefined') {
			array.push(...currentRace.importantAdvantages);
			array.push(...currentRace.importantDisadvantages);
			array.push(...currentRace.typicalAdvantages);
			array.push(...currentRace.typicalDisadvantages);
		}

		if (typeof currentCulture !== 'undefined') {
			array.push(...currentCulture.typicalAdvantages);
			array.push(...currentCulture.typicalDisadvantages);
		}

		if (typeof currentProfession !== 'undefined') {
			array.push(...currentProfession.typicalAdvantages);
			array.push(...currentProfession.typicalDisadvantages);
		}

		return array.includes(sourceId);
	}
	else if (isSexRequirement(req)) {
		return ProfileStore.getSex() === req.value;
	}
	else if (isRaceRequirement(req)) {
		const race = RaceStore.getCurrentID();
		if (Array.isArray(req.value)) {
			return !!race && req.value.map(e => `R_${e}`).includes(race);
		}
		return !!race && race === `R_${req.value}`;
	}
	else if (isCultureRequirement(req)) {
		const culture = CultureStore.getCurrentID();
		if (Array.isArray(req.value)) {
			return !!culture && req.value.map(e => `C_${e}`).includes(culture);
		}
		return !!culture && culture === `C_${req.value}`;
	}
	else if (isRequiringPrimaryAttribute(req)) {
		const id = getPrimaryAttrID(req.type);
		if (typeof id === 'string') {
			const entry = get(id);
			if (isIncreasableInstance(entry)) {
				return entry.value >= req.value;
			}
		}
		return false;
	}
	else if (isRequiringIncreasable(req)) {
		if (Array.isArray(req.id)) {
			const resultOfAll = req.id.map(e => validateObject({ ...req, id: e }, sourceId));
			return resultOfAll.includes(true);
		}
		const entry = get(req.id);
		if (isIncreasableInstance(entry)) {
			return entry.value >= req.value;
		}
	}
	else {
		if (Array.isArray(req.id)) {
			const resultOfAll = req.id.map(e => validateObject({ ...req, id: e }, sourceId));
			return resultOfAll.includes(true);
		}
		if (req.sid === 'sel') {
			return true;
		}
		if (req.sid === 'GR') {
			const gr = req.sid2 as number;
			const arr = getAllByCategoryGroup(Categories.TALENTS, gr).map(e => e.id);
			for (const e of getSids(get(req.id) as ActivatableInstance)) {
				if (arr.includes(e as string)) {
					return false;
				}
			}
			return true;
		}
		const entry = get(req.id);
		if (isActivatableInstance(entry)) {
			if (req.sid) {
				if (Array.isArray(req.sid)) {
					const activeSids = getSids(entry);
					return req.active === req.sid.some(e => activeSids.includes(e));
				}
				return req.active === getSids(entry).includes(req.sid);
			}
			return isActive(entry) === req.active;
		}
	}
	return false;
}

/**
 * Checks if all requirements are fulfilled.
 * @param requirements An array of requirement objects.
 * @param sourceId The id of the entry the requirement objects belong to.
 */
export function validate(requirements: AllRequirements[], sourceId: string): boolean {
	return requirements.every(e => validateObject(e, sourceId));
}

export function isSexRequirement(req: AllRequirementObjects): req is SexRequirement {
	return req.id === 'SEX';
}

export function isRaceRequirement(req: AllRequirementObjects): req is RaceRequirement {
	return req.id === 'RACE';
}

export function isCultureRequirement(req: AllRequirementObjects): req is CultureRequirement {
	return req.id === 'CULTURE';
}

export function isRequiringIncreasable(req: AllRequirementObjects): req is RequiresIncreasableObject {
	if (Array.isArray(req.id)) {
		return req.hasOwnProperty('value') && req.id.every(e => {
			const entry = get(e);
			return isIncreasableInstance(entry);
		});
	}
	const entry = get(req.id);
	return req.hasOwnProperty('value') && isIncreasableInstance(entry);
}

export function isRequiringActivatable(req: AllRequirementObjects): req is RequiresActivatableObject {
	if (Array.isArray(req.id)) {
		return req.hasOwnProperty('active') && req.id.every(e => {
			const entry = get(e);
			return isActivatableInstance(entry);
		});
	}
	const entry = get(req.id);
	return req.hasOwnProperty('active') && isActivatableInstance(entry);
}

export function isRequiringPrimaryAttribute(req: AllRequirementObjects): req is RequiresPrimaryAttribute {
	return req.id === 'ATTR_PRIMARY';
}

export function isIncreasableInstance(entry?: Instance): entry is IncreasableInstance {
	const categories = [Categories.ATTRIBUTES, Categories.COMBAT_TECHNIQUES, Categories.LITURGIES, Categories.SPELLS, Categories.TALENTS];
	return !!entry && categories.includes(entry.category);
}

export function isActivatableInstance(entry?: Instance): entry is ActivatableInstance {
	const categories = [Categories.ADVANTAGES, Categories.DISADVANTAGES, Categories.SPECIAL_ABILITIES];
	return !!entry && categories.includes(entry.category);
}
