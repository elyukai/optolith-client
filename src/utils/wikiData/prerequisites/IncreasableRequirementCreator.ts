import { RequiresIncreasableObject } from '../../../types/wiki';
import { fromDefault, makeGetters } from '../../structures/Record';
import { RequiredFunction } from '../sub/typeHelpers';

const RequireIncreasableCreator =
  fromDefault<RequiresIncreasableObject> ({
    id: '',
    value: 0,
  })

export const RequireIncreasableG = makeGetters (RequireIncreasableCreator)

export const createRequireIncreasable: RequiredFunction<RequiresIncreasableObject> =
  RequireIncreasableCreator
