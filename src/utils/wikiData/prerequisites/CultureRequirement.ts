import { equals, pipe } from 'ramda';
import { AllRequirementObjects } from '../../../types/wiki';
import { List } from '../../structures/List';
import { fromDefault, makeGetters, Record } from '../../structures/Record';
import { RequireActivatableG } from './ActivatableRequirement';

export interface CultureRequirement {
  id: 'CULTURE';
  value: number | List<number>;
}

export const CultureRequirement =
  fromDefault<CultureRequirement> ({
    id: 'CULTURE',
    value: 0,
  })

export const CultureRequirementG = makeGetters (CultureRequirement)

export const isCultureRequirement =
  pipe (RequireActivatableG.id, equals<string | List<string>> ('CULTURE')) as unknown as
    (req: AllRequirementObjects) => req is Record<CultureRequirement>
