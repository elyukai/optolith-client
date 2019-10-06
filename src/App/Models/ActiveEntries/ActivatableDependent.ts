import { fnull, List } from "../../../Data/List";
import { fromJust, isJust, Just, Maybe } from "../../../Data/Maybe";
import { fromDefault, makeLenses, member, notMember, Omit, Record } from "../../../Data/Record";
import { ActivatableDependency, Dependent } from "../Hero/heroTypeHelpers";
import { ActivatableSkillDependent } from "./ActivatableSkillDependent";
import { ActiveObject } from "./ActiveObject";

export interface ActivatableDependent {
  "@@name": "ActivatableDependent"
  id: string;
  active: List<Record<ActiveObject>>;
  dependencies: List<ActivatableDependency>;
}

export const ActivatableDependent =
  fromDefault ("ActivatableDependent")
              <ActivatableDependent> ({
                id: "",
                active: List<Record<ActiveObject>> (),
                dependencies: List<ActivatableDependency> (),
              })

export const ActivatableDependentL = makeLenses (ActivatableDependent)

export const createActivatableDependent =
  (options: Partial<Omit<ActivatableDependent, "id">>) =>
  (id: string): Record<ActivatableDependent> =>
    ActivatableDependent ({
      id,
      active: List<Record<ActiveObject>> (),
      dependencies: List<ActivatableDependency> (),
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

const { active, dependencies } = ActivatableDependent.AL

export const isActivatableDependentUnused =
  (entry: Record<ActivatableDependent>): boolean =>
    fnull (active (entry))
    && fnull (dependencies (entry))

export const isExtendedActivatableDependent =
  (x: Dependent): x is Record<ActivatableDependent> | Record<ActivatableSkillDependent> =>
    ActivatableDependent.is (x) || ActivatableSkillDependent.is (x)
