import { List } from "../../../../Data/List";
import { fromDefault, Record } from "../../../../Data/Record";
import { AnyProfessionSelection, ProfessionSelectionIds } from "../wikiTypeHelpers";

export interface TerrainKnowledgeSelection {
  id: ProfessionSelectionIds
  sid: List<number>
}

export const TerrainKnowledgeSelection =
  fromDefault<TerrainKnowledgeSelection> ({
    id: ProfessionSelectionIds.TERRAIN_KNOWLEDGE,
    sid: List.empty,
  })

export const isTerrainKnowledgeSelection =
  (obj: AnyProfessionSelection): obj is Record<TerrainKnowledgeSelection> =>
    TerrainKnowledgeSelection.A.id (obj) === ProfessionSelectionIds.TERRAIN_KNOWLEDGE
