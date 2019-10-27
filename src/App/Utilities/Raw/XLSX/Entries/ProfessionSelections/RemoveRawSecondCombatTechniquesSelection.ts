import { ProfessionSelectionIds } from "../../../../../Models/Wiki/wikiTypeHelpers";
import { AnyRawProfessionVariantSelection } from "../rawTypeHelpers";
import { RawCombatTechniquesSecondSelection } from "./RawSecondCombatTechniquesSelection";

export interface RemoveRawCombatTechniquesSecondSelection {
  id: ProfessionSelectionIds
  active: false
}

export type RawVariantCombatTechniquesSecondSelection =
  RawCombatTechniquesSecondSelection |
  RemoveRawCombatTechniquesSecondSelection

export const isRemoveRawCombatTechniquesSecondSelection =
  (obj: AnyRawProfessionVariantSelection): obj is RemoveRawCombatTechniquesSecondSelection =>
    obj.id === ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND
    // @ts-ignore
    && obj.active === false
