import { pipe } from 'ramda';
import { ActivatableLikeCategories, Categories } from '../../../constants/Categories';
import { getCategoryById } from '../../IDUtils';
import { all, elem_, isList, List } from '../../structures/List';
import { fmap, Maybe, Nothing, or } from '../../structures/Maybe';
import { fromDefault, makeLenses_, member, Record } from '../../structures/Record';
import { AllRequirementObjects, ProfessionPrerequisite, SID } from '../wikiTypeHelpers';

export interface RequireActivatable {
  id: string | List<string>;
  active: boolean;
  sid: Maybe<SID>;
  sid2: Maybe<string | number>;
  tier: Maybe<number>;
}

export interface ProfessionRequireActivatable extends RequireActivatable {
  id: string;
  sid: Maybe<string | number>;
}

export const RequireActivatable =
  fromDefault<RequireActivatable> ({
    id: '',
    active: true,
    sid: Nothing,
    sid2: Nothing,
    tier: Nothing,
  })

export const RequireActivatableL = makeLenses_ (RequireActivatable)

export const isRequiringActivatable =
  (req: AllRequirementObjects): req is Record<RequireActivatable> => {
    const id = RequireActivatable.A.id (req)

    if (isList (id)) {
      return member ('value') (req)
        && all<string> (pipe (
                         getCategoryById,
                         category => or (fmap (elem_<Categories> (ActivatableLikeCategories))
                                              (category))
                       ))
                       (id)
    }

    return member ('value') (req)
      && or (fmap (elem_<Categories> (ActivatableLikeCategories))
                  (getCategoryById (id)))
  }

export const isProfessionRequiringActivatable =
  (req: ProfessionPrerequisite): req is Record<ProfessionRequireActivatable> => {
    const id = RequireActivatable.A.id (req) as string

    return member ('value') (req)
      && or (fmap (elem_<Categories> (ActivatableLikeCategories))
                  (getCategoryById (id)))
  }
