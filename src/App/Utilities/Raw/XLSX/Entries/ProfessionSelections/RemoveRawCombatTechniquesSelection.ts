import { ProfessionSelectionIds } from "../../../../../Models/Wiki/wikiTypeHelpers"
import { AnyRawProfessionVariantSelection } from "../rawTypeHelpers"
import { RawCombatTechniquesSelection } from "./RawCombatTechniquesSelection"

export interface RemoveRawCombatTechniquesSelection {
  id: ProfessionSelectionIds
  active: false
}

export type RawVariantCombatTechniquesSelection =
  RawCombatTechniquesSelection |
  RemoveRawCombatTechniquesSelection

export const isRemoveRawCombatTechniquesSelection =
  (obj: AnyRawProfessionVariantSelection): obj is RemoveRawCombatTechniquesSelection =>
    obj.id === ProfessionSelectionIds.COMBAT_TECHNIQUES
    // @ts-ignore
    && obj.active === false
