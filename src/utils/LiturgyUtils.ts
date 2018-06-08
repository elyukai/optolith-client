import R from 'ramda';
import { Categories } from '../constants/Categories';
import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki.d';
import { getSkillCheckValues } from './AttributeUtils';
import { getNumericBlessedTraditionIdByInstanceId } from './IDUtils';
import { NumberKeyObject, convertMapToValues, setM } from './collectionUtils';
import { flattenDependencies } from './flattenDependencies';
import { Maybe } from './maybe';
import { getActiveSelections } from './selectionUtils';

const unavailableBlessingsByTradition = new Map([
  ['SA_694', ['BLESSING_1', 'BLESSING_5', 'BLESSING_12']],
  ['SA_695', ['BLESSING_4', 'BLESSING_11', 'BLESSING_12']],
  ['SA_696', ['BLESSING_3', 'BLESSING_6', 'BLESSING_7']],
  ['SA_697', ['BLESSING_2', 'BLESSING_8', 'BLESSING_10']],
  ['SA_698', ['BLESSING_2', 'BLESSING_3', 'BLESSING_9']],
]);

const getUnavailableBlessingsForTradition = (traditionId: string): string[] => {
  return unavailableBlessingsByTradition.get(traditionId) || [];
};

export const isOwnTradition = (
  tradition: Wiki.SpecialAbility,
  obj: Wiki.LiturgicalChant | Wiki.Blessing,
): boolean => {
  const isBaseTradition = obj.tradition.some(e => {
    const numbericId = getNumericBlessedTraditionIdByInstanceId(tradition.id);
    return e === 1 || Maybe.of(e).equals(numbericId.map(e => e + 1));
  });

  const isLiturgicalChant = obj.category === Categories.LITURGIES;
  const blessings = getUnavailableBlessingsForTradition(tradition.id);
  const isSpecial = isLiturgicalChant || !blessings.includes(obj.id);

  return isBaseTradition && isSpecial;
};

export const isIncreasable = (
  tradition: Wiki.SpecialAbility,
  wikiEntry: Wiki.LiturgicalChant,
  instance: Data.ActivatableSkillDependent,
  startEL: Wiki.ExperienceLevel,
  phase: number,
  attributes: ReadonlyMap<string, Data.AttributeDependent>,
  exceptionalSkill: Maybe<Data.ActivatableDependent>,
  aspectKnowledge: Maybe<Data.ActivatableDependent>,
): boolean => {
  let max = 0;
  const bonus =
    exceptionalSkill
      .map(e => e.active.filter(e => e === wikiEntry.id).length)
      .valueOr(0);

  if (phase < 3) {
    max = startEL.maxSkillRating;
  }
  else {
    max = Math.max(...getSkillCheckValues(attributes)(wikiEntry.check)) + 2;
  }

  const aspects = getActiveSelections(aspectKnowledge) as number[];
  const hasActiveAspect = aspects.some(e => wikiEntry.aspects.includes(e));
  const noNamelessTradition = tradition.id !== 'SA_693';

  if (!hasActiveAspect && noNamelessTradition) {
    max = Math.min(14, max);
  }

  return instance.value < max + bonus;
};

export const getAspectCounter = (
  wiki: ReadonlyMap<string, Wiki.LiturgicalChant>,
  state: ReadonlyMap<string, Data.ActivatableSkillDependent>,
) => {
  return convertMapToValues(state).filter(e => e.value >= 10).reduce(
    (acc, instance) => {
      return R.defaultTo(
        acc,
        Maybe.of(wiki.get(instance.id))
          .map(wikiEntry => {
            return wikiEntry.aspects.reduce((acc, aspect) => {
              const existing = R.defaultTo(0, acc.get(aspect));
              return setM(aspect, existing + 1)(acc);
            }, acc);
          })
          .value
      );
    },
    new Map<number, number>() as ReadonlyMap<number, number>,
  );
};

export const isDecreasable = (
  wiki: Wiki.WikiAll,
  state: Data.HeroDependent,
  wikiEntry: Wiki.LiturgicalChant,
  instance: Data.ActivatableSkillDependent,
  liturgicalChants: ReadonlyMap<string, Data.ActivatableSkillDependent>,
  aspectKnowledge: Maybe<Data.ActivatableDependent>,
): boolean => {
  const dependencies = flattenDependencies(
    wiki,
    state,
    instance.dependencies,
  );

  const valid = instance.value < 1
    ? !dependencies.includes(true)
    : instance.value > Math.max(0, ...dependencies.filter(isNumber));

  const activeAspectKnowledges = getActiveSelections(aspectKnowledge);
  const hasActiveAspectKnowledge = activeAspectKnowledges.some(e => {
    return isNumber(e) && wikiEntry.aspects.includes(e);
  });

  if (hasActiveAspectKnowledge) {
    const counter = getAspectCounter(wiki.liturgicalChants, liturgicalChants);

    const countedLowestWithProperty = wikiEntry.aspects.reduce((n, aspect) => {
      const counted = counter.get(aspect);
      if (activeAspectKnowledges.includes(aspect) && isNumber(counted)) {
        return Math.min(counted, n);
      }
      return n;
    }, 4);

    return (instance.value !== 10 || countedLowestWithProperty > 3) && valid;
  }

  return valid;
};

const traditionsByAspect: NumberKeyObject<number> = {
  1: 1,
  2: 2,
  3: 2,
  4: 3,
  5: 3,
  6: 4,
  7: 4,
  8: 5,
  9: 5,
  10: 6,
  11: 6,
  12: 7,
  13: 7,
  14: 8,
  15: 8,
  16: 9,
  17: 9,
  18: 10,
  19: 10,
  20: 11,
  21: 11,
  22: 12,
  23: 12,
  24: 13,
  25: 13,
  26: 15,
  27: 15,
  28: 16,
  29: 16,
  30: 17,
  31: 17,
  32: 18,
  33: 18,
  34: 19,
  35: 19,
};

/**
 * Returns the tradition id used by chants. To get the tradition SId for the
 * actual special ability, you have to decrease the return value by 1.
 * @param aspectId The id used for chants or Aspect Knowledge.
 */
export const getTraditionOfAspect = (aspectId: number): number => {
  return traditionsByAspect[aspectId];
};

const aspectsByTradition: NumberKeyObject<number[]> = {
  1: [],
  2: [2, 3],
  3: [4, 5],
  4: [6, 7],
  5: [8, 9],
  6: [10, 11],
  7: [12, 13],
  8: [14, 15],
  9: [16, 17],
  10: [18, 19],
  11: [20, 21],
  12: [22, 23],
  13: [24, 25],
  14: [],
  15: [26, 27],
  16: [28, 29],
  17: [30, 31],
  18: [32, 33],
  19: [34, 35],
};

/**
 * Return the aspect ids used for chants and Aspect Knowledge.
 * @param traditionId The id used by chants. If you only have the SId from the
 * actual special ability, you have to increase the value by 1 before passing
 * it.
 */
export const getAspectsOfTradition = (traditionId: number): number[] => {
  return [1, ...aspectsByTradition[traditionId]];
};
