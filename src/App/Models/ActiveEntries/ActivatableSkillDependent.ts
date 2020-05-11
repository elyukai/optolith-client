import { fnull, List } from "../../../Data/List"
import { ExtendedSkillDependency } from "../Hero/heroTypeHelpers"

export interface ActivatableSkillDependent {
  id: string
  value: number
  active: boolean
  dependencies: List<ExtendedSkillDependency>
}

const createActivatableSkillDependent =
  (options: Partial<Omit<ActivatableSkillDependent, "id">>) =>
  (id: string): ActivatableSkillDependent =>
    ({
      id,
      value: 0,
      active: false,
      dependencies: List<ExtendedSkillDependency> (),
      ...options,
    })

export const createInactiveActivatableSkillDependent = createActivatableSkillDependent ({})

export const createActiveActivatableSkillDependent =
  createActivatableSkillDependent ({ active: true })

export const createActivatableSkillDependentWithValue =
  (x: number) => createActivatableSkillDependent ({ active: true, value: x })

export const isActivatableSkillDependentUnused =
  (entry: ActivatableSkillDependent): boolean =>
    entry.value === 0
    && !entry.active
    && fnull (entry.dependencies)
