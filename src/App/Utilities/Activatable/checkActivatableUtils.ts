import { any } from "../../../Data/List"
import { member, Record } from "../../../Data/Record"
import { Pair } from "../../../Data/Tuple"
import { AdvantageId, DisadvantageId, SpecialAbilityId } from "../../Constants/Ids"
import { ActiveActivatable } from "../../Models/View/ActiveActivatable"
import { InactiveActivatable } from "../../Models/View/InactiveActivatable"
import { Advantage } from "../../Models/Wiki/Advantage"
import { RequireActivatable } from "../../Models/Wiki/prerequisites/ActivatableRequirement"
import { Activatable, AllRequirements } from "../../Models/Wiki/wikiTypeHelpers"
import { getFirstLevelPrerequisites } from "../Prerequisites/flattenPrerequisites"

const { id, active } = RequireActivatable.AL
const AAL = Advantage.AL

const getMagicalOrBlessedFilter =
  (advantageId: AdvantageId.Blessed | AdvantageId.Spellcaster) =>
    (e: AllRequirements) =>
      e !== "RCP"
        && RequireActivatable.is (e)
        && id (e) === advantageId
        && active (e)

/**
 * Checks if the entry is blessed (`fst`; prerequisites contain `Spellcaster`)
 * or magical (`snd`; prerequisites contain `Blessed`).
 */
export const isBlessedOrMagical =
  (obj: Activatable) => {
    const firstTier = getFirstLevelPrerequisites (AAL.prerequisites (obj))

    const isBlessed =
      AAL.gr (obj) === 3
      || any (getMagicalOrBlessedFilter (AdvantageId.Blessed)) (firstTier)

    const isMagical =
      AAL.gr (obj) === 2
      || any (getMagicalOrBlessedFilter (AdvantageId.Spellcaster)) (firstTier)

    return Pair (isBlessed, isMagical)
  }

type ViewActivatable = Record<ActiveActivatable> | Record<InactiveActivatable>

export const isActiveViewObject =
  (obj: ViewActivatable): obj is Record<ActiveActivatable> =>
    member ("index") (obj)

export const isCustomActivatable =
  (obj: Activatable): boolean =>
    isCustomActivatableId(obj.values.id)

export const isCustomActivatableId =
  (activatableId: string): boolean =>
    activatableId === AdvantageId.CustomAdvantage
    || activatableId === DisadvantageId.CustomDisadvantage
    || activatableId === SpecialAbilityId.CustomSpecialAbility
