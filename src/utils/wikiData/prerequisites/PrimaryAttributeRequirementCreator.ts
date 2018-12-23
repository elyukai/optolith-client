import { RequiresPrimaryAttribute } from '../../../types/wiki';
import { fromDefault, makeGetters } from '../../structures/Record';

const RequirePrimaryAttributeCreator =
  fromDefault<RequiresPrimaryAttribute> ({
    id: 'ATTR_PRIMARY',
    type: 1,
    value: 0,
  })

export const RequirePrimaryAttributeG = makeGetters (RequirePrimaryAttributeCreator)

export const createRequirePrimaryAttribute =
  (type: 1 | 2) => (value: number) => RequirePrimaryAttributeCreator ({ type, value })
