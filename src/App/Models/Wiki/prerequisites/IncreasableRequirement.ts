import { fmap } from "../../../../Data/Functor";
import { all, elemF, isList, List } from "../../../../Data/List";
import { or } from "../../../../Data/Maybe";
import { fromDefault, makeLenses, member, Record } from "../../../../Data/Record";
import { Categories, IncreasableCategories } from "../../../Constants/Categories";
import { getCategoryById } from "../../../Utilities/IDUtils";
import { pipe } from "../../../Utilities/pipe";
import { AllRequirementObjects, ProfessionPrerequisite } from "../wikiTypeHelpers";

export interface RequireIncreasable {
  id: string | List<string>
  value: number
}

export interface ProfessionRequireIncreasable extends RequireIncreasable {
  id: string
}

export const RequireIncreasable =
  fromDefault<RequireIncreasable> ({
    id: "",
    value: 0,
  })

export const RequireIncreasableL = makeLenses (RequireIncreasable)

export const isRequiringIncreasable =
  (req: AllRequirementObjects): req is Record<RequireIncreasable> => {
    const id = RequireIncreasable.A.id (req)

    if (isList (id)) {
      return member ("value") (req)
        && all<string> (pipe (
                         getCategoryById,
                         category => or (fmap (elemF<Categories> (IncreasableCategories))
                                              (category))
                       ))
                       (id)
    }

    return member ("value") (req)
      && or (fmap (elemF<Categories> (IncreasableCategories))
                  (getCategoryById (id)))
  }

export const isProfessionRequiringIncreasable =
  (req: ProfessionPrerequisite): req is Record<ProfessionRequireIncreasable> => {
    const id = RequireIncreasable.A.id (req) as string

    return member ("value") (req)
      && or (fmap (elemF<Categories> (IncreasableCategories))
                  (getCategoryById (id)))
  }
