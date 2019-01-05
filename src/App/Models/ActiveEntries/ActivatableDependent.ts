import { fnull, fromElements, List } from "../../../Data/List";
import { fromJust, isJust, Just, Maybe } from "../../../Data/Maybe";
import { fromDefault, makeLenses, member, notMember, Omit, Record } from "../../../Data/Record";
import { ActivatableDependency, Dependent } from "../../../types/data";
import { ActiveObject } from "./ActiveObject";

export interface ActivatableDependent {
  id: string;
  active: List<Record<ActiveObject>>;
  dependencies: List<ActivatableDependency>;
}

export const ActivatableDependent =
  fromDefault<ActivatableDependent> ({
    id: "",
    active: fromElements<Record<ActiveObject>> (),
    dependencies: fromElements<ActivatableDependency> (),
  })

export const ActivatableDependentL = makeLenses (ActivatableDependent)

export const createActivatableDependent =
  (options: Partial<Omit<ActivatableDependent, "id">>) =>
  (id: string): Record<ActivatableDependent> =>
    ActivatableDependent ({
      id,
      active: fromElements<Record<ActiveObject>> (),
      dependencies: fromElements<ActivatableDependency> (),
      ...options,
    })

export const createActivatableDependentWithActive =
  (activeObjects: List<Record<ActiveObject>>) =>
    createActivatableDependent ({ active: activeObjects })

export const createPlainActivatableDependent = createActivatableDependent ({ })

export const isMaybeActivatableDependent =
  (entry: Maybe<Dependent>): entry is Just<Record<ActivatableDependent>> =>
    isJust (entry)
    && member ("active") (fromJust (entry))
    && notMember ("value") (fromJust (entry))

export const isActivatableDependent =
  (entry: Dependent): entry is Record<ActivatableDependent> =>
    member ("active") (entry)
    && notMember ("value") (entry)

const { active, dependencies } = ActivatableDependent.A

export const isActivatableDependentUnused =
  (entry: Record<ActivatableDependent>): boolean =>
    fnull (active (entry))
    && fnull (dependencies (entry))
