import { List } from '../../structures/List';
import { fromDefault } from '../../structures/Record';
import { ProfessionSelectionIds } from '../wikiTypeHelpers';

export interface SpecializationSelection {
  id: ProfessionSelectionIds.SPECIALIZATION;
  sid: string | List<string>;
}

export const SpecializationSelection =
  fromDefault<SpecializationSelection> ({
    id: ProfessionSelectionIds.SPECIALIZATION,
    sid: '',
  })
