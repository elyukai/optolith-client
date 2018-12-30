import { fromDefault, Record } from '../../structures/Record';
import { ProfessionSelectionIds, ProfessionVariantSelection } from '../wikiTypeHelpers';
import { CombatTechniquesSecondSelection } from './SecondCombatTechniquesSelection';

export interface RemoveCombatTechniquesSecondSelection {
  id: ProfessionSelectionIds
  active: false
}

export type VariantCombatTechniquesSecondSelection =
  Record<CombatTechniquesSecondSelection> |
  Record<RemoveCombatTechniquesSecondSelection>

const _RemoveCombatTechniquesSecondSelection =
  fromDefault<RemoveCombatTechniquesSecondSelection> ({
    id: ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND,
    active: false,
  })

export const RemoveCombatTechniquesSecondSelection =
  _RemoveCombatTechniquesSecondSelection ({
    id: ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND,
    active: false,
  })

export const isRemoveCombatTechniquesSecondSelection =
  (obj: ProfessionVariantSelection): obj is Record<RemoveCombatTechniquesSecondSelection> =>
    obj === RemoveCombatTechniquesSecondSelection
