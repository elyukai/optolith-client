import { ProfessionSelectionIds, SpecializationSelection } from '../../../types/wiki';
import { List } from '../../structures/List';
import { fromDefault, makeGetters } from '../../structures/Record';

const SpecializationSelectionCreator =
  fromDefault<SpecializationSelection> ({
    id: ProfessionSelectionIds.SPECIALIZATION,
    sid: '',
  })

export const SpecializationSelectionG = makeGetters (SpecializationSelectionCreator)

export const createSpecializationSelection =
  (id: string | List<string>) => SpecializationSelectionCreator ({ sid: id })
