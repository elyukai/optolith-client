import { IdPrefixes } from "../../../../../constants/IdPrefixes";
import { ProfessionSelectionIds } from "../../../../Models/Wiki/wikiTypeHelpers";
import { prefixId } from "../../../IDUtils";
import { naturalNumber } from "../../../RegexUtils";
import { AnyRawProfessionSelection } from "../rawTypeHelpers";

export interface RawCombatTechniquesSelection {
  id: ProfessionSelectionIds
  amount: number
  value: number
  sid: string[]
}

const combatTechniqueId =
  new RegExp (prefixId (IdPrefixes.COMBAT_TECHNIQUES) (naturalNumber.source))

export const isCombatTechniqueId = (x: string) => combatTechniqueId .test (x)

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
    && obj .sid .every (isCombatTechniqueId)
