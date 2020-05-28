import { fnull, List } from "../../../Data/List"
import { Attribute as AttributeDependent } from "../Hero.gen"
import { SkillDependency } from "../Hero/heroTypeHelpers"

export { AttributeDependent }

export const createAttributeDependent =
  (options: Partial<Omit<AttributeDependent, "id">>) =>
  (id: number): AttributeDependent =>
    ({
      id,
      value: 8,
      dependencies: List<SkillDependency> (),
      ...options,
    })

export const createAttributeDependentWithValue =
  (x: number) => createAttributeDependent ({ value: x })

export const createPlainAttributeDependent = createAttributeDependent ({ })

export const isAttributeDependentUnused =
  (entry: AttributeDependent): boolean =>
    entry.value === 8
    && fnull (entry.dependencies)
