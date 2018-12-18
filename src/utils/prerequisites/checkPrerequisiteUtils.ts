import * as R from 'ramda';
import * as Categories from '../../constants/Categories';
import * as Wiki from '../../types/wiki';
import { getCategoryById } from '../IDUtils';
import { List, Maybe, Record } from './dataUtils';

export const isSexRequirement =
  (req: Wiki.AllRequirementObjects): req is Record<Wiki.SexRequirement> =>
    req.get ('id') === 'SEX';

export const isRaceRequirement =
  (req: Wiki.AllRequirementObjects): req is Record<Wiki.RaceRequirement> =>
    req.get ('id') === 'RACE';

export const isCultureRequirement =
  (req: Wiki.AllRequirementObjects): req is Record<Wiki.CultureRequirement> =>
    req.get ('id') === 'CULTURE';

export const isPactRequirement =
  (req: Wiki.AllRequirementObjects): req is Record<Wiki.PactRequirement> =>
    req.get ('id') === 'PACT';

export const isRequiringPrimaryAttribute =
  (req: Wiki.AllRequirementObjects): req is Record<Wiki.RequiresPrimaryAttribute> =>
    req.get ('id') === 'ATTR_PRIMARY';

export const isRequiringIncreasable =
  (req: Wiki.AllRequirementObjects): req is Record<Wiki.RequiresIncreasableObject> => {
    const id = req.get ('id');

    if (id instanceof List) {
      return req.member ('value') && id.all (R.pipe (
        getCategoryById,
        category => Maybe.isJust (category) &&
          Categories.IncreasableCategories.elem (
            Maybe.fromJust (category) as Categories.IncreasableCategory
          )
      ));
    }
    else {
      const category = getCategoryById (id);

      return req.member ('value') && Maybe.isJust (category) &&
        Categories.IncreasableCategories.elem (
          Maybe.fromJust (category) as Categories.IncreasableCategory
        );
    }
  };

export const isProfessionRequiringIncreasable =
  (req: Wiki.ProfessionPrerequisite): req is Record<Wiki.ProfessionRequiresIncreasableObject> => {
    const category = getCategoryById (req.get ('id'));

    return req.member ('value') && Maybe.isJust (category) &&
      Categories.IncreasableCategories.elem (
        Maybe.fromJust (category) as Categories.IncreasableCategory
      );
  };

export const isRequiringActivatable =
  (req: Wiki.AllRequirementObjects): req is Record<Wiki.RequiresActivatableObject> => {
    const id = req.get ('id');

    if (id instanceof List) {
      return req.member ('active') && id.all (R.pipe (
        getCategoryById,
        category => Maybe.isJust (category) &&
          Categories.ActivatableLikeCategories.elem (
            Maybe.fromJust (category) as Categories.ActivatableLikeCategory
          )
      ));
    }
    else {
      const category = getCategoryById (id);

      return req.member ('active') && Maybe.isJust (category) &&
        Categories.ActivatableLikeCategories.elem (
          Maybe.fromJust (category) as Categories.ActivatableLikeCategory
        );
    }
  };

export const isProfessionRequiringActivatable =
  (req: Wiki.ProfessionPrerequisite): req is Record<Wiki.ProfessionRequiresActivatableObject> => {
    const category = getCategoryById (req.get ('id'));

    return req.member ('active') && Maybe.isJust (category) &&
      Categories.ActivatableLikeCategories.elem (
        Maybe.fromJust (category) as Categories.ActivatableLikeCategory
      );
  };

export const isDependentPrerequisite =
  (entry: Wiki.AllRequirements): entry is Wiki.DependentPrerequisite =>
    entry !== 'RCP'
    && !isRaceRequirement (entry)
    && !isCultureRequirement (entry)
    && !isSexRequirement (entry)
    && !isPactRequirement (entry);
