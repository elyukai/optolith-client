import { fnull, List } from "../../../Data/List"
import { ActivatableSkill as ActivatableSkillDependent } from "../Hero.gen"
import { ExtendedSkillDependency } from "../Hero/heroTypeHelpers"

export { ActivatableSkillDependent }

const createActivatableSkillDependent =
  (options: Partial<Omit<ActivatableSkillDependent, "id">>) =>
  (id: number): ActivatableSkillDependent =>
    ({
      id,
      value: "Inactive",
      dependencies: List<ExtendedSkillDependency> (),
      ...options,
    })

export const createInactiveActivatableSkillDependent = createActivatableSkillDependent ({})

export const createActiveActivatableSkillDependent =
  createActivatableSkillDependent ({ value: { tag: "Active", value: 0 } })

export const createActivatableSkillDependentWithValue =
  (x: number) => createActivatableSkillDependent ({ value: { tag: "Active", value: x } })

export const isActivatableSkillDependentUnused =
  (entry: ActivatableSkillDependent): boolean =>
    entry.value !== "Inactive"
    && entry.value.value === 0
    && fnull (entry.dependencies)
