import { ProfessionSelectionIds } from '../../../types/wiki';
import { List } from '../../structures/List';
import { fromDefault, makeGetters } from '../../structures/Record';

export interface SpecializationSelection {
  id: ProfessionSelectionIds.SPECIALIZATION;
  sid: string | List<string>;
}

export const SpecializationSelection =
  fromDefault<SpecializationSelection> ({
    id: ProfessionSelectionIds.SPECIALIZATION,
    sid: '',
  })

export const SpecializationSelectionG = makeGetters (SpecializationSelection)
