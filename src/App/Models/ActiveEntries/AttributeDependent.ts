import { fnull, List } from "../../../Data/List"
import { SkillDependency } from "../Hero/heroTypeHelpers"

export interface AttributeDependent {
  id: string
  value: number
  mod: number
  dependencies: List<SkillDependency>
}

export const createAttributeDependent =
  (options: Partial<Omit<AttributeDependent, "id">>) =>
  (id: string): AttributeDependent =>
    ({
      id,
      value: 8,
      mod: 0,
      dependencies: List<SkillDependency> (),
      ...options,
    })

export const createAttributeDependentWithValue =
  (x: number) => createAttributeDependent ({ value: x })

export const createPlainAttributeDependent = createAttributeDependent ({ })

export const isAttributeDependentUnused =
  (entry: AttributeDependent): boolean =>
    entry.value === 8
    && entry.mod === 0
    && fnull (entry.dependencies)
