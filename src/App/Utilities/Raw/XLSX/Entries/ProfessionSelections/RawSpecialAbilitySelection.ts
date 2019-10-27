import { ProfessionSelectionIds } from "../../../../../Models/Wiki/wikiTypeHelpers";
import { isRawProfessionRequiringActivatable, RawProfessionRequireActivatable } from "../Prerequisites/RawActivatableRequirement";
import { AnyRawProfessionSelection } from "../rawTypeHelpers";

export interface RawSpecialAbilitySelection {
  id: ProfessionSelectionIds
  sid: RawProfessionRequireActivatable[]
}

export const isRawSpecialAbilitySelection =
  (obj: AnyRawProfessionSelection): obj is RawSpecialAbilitySelection =>
    obj.id === ProfessionSelectionIds.SPECIAL_ABILITY
    // @ts-ignore
    && Array.isArray (obj .sid) && obj .sid .every (isRawProfessionRequiringActivatable)
