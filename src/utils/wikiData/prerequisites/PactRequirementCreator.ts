import { equals, pipe } from 'ramda';
import { AllRequirementObjects, PactRequirement } from '../../../types/wiki';
import { List } from '../../structures/List';
import { Nothing } from '../../structures/Maybe';
import { fromDefault, makeGetters, Record } from '../../structures/Record';
import { RequireActivatableG } from './ActivatableRequirementCreator';

const PactRequirementCreator =
  fromDefault<PactRequirement> ({
    id: 'PACT',
    category: 0,
    domain: Nothing,
    level: Nothing,
  })

export const PactRequirementG = makeGetters (PactRequirementCreator)

export const createPactRequirement = PactRequirementCreator

export const isPactRequirement =
  pipe (RequireActivatableG.id, equals<string | List<string>> ('PACT')) as unknown as
    (req: AllRequirementObjects) => req is Record<PactRequirement>
