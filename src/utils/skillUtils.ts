import * as R from 'ramda';
import * as Data from '../types/data';
import { SkillCombined } from '../types/view';
import * as Wiki from '../types/wiki';
import { getSkillCheckValues } from './AttributeUtils';
import { Just, List, Maybe, Nothing, OrderedMap, Record, Tuple } from './dataUtils';
import { flattenDependencies } from './flattenDependencies';
import { isActive } from './isActive';
import { isNumber } from './typeCheckUtils';

/**
 * `getExceptionalSkillBonus skillId exceptionalSkillStateEntry`
 * @param skillId The skill's id.
 * @param exceptionalSkill The state entry of Exceptional Skill.
 */
export const getExceptionalSkillBonus = (skillId: Maybe<string>) =>
  Maybe.maybe<Record<Data.ActivatableDependent>, number> (0) (
    e => e.get ('active')
      .filter (active => active.lookup ('sid').equals (skillId))
      .length ()
  );

export const isIncreasable = (
  skill: Record<SkillCombined>,
  startEL: Record<Wiki.ExperienceLevel>,
  phase: number,
  attributes: OrderedMap<string, Record<Data.AttributeDependent>>,
  exceptionalSkill: Maybe<Record<Data.ActivatableDependent>>
): boolean => {
  const bonus = getExceptionalSkillBonus (skill .lookup ('id')) (exceptionalSkill);

  const maxList = List.of (
    getSkillCheckValues (attributes) (skill .get ('check')) .maximum () + 2
  );

  const getAdditionalMax = R.pipe (
    (list: typeof maxList) => phase < 3
      ? list.append (startEL .get ('maxSkillRating'))
      : list
  );

  const max = getAdditionalMax (maxList) .minimum ();

  return skill .get ('value') < max + bonus;
};

export const isDecreasable = (
  wiki: Record<Wiki.WikiAll>,
  state: Record<Data.HeroDependent>,
  skill: Record<SkillCombined>
): boolean => {
  const dependencies = flattenDependencies<number | boolean> (
    wiki,
    state,
    skill .get ('dependencies')
  );

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
    );

    const metalworkingRating = Maybe.fromMaybe (0) (
      state.get ('skills').lookup ('TAL_55').fmap (e => e.get ('value'))
    );

    if (woodworkingRating + metalworkingRating < 12) {
      return false;
    }
  }

  // Basic validation
  return skill .get ('value') > Math.max (0, ...dependencies.filter (isNumber));
};

export const isCommon = (rating: OrderedMap<string, Data.EntryRating>) =>
  (obj: Record<Wiki.Skill>): boolean =>
    Maybe.elem (Data.EntryRating.Common) (rating .lookup (obj.get ('id')));

export const isUncommon = (rating: OrderedMap<string, Data.EntryRating>) =>
  (obj: Record<Wiki.Skill>): boolean =>
    Maybe.elem (Data.EntryRating.Uncommon) (rating .lookup (obj.get ('id')));

export const getRoutineValue = (
  sr: number,
  checkAttributeValues: List<number>
): (Maybe<Tuple<number, boolean>>) => {
  if (sr > 0) {
    const tooLessAttributePoints = checkAttributeValues.map (e => e < 13 ? 13 - e : 0).sum ();
    const flatRoutineLevel = Math.floor ((sr - 1) / 3);
    const checkModThreshold = flatRoutineLevel * -1 + 3;
    const dependentCheckMod = checkModThreshold + tooLessAttributePoints;

    return dependentCheckMod < 4
      ? Just (Tuple.of<number, boolean> (dependentCheckMod) (tooLessAttributePoints > 0))
      : Nothing ();
  }

  return Nothing ();
}
