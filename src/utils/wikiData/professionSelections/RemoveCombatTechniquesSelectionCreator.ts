import { ProfessionSelectionIds, RemoveCombatTechniquesSelection } from '../../../types/wiki';
import { fromDefault, makeGetters } from '../../structures/Record';

const RemoveCombatTechniquesSelectionCreator =
  fromDefault<RemoveCombatTechniquesSelection> ({
    id: ProfessionSelectionIds.COMBAT_TECHNIQUES,
    active: false,
  })

export const RemoveCombatTechniquesSelectionG = makeGetters (RemoveCombatTechniquesSelectionCreator)

export const createRemoveCombatTechniquesSelection =
  () => RemoveCombatTechniquesSelectionCreator ({ })
