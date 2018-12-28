import { equals, pipe } from 'ramda';
import { AllRequirementObjects } from '../../../types/wiki';
import { List } from '../../structures/List';
import { fromDefault, makeGetters, Record } from '../../structures/Record';
import { RequireActivatableG } from './ActivatableRequirement';

export interface RaceRequirement {
  id: 'RACE';
  value: number | List<number>;
}

export const RaceRequirement =
  fromDefault<RaceRequirement> ({
    id: 'RACE',
    value: 0,
  })

export const RaceRequirementG = makeGetters (RaceRequirement)

export const isRaceRequirement =
  pipe (RequireActivatableG.id, equals<string | List<string>> ('RACE')) as unknown as
    (req: AllRequirementObjects) => req is Record<RaceRequirement>
