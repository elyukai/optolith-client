import { fnull, List } from "../../../Data/List"
import { add } from "../../../Data/Num"
import { pipe } from "../../Utilities/pipe"
import { SkillDependency } from "../Hero/heroTypeHelpers"

export interface SkillDependent {
  id: string
  value: number
  dependencies: List<SkillDependency>
}

export const createSkillDependent =
  (options: Partial<Omit<SkillDependent, "id">>) =>
  (id: string): SkillDependent =>
    ({
      id,
      value: 0,
      dependencies: List<SkillDependency> (),
      ...options,
    })

export const createPlainSkillDependent = createSkillDependent ({ })

export const createSkillDependentWithValue = (x: number) => createSkillDependent ({ value: x })

export const createSkillDependentWithBaseValue6 = pipe (add (6), createSkillDependentWithValue)

export const createSkillDependentWithValue6 = createSkillDependent ({ value: 6 })

export const isSkillDependentUnused =
  (entry: SkillDependent): boolean =>
    entry.value === 0
    && fnull (entry.dependencies)

export const isCombatTechniqueSkillDependentUnused =
  (entry: SkillDependent): boolean =>
  entry.value === 6
    && fnull (entry.dependencies)
