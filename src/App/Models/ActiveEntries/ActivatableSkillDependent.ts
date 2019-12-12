import { fnull, List } from "../../../Data/List";
import { fromJust, isJust, Just, Maybe } from "../../../Data/Maybe";
import { fromDefault, makeLenses, member, Omit, Record } from "../../../Data/Record";
import { Dependent, ExtendedSkillDependency } from "../Hero/heroTypeHelpers";

export interface ActivatableSkillDependent {
  "@@name": "ActivatableSkillDependent"
  id: string;
  value: number;
  active: boolean;
  dependencies: List<ExtendedSkillDependency>;
}

export const ActivatableSkillDependent =
  fromDefault ("ActivatableSkillDependent")
              <ActivatableSkillDependent> ({
                id: "",
                value: 0,
                active: false,
                dependencies: List<ExtendedSkillDependency> (),
              })

export const ActivatableSkillDependentL = makeLenses (ActivatableSkillDependent)

const createActivatableSkillDependent =
  (options: Partial<Omit<ActivatableSkillDependent, "id">>) =>
  (id: string): Record<ActivatableSkillDependent> =>
    ActivatableSkillDependent ({
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

export const isMaybeActivatableSkillDependent =
  (entry: Maybe<Dependent>): entry is Just<Record<ActivatableSkillDependent>> =>
    isJust (entry)
    && member ("value") (fromJust (entry))
    && member ("active") (fromJust (entry))

export const isActivatableSkillDependent =
  (entry: Dependent): entry is Record<ActivatableSkillDependent> =>
    member ("value") (entry)
    && member ("active") (entry)

const { active, value, dependencies } = ActivatableSkillDependent.AL

export const isActivatableSkillDependentUnused =
  (entry: Record<ActivatableSkillDependent>): boolean =>
    value (entry) === 0
    && !active (entry)
    && fnull (dependencies (entry))
