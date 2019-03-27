import { join } from "../../../Data/Function";
import { over, view } from "../../../Data/Lens";
import { deleteAt, elemIndex } from "../../../Data/List";
import { fromMaybe } from "../../../Data/Maybe";
import { ActivatableDependentL, isActivatableDependentUnused } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActivatableSkillDependentL, isActivatableSkillDependentUnused } from "../../Models/ActiveEntries/ActivatableSkillDependent";
import { AttributeDependentL, isAttributeDependentUnused } from "../../Models/ActiveEntries/AttributeDependent";
import { isSkillDependentUnused, SkillDependentL } from "../../Models/ActiveEntries/SkillDependent";
import { ActivatableDependency, ExtendedSkillDependency, SkillDependency } from "../../Models/Hero/heroTypeHelpers";
import { adjustRemoveEntryDef } from "../heroStateUtils";
import { pipe } from "../pipe";

export const removeAttributeDependency =
  (d: SkillDependency) =>
    adjustRemoveEntryDef
      (isAttributeDependentUnused)
      (join (pipe (
        view (AttributeDependentL.dependencies),
        elemIndex (d),
        fromMaybe (-1),
        deleteAt,
        over (AttributeDependentL.dependencies)
      )))

export const removeSkillDependency =
  (d: SkillDependency) =>
    adjustRemoveEntryDef
      (isSkillDependentUnused)
      (join (pipe (
        view (SkillDependentL.dependencies),
        elemIndex (d),
        fromMaybe (-1),
        deleteAt,
        over (SkillDependentL.dependencies)
      )))

export const removeActivatableSkillDependency =
  (d: ExtendedSkillDependency) =>
    adjustRemoveEntryDef
      (isActivatableSkillDependentUnused)
      (join (pipe (
        view (ActivatableSkillDependentL.dependencies),
        elemIndex (d),
        fromMaybe (-1),
        deleteAt,
        over (ActivatableSkillDependentL.dependencies)
      )))

export const removeActivatableDependency =
  (d: ActivatableDependency) =>
    adjustRemoveEntryDef
      (isActivatableDependentUnused)
      (join (pipe (
        view (ActivatableDependentL.dependencies),
        elemIndex (d),
        fromMaybe (-1),
        deleteAt,
        over (ActivatableDependentL.dependencies)
      )))
