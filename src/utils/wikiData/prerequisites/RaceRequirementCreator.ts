import { RaceRequirement } from '../../../types/wiki';
import { List } from '../../structures/List';
import { fromDefault, makeGetters } from '../../structures/Record';

const RaceRequirementCreator =
  fromDefault<RaceRequirement> ({
    id: 'RACE',
    value: 0,
  })

export const RaceRequirementG = makeGetters (RaceRequirementCreator)

export const createRaceRequirement =
  (x: number | List<number>) => RaceRequirementCreator ({ value: x })
