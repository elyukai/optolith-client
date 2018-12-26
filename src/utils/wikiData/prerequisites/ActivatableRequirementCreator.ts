import { pipe } from 'ramda';
import { ActivatableLikeCategories, Categories } from '../../../constants/Categories';
import { AllRequirementObjects, ProfessionPrerequisite, ProfessionRequiresActivatableObject, RequiresActivatableObject } from '../../../types/wiki';
import { getCategoryById } from '../../IDUtils';
import { all, elem_, isList } from '../../structures/List';
import { fmap, Nothing, or } from '../../structures/Maybe';
import { fromDefault, makeGetters, makeLenses_, member, Record } from '../../structures/Record';

const RequireActivatableCreator =
  fromDefault<RequiresActivatableObject> ({
    id: '',
    active: true,
    sid: Nothing,
    sid2: Nothing,
    tier: Nothing,
  })

export const RequireActivatableG = makeGetters (RequireActivatableCreator)
export const RequireActivatableL = makeLenses_ (RequireActivatableG) (RequireActivatableCreator)

export const createRequireActivatable = RequireActivatableCreator

export const isRequiringActivatable =
  (req: AllRequirementObjects): req is Record<RequiresActivatableObject> => {
    const id = RequireActivatableG.id (req)

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
  (req: ProfessionPrerequisite): req is Record<ProfessionRequiresActivatableObject> => {
    const id = RequireActivatableG.id (req) as string

    return member ('value') (req)
      && or (fmap (elem_<Categories> (ActivatableLikeCategories))
                  (getCategoryById (id)))
  }
