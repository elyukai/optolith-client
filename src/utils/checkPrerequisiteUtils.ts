import * as Categories from '../constants/Categories';
import * as Data from '../types/data';
import * as Reusable from '../types/reusable';
import * as Wiki from '../types/wiki';
import { getCategoryById } from './IDUtils';

export const isSexRequirement = (
  req: Wiki.AllRequirementObjects,
): req is Reusable.SexRequirement => {
  return req.id === 'SEX';
}

export const isRaceRequirement = (
  req: Wiki.AllRequirementObjects,
): req is Reusable.RaceRequirement => {
  return req.id === 'RACE';
}

export const isCultureRequirement = (
  req: Wiki.AllRequirementObjects,
): req is Reusable.CultureRequirement => {
  return req.id === 'CULTURE';
}

export const isPactRequirement = (
  req: Wiki.AllRequirementObjects,
): req is Reusable.PactRequirement => {
  return req.id === 'PACT';
}

export function isRequiringIncreasable(
  req: Wiki.AllRequirementObjects,
): req is Reusable.RequiresIncreasableObject {
  if (Array.isArray(req.id)) {
    return req.hasOwnProperty('value') && req.id.every(e => {
      const category = getCategoryById(e);
      return !!category && Categories.IncreasableCategories.includes(category);
    });
  }

  const category = getCategoryById(req.id);
  return req.hasOwnProperty('value') && !!category && Categories.IncreasableCategories.includes(category);
}

export function isRequiringActivatable(
  req: Wiki.AllRequirementObjects,
): req is Reusable.RequiresActivatableObject {
  if (Array.isArray(req.id)) {
    return req.hasOwnProperty('active') && req.id.every(e => {
      const category = getCategoryById(e);
      return !!category && Categories.ActivatableLikeCategories.includes(category);
    });
  }

  const category = getCategoryById(req.id);
  return req.hasOwnProperty('active') && !!category && Categories.ActivatableLikeCategories.includes(category);
}

export const isRequiringPrimaryAttribute = (
  req: Wiki.AllRequirementObjects,
): req is Reusable.RequiresPrimaryAttribute => {
  return req.id === 'ATTR_PRIMARY';
};

export const isIncreasableInstance = (
  entry?: Data.Instance,
): entry is Data.IncreasableInstance => {
  return !!entry && Categories.IncreasableCategories.includes(entry.category);
};

export const isActivatableInstance = (
  entry?: Data.Instance,
): entry is Data.ActivatableInstance => {
  return !!entry && Categories.ActivatableCategories.includes(entry.category);
};

export const isActivatableSkillInstance = (
  entry?: Data.Instance,
): entry is Data.ActivatableSkillInstance => {
  return !!entry && Categories.ActivatableSkillCategories.includes(entry.category);
};

export const isDependentPrerequisite = (
  entry: Wiki.AllRequirements,
): entry is Data.DependentPrerequisite => {
  return entry !== 'RCP' &&
    !isRaceRequirement(entry) &&
    !isCultureRequirement(entry) &&
    !isSexRequirement(entry) &&
    !isPactRequirement(entry);
};
