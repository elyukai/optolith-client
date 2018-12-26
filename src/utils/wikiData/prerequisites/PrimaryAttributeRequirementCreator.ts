import { equals, pipe } from 'ramda';
import { AllRequirementObjects, RequiresPrimaryAttribute } from '../../../types/wiki';
import { List } from '../../structures/List';
import { fromDefault, makeGetters, Record } from '../../structures/Record';
import { RequireActivatableG } from './ActivatableRequirementCreator';

const RequirePrimaryAttributeCreator =
  fromDefault<RequiresPrimaryAttribute> ({
    id: 'ATTR_PRIMARY',
    type: 1,
    value: 0,
  })

export const RequirePrimaryAttributeG = makeGetters (RequirePrimaryAttributeCreator)

export const createRequirePrimaryAttribute =
  (type: 1 | 2) => (value: number) =>
    RequirePrimaryAttributeCreator ({ id: 'ATTR_PRIMARY', type, value })

export const isPrimaryAttributeRequirement =
  pipe (RequireActivatableG.id, equals<string | List<string>> ('ATTR_PRIMARY')) as unknown as
    (req: AllRequirementObjects) => req is Record<RequiresPrimaryAttribute>
