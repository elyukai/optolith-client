import { IdPrefixes } from "../../../../../constants/IdPrefixes";
import { ProfessionSelectionIds } from "../../../../Models/Wiki/wikiTypeHelpers";
import { prefixId } from "../../../IDUtils";
import { naturalNumber } from "../../../RegexUtils";
import { AnyRawProfessionSelection } from "../rawTypeHelpers";

export interface RawCantripsSelection {
  id: ProfessionSelectionIds
  amount: number
  sid: string[]
}

const cantripId =
  new RegExp (prefixId (IdPrefixes.CANTRIPS) (naturalNumber.source))

const isCantripId = (x: string) => cantripId .test (x)

export const isRawCantripsSelection =
  (obj: AnyRawProfessionSelection): obj is RawCantripsSelection =>
    obj .id === ProfessionSelectionIds.CANTRIPS
    // @ts-ignore
    && typeof obj .amount === "number"
    // @ts-ignore
    && Array.isArray (obj .sid)
    // @ts-ignore
    && obj .sid .every (isCantripId)
