import { ProfessionSelectionIds, ProfessionVariantSelection, RemoveCombatTechniquesSecondSelection } from '../../../types/wiki';
import { fromDefault, makeGetters, member, Record } from '../../structures/Record';

const RemoveCombatTechniquesSecondSelectionCreator =
  fromDefault<RemoveCombatTechniquesSecondSelection> ({
    id: ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND,
    active: false,
  })

export const RemoveCombatTechniquesSecondSelectionG =
  makeGetters (RemoveCombatTechniquesSecondSelectionCreator)

export const createRemoveCombatTechniquesSecondSelection =
  () => RemoveCombatTechniquesSecondSelectionCreator ({ })

export const isRemoveCombatTechniquesSecondSelection =
  (obj: ProfessionVariantSelection): obj is Record<RemoveCombatTechniquesSecondSelection> =>
    RemoveCombatTechniquesSecondSelectionG.id (obj as unknown as
      Record<RemoveCombatTechniquesSecondSelection>)
      === ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND
      && member ('active') (obj)
