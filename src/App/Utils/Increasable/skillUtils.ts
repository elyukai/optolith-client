import { pipe } from "ramda";
import { cnst, ident } from "../../../Data/Function";
import { consF, countWith, foldr, List, maximum, maximumNonNegative, minimum } from "../../../Data/List";
import { elem, fmap, Just, maybe, Maybe, Nothing, sum } from "../../../Data/Maybe";
import { lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { } from "../../../Data/OrderedSet";
import { fromBoth, Pair } from "../../../Data/Pair";
import { Record } from "../../../Data/Record";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject";
import { AttributeDependent } from "../../Models/ActiveEntries/AttributeDependent";
import { SkillDependent } from "../../Models/ActiveEntries/SkillDependent";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { EntryRating } from "../../Models/Hero/heroTypeHelpers";
import { SkillCombined, SkillCombinedAccessors } from "../../Models/View/SkillCombined";
import { ExperienceLevel } from "../../Models/Wiki/ExperienceLevel";
import { Skill } from "../../Models/Wiki/Skill";
import { WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { isMaybeActive } from "../A/Activatable/isActive";
import { flattenDependencies } from "../Dependencies/flattenDependencies";
import { ifElse } from "../ifElse";
import { add } from "../mathUtils";
import { getSkillCheckValues } from "./attributeUtils";

const { specialAbilities, skills } = HeroModel.A
const { active } = ActivatableDependent.A
const { sid } = ActiveObject.A
const { id, value, dependencies, wikiEntry } = SkillCombinedAccessors
const { maxSkillRating } = ExperienceLevel.A

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
      Skill.A.check,
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
    ifElse<List<number>, List<number>>
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
                     (wikiEntry (skill))

    return value (skill) < max + bonus
  }

/**
 * Returns if the passed skill's skill rating can be decreased.
 */
export const isSkillDecreasable =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (skill: Record<SkillCombined>): boolean => {
    /**
     * Craft Instruments
     * => sum of Woodworking and Metalworking must be at least 12.
     */
    if (
      ["TAL_51", "TAL_55"].includes (id (skill))
      && isMaybeActive (lookupF (specialAbilities (state)) ("SA_17"))
    ) {
      const woodworkingRating =
        sum (fmap (SkillDependent.A.value) (lookupF (skills (state)) ("TAL_51")))

      const metalworkingRating =
        sum (fmap (SkillDependent.A.value) (lookupF (skills (state)) ("TAL_55")))

      if (woodworkingRating + metalworkingRating < 12) {
        return false
      }
    }

    const flattenedDependencies =
      flattenDependencies<number> (wiki) (state) (dependencies (skill))

    // Basic validation
    return value (skill) > maximumNonNegative (flattenedDependencies)
  }

export const isCommon =
  (rating: OrderedMap<string, EntryRating>) =>
    pipe (Skill.A.id, lookupF (rating), elem (EntryRating.Common))

export const isUncommon =
  (rating: OrderedMap<string, EntryRating>) =>
    pipe (Skill.A.id, lookupF (rating), elem (EntryRating.Uncommon))

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
        ? Just (fromBoth<number, boolean> (dependentCheckMod) (tooLessAttributePoints > 0))
        : Nothing
    }

    return Nothing
  }
