import { fmap, fmapF } from "../../../../Data/Functor";
import { all, elemF, head, isList, NonEmptyList } from "../../../../Data/List";
import { Maybe, Nothing, or } from "../../../../Data/Maybe";
import { fromDefault, makeLenses, member, Record, RecordCreator } from "../../../../Data/Record";
import { ActivatableLikeCategories, Categories } from "../../../Constants/Categories";
import { getCategoryById } from "../../../Utilities/IDUtils";
import { pipe } from "../../../Utilities/pipe";
import { ActiveObject } from "../../ActiveEntries/ActiveObject";
import { AllRequirementObjects, ProfessionPrerequisite, SID } from "../wikiTypeHelpers";

export interface RequireActivatable {
  id: string | NonEmptyList<string>
  active: boolean
  sid: Maybe<SID>
  sid2: Maybe<string | number>
  tier: Maybe<number>
}

export interface ProfessionRequireActivatable extends RequireActivatable {
  id: string
  sid: Maybe<string | number>
}

export const RequireActivatable =
  fromDefault<RequireActivatable> ({
    id: "",
    active: true,
    sid: Nothing,
    sid2: Nothing,
    tier: Nothing,
  })

export const RequireActivatableL = makeLenses (RequireActivatable)

export const ProfessionRequireActivatable =
  RequireActivatable as RecordCreator<ProfessionRequireActivatable>

export const isRequiringActivatable =
  (req: AllRequirementObjects): req is Record<RequireActivatable> => {
    const id = RequireActivatable.AL.id (req)

    if (isList (id)) {
      return member ("value") (req)
        && all<string> (pipe (
                         getCategoryById,
                         category => or (fmap (elemF<Categories> (ActivatableLikeCategories))
                                              (category))
                       ))
                       (id)
    }

    return member ("value") (req)
      && or (fmap (elemF<Categories> (ActivatableLikeCategories))
                  (getCategoryById (id)))
  }

export const isProfessionRequiringActivatable =
  (req: ProfessionPrerequisite): req is Record<ProfessionRequireActivatable> => {
    const id = RequireActivatable.AL.id (req) as string

    return member ("value") (req)
      && or (fmap (elemF<Categories> (ActivatableLikeCategories))
                  (getCategoryById (id)))
  }

const RAA = RequireActivatable.A
const PRAA = ProfessionRequireActivatable.A

export const reqToActiveFst =
  (x: Record<RequireActivatable>) =>
    ActiveObject ({
      sid: fmapF (RAA.sid (x)) (curr_sid => isList (curr_sid) ? head (curr_sid) : curr_sid),
      sid2: RAA.sid2 (x),
      tier: RAA.tier (x),
    })

export const reqToActive =
  (x: Record<ProfessionRequireActivatable>) =>
    ActiveObject ({
      sid: PRAA.sid (x),
      sid2: PRAA.sid2 (x),
      tier: PRAA.tier (x),
    })
