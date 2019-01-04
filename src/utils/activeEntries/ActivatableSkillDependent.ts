import { Dependent, ExtendedSkillDependency } from "../../types/data";
import { fnull, fromElements, List } from "../structures/List";
import { fromJust, isJust, Just, Maybe } from "../structures/Maybe";
import { fromDefault, makeLenses, member, Omit, Record } from "../structures/Record";

export interface ActivatableSkillDependent {
  id: string;
  value: number;
  active: boolean;
  dependencies: List<ExtendedSkillDependency>;
}

export const ActivatableSkillDependent =
  fromDefault<ActivatableSkillDependent> ({
    id: "",
    value: 0,
    active: false,
    dependencies: fromElements<ExtendedSkillDependency> (),
  })

export const ActivatableSkillDependentL = makeLenses (ActivatableSkillDependent)

const createActivatableSkillDependent =
  (options: Partial<Omit<ActivatableSkillDependent, "id">>) =>
  (id: string): Record<ActivatableSkillDependent> =>
    ActivatableSkillDependent ({
      id,
      value: 0,
      active: false,
      dependencies: fromElements<ExtendedSkillDependency> (),
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

const { active, value, dependencies } = ActivatableSkillDependent.A

export const isActivatableDependentSkillUnused =
  (entry: Record<ActivatableSkillDependent>): boolean =>
    value (entry) === 0
    && !active (entry)
    && fnull (dependencies (entry))
