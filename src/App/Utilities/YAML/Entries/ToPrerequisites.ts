/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { fromArray, NonEmptyList } from "../../../../Data/List"
import { Maybe } from "../../../../Data/Maybe"
import { Record } from "../../../../Data/Record"
import { RequireActivatable } from "../../../Models/Wiki/prerequisites/ActivatableRequirement"
import { RequireIncreasable } from "../../../Models/Wiki/prerequisites/IncreasableRequirement"
import { ActivatableRequirement, IncreasableRequirement } from "../Schema/Prerequisites/Prerequisites"


export const toActivatablePrerequisite : (x : ActivatableRequirement) => Record<RequireActivatable>
                                       = x => RequireActivatable ({
                                                id: Array.isArray (x.id)
                                                  ? fromArray (x.id) as NonEmptyList<string>
                                                  : x.id,
                                                active: x.active,
                                                sid: Maybe (
                                                  Array.isArray (x.sid)
                                                  ? fromArray<string | number> (x.sid) as
                                                      NonEmptyList<number>
                                                  : x.sid
                                                ),
                                                sid2: Maybe (x.sid2),
                                                tier: Maybe (x.level),
                                              })


export const toIncreasablePrerequisite : (x : IncreasableRequirement) => Record<RequireIncreasable>
                                       = x => RequireIncreasable ({
                                                id: Array.isArray (x.id)
                                                  ? fromArray (x.id) as NonEmptyList<string>
                                                  : x.id,
                                                value: x.value,
                                              })
