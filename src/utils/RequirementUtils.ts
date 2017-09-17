import { flatten } from 'lodash';
import * as Categories from '../constants/Categories';
import { CurrentHeroInstanceState } from '../reducers/currentHero';
import { get, getAllByCategoryGroup } from '../selectors/dependentInstancesSelectors';
import { ActivatableInstance, ActivatableInstanceDependency, AllRequirementObjects, AllRequirements, CultureInstance, IncreasableInstance, Instance, ProfessionInstance, RaceInstance } from '../types/data.d';
import { CultureRequirement, RaceRequirement, RequiresActivatableObject, RequiresIncreasableObject, RequiresPrimaryAttribute, SexRequirement } from '../types/reusable.d';
import { getSids, isActive } from './ActivatableUtils';
import { getPrimaryAttributeId } from './AttributeUtils';
import { getCategoryById } from './IDUtils';

/**
 * Checks if the requirement is fulfilled.
 * @param state The current hero data.
 * @param req A requirement object.
 * @param sourceId The id of the entry the requirement object belongs to.
 */
export function validateObject(state: CurrentHeroInstanceState, req: AllRequirements, sourceId: string): boolean {
  if (req === 'RCP') {
    const array = [];
    const currentRace = typeof state.rcp.race === 'string' && get(state.dependent, state.rcp.race) as RaceInstance;
    const currentCulture = typeof state.rcp.culture === 'string' && get(state.dependent, state.rcp.culture) as CultureInstance;
    const currentProfession = typeof state.rcp.profession === 'string' && get(state.dependent, state.rcp.profession) as ProfessionInstance;

    if (typeof currentRace === 'object') {
      array.push(...currentRace.stronglyRecommendedAdvantages);
      array.push(...currentRace.stronglyRecommendedDisadvantages);
      array.push(...currentRace.commonAdvantages);
      array.push(...currentRace.commonDisadvantages);
    }

    if (typeof currentCulture === 'object') {
      array.push(...currentCulture.typicalAdvantages);
      array.push(...currentCulture.typicalDisadvantages);
    }

    if (typeof currentProfession === 'object') {
      array.push(...currentProfession.typicalAdvantages);
      array.push(...currentProfession.typicalDisadvantages);
    }

    return array.includes(sourceId);
  }
  else if (isSexRequirement(req)) {
    return state.profile.sex === req.value;
  }
  else if (isRaceRequirement(req)) {
    const race = state.rcp.race;
    if (Array.isArray(req.value)) {
      return typeof race === 'string' && req.value.map(e => `R_${e}`).includes(race);
    }
    return typeof race === 'string' && race === `R_${req.value}`;
  }
  else if (isCultureRequirement(req)) {
    const culture = state.rcp.culture;
    if (Array.isArray(req.value)) {
      return typeof culture === 'string' && req.value.map(e => `C_${e}`).includes(culture);
    }
    return typeof culture === 'string' && culture === `C_${req.value}`;
  }
  else if (isRequiringPrimaryAttribute(req)) {
    const id = getPrimaryAttributeId(state.dependent, req.type);
    if (typeof id === 'string') {
      const entry = get(state.dependent, id);
      if (isIncreasableInstance(entry)) {
        return entry.value >= req.value;
      }
    }
    return false;
  }
  else if (isRequiringIncreasable(req)) {
    if (Array.isArray(req.id)) {
      const resultOfAll = req.id.map(e => validateObject(state, { ...req, id: e }, sourceId));
      return resultOfAll.includes(true);
    }
    const entry = get(state.dependent, req.id);
    if (isIncreasableInstance(entry)) {
      return entry.value >= req.value;
    }
  }
  else {
    if (Array.isArray(req.id)) {
      const resultOfAll = req.id.map(e => validateObject(state, { ...req, id: e }, sourceId));
      return resultOfAll.includes(true);
    }
    if (req.sid === 'sel') {
      return true;
    }
    if (req.sid === 'GR') {
      const gr = req.sid2 as number;
      const arr = getAllByCategoryGroup(state.dependent, Categories.TALENTS, gr).map(e => e.id);
      for (const e of getSids(get(state.dependent, req.id) as ActivatableInstance)) {
        if (arr.includes(e as string)) {
          return false;
        }
      }
      return true;
    }
    const entry = get(state.dependent, req.id);
    if (isActivatableInstance(entry)) {
      if (req.sid && req.tier) {
        if (Array.isArray(req.sid)) {
          const activeSids = getSids(entry);
          return req.active === req.sid.some(e => activeSids.includes(e)) && entry.active.some(e => typeof e.tier === 'number' && typeof req.tier === 'number' && e.tier >= req.tier);
        }
        return req.active === getSids(entry).includes(req.sid) && entry.active.some(e => typeof e.tier === 'number' && typeof req.tier === 'number' && e.tier >= req.tier);
      }
      else if (req.sid) {
        if (Array.isArray(req.sid)) {
          const activeSids = getSids(entry);
          return req.active === req.sid.some(e => activeSids.includes(e));
        }
        return req.active === getSids(entry).includes(req.sid);
      }
      else if (req.tier) {
        return entry.active.some(e => typeof e.tier === 'number' && typeof req.tier === 'number' && e.tier >= req.tier);
      }
      return isActive(entry) === req.active;
    }
  }
  return false;
}

/**
 * Checks if all requirements are fulfilled.
 * @param state The current hero data.
 * @param requirements An array of requirement objects.
 * @param sourceId The id of the entry the requirement objects belong to.
 */
export function validate(state: CurrentHeroInstanceState, requirements: AllRequirements[], sourceId: string): boolean {
  return requirements.every(e => validateObject(state, e, sourceId));
}

/**
 * Get maximum valid tier.
 * @param state The current hero data.
 * @param requirements A Map of tier prereqisite arrays.
 * @param sourceId The id of the entry the requirement objects belong to.
 */
export function validateTier(state: CurrentHeroInstanceState, requirements: Map<number, AllRequirements[]>, sourceId: string): number | undefined {
  const ascendingTiers = [...requirements].sort((a, b) => a[0] - b[0]);
  let validTier = 0;
  for (const [tier, prerequisites] of ascendingTiers) {
    if (prerequisites.every(e => validateObject(state, e, sourceId))) {
      validTier = tier;
    }
    else {
      return validTier;
    }
  }
  return;
}

/**
 * Get flat prerequisites array.
 * @param prerequisites A Map of tier prereqisite arrays.
 */
export function getFlatPrerequisites(prerequisites: Map<number, AllRequirements[]> | AllRequirements[]): AllRequirements[] {
  return Array.isArray(prerequisites) ? prerequisites : flatten([...prerequisites.values()]);
}

/**
 * Get flat prerequisites array.
 * @param prerequisites A Map of tier prereqisite arrays.
 */
export function getFlatFirstTierPrerequisites(prerequisites: Map<number, AllRequirements[]> | AllRequirements[]): AllRequirements[] {
  return Array.isArray(prerequisites) ? prerequisites : (prerequisites.get(1) || []);
}

/**
 * Get minimum valid tier.
 * @param dependencies The current instance dependencies.
 */
export function getMinTier(dependencies: ActivatableInstanceDependency[]): number | undefined {
  return dependencies.reduce<number | undefined>((min = 0, dependency) => typeof dependency === 'object' && typeof dependency.tier === 'number' && dependency.tier > min ? dependency.tier : min, undefined);
}

/**
 * Checks if all profession prerequisites are fulfilled.
 * @param prerequisites An array of prerequisite objects.
 */
export function validateProfession(prerequisites: (CultureRequirement | RaceRequirement | SexRequirement)[], race?: string, culture?: string, sex?: 'm' | 'f'): boolean {
  return prerequisites.every(req => {
    if (isSexRequirement(req)) {
      return sex === req.value;
    }
    else if (isRaceRequirement(req)) {
      if (Array.isArray(req.value)) {
        return typeof race === 'string' && req.value.map(e => `R_${e}`).includes(race);
      }
      return typeof race === 'string' && race === `R_${req.value}`;
    }
    else if (isCultureRequirement(req)) {
      if (Array.isArray(req.value)) {
        return typeof culture === 'string' && req.value.map(e => `C_${e}`).includes(culture);
      }
      return typeof culture === 'string' && culture === `C_${req.value}`;
    }
    return false;
  });
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
  const categories = [Categories.ATTRIBUTES, Categories.COMBAT_TECHNIQUES, Categories.LITURGIES, Categories.SPELLS, Categories.TALENTS];
  if (Array.isArray(req.id)) {
    return req.hasOwnProperty('value') && req.id.every(e => {
      const category = getCategoryById(e);
      return !!category && categories.includes(category);
    });
  }
  const category = getCategoryById(req.id);
  return req.hasOwnProperty('value') && !!category && categories.includes(category);
}

export function isRequiringActivatable(req: AllRequirementObjects): req is RequiresActivatableObject {
  const categories = [Categories.ADVANTAGES, Categories.DISADVANTAGES, Categories.SPECIAL_ABILITIES];
  if (Array.isArray(req.id)) {
    return req.hasOwnProperty('active') && req.id.every(e => {
      const category = getCategoryById(e);
      return !!category && categories.includes(category);
    });
  }
  const category = getCategoryById(req.id);
  return req.hasOwnProperty('active') && !!category && categories.includes(category);
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
