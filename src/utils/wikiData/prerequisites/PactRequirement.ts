import { equals, pipe } from 'ramda';
import { AllRequirementObjects } from '../../../types/wiki';
import { List } from '../../structures/List';
import { Maybe, Nothing } from '../../structures/Maybe';
import { fromDefault, makeGetters, Record } from '../../structures/Record';
import { RequireActivatableG } from './ActivatableRequirement';

export interface PactRequirement {
  id: 'PACT';
  category: number;
  domain: Maybe<number | List<number>>;
  level: Maybe<number>;
}

export const PactRequirement =
  fromDefault<PactRequirement> ({
    id: 'PACT',
    category: 0,
    domain: Nothing,
    level: Nothing,
  })

export const PactRequirementG = makeGetters (PactRequirement)

export const isPactRequirement =
  pipe (RequireActivatableG.id, equals<string | List<string>> ('PACT')) as unknown as
    (req: AllRequirementObjects) => req is Record<PactRequirement>
