import { ProfessionSelectionIds } from "../../../../Models/Wiki/wikiTypeHelpers";
import { isNaturalNumber } from "../../../RegexUtils";
import { AnyRawProfessionSelection } from "../rawTypeHelpers";

export interface RawCombatTechniquesSecondSelection {
  id: ProfessionSelectionIds
  amount: number
  value: number
  sid: number[]
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
    && obj .sid .every (isNaturalNumber)
