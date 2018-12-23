import { CombatTechniquesSecondSelection, ProfessionSelectionIds } from '../../../types/wiki';
import { List } from '../../structures/List';
import { fromDefault, makeGetters } from '../../structures/Record';
import { RequiredExceptIdFunction } from '../sub/typeHelpers';

const CombatTechniquesSecondSelectionCreator =
  fromDefault<CombatTechniquesSecondSelection> ({
    id: ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND,
    amount: 0,
    value: 0,
    sid: List.empty,
  })

export const CombatTechniquesSecondSelectionG = makeGetters (CombatTechniquesSecondSelectionCreator)

export const createCombatTechniquesSecondSelection:
  RequiredExceptIdFunction<CombatTechniquesSecondSelection> =
    CombatTechniquesSecondSelectionCreator
