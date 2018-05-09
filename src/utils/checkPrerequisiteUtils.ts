import * as Categories from '../constants/Categories';
import * as Data from '../types/data';
import * as Reusable from '../types/reusable';
import * as Wiki from '../types/wiki';
import { getCategoryById } from './IDUtils';
import { match } from './match';
import { pipe } from './pipe';

export const isSexRequirement = (
  req: Wiki.AllRequirementObjects,
): req is Reusable.SexRequirement => req.id === 'SEX';

export const isRaceRequirement = (
  req: Wiki.AllRequirementObjects,
): req is Reusable.RaceRequirement => req.id === 'RACE';

export const isCultureRequirement = (
  req: Wiki.AllRequirementObjects,
): req is Reusable.CultureRequirement => req.id === 'CULTURE';

export const isPactRequirement = (
  req: Wiki.AllRequirementObjects,
): req is Reusable.PactRequirement => req.id === 'PACT';

export const isRequiringIncreasable = (
  req: Wiki.AllRequirementObjects,
): req is Reusable.RequiresIncreasableObject => {
  return match<string | string[], boolean>(req.id)
    .on((id): id is string[] => typeof id === 'object', id => {
      return req.hasOwnProperty('value') && id.every(pipe(
        getCategoryById,
        category => typeof category === 'string' &&
          Categories.IncreasableCategories.includes(category)
      ));
    })
    .otherwise(pipe(
      getCategoryById,
      category => req.hasOwnProperty('value') &&
        typeof category === 'string' &&
        Categories.IncreasableCategories.includes(category)
    ));
};

export const isRequiringActivatable = (
  req: Wiki.AllRequirementObjects,
): req is Reusable.RequiresActivatableObject => {
  return match<string | string[], boolean>(req.id)
    .on((id): id is string[] => typeof id === 'object', id => {
      return req.hasOwnProperty('active') && id.every(pipe(
        getCategoryById,
        category => typeof category === 'string' &&
          Categories.ActivatableLikeCategories.includes(category)
      ));
    })
    .otherwise(pipe(
      getCategoryById,
      category => req.hasOwnProperty('active') &&
        typeof category === 'string' &&
        Categories.ActivatableLikeCategories.includes(category)
    ));
};

export const isRequiringPrimaryAttribute = (
  req: Wiki.AllRequirementObjects,
): req is Reusable.RequiresPrimaryAttribute => req.id === 'ATTR_PRIMARY';

export const isIncreasableInstance = (
  entry?: Data.Instance,
): entry is Data.IncreasableInstance => typeof entry === 'object' &&
  Categories.IncreasableCategories.includes(entry.category);

export const isActivatableInstance = (
  entry?: Data.Instance,
): entry is Data.ActivatableInstance => typeof entry === 'object' &&
  Categories.ActivatableCategories.includes(entry.category);

export const isActivatableSkillInstance = (
  entry?: Data.Instance,
): entry is Data.ActivatableSkillInstance => typeof entry === 'object' &&
  Categories.ActivatableSkillCategories.includes(entry.category);

export const isDependentPrerequisite = (
  entry: Wiki.AllRequirements,
): entry is Data.DependentPrerequisite => entry !== 'RCP' &&
  !isRaceRequirement(entry) &&
  !isCultureRequirement(entry) &&
  !isSexRequirement(entry) &&
  !isPactRequirement(entry);
