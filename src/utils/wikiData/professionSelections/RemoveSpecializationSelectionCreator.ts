import { ProfessionSelectionIds, ProfessionVariantSelection, RemoveSpecializationSelection } from '../../../types/wiki';
import { fromDefault, makeGetters, member, Record } from '../../structures/Record';

const RemoveSpecializationSelectionCreator =
  fromDefault<RemoveSpecializationSelection> ({
    id: ProfessionSelectionIds.SPECIALIZATION,
    active: false,
  })

export const RemoveSpecializationSelectionG = makeGetters (RemoveSpecializationSelectionCreator)

export const createRemoveSpecializationSelection = () => RemoveSpecializationSelectionCreator ({ })

export const isRemoveSpecializationSelection =
  (obj: ProfessionVariantSelection): obj is Record<RemoveSpecializationSelection> =>
    RemoveSpecializationSelectionG.id (obj as unknown as Record<RemoveSpecializationSelection>)
      === ProfessionSelectionIds.SPECIALIZATION
      && member ('active') (obj)
