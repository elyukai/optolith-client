import { ProfessionSelectionIds } from "../../../../../Models/Wiki/wikiTypeHelpers";
import { isNaturalNumber } from "../../../../RegexUtils";
import { AnyRawProfessionSelection } from "../rawTypeHelpers";

export interface RawCantripsSelection {
  id: ProfessionSelectionIds
  amount: number
  sid: number[]
}

export const isRawCantripsSelection =
  (obj: AnyRawProfessionSelection): obj is RawCantripsSelection =>
    obj .id === ProfessionSelectionIds.CANTRIPS
    // @ts-ignore
    && typeof obj .amount === "number"
    // @ts-ignore
    && Array.isArray (obj .sid)
    // @ts-ignore
    && obj .sid .every (isNaturalNumber)
