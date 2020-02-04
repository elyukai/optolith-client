import { ProfessionSelectionIds } from "../../../../../Models/Wiki/wikiTypeHelpers"
import { isNumber } from "../../../../typeCheckUtils"
import { AnyRawProfessionSelection } from "../rawTypeHelpers"

export interface RawTerrainKnowledgeSelection {
  id: ProfessionSelectionIds
  sid: number[]
}

export const isRawTerrainKnowledgeSelection =
  (obj: AnyRawProfessionSelection): obj is RawTerrainKnowledgeSelection =>
    obj.id === ProfessionSelectionIds.TERRAIN_KNOWLEDGE
    // @ts-ignore
    && Array.isArray (obj.sid) && (obj .sid as any[]) .every (isNumber)
