import { ProfessionSelectionIds, RemoveSpecializationSelection } from '../../../types/wiki';
import { fromDefault, makeGetters } from '../../structures/Record';

const RemoveSpecializationSelectionCreator =
  fromDefault<RemoveSpecializationSelection> ({
    id: ProfessionSelectionIds.SPECIALIZATION,
    active: false,
  })

export const RemoveSpecializationSelectionG = makeGetters (RemoveSpecializationSelectionCreator)

export const createRemoveSpecializationSelection = () => RemoveSpecializationSelectionCreator ({ })
