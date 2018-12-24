import { CombatTechniquesSelection, ProfessionSelectionIds, ProfessionVariantSelection } from '../../../types/wiki';
import { List } from '../../structures/List';
import { fromDefault, makeGetters, member, Record } from '../../structures/Record';
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

export const isCombatTechniquesSelection =
  (obj: ProfessionVariantSelection): obj is Record<CombatTechniquesSelection> =>
    CombatTechniquesSelectionG.id (obj as unknown as Record<CombatTechniquesSelection>)
      === ProfessionSelectionIds.COMBAT_TECHNIQUES
      && member ('sid') (obj)
      && member ('value') (obj)
      && member ('amount') (obj)
