import { Application } from '../../../types/wiki';
import { Nothing } from '../../structures/Maybe';
import { fromDefault, makeGetters } from '../../structures/Record';
import { PartialMaybeFunction } from './typeHelpers';

const ApplicationCreator =
  fromDefault<Application> ({
    id: 0,
    name: '',
    prerequisites: Nothing,
  })

export const ApplicationG = makeGetters (ApplicationCreator)

export const createApplication: PartialMaybeFunction<Application> = ApplicationCreator
