import { equals, pipe } from 'ramda';
import { AllRequirementObjects, RaceRequirement } from '../../../types/wiki';
import { List } from '../../structures/List';
import { fromDefault, makeGetters, Record } from '../../structures/Record';
import { RequireActivatableG } from './ActivatableRequirementCreator';

const RaceRequirementCreator =
  fromDefault<RaceRequirement> ({
    id: 'RACE',
    value: 0,
  })

export const RaceRequirementG = makeGetters (RaceRequirementCreator)

export const createRaceRequirement =
  (x: number | List<number>) => RaceRequirementCreator ({ id: 'RACE', value: x })

export const isRaceRequirement =
  pipe (RequireActivatableG.id, equals<string | List<string>> ('RACE')) as unknown as
    (req: AllRequirementObjects) => req is Record<RaceRequirement>
