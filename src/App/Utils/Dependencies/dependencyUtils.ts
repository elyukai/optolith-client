import { pipe } from "ramda";
import { notEquals } from "../../../Data/Eq";
import { flip, ident, join, thrush } from "../../../Data/Function";
import { foldr, isList } from "../../../Data/List";
import { elemF, fmap, fromMaybe, isNothing, Just, Nothing } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { Categories } from "../../Constants/Categories";
import { DependencyObject } from "../../Models/ActiveEntries/DependencyObject";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { ActivatableDependency, ExtendedSkillDependency, SkillDependency } from "../../Models/Hero/heroTypeHelpers";
import { SkillOptionalDependency } from "../../Models/Hero/SkillOptionalDependency";
import { isRequiringActivatable, RequireActivatable } from "../../Models/Wiki/prerequisites/ActivatableRequirement";
import { isDependentPrerequisite } from "../../Models/Wiki/prerequisites/DependentRequirement";
import { isRequiringIncreasable, RequireIncreasable } from "../../Models/Wiki/prerequisites/IncreasableRequirement";
import { isPrimaryAttributeRequirement, RequirePrimaryAttribute } from "../../Models/Wiki/prerequisites/PrimaryAttributeRequirement";
import { AllRequirements } from "../../Models/Wiki/wikiTypeHelpers";
import { getCategoryById } from "../IDUtils";
import { getPrimaryAttributeId } from "../primaryAttributeUtils";
import { addActivatableDependency, addActivatableSkillDependency, addAttributeDependency, addSkillDependency } from "./addDependencyUtils";
import { removeActivatableDependency, removeActivatableSkillDependency, removeAttributeDependency, removeSkillDependency } from "./removeDependencyUtils";

const { specialAbilities } = HeroModel.A

type ModifyAttributeDependency =
  (d: SkillDependency) => (id: string) => (state: HeroModelRecord) => HeroModelRecord

type ModifySkillDependency =
  (d: SkillDependency) => (id: string) => (state: HeroModelRecord) => HeroModelRecord

type ModifyActivatableSkillDependency =
  (d: ExtendedSkillDependency) => (id: string) => (state: HeroModelRecord) => HeroModelRecord

type ModifyActivatableDependency =
  (d: ActivatableDependency) => (id: string) => (state: HeroModelRecord) => HeroModelRecord

const putActivatableDependency =
  (f: ModifyActivatableDependency) =>
  (sourceId: string) =>
  (req: Record<RequireActivatable>) => {
    const { id, active, sid, sid2, tier } = RequireActivatable.A

    const current_id = id (req)

    if (isList (current_id)) {
      if (isNothing (sid (req)) || isNothing (sid2 (req)) || isNothing (tier (req))) {
        return flip (foldr (f (DependencyObject ({
                                                  origin: Just (sourceId),
                                                  active: Just (active (req)),
                                                }))))
                    (current_id)
      }

      return flip (foldr (f (DependencyObject ({
                                                origin: Just (sourceId),
                                                active:
                                                  isList (sid (req))
                                                  ? Just (active (req))
                                                  : Nothing,
                                                sid: sid (req),
                                                sid2: sid2 (req),
                                                tier: tier (req),
                                              }))))
                  (current_id)
    }

    // current_id is no list:

    if (isNothing (sid (req)) || isNothing (sid2 (req)) || isNothing (tier (req))) {
      return f (active (req)) (current_id)
    }

    return f (DependencyObject ({
                                 active:
                                   isList (sid (req))
                                   ? Just (active (req))
                                   : Nothing,
                                 sid: sid (req),
                                 sid2: sid2 (req),
                                 tier: tier (req),
                               }))
             (current_id)
  }

const putPrimaryAttributeDependency =
  (f: ModifyAttributeDependency) =>
  (req: Record<RequirePrimaryAttribute>) =>
  (state: HeroModelRecord): HeroModelRecord => {
    const { type, value } = RequirePrimaryAttribute.A

    return fromMaybe (state)
                     (fmap ((x: string) => f (value (req)) (x) (state))
                           (getPrimaryAttributeId (specialAbilities (state))
                                                  (type (req))))
  }

const getMatchingIncreasableModifier =
  (f: ModifyAttributeDependency) =>
  (g: ModifySkillDependency) =>
  (h: ModifyActivatableSkillDependency) =>
  (id: string): ModifySkillDependency => {
    const isOfCategory = elemF (getCategoryById (id))

    if (isOfCategory (Categories.ATTRIBUTES)) {
      return f
    }

    if (isOfCategory (Categories.LITURGIES) || isOfCategory (Categories.SPELLS)) {
      return h
    }

    return g
  }

const putIncreasableDependency =
  (f: ModifyAttributeDependency) =>
  (g: ModifySkillDependency) =>
  (h: ModifyActivatableSkillDependency) =>
  (sourceId: string) =>
  (req: Record<RequireIncreasable>) =>
  (state: HeroModelRecord): HeroModelRecord => {
    const { id, value } = RequireIncreasable.A

    const current_id = id (req)

    if (isList (current_id)) {
      return foldr (join (pipe (
                                 getMatchingIncreasableModifier (f)
                                                                (g)
                                                                (h),
                                 thrush (SkillOptionalDependency ({
                                          origin: sourceId,
                                          value: value (req),
                                        }))
                   )))
                   (state)
                   (current_id)
    }

    return getMatchingIncreasableModifier (f)
                                          (g)
                                          (h)
                                          (current_id)
                                          (value (req))
                                          (current_id)
                                          (state)
  }

const modifyDependencies =
  (modifyAttributeDependency: ModifyAttributeDependency) =>
  (modifySkillDependency: ModifySkillDependency) =>
  (modifyActivatableSkillDependency: ModifyActivatableSkillDependency) =>
  (modifyActivatableDependency: ModifyActivatableDependency) =>
  (sourceId: string) =>
    flip (foldr ((x: AllRequirements): (state: Record<HeroModel>) => Record<HeroModel> => {
                  if (isDependentPrerequisite (x)) {
                    if (isPrimaryAttributeRequirement (x)) {
                      return putPrimaryAttributeDependency (modifyAttributeDependency)
                                                           (x)
                    }

                    if (isRequiringIncreasable (x)) {
                      return putIncreasableDependency (modifyAttributeDependency)
                                                      (modifySkillDependency)
                                                      (modifyActivatableSkillDependency)
                                                      (sourceId)
                                                      (x)
                    }

                    if (
                      isRequiringActivatable (x)
                      && notEquals (RequireActivatable.A.sid (x)) (Just ("GR"))
                    ) {
                      return putActivatableDependency (modifyActivatableDependency)
                                                      (sourceId)
                                                      (x)
                    }
                  }

                  return ident
                }))

/**
 * Adds dependencies to all required entries to ensure rule validity.
 */
export const addDependencies = modifyDependencies (addAttributeDependency)
                                                  (addSkillDependency)
                                                  (addActivatableSkillDependency)
                                                  (addActivatableDependency)

/**
 * Removes dependencies from all required entries to ensure rule validity.
 */
export const removeDependencies = modifyDependencies (removeAttributeDependency)
                                                     (removeSkillDependency)
                                                     (removeActivatableSkillDependency)
                                                     (removeActivatableDependency)
