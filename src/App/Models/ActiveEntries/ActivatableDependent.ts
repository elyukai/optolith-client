import { fnull, List } from "../../../Data/List"
import { Activatable as ActivatableDependent } from "../Hero.gen"
import { ActivatableDependency } from "../Hero/heroTypeHelpers"
import { ActiveObject } from "./ActiveObject"

export { ActivatableDependent }

export const createActivatableDependent =
  (options: Partial<Omit<ActivatableDependent, "id">>) =>
  (id: number): ActivatableDependent =>
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
