import { fromDefault, makeGetters } from '../structures/Record';

export interface SkillOptionalDependency {
  value: number
  origin: string
}

/**
 * Create a new `SkillOptionalDependency` object.
 */
export const SkillOptionalDependency =
  fromDefault<SkillOptionalDependency> ({
    value: 0,
    origin: '',
  })

export const SkillOptionalDependencyG = makeGetters (SkillOptionalDependency)
