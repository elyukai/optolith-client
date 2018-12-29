import { pipe } from 'ramda';
import * as Data from '../types/data';
import { isMaybeActive } from './activatable/isActive';
import { ActivatableDependent, ActivatableDependentG, ActiveObjectG } from './activeEntries/ActivatableDependent';
import { AttributeDependent } from './activeEntries/AttributeDependent';
import { SkillDependentG } from './activeEntries/SkillDependent';
import { getSkillCheckValues } from './AttributeUtils';
import { flattenDependencies } from './dependencies/flattenDependencies';
import { HeroModelG, HeroModelRecord } from './heroData/HeroModel';
import { ifElse } from './ifElse';
import { add } from './mathUtils';
import { cnst, ident } from './structures/Function';
import { cons, cons_, filter, foldr, fromElements, length, List, maximum, minimum } from './structures/List';
import { elem, fmap, Just, Maybe, maybe, Nothing, sum } from './structures/Maybe';
import { lookup_, OrderedMap } from './structures/OrderedMap';
import { fromBoth, Pair } from './structures/Pair';
import { Record } from './structures/Record';
import { isNumber } from './typeCheckUtils';
import { SkillCombined, SkillCombinedG } from './viewData/SkillCombined';
import { ExperienceLevel, ExperienceLevelG } from './wikiData/ExperienceLevel';
import { SkillG } from './wikiData/Skill';
import { WikiModelRecord } from './wikiData/WikiModel';

const { specialAbilities, skills } = HeroModelG
const { active } = ActivatableDependentG
const { sid } = ActiveObjectG
const { id, check, value, dependencies } = SkillCombinedG
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
      (pipe (active, filter (pipe (sid, elem<string | number> (skillId))), length))

export const isIncreasable =
  (startEL: Record<ExperienceLevel>) =>
  (phase: number) =>
  (attributes: OrderedMap<string, Record<AttributeDependent>>) =>
  (exceptionalSkill: Maybe<Record<ActivatableDependent>>) =>
  (skill: Record<SkillCombined>): boolean => {
    const bonus = getExceptionalSkillBonus (id (skill)) (exceptionalSkill)

    const maxList =
      fromElements (maximum (cons (getSkillCheckValues (attributes) (check (skill))) (8)) + 2)

    const getAdditionalMax =
      ifElse<typeof maxList, typeof maxList>
        (cnst (phase < 3))
        (cons_ (maxSkillRating (startEL)))
        (ident)

    const max = minimum (getAdditionalMax (maxList))

    return value (skill) < max + bonus
  }

export const isDecreasable =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (skill: Record<SkillCombined>): boolean => {
    const flattenedDependencies =
      flattenDependencies<number | boolean> (wiki) (state) (dependencies (skill))

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

    // Basic validation
    return value (skill) > Math.max (0, ...filter (isNumber) (flattenedDependencies))
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
