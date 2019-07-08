import { notEquals } from "../../../Data/Eq";
import { flip, ident, join, thrush } from "../../../Data/Function";
import { fmap } from "../../../Data/Functor";
import { foldr, isList } from "../../../Data/List";
import { elemF, fromMaybe, isNothing, Just, Nothing } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { Categories } from "../../Constants/Categories";
import { DependencyObject } from "../../Models/ActiveEntries/DependencyObject";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { ActivatableDependency, ExtendedSkillDependency, SkillDependency } from "../../Models/Hero/heroTypeHelpers";
import { SkillOptionalDependency } from "../../Models/Hero/SkillOptionalDependency";
import { RequireActivatable } from "../../Models/Wiki/prerequisites/ActivatableRequirement";
import { isDependentPrerequisite } from "../../Models/Wiki/prerequisites/DependentRequirement";
import { RequireIncreasable } from "../../Models/Wiki/prerequisites/IncreasableRequirement";
import { RequirePrimaryAttribute } from "../../Models/Wiki/prerequisites/PrimaryAttributeRequirement";
import { AllRequirements } from "../../Models/Wiki/wikiTypeHelpers";
import { getCategoryById } from "../IDUtils";
import { pipe } from "../pipe";
import { getPrimaryAttributeId } from "../primaryAttributeUtils";
import { addActivatableDependency, addActivatableSkillDependency, addAttributeDependency, addSkillDependency } from "./addDependencyUtils";
import { removeActivatableDependency, removeActivatableSkillDependency, removeAttributeDependency, removeSkillDependency } from "./removeDependencyUtils";

const { specialAbilities } = HeroModel.AL
const RAA = RequireActivatable.A
const RPAA = RequirePrimaryAttribute.A

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
  (req: Record<RequireActivatable>): ident<HeroModelRecord> => {

    const current_id = RAA.id (req)

    if (isList (current_id)) {
      if (isNothing (RAA.sid (req)) || isNothing (RAA.sid2 (req)) || isNothing (RAA.tier (req))) {
        return flip (foldr (f (DependencyObject ({
                                                  origin: Just (sourceId),
                                                  active: Just (RAA.active (req)),
                                                }))))
                    (current_id)
      }

      return flip (foldr (f (DependencyObject ({
                                                origin: Just (sourceId),
                                                active:
                                                  isList (RAA.sid (req))
                                                  ? Just (RAA.active (req))
                                                  : Nothing,
                                                sid: RAA.sid (req),
                                                sid2: RAA.sid2 (req),
                                                tier: RAA.tier (req),
                                              }))))
                  (current_id)
    }

    // current_id is no list:

    if (isNothing (RAA.sid (req)) || isNothing (RAA.sid2 (req)) || isNothing (RAA.tier (req))) {
      return f (RAA.active (req)) (current_id)
    }

    return f (DependencyObject ({
                                 active:
                                   isList (RAA.sid (req))
                                   ? Just (RAA.active (req))
                                   : Nothing,
                                 sid: RAA.sid (req),
                                 sid2: RAA.sid2 (req),
                                 tier: RAA.tier (req),
                               }))
             (current_id)
  }

const putPrimaryAttributeDependency =
  (f: ModifyAttributeDependency) =>
  (req: Record<RequirePrimaryAttribute>) =>
  (state: HeroModelRecord): HeroModelRecord =>
    fromMaybe (state)
              (fmap ((x: string) => f (RPAA.value (req)) (x) (state))
                    (getPrimaryAttributeId (specialAbilities (state))
                                           (RPAA.type (req))))

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
    const { id, value } = RequireIncreasable.AL

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
    flip (foldr ((x: AllRequirements): ident<Record<HeroModel>> => {
                  if (isDependentPrerequisite (x)) {
                    if (RequirePrimaryAttribute.is (x)) {
                      return putPrimaryAttributeDependency (modifyAttributeDependency)
                                                           (x)
                    }

                    if (RequireIncreasable.is (x)) {
                      return putIncreasableDependency (modifyAttributeDependency)
                                                      (modifySkillDependency)
                                                      (modifyActivatableSkillDependency)
                                                      (sourceId)
                                                      (x)
                    }

                    if (
                      RequireActivatable.is (x)
                      && notEquals (RAA.sid (x)) (Just ("GR"))
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
