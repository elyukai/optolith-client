import { PactRequirement } from '../../../types/wiki';
import { Nothing } from '../../structures/Maybe';
import { fromDefault, makeGetters } from '../../structures/Record';
import { PartialMaybeFunction } from '../sub/typeHelpers';

const PactRequirementCreator =
  fromDefault<PactRequirement> ({
    id: 'PACT',
    category: 0,
    domain: Nothing,
    level: Nothing,
  })

export const PactRequirementG = makeGetters (PactRequirementCreator)

export const createPactRequirement: PartialMaybeFunction<PactRequirement> =
  PactRequirementCreator
