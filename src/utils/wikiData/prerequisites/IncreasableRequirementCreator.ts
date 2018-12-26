import { pipe } from 'ramda';
import { Categories, IncreasableCategories } from '../../../constants/Categories';
import { AllRequirementObjects, ProfessionPrerequisite, ProfessionRequiresIncreasableObject, RequiresIncreasableObject } from '../../../types/wiki';
import { getCategoryById } from '../../IDUtils';
import { all, elem_, isList } from '../../structures/List';
import { fmap, or } from '../../structures/Maybe';
import { fromDefault, makeGetters, makeLenses_, member, Record } from '../../structures/Record';

const RequireIncreasableCreator =
  fromDefault<RequiresIncreasableObject> ({
    id: '',
    value: 0,
  })

export const RequireIncreasableG = makeGetters (RequireIncreasableCreator)
export const RequireIncreasableL = makeLenses_ (RequireIncreasableG) (RequireIncreasableCreator)

export const createRequireIncreasable = RequireIncreasableCreator

export const isIncreasableRequirement =
  (req: AllRequirementObjects): req is Record<RequiresIncreasableObject> => {
    const id = RequireIncreasableG.id (req)

    if (isList (id)) {
      return member ('value') (req)
        && all<string> (pipe (
                         getCategoryById,
                         category => or (fmap (elem_<Categories> (IncreasableCategories))
                                              (category))
                       ))
                       (id)
    }

    return member ('value') (req)
      && or (fmap (elem_<Categories> (IncreasableCategories))
                  (getCategoryById (id)))
  }

export const isProfessionRequiringIncreasable =
  (req: ProfessionPrerequisite): req is Record<ProfessionRequiresIncreasableObject> => {
    const id = RequireIncreasableG.id (req) as string

    return member ('value') (req)
      && or (fmap (elem_<Categories> (IncreasableCategories))
                  (getCategoryById (id)))
  }
