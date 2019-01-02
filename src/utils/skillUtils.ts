import { pipe } from 'ramda';
import * as Data from '../types/data';
import { isMaybeActive } from './activatable/isActive';
import { ActivatableDependent, ActivatableDependentG, ActiveObjectA } from './activeEntries/ActivatableDependent';
import { AttributeDependent } from './activeEntries/AttributeDependent';
import { SkillDependentG } from './activeEntries/SkillDependent';
import { getSkillCheckValues } from './AttributeUtils';
import { flattenDependencies } from './dependencies/flattenDependencies';
import { HeroModelA, HeroModelRecord } from './heroData/HeroModel';
import { ifElse } from './ifElse';
import { add } from './mathUtils';
import { cnst, ident } from './structures/Function';
import { consF, countWith, foldr, List, maximum, maximumNonNegative, minimum } from './structures/List';
import { elem, fmap, Just, Maybe, maybe, Nothing, sum } from './structures/Maybe';
import { lookup_, OrderedMap } from './structures/OrderedMap';
import { fromBoth, Pair } from './structures/Pair';
import { Record } from './structures/Record';
import { SkillCombined, SkillCombinedAccessors } from './viewData/SkillCombined';
import { ExperienceLevel, ExperienceLevelG } from './wikiData/ExperienceLevel';
import { SkillG } from './wikiData/Skill';
import { WikiModelRecord } from './wikiData/WikiModel';

const { specialAbilities, skills } = HeroModelA
const { active } = ActivatableDependentG
const { sid } = ActiveObjectA
const { id, value, dependencies, wikiEntry } = SkillCombinedAccessors
const { maxSkillRating } = ExperienceLevelG

/**
 * `getExceptionalSkillBonus skillId exceptionalSkillStateEntry`
 * @param skillId The skill's id.
 * @param exceptionalSkill The state entry of Exceptional Skill.
 */
export const getExceptionalSkillBonus =
  (skillId: string) =>
    maybe<Record<ActivatableDependent>, number>
      (0)
      (pipe (active, countWith (pipe (sid, elem<string | number> (skillId)))))

/**
 * Creates the base for a list for calculating the maximum of a skill based on
 * the skill check's atrributes' values.
 */
export const getInitialMaximumList =
  (attributes: OrderedMap<string, Record<AttributeDependent>>) =>
    pipe (
      SkillG.check,
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
      ['TAL_51', 'TAL_55'].includes (id (skill))
      && isMaybeActive (lookup_ (specialAbilities (state)) ('SA_17'))
    ) {
      const woodworkingRating =
        sum (fmap (SkillDependentG.value) (lookup_ (skills (state)) ('TAL_51')))

      const metalworkingRating =
        sum (fmap (SkillDependentG.value) (lookup_ (skills (state)) ('TAL_55')))

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
  (rating: OrderedMap<string, Data.EntryRating>) =>
    pipe (SkillG.id, lookup_ (rating), elem (Data.EntryRating.Common))

export const isUncommon =
  (rating: OrderedMap<string, Data.EntryRating>) =>
    pipe (SkillG.id, lookup_ (rating), elem (Data.EntryRating.Uncommon))

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
