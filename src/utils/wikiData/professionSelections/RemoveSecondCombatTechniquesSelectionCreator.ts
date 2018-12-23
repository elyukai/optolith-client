import { ProfessionSelectionIds, RemoveCombatTechniquesSecondSelection } from '../../../types/wiki';
import { fromDefault, makeGetters } from '../../structures/Record';

const RemoveCombatTechniquesSecondSelectionCreator =
  fromDefault<RemoveCombatTechniquesSecondSelection> ({
    id: ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND,
    active: false,
  })

export const RemoveCombatTechniquesSecondSelectionG =
  makeGetters (RemoveCombatTechniquesSecondSelectionCreator)

export const createRemoveCombatTechniquesSecondSelection =
  () => RemoveCombatTechniquesSecondSelectionCreator ({ })
