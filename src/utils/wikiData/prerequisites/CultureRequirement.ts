import { equals, pipe } from 'ramda';
import { List } from '../../structures/List';
import { fromDefault, Record } from '../../structures/Record';
import { AllRequirementObjects } from '../wikiTypeHelpers';
import { RequireActivatable } from './ActivatableRequirement';

export interface CultureRequirement {
  id: 'CULTURE';
  value: number | List<number>;
}

export const CultureRequirement =
  fromDefault<CultureRequirement> ({
    id: 'CULTURE',
    value: 0,
  })

export const isCultureRequirement =
  pipe (RequireActivatable.A.id, equals<string | List<string>> ('CULTURE')) as unknown as
    (req: AllRequirementObjects) => req is Record<CultureRequirement>
