import { ProfessionSelectionIds, ProfessionVariantSelection } from '../../../types/wiki';
import { List } from '../../structures/List';
import { fromDefault, makeGetters, member, Record } from '../../structures/Record';

export interface CombatTechniquesSelection {
  id: ProfessionSelectionIds.COMBAT_TECHNIQUES;
  amount: number;
  value: number;
  sid: List<string>;
}

export const CombatTechniquesSelection =
  fromDefault<CombatTechniquesSelection> ({
    id: ProfessionSelectionIds.COMBAT_TECHNIQUES,
    amount: 0,
    value: 0,
    sid: List.empty,
  })

export const CombatTechniquesSelectionG = makeGetters (CombatTechniquesSelection)

export const isCombatTechniquesSelection =
  (obj: ProfessionVariantSelection): obj is Record<CombatTechniquesSelection> =>
    CombatTechniquesSelectionG.id (obj as unknown as Record<CombatTechniquesSelection>)
      === ProfessionSelectionIds.COMBAT_TECHNIQUES
      && member ('sid') (obj)
      && member ('value') (obj)
      && member ('amount') (obj)
