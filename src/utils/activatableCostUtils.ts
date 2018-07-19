import R from 'ramda';
import { ActivatableCategory, Categories } from '../constants/Categories';
import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki.d';
import { Just, List, Maybe, Record } from './dataUtils';
import { getHeroStateListItem } from './heroStateUtils';
import { translate } from './I18n';
import { getCategoryById } from './IDUtils';
import { isActive } from './isActive';
import { match } from './match';
import { getRoman } from './NumberUtils';
import { getSelectOptionCost } from './selectionUtils';
import { getWikiEntry } from './WikiUtils';

const isDisadvantageActive =
  (id: string, state: Maybe<Record<Data.HeroDependent>>) =>
    isActive(state.bind(
      stateRec => stateRec.get('disadvantages').lookup(id)
    ));

const getEntrySpecificCost = (
  wiki: Record<Wiki.WikiAll>,
  wikiEntry: Wiki.WikiActivatable,
  obj: Record<Data.ActiveObjectWithId>,
  state: Maybe<Record<Data.HeroDependent>>,
  active: Maybe<List<Record<Data.ActiveObject>>>,
  costToAdd: Maybe<boolean>,
) => {
  return match<string, Maybe<number | List<number>>>(obj.get('id'))
    .on(
      [
        'ADV_4',
        'ADV_47',
        'ADV_16',
        'ADV_17',
        'DISADV_48',
        'SA_231',
        'SA_250',
        'SA_472',
        'SA_473',
        'SA_531',
        'SA_569',
      ].includes,
      () => {
        const getCostForId: (id: string) => Maybe<number> = R.pipe(
          getWikiEntry<Wiki.Skillish>(wiki),
          m => m.bind(
            entry => (wikiEntry.get('cost') as List<number>)
              .subscript(entry.get('ic') - 1)
          ),
          e => e.alt(Maybe.Just(0))
        );

        return getCostForId(Maybe.fromJust(obj.lookup('sid') as Just<string>));
      }
    )
    .on(['DISADV_34', 'DISADV_50'].includes, () => {
      const compareMaxTier = (previousMax: number) =>
        (activeRec: Record<Data.ActiveObject>) => {
          const maybeActiveTier = activeRec.lookup('tier');

          if (Maybe.isJust(maybeActiveTier)) {
            const tier = Maybe.fromJust(maybeActiveTier);

            return tier > previousMax
              && Maybe.isNothing(activeRec.lookup('cost'))
              ? tier
              : previousMax;
          }

          return previousMax;
        };

      const compareSubMaxTier = (maxTier: Maybe<number>) =>
        (previousMax: number) => (activeRec: Record<Data.ActiveObject>) => {
          const maybeActiveTier = activeRec.lookup('tier');

          if (Maybe.isJust(maybeActiveTier)) {
            const tier = Maybe.fromJust(maybeActiveTier);

            return tier > previousMax
              && (!Maybe.isJust(maxTier) || tier < Maybe.fromJust(maxTier))
              && Maybe.isNothing(activeRec.lookup('cost'))
              ? tier
              : previousMax;
          }

          return previousMax;
        };

      const maxCurrentTier = active.map(activeList => activeList.foldl(
        compareMaxTier,
        0,
      ));

      const subMaxCurrentTier = active.map(activeList => activeList.foldl(
        compareSubMaxTier(maxCurrentTier),
        0,
      ));

      const maybeTier = obj.lookup('tier');

      if (
        (Maybe.isJust(maybeTier) && maxCurrentTier.gt(maybeTier))
        || Maybe.fromMaybe(0, active.map(activeList => activeList.filter(
          e => e.lookup('tier').equals(maybeTier)
        ).length())) > (Maybe.isJust(costToAdd) ? 0 : 1)
      ) {
        return Maybe.Just(0);
      }
      else {
        return Maybe.Just(
          (wikiEntry.get('cost') as number) *
            (Maybe.fromMaybe(0, maybeTier) -
              Maybe.fromMaybe(0, subMaxCurrentTier))
        );
      }
    })
    .on('DISADV_33', () => {
      if (
        obj.lookup('sid').equals(Maybe.Just(7))
        && Maybe.fromMaybe(0, active.map(activeList => activeList.filter(
          e =>
            e.lookup('sid').equals(Maybe.Just(7))
            && Maybe.isNothing(e.lookup('cost'))
        ).length())) > (Maybe.isJust(costToAdd) ? 0 : 1)
      ) {
        return Maybe.Just(0);
      }
      else {
        return getSelectOptionCost(wikiEntry, obj.lookup('sid'));
      }
    })
    .on('DISADV_36', () => {
      if (Maybe.fromMaybe(0, active.map(activeList => activeList.filter(
        e => Maybe.isNothing(e.lookup('cost'))
      ).length())) > (Maybe.isJust(costToAdd) ? 2 : 3)) {
        return Maybe.Just(0);
      }
      else {
        return wikiEntry.lookup('cost') as Just<number>;
      }
    })
    .on(
      'SA_9',
      () => (obj.lookup('sid') as Maybe<string>)
        .bind(wiki.get('skills').lookup)
        .map(
          skill => Maybe.fromMaybe(skill.get('ic'), state.bind(
            stateRec => stateRec.get('specialAbilities')
              .lookup(wikiEntry.get('id'))
              .map(R.pipe(
                instance => instance.get('active'),
                activeList => activeList.foldl<number>(
                  counter => e =>
                    e.lookup('sid').equals(obj.lookup('sid'))
                    && Maybe.isNothing(e.lookup('cost'))
                      ? R.inc(counter)
                      : counter,
                  0
                ),
                R.add(Maybe.isJust(costToAdd) ? 1 : 0),
                R.multiply(skill.get('ic'))
              ))
          ))
        )
    )
    .on(
      'SA_29',
      () => obj.lookup('tier').equals(Maybe.Just(4))
        ? Maybe.Just(0)
        : obj.lookup('cost')
    )
    .on('SA_72', () => {
      const length = Maybe.fromMaybe(0, active.map(activeList => activeList
        .filter(e => Maybe.isNothing(e.lookup('cost')))
        .length()));

      const index = length + (Maybe.isJust(costToAdd) ? 0 : -1);

      return List.of(10, 20, 40).subscript(index);
    })
    .on('SA_87', () => {
      const length = Maybe.fromMaybe(0, active.map(activeList => activeList
        .filter(e => Maybe.isNothing(e.lookup('cost')))
        .length()));

      const index = length + (Maybe.isJust(costToAdd) ? 0 : -1);

      return List.of(15, 25, 45).subscript(index);
    })
    .on('SA_255', () => {
      const decreaseCost = (id: string) => (cost: number) =>
        isDisadvantageActive(id, state) ? cost - 10 : cost;

      return R.pipe(
        decreaseCost('DISADV_17'),
        decreaseCost('DISADV_18'),
        Maybe.Just
      )(wikiEntry.get('cost') as number);
    })
    .on(
      'SA_533',
      () =>
        obj.lookup('sid')
          .bind(Maybe.ensure(isString))
          .bind(wiki.get('skills').lookup)
          .bind(
            entry => state.bind(
              stateRec => stateRec.get('specialAbilities').lookup('SA_531')
            )
              .bind(
                e => e.get('active').subscript(0)
                  .bind(activeElem => activeElem.lookup('sid'))
              )
              .bind(Maybe.ensure(isString))
              .bind(wiki.get('skills').lookup)
              .bind(
                firstEntry => (wikiEntry.get('cost') as List<number>)
                  .subscript(entry.get('ic') - 1)
                  .map(cost => cost + firstEntry.get('ic'))
              )
          )
    )
    .on(
      'SA_699',
      () => state
        .bind(stateRec => stateRec.get('specialAbilities').lookup('SA_29'))
        .bind(
          specialAbility => specialAbility.get('active')
            .find(e => e.lookup('sid').equals(obj.lookup('sid')))
        )
        .bind(activeRec => activeRec.lookup('tier'))
        .bind<number>(tier => tier === 4 ? Maybe.Just(0) : Maybe.Nothing())
        .alt(Maybe.Just(wikiEntry.get('cost') as number))
    )
    .otherwise(() => {
      if (
        Maybe.fromMaybe(
          false,
          wikiEntry.lookup('select').map(e => e instanceof List)
        )
        && wikiEntry.get('cost') === 'sel'
      ) {
        return getSelectOptionCost(wikiEntry, obj.lookup('sid'));
      }

      return wikiEntry.lookup('cost') as Just<number | List<number>>;
    });
};

/**
 * Returns the AP you get when removing the ActiveObject.
 * @param obj The ActiveObject with origin id.
 * @param wiki The wiki state.
 * @param dependent The current hero's state.
 * @param costToAdd If the cost are going to be added or removed from AP left.
 */
export const getCost = (
  obj: Record<Data.ActiveObjectWithId>,
  wiki: Record<Wiki.WikiAll>,
  state?: Record<Data.HeroDependent>,
  costToAdd?: boolean,
): Maybe<number | List<number>> => {
  const id = obj.get('id');

  return getWikiEntry<Wiki.Activatable>(wiki, id)
    .map(wikiEntry => {
      const calculateCost = R.pipe(
        (active: Maybe<List<Record<Data.ActiveObject>>>) => {
          const customCost = obj.lookup('cost');
          if (Maybe.isJust(customCost)) {
            return Maybe.fromJust(customCost);
          }
          else {
            return Maybe.fromMaybe(
              0,
              getEntrySpecificCost(
                wiki,
                wikiEntry,
                obj,
                Maybe.of(state),
                active,
                Maybe.of(costToAdd),
              )
            );
          }
        },
        currentCost => {
          if (wikiEntry.get('category') as ActivatableCategory
            === Categories.DISADVANTAGES) {
            return typeof currentCost === 'object'
              ? currentCost.map(e => -e)
              : -currentCost;
          }

          return currentCost;
        }
      );

      return calculateCost(
        Maybe.of(state)
          .bind<Record<Data.ActivatableDependent>>(
            getHeroStateListItem<Record<Data.ActivatableDependent>>(id)
          )
          .map(instance => instance.get('active'))
      );
    });
};

interface AdjustedCost extends Data.ActivatableNameCost {
  currentCost: number;
}

const adjustCurrentCost = (
  obj: Record<Data.ActivatableNameCost>,
): Record<AdjustedCost> =>
  obj.merge(Record.of({
    currentCost: match<number | List<number>, number>(obj.get('currentCost'))
      .on((e): e is List<number> => e instanceof List, currentCost => {
        const tier = obj.lookupWithDefault(1, 'tier');

        return currentCost.ifoldl(
          sum => index => current =>
            index <= (tier - 1) ? sum + current : sum,
          0
        );
      })
      .on(
        () => Maybe.isJust(obj.lookup('tier'))
          && obj.get('id') !== 'DISADV_34'
          && obj.get('id') !== 'DISADV_50'
          && Maybe.isJust(obj.lookup('cost')),
        currentCost => Maybe.fromMaybe(
          0,
          obj.lookup('tier').map(tier => currentCost * tier)
        )
      )
      .otherwise(() => obj.get('currentCost') as number)
  }));

const getTier = (tier: number) => {
  return ` ${getRoman(tier)}`;
};

const getSpecialAbilityTier = (tier: number) => {
  return tier > 1 ? ` I-${getRoman(tier)}` : getTier(tier);
};

const getAdjustedTierName = (
  locale: Maybe<Record<Data.UIMessages>>,
  obj: Record<AdjustedCost>,
  tier: number
) => {
  if (obj.get('id') === 'SA_29' && tier === 4) {
    return ` ${translate(locale, 'mothertongue.short')}`;
  }
  else if (
    Array.isArray(obj.get('currentCost'))
    || getCategoryById(obj.get('id')).equals(Maybe.Just(Categories.SPECIAL_ABILITIES))
  ) {
    return getSpecialAbilityTier(tier);
  }
  else {
    return getTier(tier);
  }
};

const hasTierName = (
  locale: Maybe<Record<Data.UIMessages>>,
  obj: Record<AdjustedCost>,
  maybeTier: Maybe<number>
): Maybe<string> => {
  if (
    Maybe.isJust(maybeTier)
    && obj.get('id') !== 'DISADV_34'
    && obj.get('id') !== 'DISADV_50'
    && Maybe.isJust(obj.lookup('cost'))
  ) {
    const tier = Maybe.fromJust(maybeTier);

    return Maybe.Just(getAdjustedTierName(locale, obj, tier))
  }
  else {
    return Maybe.Nothing();
  }
}

const adjustTierName = (
  locale: Maybe<Record<Data.UIMessages>>,
  addTierToCombinedTier?: boolean,
) => (obj: Record<AdjustedCost>): Record<Data.ActivatableNameCostEvalTier> => {
  const maybeTier = obj.lookup('tier');

  return Maybe.fromMaybe(
    obj,
    hasTierName(locale, obj, maybeTier)
      .bind(Maybe.ensure(() => addTierToCombinedTier !== true))
      .map(tierName => R.merge(obj, {
        combinedName: obj.get('combinedName') + tierName,
        tierName,
      }))
  );
};

/**
 * Calculates level name and level-based cost and (optionally) updates
 * `combinedName`.
 * @param locale
 * @param addTierToCombinedTier If true, does not add `tierName` to
 * `combinedName`.
 */
export const convertPerTierCostToFinalCost = (
  locale: Maybe<Record<Data.UIMessages>>,
  addTierToCombinedTier?: boolean,
): (
  (obj: Record<Data.ActivatableNameCost>) =>
    Record<Data.ActivatableNameCostEvalTier>
) =>
  R.pipe(
    adjustCurrentCost,
    adjustTierName(locale, addTierToCombinedTier),
  );

interface SplittedActiveObjectsByCustomCost {
  defaultCostList: Record<Data.ActiveObject>[];
  customCostList: Record<Data.ActiveObject>[];
}

const getSplittedActiveObjectsByCustomCost =
  (entries: List<Record<Data.ActiveObject>>) =>
    entries.foldl<SplittedActiveObjectsByCustomCost>(
      res => obj => {
        if (Maybe.isJust(obj.lookup('cost'))) {
          return {
            ...res,
            customCostList: [
              ...res.customCostList,
              obj,
            ],
          };
        }

        return {
          ...res,
          defaultCostList: [
            ...res.defaultCostList,
            obj,
          ],
        };
      },
      {
        defaultCostList: [],
        customCostList: [],
      }
    );

export const getActiveWithNoCustomCost =
  (entries: List<Record<Data.ActiveObject>>) =>
    List.of(
      ...getSplittedActiveObjectsByCustomCost(entries).defaultCostList
    );
