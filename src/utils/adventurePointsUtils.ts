import R from 'ramda';
import { AdventurePointsObject } from '../selectors/adventurePointsSelectors';
import * as Data from '../types/data';
import { Skill, WikiAll } from '../types/wiki';
import { getActiveWithNoCustomCost } from './activatableCostUtils';
import { List, Maybe, OrderedMap, Record, Tuple } from './dataUtils';
import { exists } from './exists';
import { getMagicalTraditions } from './traditionUtils';

/**
 * Checks if there are enough AP available.
 * @param cost The AP value you want to check.
 * @param ap The current AP state.
 * @param negativeApValid If the character's AP left can be a negative value
 * (during character creation) or not.
 */
export const areSufficientAPAvailable = (
  cost: number,
  availableAP: number,
  negativeApValid: boolean,
): boolean => {
  if (cost > 0 && negativeApValid === false) {
    return cost <= availableAP;
  }

  return true;
};

/**
 * Returns the maximum AP value you can spend on magical/blessed
 * advantages/disadvantages.
 * @param state The list of dependent instances.
 * @param index The index in the AP array. `0` equals General, `1` equals
 * Magical and `2` equals Blessed.
 */
export const getDisAdvantagesSubtypeMax = (
  state: Data.HeroDependent,
  isMagical: boolean,
): number => {
  if (isMagical) {
    const maybeTradition = getMagicalTraditions(state.specialAbilities).head();
    const semiTraditionIds = ['SA_677', 'SA_678', 'SA_679', 'SA_680'];

    const maybeIsSemiTradition = maybeTradition.fmap(
      traditionActive => semiTraditionIds.includes(traditionActive.get('id'))
    );

    if (maybeIsSemiTradition.equals(Maybe.Just(true))) {
      return 25;
    }
  }

  return 50;
};

export interface SufficientAPAvailableForDisAdvantage {
  readonly totalValid: boolean;
  readonly mainValid: boolean;
  readonly subValid: boolean;
}

const getDisAdvantageSubtypeAPSpent = (
  isMagicalOrBlessed: {
    isBlessed: boolean;
    isMagical: boolean;
  },
  isDisadvantage: boolean,
  adventurePoints: AdventurePointsObject,
): number | undefined => {
  const { isBlessed, isMagical } = isMagicalOrBlessed;

  if (isDisadvantage) {
    if (isMagical) {
      return adventurePoints.spentOnMagicalDisadvantages;
    }
    else if (isBlessed) {
      return adventurePoints.spentOnBlessedDisadvantages;
    }
  }
  else if (isMagical) {
    return adventurePoints.spentOnMagicalAdvantages;
  }
  else if (isBlessed) {
    return adventurePoints.spentOnBlessedAdvantages;
  }

  return;
}

/**
 * Checks if there are enough AP available and if the restrictions for
 * advantages/disadvantages will be met.
 * @param cost The AP value you want to check.
 * @param ap The current AP state.
 * @param state The list of dependent instances.
 * @param isMagicalOrBlessed If the the advantage/disadvantage is magical or
 * blessed.
 * @param isDisadvantage If the entry is a disadvantage.
 * @param isInCharacterCreation If the character's AP left can be a negative
 * value (during character creation) or not.
 */
export const areSufficientAPAvailableForDisAdvantage = (
  cost: number,
  adventurePoints: AdventurePointsObject,
  state: Data.HeroDependent,
  isMagicalOrBlessed: {
    isBlessed: boolean;
    isMagical: boolean;
  },
  isDisadvantage: boolean,
  isInCharacterCreation: boolean,
): SufficientAPAvailableForDisAdvantage => {
  const { isMagical } = isMagicalOrBlessed;

  const currentAPSpent = isDisadvantage
    ? adventurePoints.spentOnDisadvantages
    : adventurePoints.spentOnAdvantages;

  const subCurrentAPSpent = getDisAdvantageSubtypeAPSpent(
    isMagicalOrBlessed,
    isDisadvantage,
    adventurePoints,
  );

  const smallMax = getDisAdvantagesSubtypeMax(state, isMagical);
  const equalizedCost = isDisadvantage ? cost * -1 : cost;

  const subValid = !isInCharacterCreation
    || (exists(subCurrentAPSpent)
      ? subCurrentAPSpent + equalizedCost <= smallMax
      : true);

  const mainValid = !isInCharacterCreation
    || currentAPSpent + equalizedCost <= 80;

  const totalValid = cost <= adventurePoints.available || isInCharacterCreation;

  return { totalValid, mainValid, subValid };
};

const getPrinciplesObligationsDiff = (
  entries: List<Record<Data.ActiveViewObject>>,
  state: OrderedMap<string, Record<Data.ActivatableDependent>>,
  wiki: Record<WikiAll>,
  sourceId: string,
): number => {
  if (entries.any(e => e.get('id') === sourceId)) {
    return Maybe.fromMaybe(
      0,
      state.lookup(sourceId)
        .bind(
          entry => {
            const active = entry.get('active');

            const maxCurrentTier = active.foldl(
              a => b => {
                const tier = b.lookup('tier');

                return Maybe.isJust(tier)
                  && Maybe.fromJust(tier) > a
                  && Maybe.isNothing(b.lookup('cost'))
                    ? Maybe.fromJust(tier)
                    : a;
              },
              0
            );

            // Next lower tier
            const subMaxCurrentTier = active.foldl(
              a => b => {
                const tier = b.lookup('tier');

                return Maybe.isJust(tier)
                  && Maybe.fromJust(tier) > a
                  && Maybe.fromJust(tier) < maxCurrentTier
                  && Maybe.isNothing(b.lookup('cost'))
                    ? Maybe.fromJust(tier)
                    : a;
              },
              0
            );

            const justMaxCurrentTier = Maybe.Just(maxCurrentTier);

            const amountMaxTiers = active.foldl(
              a => b => b.lookup('tier').equals(justMaxCurrentTier) ? a + 1 : a,
              0
            );

            const baseCost = wiki.get('disadvantages')
              .lookup(sourceId)
              .fmap(e => e.get('cost') as number);

            const amountDiff = amountMaxTiers > 1
              ? baseCost.fmap(base => maxCurrentTier * -base)
              : Maybe.Just(0);

            const levelDiff = baseCost.fmap(base => subMaxCurrentTier * -base);

            return amountDiff.bind(
              amount => levelDiff.fmap(level => amount + level)
            );
          },
        )
    );
  }
  else {
    return 0;
  }
}

const getPropertyOrAspectKnowledgeDiff = (
  state: OrderedMap<string, Record<Data.ActivatableDependent>>,
  apArr: List<number>,
): number =>
  Maybe.fromMaybe(
    0,
    state.lookup('SA_72')
      .fmap(entry => {
        const active = entry.get('active');

        const actualAPSum = apArr.ifoldl(
          a => i => b => i + 1 < active.length() ? a + b : a,
          0
        );

        // Sum of displayed AP values for entries (not actual sum)
        const displayedAPSumForAll =
          Maybe.fromMaybe(0, apArr.last()) * (active.length() - 1);

        return actualAPSum - displayedAPSumForAll;
      })
  );

const getPersonalityFlawsDiff = (
  entries: List<Record<Data.ActiveViewObject>>,
  state: OrderedMap<string, Record<Data.ActivatableDependent>>,
  wiki: Record<WikiAll>,
): number => {
  if (entries.any(e => e.get('id') === 'DISADV_33')) {
    return Maybe.fromMaybe(
      0,
      state.lookup('DISADV_33')
        .fmap(
          entry => {
            const active = entry.get('active');

            const numberOfEntriesWithMultiplePossible =
              active.filter(
                e => e.lookup('sid').equals(Maybe.Just(7))
                  && Maybe.isNothing(e.lookup('cost'))
              )
                .length();

            if (numberOfEntriesWithMultiplePossible > 1) {
              return Maybe.fromMaybe(
                0,
                wiki.get('disadvantages').lookup('DISADV_33')
                  .bind(wikiEntry => wikiEntry.lookup('select'))
                  .bind(select => select.find(e => e.get('id') === 7))
                  .bind(selection => selection.lookup('cost'))
                  .fmap(cost => -cost)
              );
            }

            return 0;
          }
        )
    );
  }
  else {
    return 0;
  }
};

const getBadHabitsDiff = (
  entries: List<Record<Data.ActiveViewObject>>,
  state: OrderedMap<string, Record<Data.ActivatableDependent>>,
  wiki: Record<WikiAll>,
): number => {
  if (entries.any(e => e.get('id') === 'DISADV_36')) {
    return Maybe.fromMaybe(
      0,
      state.lookup('DISADV_36')
        .fmap(
          entry => {
            const active = entry.get('active');

            if (getActiveWithNoCustomCost(active).length() > 3) {
              return Maybe.fromMaybe(
                0,
                wiki.get('disadvantages').lookup('DISADV_36')
                  .fmap(wikiEntry => wikiEntry.get('cost'))
                  .bind(Maybe.ensure(isNumber))
                  .fmap(cost => cost * -3)
              );
            }

            return 0;
          }
        )
    );
  }
  else {
    return 0;
  }
};

const getSkillSpecializationsDiff = (
  entries: List<Record<Data.ActiveViewObject>>,
  state: OrderedMap<string, Record<Data.ActivatableDependent>>,
  wiki: Record<WikiAll>,
): number => {
  if (entries.any(e => e.get('id') === 'SA_9')) {
    return Maybe.fromMaybe(
      0,
      state.lookup('SA_9')
        .fmap(
          entry => {
            const active = entry.get('active');

            // Count how many specializations are for the same skill
            const sameSkill = active.foldl<OrderedMap<string, number>>(
              acc => current => {
                const altered = current.lookup('sid')
                  .bind(Maybe.ensure(isString))
                  .fmap(acc.alter(sum => sum.fmap(R.inc).alt(Maybe.Just(1))))

                return Maybe.isJust(altered) ? Maybe.fromJust(altered) : acc;
              },
              OrderedMap.empty()
            );

            // Return the accumulated value, otherwise 0.
            const getFlatSkillDone =
              (accMap: OrderedMap<string, number>, sid: string) =>
                Maybe.fromMaybe(0, accMap.lookup(sid));

            // Calculates the diff for a single skill specialization
            const getSingleDiff = (
              skill: Record<Skill>,
              accMap: OrderedMap<string, number>,
              sid: string,
              counter: number,
            ) =>
              skill.get('ic') * (getFlatSkillDone(accMap, sid) + 1 - counter);

            /*
             * Iterates through the counter and sums up all cost differences for
             * each specialization.
             *
             * It keeps track of how many specializations have been already
             * taken into account.
             */
            const skillDone =
              active.foldl<Tuple<number, OrderedMap<string, number>>>(
                acc => current => {
                  const altered = current.lookup('sid')
                    .bind(Maybe.ensure(isString))
                    .bind(sid =>
                      sameSkill.lookup(sid)
                        .fmap(counter => {
                          const accMap = Tuple.snd(acc);
                          if (
                            !accMap.member(sid)
                            || accMap.lookup(sid).lt(Maybe.Just(counter))
                          ) {
                            const maybeSkill = wiki.get('skills').lookup(sid);

                            return Tuple.of(
                              Maybe.fromMaybe(
                                Tuple.fst(acc),
                                maybeSkill.fmap(skill =>
                                  Tuple.fst(acc)
                                  + getSingleDiff(skill, accMap, sid, counter)
                                )
                              ),
                              accMap.alter(
                                sum => sum.fmap(R.inc).alt(Maybe.Just(1)),
                                sid
                              )
                            );
                          }

                          return acc;
                        })
                    );

                  return Maybe.isJust(altered) ? Maybe.fromJust(altered) : acc;
                },
                Tuple.of(0, OrderedMap.empty())
              );

            return Tuple.fst(skillDone);
          }
        )
    );
  }
  else {
    return 0;
  }
};

const getPropertyKnowledgeDiff = (
  entries: List<Record<Data.ActiveViewObject>>,
  state: OrderedMap<string, Record<Data.ActivatableDependent>>,
): number => {
  if (entries.any(e => e.get('id') === 'SA_72')) {
    return getPropertyOrAspectKnowledgeDiff(state, List.of(10, 20, 40));
  }
  else {
    return 0;
  }
};

const getAspectKnowledgeDiff = (
  entries: List<Record<Data.ActiveViewObject>>,
  state: OrderedMap<string, Record<Data.ActivatableDependent>>,
): number => {
  if (entries.any(e => e.get('id') === 'SA_87')) {
    return getPropertyOrAspectKnowledgeDiff(state, List.of(15, 25, 45));
  }
  else {
    return 0;
  }
};

export function getAdventurePointsSpentDifference(
  entries: List<Record<Data.ActiveViewObject>>,
  state: OrderedMap<string, Record<Data.ActivatableDependent>>,
  wiki: Record<WikiAll>,
): number {
  const sumAdventurePointsSpentDifference = R.pipe(
    R.add(getPrinciplesObligationsDiff(entries, state, wiki, 'DISADV_34')),
    R.add(getPrinciplesObligationsDiff(entries, state, wiki, 'DISADV_50')),
    R.add(getPersonalityFlawsDiff(entries, state, wiki)),
    R.add(getBadHabitsDiff(entries, state, wiki)),
    R.add(getSkillSpecializationsDiff(entries, state, wiki)),
    R.add(getPropertyKnowledgeDiff(entries, state)),
    R.add(getAspectKnowledgeDiff(entries, state)),
  );

  return sumAdventurePointsSpentDifference(0);
}
