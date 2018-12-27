import { pipe } from 'ramda';
import * as Data from '../types/data';
import * as Wiki from '../types/wiki';
import { isActive } from './activatable/isActive';
import { ActivatableDependentG, ActiveObjectG } from './activeEntries/activatableDependent';
import { getSkillCheckValues } from './AttributeUtils';
import { flattenDependencies } from './dependencies/flattenDependencies';
import { equals } from './structures/Eq';
import { filter, length, List } from './structures/List';
import { Just, Maybe, maybe, Nothing } from './structures/Maybe';
import { OrderedMap } from './structures/OrderedMap';
import { Record } from './structures/Record';
import { isNumber } from './typeCheckUtils';
import { SkillCombined } from './viewData/viewTypeHelpers';

const { active } = ActivatableDependentG
const { sid } = ActiveObjectG

/**
 * `getExceptionalSkillBonus skillId exceptionalSkillStateEntry`
 * @param skillId The skill's id.
 * @param exceptionalSkill The state entry of Exceptional Skill.
 */
export const getExceptionalSkillBonus =
  (skillId: Maybe<string>) =>
    maybe<Record<Data.ActivatableDependent>, number>
      (0)
      (pipe (active, filter (pipe (sid, equals<Maybe<string | number>> (skillId))), length))

export const isIncreasable =
  (skill: Record<SkillCombined>) =>
  (startEL: Record<Wiki.ExperienceLevel>) =>
  (phase: number) =>
  (attributes: OrderedMap<string, Record<Data.AttributeDependent>>) =>
  (exceptionalSkill: Maybe<Record<Data.ActivatableDependent>>): boolean => {
    const bonus = getExceptionalSkillBonus (id (skill)) (exceptionalSkill)

    const maxList = List.of (
      getSkillCheckValues (attributes) (skill .get ('check')) .cons (8) .maximum () + 2
    )

    const getAdditionalMax = pipe (
      (list: typeof maxList) => phase < 3
        ? list .cons (startEL .get ('maxSkillRating'))
        : list
    )

    const max = getAdditionalMax (maxList) .minimum ()

    return skill .get ('value') < max + bonus
  }

export const isDecreasable = (
  wiki: Record<Wiki.WikiAll>,
  state: Record<Data.HeroDependent>,
  skill: Record<SkillCombined>
): boolean => {
  const dependencies = flattenDependencies<number | boolean> (
    wiki,
    state,
    skill .get ('dependencies')
  )

  /**
   * Craft Instruments
   * => sum of Woodworking and Metalworking must be at least 12.
   */
  if (
    ['TAL_51', 'TAL_55'].includes (skill .get ('id'))
    && isActive (state.get ('specialAbilities').lookup ('SA_17'))
  ) {
    const woodworkingRating = Maybe.fromMaybe (0) (
      state.get ('skills').lookup ('TAL_51').fmap (e => e.get ('value'))
    )

    const metalworkingRating = Maybe.fromMaybe (0) (
      state.get ('skills').lookup ('TAL_55').fmap (e => e.get ('value'))
    )

    if (woodworkingRating + metalworkingRating < 12) {
      return false
    }
  }

  // Basic validation
  return skill .get ('value') > Math.max (0, ...dependencies.filter (isNumber))
}

export const isCommon = (rating: OrderedMap<string, Data.EntryRating>) =>
  (obj: Record<Wiki.Skill>): boolean =>
    Maybe.elem (Data.EntryRating.Common) (rating .lookup (obj.get ('id')))

export const isUncommon = (rating: OrderedMap<string, Data.EntryRating>) =>
  (obj: Record<Wiki.Skill>): boolean =>
    Maybe.elem (Data.EntryRating.Uncommon) (rating .lookup (obj.get ('id')))

export const getRoutineValue = (
  sr: number,
  checkAttributeValues: List<number>
): (Maybe<Tuple<number, boolean>>) => {
  if (sr > 0) {
    const tooLessAttributePoints = checkAttributeValues.map (e => e < 13 ? 13 - e : 0).sum ()
    const flatRoutineLevel = Math.floor ((sr - 1) / 3)
    const checkModThreshold = flatRoutineLevel * -1 + 3
    const dependentCheckMod = checkModThreshold + tooLessAttributePoints

    return dependentCheckMod < 4
      ? Just (Tuple.of<number, boolean> (dependentCheckMod) (tooLessAttributePoints > 0))
      : Nothing ()
  }

  return Nothing ()
}
