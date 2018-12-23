import { CombatTechniquesSelection, ProfessionSelectionIds } from '../../../types/wiki';
import { List } from '../../structures/List';
import { fromDefault, makeGetters } from '../../structures/Record';
import { RequiredExceptIdFunction } from '../sub/typeHelpers';

const CombatTechniquesSelectionCreator =
  fromDefault<CombatTechniquesSelection> ({
    id: ProfessionSelectionIds.COMBAT_TECHNIQUES,
    amount: 0,
    value: 0,
    sid: List.empty,
  })

export const CombatTechniquesSelectionG = makeGetters (CombatTechniquesSelectionCreator)

export const createCombatTechniquesSelection: RequiredExceptIdFunction<CombatTechniquesSelection> =
  CombatTechniquesSelectionCreator
