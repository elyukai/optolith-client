import { ProfessionSelectionIds } from '../../../types/wiki';
import { List } from '../../structures/List';
import { fromDefault, makeGetters } from '../../structures/Record';

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

export const CombatTechniquesSecondSelectionG = makeGetters (CombatTechniquesSecondSelection)
