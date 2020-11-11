import { List } from "../../../../Data/List"
import { fromDefault } from "../../../../Data/Record"
import { ProfessionSelectionIds } from "../wikiTypeHelpers"

export interface TerrainKnowledgeSelection {
  "@@name": "TerrainKnowledgeSelection"
  id: ProfessionSelectionIds
  sid: List<number>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const TerrainKnowledgeSelection =
  fromDefault ("TerrainKnowledgeSelection")
              <TerrainKnowledgeSelection> ({
                id: ProfessionSelectionIds.TERRAIN_KNOWLEDGE,
                sid: List.empty,
              })
