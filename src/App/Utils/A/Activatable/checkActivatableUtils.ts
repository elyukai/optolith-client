import { any } from "../../../../Data/List";
import { member, Record } from "../../../../Data/Record";
import { ActiveActivatable } from "../../../Models/View/ActiveActivatable";
import { InactiveActivatable } from "../../../Models/View/InactiveActivatable";
import { Advantage } from "../../../Models/Wiki/Advantage";
import { isRequiringActivatable, RequireActivatable } from "../../../Models/Wiki/prerequisites/ActivatableRequirement";
import { Activatable, AllRequirements } from "../../../Models/Wiki/wikiTypeHelpers";
import { getFirstTierPrerequisites } from "../../P/Prerequisites/flattenPrerequisites";

const { id, active } = RequireActivatable.A
const { prerequisites } = Advantage.A

const getMagicalOrBlessedFilter =
  (advantageId: "ADV_12" | "ADV_50") =>
    (e: AllRequirements) =>
      e !== "RCP"
        && isRequiringActivatable (e)
        && id (e) === advantageId
        && active (e)

export const isMagicalOrBlessed =
  (obj: Activatable) => {
    const firstTier = getFirstTierPrerequisites (prerequisites (obj))

    const isBlessed = any (getMagicalOrBlessedFilter ("ADV_12")) (firstTier)
    const isMagical = any (getMagicalOrBlessedFilter ("ADV_50")) (firstTier)

    return {
      isBlessed,
      isMagical,
    }
  }

type ViewActivatable = Record<ActiveActivatable> | Record<InactiveActivatable>

export const isActiveViewObject =
  (obj: ViewActivatable): obj is Record<ActiveActivatable> =>
    member ("index") (obj)
