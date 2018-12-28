import { pipe } from 'ramda';
import { Categories, IncreasableCategories } from '../../../constants/Categories';
import { AllRequirementObjects, ProfessionPrerequisite } from '../../../types/wiki';
import { getCategoryById } from '../../IDUtils';
import { all, elem_, isList, List } from '../../structures/List';
import { fmap, or } from '../../structures/Maybe';
import { fromDefault, makeGetters, makeLenses_, member, Record } from '../../structures/Record';

export interface RequireIncreasable {
  id: string | List<string>;
  value: number;
}

export interface ProfessionRequireIncreasable extends RequireIncreasable {
  id: string;
}

export const RequireIncreasable =
  fromDefault<RequireIncreasable> ({
    id: '',
    value: 0,
  })

export const RequireIncreasableG = makeGetters (RequireIncreasable)
export const RequireIncreasableL = makeLenses_ (RequireIncreasableG) (RequireIncreasable)

export const isIncreasableRequirement =
  (req: AllRequirementObjects): req is Record<RequireIncreasable> => {
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
  (req: ProfessionPrerequisite): req is Record<ProfessionRequireIncreasable> => {
    const id = RequireIncreasableG.id (req) as string

    return member ('value') (req)
      && or (fmap (elem_<Categories> (IncreasableCategories))
                  (getCategoryById (id)))
  }
