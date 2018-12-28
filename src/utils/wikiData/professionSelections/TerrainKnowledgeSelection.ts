import { ProfessionSelectionIds } from '../../../types/wiki';
import { List } from '../../structures/List';
import { fromDefault, makeGetters } from '../../structures/Record';

export interface TerrainKnowledgeSelection {
  id: ProfessionSelectionIds.TERRAIN_KNOWLEDGE;
  sid: List<number>;
}

export const TerrainKnowledgeSelection =
  fromDefault<TerrainKnowledgeSelection> ({
    id: ProfessionSelectionIds.TERRAIN_KNOWLEDGE,
    sid: List.empty,
  })

export const TerrainKnowledgeSelectionG = makeGetters (TerrainKnowledgeSelection)
