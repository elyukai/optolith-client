import { SkillOptionalDependency } from '../../types/data';
import { fromDefault, makeGetters } from '../structures/Record';

/**
 * Create a new `SkillOptionalDependency` object.
 */
export const SkillOptionalDependencyCreator =
  fromDefault<SkillOptionalDependency> ({
    value: 0,
    origin: '',
  })

export const SkillOptionalDependencyG = makeGetters (SkillOptionalDependencyCreator)
