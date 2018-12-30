import { List } from '../../structures/List';
import { fromDefault } from '../../structures/Record';
import { ProfessionSelectionIds } from '../wikiTypeHelpers';

export interface CombatTechniquesSecondSelection {
  id: ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND;
  amount: number;
  value: number;
  sid: List<string>;
}

export const CombatTechniquesSecondSelection =
  fromDefault<CombatTechniquesSecondSelection> ({
    id: ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND,
    amount: 0,
    value: 0,
    sid: List.empty,
  })
