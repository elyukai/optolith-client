import { ProfessionSelectionIds } from "../../../../Models/Wiki/wikiTypeHelpers";
import { AnyRawProfessionSelection } from "../rawTypeHelpers";
import { isCombatTechniqueId } from "./RawCombatTechniquesSelection";

export interface RawCombatTechniquesSecondSelection {
  id: ProfessionSelectionIds
  amount: number
  value: number
  sid: string[]
}

export const isRawSecondCombatTechniquesSelection =
  (obj: AnyRawProfessionSelection): obj is RawCombatTechniquesSecondSelection =>
    obj .id === ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND
    // @ts-ignore
    && typeof obj .amount === "number"
    // @ts-ignore
    && typeof obj .value === "number"
    // @ts-ignore
    && Array.isArray (obj .sid)
    // @ts-ignore
    && obj .sid .every (isCombatTechniqueId)
