import R from 'ramda';
import { Categories } from '../constants/Categories';
import * as Data from '../types/data';
import * as Wiki from '../types/wiki';
import { getSkillCheckValues } from './AttributeUtils';
import { Just, List, Maybe, OrderedMap, Record } from './dataUtils';
import { flattenDependencies } from './flattenDependencies';
import { getNumericBlessedTraditionIdByInstanceId } from './IDUtils';
import { getActiveSelections } from './selectionUtils';
import { getExceptionalSkillBonus } from './skillUtils';

const unavailableBlessingsByTradition = OrderedMap.of([
  ['SA_694', List.of('BLESSING_1', 'BLESSING_5', 'BLESSING_12')],
  ['SA_695', List.of('BLESSING_4', 'BLESSING_11', 'BLESSING_12')],
  ['SA_696', List.of('BLESSING_3', 'BLESSING_6', 'BLESSING_7')],
  ['SA_697', List.of('BLESSING_2', 'BLESSING_8', 'BLESSING_10')],
  ['SA_698', List.of('BLESSING_2', 'BLESSING_3', 'BLESSING_9')],
]);

const getUnavailableBlessingsForTradition = (traditionId: string): List<string> =>
  unavailableBlessingsByTradition.findWithDefault(List.of(), traditionId);

export const isOwnTradition = (
  tradition: Record<Wiki.SpecialAbility>,
  obj: Record<Wiki.LiturgicalChant> | Record<Wiki.Blessing>,
): boolean => {
  const isBaseTradition = obj.get('tradition').any(e => {
    const numericId = tradition.lookup('id')
      .bind(getNumericBlessedTraditionIdByInstanceId);

    return e === 1 || Maybe.return(e).equals(numericId.fmap(R.inc));
  });

  const isLiturgicalChant =
    obj.get('category') === Categories.LITURGIES;

  const blessings = Maybe.fromJust(
    tradition.lookup('id').fmap(getUnavailableBlessingsForTradition)
  );

  const isSpecial = isLiturgicalChant
    || !blessings.elem(obj.get('id'));

  return isBaseTradition && isSpecial;
};

export const isIncreasable = (
  tradition: Record<Wiki.SpecialAbility>,
  wikiEntry: Record<Wiki.LiturgicalChant>,
  instance: Record<Data.ActivatableSkillDependent>,
  startEL: Record<Wiki.ExperienceLevel>,
  phase: number,
  attributes: OrderedMap<string, Record<Data.AttributeDependent>>,
  exceptionalSkill: Maybe<Record<Data.ActivatableDependent>>,
  aspectKnowledge: Maybe<Record<Data.ActivatableDependent>>,
): boolean => {
  const bonus = getExceptionalSkillBonus(wikiEntry.lookup('id'), exceptionalSkill);

  const hasAspectKnowledgeRestriction = getActiveSelections(aspectKnowledge)
    .fmap(aspects => {
      const hasActiveAspect = aspects.any(e => wikiEntry.get('aspects').elem(e as number));
      const noNamelessTradition = tradition.get('id') !== 'SA_693';

      return !hasActiveAspect && noNamelessTradition;
    });

  const maxList = List.of(
    getSkillCheckValues(attributes)(wikiEntry.get('check')).maximum() + 2
  );

  const getAdditionalMax = R.pipe(
    (list: typeof maxList) => phase < 3
      ? list.append(startEL.get('maxSkillRating'))
      : list,
    (list: typeof maxList) => hasAspectKnowledgeRestriction.equals(Just(true))
      ? list.append(14)
      : list
  );

  const max = getAdditionalMax(maxList).minimum();

  return instance.get('value') < max + bonus;
};

export const getAspectCounter = (
  wiki: OrderedMap<string, Record<Wiki.LiturgicalChant>>,
  state: OrderedMap<string, Record<Data.ActivatableSkillDependent>>
) =>
  state.filter(e => e.get('value') >= 10)
    .foldl(
      acc => instance => Maybe.maybe(
        acc,
        wikiEntry =>
          wikiEntry.get('aspects').foldl(
            acc1 => acc1.alter(existing => Just(Maybe.fromMaybe(0, existing) + 1)),
            acc
          ),
        wiki.lookup(instance.get('id'))
      ),
      OrderedMap.empty<number, number>(),
    );

export const isDecreasable = (
  wiki: Record<Wiki.WikiAll>,
  state: Record<Data.HeroDependent>,
  wikiEntry: Record<Wiki.LiturgicalChant>,
  instance: Record<Data.ActivatableSkillDependent>,
  liturgicalChants: OrderedMap<string, Record<Data.ActivatableSkillDependent>>,
  aspectKnowledge: Maybe<Record<Data.ActivatableDependent>>,
): boolean => {
  const dependencies = flattenDependencies<number | boolean>(
    wiki,
    state,
    instance.get('dependencies'),
  );

  // Basic validation
  const valid = instance.get('value') < 1
    ? dependencies.notElem(true)
    : instance.get('value') > Math.max(0, ...dependencies.filter(isNumber));

  return Maybe.fromMaybe(
    valid,
    getActiveSelections(aspectKnowledge)
      // Check if liturgical chant is part of dependencies of active Aspect Knowledge
      .bind(Maybe.ensure(
        activeAspects => activeAspects.any(
          e => isNumber(e) && wikiEntry.get('aspects').elem(e)
        )
      ))
      .fmap(
        activeAspects => {
          const counter = getAspectCounter(wiki.get('liturgicalChants'), liturgicalChants);

          const countedLowestWithProperty = wikiEntry.get('aspects').foldl(
            n => aspect => {
              const counted = counter.lookup(aspect);

              if (Maybe.isJust(counted) && activeAspects.elem(aspect)) {
                return Math.min(Maybe.fromJust(counted), n);
              }

              return n;
            },
            4
          );

          return (instance.get('value') !== 10 || countedLowestWithProperty > 3) && valid;
        }
      )
  );
};

// Keys are aspects and their value is the respective tradition
const traditionsByAspect = OrderedMap.of([
  [1, 1],
  [2, 2],
  [3, 2],
  [4, 3],
  [5, 3],
  [6, 4],
  [7, 4],
  [8, 5],
  [9, 5],
  [10, 6],
  [11, 6],
  [12, 7],
  [13, 7],
  [14, 8],
  [15, 8],
  [16, 9],
  [17, 9],
  [18, 10],
  [19, 10],
  [20, 11],
  [21, 11],
  [22, 12],
  [23, 12],
  [24, 13],
  [25, 13],
  [26, 15],
  [27, 15],
  [28, 16],
  [29, 16],
  [30, 17],
  [31, 17],
  [32, 18],
  [33, 18],
  [34, 19],
  [35, 19],
]);

/**
 * Returns the tradition id used by chants. To get the tradition SId for the
 * actual special ability, you have to decrease the return value by 1.
 * @param aspectId The id used for chants or Aspect Knowledge.
 */
export const getTraditionOfAspect = (aspectId: number): number =>
  traditionsByAspect.findWithDefault(1, aspectId);

// Keys are traditions and their values are their respective aspects
const aspectsByTradition = OrderedMap.of([
  [1, []],
  [2, [2, 3]],
  [3, [4, 5]],
  [4, [6, 7]],
  [5, [8, 9]],
  [6, [10, 11]],
  [7, [12, 13]],
  [8, [14, 15]],
  [9, [16, 17]],
  [10, [18, 19]],
  [11, [20, 21]],
  [12, [22, 23]],
  [13, [24, 25]],
  [14, []],
  [15, [26, 27]],
  [16, [28, 29]],
  [17, [30, 31]],
  [18, [32, 33]],
  [19, [34, 35]],
]);

/**
 * Return the aspect ids used for chants and Aspect Knowledge.
 * @param traditionId The id used by chants. If you only have the SId from the
 * actual special ability, you have to increase the value by 1 before passing
 * it.
 */
export const getAspectsOfTradition = (traditionId: number): number[] =>
  [1, ...aspectsByTradition.findWithDefault([], traditionId)];
