import { ProfessionSelectionIds, TerrainKnowledgeSelection } from '../../../types/wiki';
import { List } from '../../structures/List';
import { fromDefault, makeGetters } from '../../structures/Record';

const TerrainKnowledgeSelectionCreator =
  fromDefault<TerrainKnowledgeSelection> ({
    id: ProfessionSelectionIds.TERRAIN_KNOWLEDGE,
    sid: List.empty,
  })

export const TerrainKnowledgeSelectionG = makeGetters (TerrainKnowledgeSelectionCreator)

export const createTerrainKnowledgeSelection =
  (options: List<number>) => TerrainKnowledgeSelectionCreator ({ sid: options })
