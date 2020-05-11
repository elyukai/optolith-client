import { fnull, List } from "../../../Data/List"
import { ActivatableDependency } from "../Hero/heroTypeHelpers"
import { ActiveObject } from "./ActiveObject"

export interface ActivatableDependent {
  id: string
  active: List<ActiveObject>
  dependencies: List<ActivatableDependency>
}

export const createActivatableDependent =
  (options: Partial<Omit<ActivatableDependent, "id">>) =>
  (id: string): ActivatableDependent =>
    ({
      id,
      active: List<ActiveObject> (),
      dependencies: List<ActivatableDependency> (),
      ...options,
    })

export const createActivatableDependentWithActive =
  (activeObjects: List<ActiveObject>) =>
    createActivatableDependent ({ active: activeObjects })

export const createPlainActivatableDependent = createActivatableDependent ({ })

export const isActivatableDependentUnused =
  (entry: ActivatableDependent): boolean =>
    fnull (entry.active)
    && fnull (entry.dependencies)
