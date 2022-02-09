import { notEquals } from "../../../Data/Eq"
import { flip, ident, join, thrush } from "../../../Data/Function"
import { over } from "../../../Data/Lens"
import { consF, foldr, isList, sdelete } from "../../../Data/List"
import { elemF, isNothing, Just, Nothing } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { Category } from "../../Constants/Categories"
import { DependencyObject } from "../../Models/ActiveEntries/DependencyObject"
import { HeroModel, HeroModelL, HeroModelRecord } from "../../Models/Hero/HeroModel"
import { ActivatableDependency, ExtendedSkillDependency, SkillDependency } from "../../Models/Hero/heroTypeHelpers"
import { SkillOptionalDependency } from "../../Models/Hero/SkillOptionalDependency"
import { RequireActivatable } from "../../Models/Wiki/prerequisites/ActivatableRequirement"
import { RequireIncreasable } from "../../Models/Wiki/prerequisites/IncreasableRequirement"
import { PrimaryAttributeType, RequirePrimaryAttribute } from "../../Models/Wiki/prerequisites/PrimaryAttributeRequirement"
import { SocialPrerequisite } from "../../Models/Wiki/prerequisites/SocialPrerequisite"
import { AllRequirements } from "../../Models/Wiki/wikiTypeHelpers"
import { getCategoryById } from "../IDUtils"
import { pipe } from "../pipe"
import { addActivatableDependency, addActivatableSkillDependency, addAttributeDependency, addSkillDependency } from "./addDependencyUtils"
import { removeActivatableDependency, removeActivatableSkillDependency, removeAttributeDependency, removeSkillDependency } from "./removeDependencyUtils"

const HL = HeroModelL
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
    const id = RAA.id (req)
    const sid = RAA.sid (req)
    const sid2 = RAA.sid2 (req)
    const level = RAA.tier (req)

    if (isList (id)) {
      if (isNothing (sid) && isNothing (sid2) && isNothing (level)) {
        return flip (foldr (f (DependencyObject ({
                                                  origin: Just (sourceId),
                                                  active: Just (RAA.active (req)),
                                                }))))
                    (id)
      }

      return flip (foldr (f (DependencyObject ({
                                                origin: Just (sourceId),
                                                active:
                                                  isList (sid)
                                                  ? Just (RAA.active (req))
                                                  : Nothing,
                                                sid,
                                                sid2,
                                                tier: level,
                                              }))))
                  (id)
    }

    // current_id is no list:

    if (isNothing (sid) && isNothing (sid2) && isNothing (level)) {
      return f (RAA.active (req)) (id)
    }

    return f (DependencyObject ({
                                 active:
                                   isList (sid)
                                   ? Just (RAA.active (req))
                                   : Nothing,
                                 sid,
                                 sid2,
                                 tier: level,
                               }))
             (id)
  }

const getMatchingIncreasableModifier =
  (f: ModifyAttributeDependency) =>
  (g: ModifySkillDependency) =>
  (h: ModifyActivatableSkillDependency) =>
  (id: string): ModifySkillDependency => {
    const isOfCategory = elemF (getCategoryById (id))

    if (isOfCategory (Category.ATTRIBUTES)) {
      return f
    }

    if (isOfCategory (Category.LITURGICAL_CHANTS) || isOfCategory (Category.SPELLS)) {
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

const modifySocialDependency: (isToAdd: boolean) =>
                              (prerequisite: Record<SocialPrerequisite>) =>
                              (hero: Record<HeroModel>) => Record<HeroModel> =
  isToAdd => x => over (HL.socialStatusDependencies)
                       ((isToAdd ? consF : sdelete) (SocialPrerequisite.A.value (x)))

const modifyPrimaryAttributeDependency = (
  isToAdd: boolean,
  sourceId: string,
  d: Record<RequirePrimaryAttribute>,
  state: HeroModelRecord
) =>
    over (RPAA.type (d) === PrimaryAttributeType.Blessed
           ? HL.blessedPrimaryAttributeDependencies
           : HL.magicalPrimaryAttributeDependencies)
         (isToAdd
           ? old_ds => old_ds.append ({ sourceIdentifier: sourceId, minValue: RPAA.value (d) })
           : old_ds => {
             const index = old_ds.findIndex (
               ({ sourceIdentifier, minValue }) =>
                 sourceIdentifier === sourceId && minValue === RPAA.value (d)
             )

             return old_ds.deleteAt (index)
           })
         (state)

const modifyDependencies =
  (isToAdd: boolean) =>
  (modifyAttributeDependency: ModifyAttributeDependency) =>
  (modifySkillDependency: ModifySkillDependency) =>
  (modifyActivatableSkillDependency: ModifyActivatableSkillDependency) =>
  (modifyActivatableDependency: ModifyActivatableDependency) =>
  (sourceId: string) =>
    flip (foldr ((x: AllRequirements): ident<Record<HeroModel>> => {
                  if (RequirePrimaryAttribute.is (x)) {
                    return state => modifyPrimaryAttributeDependency (isToAdd, sourceId, x, state)
                  }
                  else if (RequireIncreasable.is (x)) {
                    return putIncreasableDependency (modifyAttributeDependency)
                                                    (modifySkillDependency)
                                                    (modifyActivatableSkillDependency)
                                                    (sourceId)
                                                    (x)
                  }
                  else if (
                    RequireActivatable.is (x)
                    && notEquals (RAA.sid (x)) (Just ("GR"))
                  ) {
                    return putActivatableDependency (modifyActivatableDependency)
                                                    (sourceId)
                                                    (x)
                  }
                  else if (SocialPrerequisite.is (x)) {
                    return modifySocialDependency (isToAdd) (x)
                  }
                  else {
                    return ident
                  }
                }))

/**
 * Adds dependencies to all required entries to ensure rule validity.
 */
export const addDependencies = modifyDependencies (true)
                                                  (addAttributeDependency)
                                                  (addSkillDependency)
                                                  (addActivatableSkillDependency)
                                                  (addActivatableDependency)

/**
 * Removes dependencies from all required entries to ensure rule validity.
 */
export const removeDependencies = modifyDependencies (false)
                                                     (removeAttributeDependency)
                                                     (removeSkillDependency)
                                                     (removeActivatableSkillDependency)
                                                     (removeActivatableDependency)
