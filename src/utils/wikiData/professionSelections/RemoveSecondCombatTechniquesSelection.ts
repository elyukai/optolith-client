import { ProfessionSelectionIds, ProfessionVariantSelection } from '../../../types/wiki';
import { fromDefault, makeGetters, Record } from '../../structures/Record';
import { CombatTechniquesSecondSelection } from './SecondCombatTechniquesSelection';

export interface RemoveCombatTechniquesSecondSelection {
  id: ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND;
  active: false;
}

export type VariantCombatTechniquesSecondSelection =
  Record<CombatTechniquesSecondSelection> |
  Record<RemoveCombatTechniquesSecondSelection>;

const _RemoveCombatTechniquesSecondSelection =
  fromDefault<RemoveCombatTechniquesSecondSelection> ({
    id: ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND,
    active: false,
  })

export const RemoveCombatTechniquesSecondSelectionG =
  makeGetters (_RemoveCombatTechniquesSecondSelection)

export const RemoveCombatTechniquesSecondSelection =
  _RemoveCombatTechniquesSecondSelection ({
    id: ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND,
    active: false,
  })

export const isRemoveCombatTechniquesSecondSelection =
  (obj: ProfessionVariantSelection): obj is Record<RemoveCombatTechniquesSecondSelection> =>
    obj === RemoveCombatTechniquesSecondSelection
