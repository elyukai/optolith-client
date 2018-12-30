import { List } from '../../structures/List';
import { fromDefault } from '../../structures/Record';
import { ProfessionSelectionIds } from '../wikiTypeHelpers';

export interface TerrainKnowledgeSelection {
  id: ProfessionSelectionIds.TERRAIN_KNOWLEDGE;
  sid: List<number>;
}

export const TerrainKnowledgeSelection =
  fromDefault<TerrainKnowledgeSelection> ({
    id: ProfessionSelectionIds.TERRAIN_KNOWLEDGE,
    sid: List.empty,
  })
