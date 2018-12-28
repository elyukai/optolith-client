import { pipe } from 'ramda';
import { Sex } from '../../../types/data';
import { AllRequirementObjects } from '../../../types/wiki';
import { equals } from '../../structures/Eq';
import { List } from '../../structures/List';
import { fromDefault, makeGetters, Record } from '../../structures/Record';
import { RequireActivatableG } from './ActivatableRequirement';

export interface SexRequirement {
  id: 'SEX';
  value: Sex;
}

export const SexRequirement =
  fromDefault<SexRequirement> ({
    id: 'SEX',
    value: 'm',
  })

export const SexRequirementG = makeGetters (SexRequirement)

export const isSexRequirement =
  pipe (RequireActivatableG.id, equals<string | List<string>> ('SEX')) as unknown as
    (req: AllRequirementObjects) => req is Record<SexRequirement>
