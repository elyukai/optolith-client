import { ProfessionSelectionIds, ProfessionVariantSelection } from '../../../types/wiki';
import { fromDefault, makeGetters, Record } from '../../structures/Record';
import { SpecializationSelection } from './SpecializationSelection';

export interface RemoveSpecializationSelection {
  id: ProfessionSelectionIds.SPECIALIZATION;
  active: false;
}

export type VariantSpecializationSelection =
  Record<SpecializationSelection> |
  Record<RemoveSpecializationSelection>;

const _RemoveSpecializationSelection =
  fromDefault<RemoveSpecializationSelection> ({
    id: ProfessionSelectionIds.SPECIALIZATION,
    active: false,
  })

export const RemoveSpecializationSelectionG = makeGetters (_RemoveSpecializationSelection)

export const RemoveSpecializationSelection =
  _RemoveSpecializationSelection ({
    id: ProfessionSelectionIds.SPECIALIZATION,
    active: false,
  })

export const isRemoveSpecializationSelection =
  (obj: ProfessionVariantSelection): obj is Record<RemoveSpecializationSelection> =>
    obj === RemoveSpecializationSelection
