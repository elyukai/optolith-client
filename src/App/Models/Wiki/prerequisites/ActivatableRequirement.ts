import { fmapF } from "../../../../Data/Functor";
import { head, isList, NonEmptyList } from "../../../../Data/List";
import { Maybe, Nothing } from "../../../../Data/Maybe";
import { fromNamedDefault, makeLenses, Record } from "../../../../Data/Record";
import { ActiveObject } from "../../ActiveEntries/ActiveObject";
import { SID } from "../wikiTypeHelpers";

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
  fromNamedDefault ("RequireActivatable")
                   <RequireActivatable> ({
                     id: "",
                     active: true,
                     sid: Nothing,
                     sid2: Nothing,
                     tier: Nothing,
                   })

export const RequireActivatableL = makeLenses (RequireActivatable)

export const ProfessionRequireActivatable =
  fromNamedDefault ("ProfessionRequireActivatable")
                   <ProfessionRequireActivatable> ({
                     id: "",
                     active: true,
                     sid: Nothing,
                     sid2: Nothing,
                     tier: Nothing,
                   })

export const ProfessionRequireActivatableL = makeLenses (ProfessionRequireActivatable)

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
