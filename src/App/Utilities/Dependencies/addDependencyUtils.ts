import { over } from "../../../Data/Lens"
import { consF } from "../../../Data/List"
import { ActivatableDependentL } from "../../Models/ActiveEntries/ActivatableDependent"
import { ActivatableSkillDependentL } from "../../Models/ActiveEntries/ActivatableSkillDependent"
import { AttributeDependentL } from "../../Models/ActiveEntries/AttributeDependent"
import { SkillDependentL } from "../../Models/ActiveEntries/SkillDependent"
import { ActivatableDependency, ExtendedSkillDependency, SkillDependency } from "../../Models/Hero/heroTypeHelpers"
import { adjustEntryDef } from "../heroStateUtils"

export const addAttributeDependency =
  (d: SkillDependency) =>
    adjustEntryDef (over (AttributeDependentL.dependencies) (consF (d)))

export const addSkillDependency =
  (d: SkillDependency) =>
    adjustEntryDef (over (SkillDependentL.dependencies) (consF (d)))

export const addActivatableSkillDependency =
  (d: ExtendedSkillDependency) =>
    adjustEntryDef (over (ActivatableSkillDependentL.dependencies) (consF (d)))

export const addActivatableDependency =
  (d: ActivatableDependency) =>
    adjustEntryDef (over (ActivatableDependentL.dependencies) (consF (d)))
