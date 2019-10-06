import { cnst, ident } from "../../../Data/Function";
import { fmap } from "../../../Data/Functor";
import { consF, countWith, foldr, List, maximum, maximumNonNegative, minimum } from "../../../Data/List";
import { elem, Just, maybe, Maybe, Nothing, sum } from "../../../Data/Maybe";
import { add } from "../../../Data/Num";
import { lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { } from "../../../Data/OrderedSet";
import { Record } from "../../../Data/Record";
import { Pair } from "../../../Data/Tuple";
import { SkillId, SpecialAbilityId } from "../../Constants/Ids";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject";
import { AttributeDependent } from "../../Models/ActiveEntries/AttributeDependent";
import { SkillDependent } from "../../Models/ActiveEntries/SkillDependent";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { EntryRating } from "../../Models/Hero/heroTypeHelpers";
import { SkillCombined, SkillCombinedA_ } from "../../Models/View/SkillCombined";
import { ExperienceLevel } from "../../Models/Wiki/ExperienceLevel";
import { Skill } from "../../Models/Wiki/Skill";
import { WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { isMaybeActive } from "../Activatable/isActive";
import { flattenDependencies } from "../Dependencies/flattenDependencies";
import { ifElse } from "../ifElse";
import { pipe } from "../pipe";
import { getSkillCheckValues } from "./attributeUtils";

const { specialAbilities, skills } = HeroModel.AL
const { active } = ActivatableDependent.AL
const { sid } = ActiveObject.AL
const SCA = SkillCombined.A
const { id, value, dependencies } = SkillCombinedA_
const { maxSkillRating } = ExperienceLevel.AL

/**
 * `getExceptionalSkillBonus skillId exceptionalSkillStateEntry`
 * @param skillId The skill's id.
 * @param exceptionalSkill The state entry of Exceptional Skill.
 */
export const getExceptionalSkillBonus =
  (skillId: string) =>
    maybe
      (0)
      (pipe (active, countWith (pipe (sid, elem<string | number> (skillId)))))

/**
 * Creates the base for a list for calculating the maximum of a skill based on
 * the skill check's atrributes' values.
 */
export const getInitialMaximumList =
  (attributes: OrderedMap<string, Record<AttributeDependent>>) =>
    pipe (
      Skill.AL.check,
      getSkillCheckValues (attributes),
      consF (8),
      maximum,
      add (2),
      List.pure
    )

/**
 * Adds the maximum skill rating defined by the chosen experience level to the
 * list created by `getInitialMaximumList` if the hero is in character creation
 * phase.
 */
export const putMaximumSkillRatingFromExperienceLevel =
  (startEL: Record<ExperienceLevel>) =>
  (phase: number) =>
    ifElse<List<number>>
      (cnst (phase < 3))
      (consF (maxSkillRating (startEL)))
      (ident)

/**
 * Returns if the passed skill's skill rating can be increased.
 */
export const isSkillIncreasable =
  (startEL: Record<ExperienceLevel>) =>
  (phase: number) =>
  (attributes: OrderedMap<string, Record<AttributeDependent>>) =>
  (exceptionalSkill: Maybe<Record<ActivatableDependent>>) =>
  (skill: Record<SkillCombined>): boolean => {
    const bonus = getExceptionalSkillBonus (id (skill)) (exceptionalSkill)

    const max = pipe (
                       getInitialMaximumList (attributes),
                       putMaximumSkillRatingFromExperienceLevel (startEL) (phase),
                       minimum
                     )
                     (SCA.wikiEntry (skill))

    return value (skill) < max + bonus
  }

/**
 * Returns if the passed skill's skill rating can be decreased.
 */
export const isSkillDecreasable =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (skill: Record<SkillCombined>): boolean => {
    if (
      (SkillId.Woodworking === id (skill) || SkillId.Metalworking === id (skill))
      && isMaybeActive (lookupF (specialAbilities (state)) (SpecialAbilityId.CraftInstruments))
    ) {
      const woodworkingRating =
        sum (fmap (SkillDependent.AL.value) (lookupF (skills (state)) (SkillId.Woodworking)))

      const metalworkingRating =
        sum (fmap (SkillDependent.AL.value) (lookupF (skills (state)) (SkillId.Metalworking)))

      const MINIMUM_SUM = 12

      // Sum of Woodworking and Metalworking must be at least 12.
      if (woodworkingRating + metalworkingRating < MINIMUM_SUM) {
        return false
      }
    }

    const flattenedDependencies =
      flattenDependencies (wiki) (state) (dependencies (skill))

    // Basic validation
    return value (skill) > maximumNonNegative (flattenedDependencies)
  }

export const isCommon =
  (rating: OrderedMap<string, EntryRating>) =>
    pipe (Skill.AL.id, lookupF (rating), elem<EntryRating> (EntryRating.Common))

export const isUncommon =
  (rating: OrderedMap<string, EntryRating>) =>
    pipe (Skill.AL.id, lookupF (rating), elem<EntryRating> (EntryRating.Uncommon))

export const getRoutineValue =
  (checkAttributeValues: List<number>) =>
  (sr: number): (Maybe<Pair<number, boolean>>) => {
    if (sr > 0) {
      const tooLessAttributePoints =
        foldr<number, number> (e => e < 13 ? add (13 - e) : ident) (0) (checkAttributeValues)

      const flatRoutineLevel = Math.floor ((sr - 1) / 3)
      const checkModThreshold = flatRoutineLevel * -1 + 3
      const dependentCheckMod = checkModThreshold + tooLessAttributePoints

      return dependentCheckMod < 4
        ? Just (Pair (dependentCheckMod, tooLessAttributePoints > 0))
        : Nothing
    }

    return Nothing
  }
