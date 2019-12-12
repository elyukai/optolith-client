import { fnull, List } from "../../../Data/List";
import { fromJust, isJust, Just, Maybe } from "../../../Data/Maybe";
import { add } from "../../../Data/Num";
import { fromDefault, makeLenses, member, notMember, Omit, Record } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { Dependent, ExtendedSkillDependent, SkillDependency } from "../Hero/heroTypeHelpers";
import { ActivatableSkillDependent } from "./ActivatableSkillDependent";

export interface SkillDependent {
  "@@name": "SkillDependent"
  id: string;
  value: number;
  dependencies: List<SkillDependency>;
}

export const SkillDependent =
  fromDefault ("SkillDependent")
              <SkillDependent> ({
                id: "",
                value: 0,
                dependencies: List<SkillDependency> (),
              })

export const SkillDependentL = makeLenses (SkillDependent)

export const createSkillDependent =
  (options: Partial<Omit<SkillDependent, "id">>) =>
  (id: string): Record<SkillDependent> =>
    SkillDependent ({
      id,
      value: 0,
      dependencies: List<SkillDependency> (),
      ...options,
    })

export const createPlainSkillDependent = createSkillDependent ({ })

export const createSkillDependentWithValue = (x: number) => createSkillDependent ({ value: x })

export const createSkillDependentWithBaseValue6 = pipe (add (6), createSkillDependentWithValue)

export const createSkillDependentWithValue6 = createSkillDependent ({ value: 6 })

export const isMaybeSkillDependent =
  (entry: Maybe<Dependent>): entry is Just<Record<SkillDependent>> =>
    isJust (entry)
    && member ("value") (fromJust (entry))
    && notMember ("mod") (fromJust (entry))
    && notMember ("active") (fromJust (entry))

export const isSkillDependent =
  (entry: Dependent): entry is Record<SkillDependent> =>
    member ("value") (entry)
    && notMember ("mod") (entry)
    && notMember ("active") (entry)

export const isExtendedSkillDependent =
  (entry: Dependent): entry is ExtendedSkillDependent =>
    SkillDependent.is (entry) || ActivatableSkillDependent.is (entry)

const { value, dependencies } = SkillDependent.AL

export const isSkillDependentUnused =
  (entry: Record<SkillDependent>): boolean =>
    value (entry) === 0
    && fnull (dependencies (entry))

export const isCombatTechniqueSkillDependentUnused =
  (entry: Record<SkillDependent>): boolean =>
    value (entry) === 6
    && fnull (dependencies (entry))
