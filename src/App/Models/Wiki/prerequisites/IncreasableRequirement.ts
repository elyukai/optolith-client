import { fmap } from "../../../../Data/Functor";
import { elemF, NonEmptyList } from "../../../../Data/List";
import { or } from "../../../../Data/Maybe";
import { fromDefault, makeLenses, member, Record } from "../../../../Data/Record";
import { Categories, IncreasableCategories } from "../../../Constants/Categories";
import { getCategoryById } from "../../../Utilities/IDUtils";
import { ProfessionPrerequisite } from "../wikiTypeHelpers";

export interface RequireIncreasable {
  "@@name": "RequireIncreasable"
  id: string | NonEmptyList<string>
  value: number
}

export interface ProfessionRequireIncreasable {
  "@@name": "ProfessionRequireIncreasable"
  id: string
  value: number
}

export const RequireIncreasable =
  fromDefault ("RequireIncreasable")
              <RequireIncreasable> ({
                id: "",
                value: 0,
              })

export const ProfessionRequireIncreasable =
  fromDefault ("ProfessionRequireIncreasable")
              <ProfessionRequireIncreasable> ({
                id: "",
                value: 0,
              })

export const RequireIncreasableL = makeLenses (RequireIncreasable)

export const isProfessionRequiringIncreasable =
  (req: ProfessionPrerequisite): req is Record<ProfessionRequireIncreasable> => {
    const id = RequireIncreasable.AL.id (req) as string

    return member ("value") (req)
      && or (fmap (elemF<Categories> (IncreasableCategories))
                  (getCategoryById (id)))
  }
