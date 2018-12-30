import { List } from '../../structures/List';
import { Maybe, Nothing } from '../../structures/Maybe';
import { fromDefault } from '../../structures/Record';
import { AllRequirementObjects } from '../wikiTypeHelpers';

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
