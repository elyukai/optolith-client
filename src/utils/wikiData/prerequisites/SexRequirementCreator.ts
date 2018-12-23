import { pipe } from 'ramda';
import { Sex } from '../../../types/data';
import { AllRequirementObjects, SexRequirement } from '../../../types/wiki';
import { equals } from '../../structures/Eq';
import { List } from '../../structures/List';
import { fromDefault, makeGetters, Record } from '../../structures/Record';
import { RequireActivatableG } from './ActivatableRequirementCreator';

const SexRequirementCreator =
  fromDefault<SexRequirement> ({
    id: 'SEX',
    value: 'm',
  })

export const SexRequirementG = makeGetters (SexRequirementCreator)

export const createSexRequirement = (x: Sex) => SexRequirementCreator ({ value: x })

export const isSexRequirement =
  pipe (RequireActivatableG.id, equals<string | List<string>> ('SEX')) as unknown as
    (req: AllRequirementObjects) => req is Record<SexRequirement>
