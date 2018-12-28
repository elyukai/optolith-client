import { AllRequirementObjects } from '../../../types/wiki';
import { List } from '../../structures/List';
import { Maybe, Nothing } from '../../structures/Maybe';
import { fromDefault, makeGetters } from '../../structures/Record';

export interface Application {
  id: number
  name: string
  prerequisites: Maybe<List<AllRequirementObjects>>
}

export const Application =
  fromDefault<Application> ({
    id: 0,
    name: '',
    prerequisites: Nothing,
  })

export const ApplicationG = makeGetters (Application)

