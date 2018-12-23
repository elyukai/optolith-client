import { CultureRequirement } from '../../../types/wiki';
import { List } from '../../structures/List';
import { fromDefault, makeGetters } from '../../structures/Record';

const CultureRequirementCreator =
  fromDefault<CultureRequirement> ({
    id: 'CULTURE',
    value: 0,
  })

export const CultureRequirementG = makeGetters (CultureRequirementCreator)

export const createCultureRequirement =
  (x: number | List<number>) => CultureRequirementCreator ({ value: x })
