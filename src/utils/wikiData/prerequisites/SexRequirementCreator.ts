import { Sex } from '../../../types/data';
import { SexRequirement } from '../../../types/wiki';
import { fromDefault, makeGetters } from '../../structures/Record';

const SexRequirementCreator =
  fromDefault<SexRequirement> ({
    id: 'SEX',
    value: 'm',
  })

export const SexRequirementG = makeGetters (SexRequirementCreator)

export const createSexRequirement = (x: Sex) => SexRequirementCreator ({ value: x })
