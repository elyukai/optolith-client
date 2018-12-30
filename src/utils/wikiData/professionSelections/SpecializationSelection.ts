import { List } from '../../structures/List';
import { fromDefault, Record } from '../../structures/Record';
import { ProfessionSelection, ProfessionSelectionIds } from '../wikiTypeHelpers';

export interface SpecializationSelection {
  id: ProfessionSelectionIds
  sid: string | List<string>
}

export const SpecializationSelection =
  fromDefault<SpecializationSelection> ({
    id: ProfessionSelectionIds.SPECIALIZATION,
    sid: '',
  })

export const isSpecializationSelection =
  (obj: ProfessionSelection): obj is Record<SpecializationSelection> =>
    SpecializationSelection.A.id (obj) === ProfessionSelectionIds.SPECIALIZATION
