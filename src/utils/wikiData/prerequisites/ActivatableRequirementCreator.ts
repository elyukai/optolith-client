import { RequiresActivatableObject } from '../../../types/wiki';
import { Nothing } from '../../structures/Maybe';
import { fromDefault, makeGetters } from '../../structures/Record';
import { PartialMaybeFunction } from '../sub/typeHelpers';

const RequireActivatableCreator =
  fromDefault<RequiresActivatableObject> ({
    id: '',
    active: true,
    sid: Nothing,
    sid2: Nothing,
    tier: Nothing,
  })

export const RequireActivatableG = makeGetters (RequireActivatableCreator)

export const createRequireActivatable: PartialMaybeFunction<RequiresActivatableObject> =
  RequireActivatableCreator
