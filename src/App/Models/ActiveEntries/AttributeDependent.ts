import { fnull, List } from "../../../Data/List";
import { fromJust, isJust, Just, Maybe } from "../../../Data/Maybe";
import { fromDefault, makeLenses, member, notMember, Omit, Record } from "../../../Data/Record";
import { Dependent, SkillDependency } from "../Hero/heroTypeHelpers";

export interface AttributeDependent {
  "@@name": "AttributeDependent"
  id: string;
  value: number;
  mod: number;
  dependencies: List<SkillDependency>;
}

export const AttributeDependent =
  fromDefault ("AttributeDependent")
              <AttributeDependent> ({
                id: "",
                value: 8,
                mod: 0,
                dependencies: List<SkillDependency> (),
              })

export const AttributeDependentL = makeLenses (AttributeDependent)

export const createAttributeDependent =
  (options: Partial<Omit<AttributeDependent, "id">>) =>
  (id: string): Record<AttributeDependent> =>
    AttributeDependent ({
      id,
      value: 8,
      mod: 0,
      dependencies: List<SkillDependency> (),
      ...options,
    })

export const createAttributeDependentWithValue =
  (x: number) => createAttributeDependent ({ value: x })

export const createPlainAttributeDependent = createAttributeDependent ({ })

export const isMaybeAttributeDependent =
  (entry: Maybe<Dependent>): entry is Just<Record<AttributeDependent>> =>
    isJust (entry)
    && member ("value") (fromJust (entry))
    && member ("mod") (fromJust (entry))
    && notMember ("active") (fromJust (entry))

export const isAttributeDependent =
  (entry: Dependent): entry is Record<AttributeDependent> =>
    member ("value") (entry)
    && member ("mod") (entry)
    && notMember ("active") (entry)

const { mod, value, dependencies } = AttributeDependent.AL

export const isAttributeDependentUnused =
  (entry: Record<AttributeDependent>): boolean =>
    value (entry) === 8
    && mod (entry) === 0
    && fnull (dependencies (entry))
