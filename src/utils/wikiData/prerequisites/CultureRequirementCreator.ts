import { equals, pipe } from 'ramda';
import { AllRequirementObjects, CultureRequirement } from '../../../types/wiki';
import { List } from '../../structures/List';
import { fromDefault, makeGetters, Record } from '../../structures/Record';
import { RequireActivatableG } from './ActivatableRequirementCreator';

const CultureRequirementCreator =
  fromDefault<CultureRequirement> ({
    id: 'CULTURE',
    value: 0,
  })

export const CultureRequirementG = makeGetters (CultureRequirementCreator)

export const createCultureRequirement =
  (x: number | List<number>) => CultureRequirementCreator ({ value: x })

export const isCultureRequirement =
  pipe (RequireActivatableG.id, equals<string | List<string>> ('CULTURE')) as unknown as
    (req: AllRequirementObjects) => req is Record<CultureRequirement>
