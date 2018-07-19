import R from 'ramda';
import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki.d';
import { getSkillCheckValues } from './AttributeUtils';
import { Just, List, Maybe, Nothing, OrderedMap, Record, StringKeyObject, Tuple } from './dataUtils';
import { flattenDependencies } from './flattenDependencies';
import { isActive } from './isActive';

export const getExceptionalSkillBonus = (
  id: Maybe<string>,
  exceptionalSkill: Maybe<Record<Data.ActivatableDependent>>,
) => Maybe.maybe(
  0,
  e => e.get('active')
    .filter(active => active.lookup('sid').equals(id))
    .length(),
  exceptionalSkill
);

export const isIncreasable = (
  wikiEntry: Record<Wiki.Skill>,
  instance: Record<Data.ActivatableSkillDependent>,
  startEL: Record<Wiki.ExperienceLevel>,
  phase: number,
  attributes: OrderedMap<string, Record<Data.AttributeDependent>>,
  exceptionalSkill: Maybe<Record<Data.ActivatableDependent>>,
): boolean => {
  const bonus = getExceptionalSkillBonus(wikiEntry.lookup('id'), exceptionalSkill);

  const maxList = List.of(
    getSkillCheckValues(attributes)(wikiEntry.get('check')).maximum() + 2
  );

  const getAdditionalMax = R.pipe(
    (list: typeof maxList) => phase < 3
      ? list.append(startEL.get('maxSkillRating'))
      : list
  );

  const max = getAdditionalMax(maxList).minimum();

  return instance.get('value') < max + bonus;
};

export const isDecreasable = (
  wiki: Record<Wiki.WikiAll>,
  state: Record<Data.HeroDependent>,
  instance: Record<Data.ActivatableSkillDependent>,
): boolean => {
  const dependencies = flattenDependencies<number | boolean>(
    wiki,
    state,
    instance.get('dependencies'),
  );

  /**
   * Craft Instruments
   * => sum of Woodworking and Metalworking must be at least 12.
   */
  if (
    ['TAL_51', 'TAL_55'].includes(instance.get('id'))
    && isActive(state.get('specialAbilities').lookup('SA_17'))
  ) {
    const woodworkingRating = Maybe.fromMaybe(
      0,
      state.get('skills').lookup('TAL_51').map(e => e.get('value'))
    );

    const metalworkingRating = Maybe.fromMaybe(
      0,
      state.get('skills').lookup('TAL_55').map(e => e.get('value'))
    );

    if (woodworkingRating + metalworkingRating < 12) {
      return false;
    }
  }

  // Basic validation
  return instance.get('value') > Math.max(0, ...dependencies.filter(isNumber));
};

export enum CommonVisualIds {
  Common = 'TYP',
  Uncommon = 'UNTYP'
}

export const isCommon = (
  rating: StringKeyObject<string>,
  obj: Record<Wiki.Skill>
): boolean =>
  rating[obj.get('id')] === CommonVisualIds.Common;

export const isUntyp = (
  rating: StringKeyObject<string>,
  obj: Record<Wiki.Skill>
): boolean =>
  rating[obj.get('id')] === CommonVisualIds.Uncommon;

export const getRoutineValue = (
  sr: number,
  checkAttributeValues: List<number>
): (Maybe<Tuple<number, boolean>>) => {
  if (sr > 0 ) {
    const tooLessAttributePoints = checkAttributeValues.map(e => e < 13 ? 13 - e : 0).sum();
    const flatRoutineLevel = Math.floor((sr - 1) / 3);
    const checkModThreshold = flatRoutineLevel * -1 + 3;
    const dependentCheckMod = checkModThreshold + tooLessAttributePoints;

    return dependentCheckMod < 4
      ? Just(Tuple.of(dependentCheckMod, tooLessAttributePoints > 0))
      : Nothing();
  }

  return Nothing();
}
