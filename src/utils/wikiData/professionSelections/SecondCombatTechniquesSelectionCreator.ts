import { CombatTechniquesSecondSelection, ProfessionSelectionIds } from '../../../types/wiki';
import { List } from '../../structures/List';
import { fromDefault, makeGetters, Omit } from '../../structures/Record';

const CombatTechniquesSecondSelectionCreator =
  fromDefault<CombatTechniquesSecondSelection> ({
    id: ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND,
    amount: 0,
    value: 0,
    sid: List.empty,
  })

export const CombatTechniquesSecondSelectionG = makeGetters (CombatTechniquesSecondSelectionCreator)

export const createCombatTechniquesSecondSelection =
  (xs: Omit<CombatTechniquesSecondSelection, 'id'>) =>
    CombatTechniquesSecondSelectionCreator ({
      ...xs,
      id: ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND,
    })
