import { equals, pipe } from 'ramda';
import { AllRequirementObjects } from '../../../types/wiki';
import { List } from '../../structures/List';
import { fromDefault, makeGetters, Record } from '../../structures/Record';
import { RequireActivatableG } from './ActivatableRequirement';

export interface RequirePrimaryAttribute {
  id: 'ATTR_PRIMARY';
  value: number;
  type: 1 | 2;
}

export const RequirePrimaryAttribute =
  fromDefault<RequirePrimaryAttribute> ({
    id: 'ATTR_PRIMARY',
    type: 1,
    value: 0,
  })

export const RequirePrimaryAttributeG = makeGetters (RequirePrimaryAttribute)

export const isPrimaryAttributeRequirement =
  pipe (RequireActivatableG.id, equals<string | List<string>> ('ATTR_PRIMARY')) as unknown as
    (req: AllRequirementObjects) => req is Record<RequirePrimaryAttribute>
