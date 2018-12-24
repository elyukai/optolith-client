import { ProfessionSelectionIds, ProfessionVariantSelection, RemoveCombatTechniquesSelection } from '../../../types/wiki';
import { fromDefault, makeGetters, member, Record } from '../../structures/Record';

const RemoveCombatTechniquesSelectionCreator =
  fromDefault<RemoveCombatTechniquesSelection> ({
    id: ProfessionSelectionIds.COMBAT_TECHNIQUES,
    active: false,
  })

export const RemoveCombatTechniquesSelectionG = makeGetters (RemoveCombatTechniquesSelectionCreator)

export const createRemoveCombatTechniquesSelection =
  () => RemoveCombatTechniquesSelectionCreator ({ })

export const isRemoveCombatTechniquesSelection =
  (obj: ProfessionVariantSelection): obj is Record<RemoveCombatTechniquesSelection> =>
    RemoveCombatTechniquesSelectionG.id (obj as unknown as Record<RemoveCombatTechniquesSelection>)
      === ProfessionSelectionIds.COMBAT_TECHNIQUES
      && member ('active') (obj)
