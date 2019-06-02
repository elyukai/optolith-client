import { ProfessionSelectionIds } from "../../../../Models/Wiki/wikiTypeHelpers";
import { isNaturalNumber } from "../../../RegexUtils";
import { AnyRawProfessionSelection } from "../rawTypeHelpers";

export interface RawCombatTechniquesSelection {
  id: ProfessionSelectionIds
  amount: number
  value: number
  sid: number[]
}

export const isRawCombatTechniquesSelection =
  (obj: AnyRawProfessionSelection): obj is RawCombatTechniquesSelection =>
    obj .id === ProfessionSelectionIds.COMBAT_TECHNIQUES
    // @ts-ignore
    && typeof obj .amount === "number"
    // @ts-ignore
    && typeof obj .value === "number"
    // @ts-ignore
    && Array.isArray (obj .sid)
    // @ts-ignore
    && obj .sid .every (isNaturalNumber)
