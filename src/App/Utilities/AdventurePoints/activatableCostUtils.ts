/**
 * Calculate the Adventure Points for when removing the entry. This might not
 * be the actual cost. In those cases the AP difference needs to be calculated
 * for AP spent total.
 *
 * @file src/utils/activatableCostUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { isActive } from '../Activatable/isActive';
import { getSelectOptionCost } from '../activatable/selectionUtils';
import * as Wiki from '../App/Models/Wiki/wikiTypeHelpers';
import { ActivatableCategory, Categories } from '../constants/Categories';
import { Just, List, Maybe, OrderedMap, Record } from '../dataUtils';
import { getHeroStateItem } from '../heroStateUtils';
import { translate } from '../I18n';
import { getCategoryById } from '../IDUtils';
import { match } from '../match';
import { multiply, subtractBy } from '../mathUtils';
import { getRoman } from '../NumberUtils';
import { isString } from '../typeCheckUtils';
import * as Data from '../types/data';
import { getWikiEntry } from '../WikiUtils';

const isDisadvantageActive =
  (id: string, state: Maybe<Record<Data.HeroDependent>>) =>
    isActive (state.bind (
      stateRec => stateRec.get ('disadvantages').lookup (id)
    ));

const getEntrySpecificCost = (
  wiki: Record<Wiki.WikiAll>,
  wikiEntry: Wiki.WikiActivatable,
  obj: Record<Data.ActiveObjectWithId>,
  state: Maybe<Record<Data.HeroDependent>>,
  active: Maybe<List<Record<Data.ActiveObject>>>,
  costToAdd: Maybe<boolean>
) => {
  return match<string, Maybe<number | List<number>>> (obj.get ('id'))
    .on (
      List.elem_ (List.of (
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
        'SA_569'
      )),
      () => {
        const getCostForId: (id: string) => Maybe<number> = pipe (
          getWikiEntry<Wiki.Skillish> (wiki),
          m => m.bind (
            entry => (wikiEntry.get ('cost') as List<number>)
              .subscript (entry.get ('ic') - 1)
          ),
          e => e.alt (Maybe.pure (0))
        );

        return getCostForId (Maybe.fromJust (obj.lookup ('sid') as Just<string>));
      }
    )
    .on (List.elem_ (List.of ('DISADV_34', 'DISADV_50')), () => {
      const compareMaxTier = (previousMax: number) =>
        (activeRec: Record<Data.ActiveObject>) => {
          const maybeActiveTier = activeRec.lookup ('tier');

          if (Maybe.isJust (maybeActiveTier)) {
            const tier = Maybe.fromJust (maybeActiveTier);

            return tier > previousMax
              && Maybe.isNothing (activeRec.lookup ('cost'))
                ? tier
                : previousMax;
          }

          return previousMax;
        };

      const compareSubMaxTier = (maxTier: Maybe<number>) =>
        (previousMax: number) => (activeRec: Record<Data.ActiveObject>) => {
          const maybeActiveTier = activeRec.lookup ('tier');

          if (Maybe.isJust (maybeActiveTier)) {
            const tier = Maybe.fromJust (maybeActiveTier);

            return tier > previousMax
              && Maybe.maybe<number, boolean> (true) (lt (tier)) (maxTier)
              && Maybe.isNothing (activeRec.lookup ('cost'))
                ? tier
                : previousMax;
          }

          return previousMax;
        };

      const maxCurrentTier = active.fmap (List.foldl (compareMaxTier) (0));

      const subMaxCurrentTier = active.fmap (List.foldl (compareSubMaxTier (maxCurrentTier)) (0));

      const maybeTier = obj.lookup ('tier');

      if (
        maxCurrentTier.gt (maybeTier)
        || Maybe.fromMaybe (false) (
            active
              .fmap (
                activeList => activeList
                  .filter (e => e.lookup ('tier').equals (maybeTier))
                  .length ()
              )
              .fmap (lt (Maybe.elem (true) (costToAdd) ? 0 : 1))
          )
      ) {
        return Maybe.return (0);
      }
      else {
        return maybeTier
          .ap (subMaxCurrentTier.fmap (subtractBy))
          .fmap (diff => diff * (wikiEntry.get ('cost') as number))
          .alt (Maybe.return (0));
      }
    })
    .on ('DISADV_33', () => {
      if (
        obj.lookup ('sid').equals (Maybe.pure (7))
        && Maybe.fromMaybe (false) (
          active.fmap (
            activeList => activeList
              .filter (
                e =>
                  e.lookup ('sid').equals (Maybe.pure (7))
                  && Maybe.isNothing (e.lookup ('cost'))
              )
              .length ()
          )
            .fmap (lt (Maybe.elem (true) (costToAdd) ? 0 : 1))
        )
      ) {
        return Maybe.pure (0);
      }
      else {
        return getSelectOptionCost (wikiEntry) (obj.lookup ('sid'));
      }
    })
    .on ('DISADV_36', () =>
      Maybe.fromMaybe (false) (
        active.fmap (
          activeList => activeList
            .filter (e => Maybe.isNothing (e.lookup ('cost')))
            .length ()
        )
          .fmap (lt (Maybe.elem (true) (costToAdd) ? 2 : 3))
      )
        ? Just (0)
        : wikiEntry.lookup ('cost') as Just<number>
    )
    .on (
      'SA_9',
      () => (obj.lookup ('sid') as Maybe<string>)
        .bind (id => OrderedMap.lookup<string, Record<Wiki.Skill>> (id) (wiki.get ('skills')))
        .fmap (
          skill => Maybe.fromMaybe (skill.get ('ic')) (state.bind (
            stateRec => stateRec.get ('specialAbilities')
              .lookup (wikiEntry.get ('id'))
              .fmap (pipe (
                instance => instance.get ('active'),
                activeList => activeList.foldl<number> (
                  counter => e =>
                    e.lookup ('sid').equals (obj.lookup ('sid'))
                    && Maybe.isNothing (e.lookup ('cost'))
                      ? inc (counter)
                      : counter
                ) (0),
                add (Maybe.elem (true) (costToAdd) ? 1 : 0),
                multiply (skill.get ('ic'))
              ))
          ))
        )
    )
    .on (
      'SA_29',
      () => obj .lookup ('tier') .equals (Just (4))
        ? Just (0)
        : Just (2)
    )
    .on (
      List.elem_ (List.of ('SA_72', 'SA_87')),
      () => {
        const length = Maybe.fromMaybe (0) (
          active.fmap (activeList => activeList
            .filter (e => Maybe.isNothing (e.lookup ('cost')))
            .length ())
        );

        const index = length + (Maybe.elem (true) (costToAdd) ? 0 : -1);

        const cost = wikiEntry.get ('cost');

        return cost instanceof List ? cost.subscript (index) : Maybe.empty ();
      }
    )
    .on ('SA_255', () => {
      const decreaseCost = (id: string) => (cost: number) =>
        isDisadvantageActive (id, state) ? cost - 10 : cost;

      return pipe (
        decreaseCost ('DISADV_17'),
        decreaseCost ('DISADV_18'),
        Maybe.pure
      ) (wikiEntry.get ('cost') as number);
    })
    .on (
      'SA_533',
      () =>
        obj.lookup ('sid')
          .bind (Maybe.ensure (isString))
          .bind (id => OrderedMap.lookup<string, Record<Wiki.Skill>> (id) (wiki.get ('skills')))
          .bind (
            entry => state.bind (
              stateRec => stateRec.get ('specialAbilities').lookup ('SA_531')
            )
              .bind (
                e => e.get ('active').subscript (0)
                  .bind (activeElem => activeElem.lookup ('sid'))
              )
              .bind (Maybe.ensure (isString))
              .bind (id => OrderedMap.lookup<string, Record<Wiki.Skill>> (id) (wiki.get ('skills')))
              .bind (
                firstEntry => (wikiEntry.get ('cost') as List<number>)
                  .subscript (entry.get ('ic') - 1)
                  .fmap (cost => cost + firstEntry.get ('ic'))
              )
          )
    )
    .on (
      'SA_699',
      () => state
        .bind (stateRec => stateRec.get ('specialAbilities').lookup ('SA_29'))
        .bind (
          specialAbility => specialAbility.get ('active')
            .find (e => e.lookup ('sid').equals (obj.lookup ('sid')))
        )
        .bind (activeRec => activeRec.lookup ('tier'))
        .bind<number> (tier => tier === 4 ? Maybe.pure (0) : Maybe.empty ())
        .alt (Maybe.pure (wikiEntry.get ('cost') as number))
    )
    .otherwise (() => {
      if (
        Maybe.fromMaybe (false) (
          wikiEntry.lookup ('select').fmap (e => e instanceof List)
        )
        && wikiEntry.get ('cost') === 'sel'
      ) {
        return getSelectOptionCost (wikiEntry) (obj.lookup ('sid'));
      }

      return wikiEntry.lookup ('cost') as Just<number | List<number>>;
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
  costToAdd?: boolean
): Maybe<number | List<number>> => {
  const id = obj.get ('id');

  return getWikiEntry<Wiki.Activatable> (wiki) (id)
    .fmap (wikiEntry => {
      const calculateCost = pipe (
        (active: Maybe<List<Record<Data.ActiveObject>>>) => {
          const customCost = obj.lookup ('cost');

          if (Maybe.isJust (customCost)) {
            return Maybe.fromJust (customCost);
          }

          return Maybe.fromMaybe<number | List<number>> (0) (
            getEntrySpecificCost (
              wiki,
              wikiEntry,
              obj,
              Maybe.fromNullable (state),
              active,
              Maybe.fromNullable (costToAdd)
            )
          );
        },
        currentCost => {
          if ((wikiEntry.get ('category') as ActivatableCategory) === Categories.DISADVANTAGES) {
            return currentCost instanceof List ? currentCost .map (negate) : -currentCost;
          }

          return currentCost;
        }
      );

      return calculateCost (
        Maybe.fromNullable (state)
          .bind<Record<Data.ActivatableDependent>> (
            getHeroStateItem<Record<Data.ActivatableDependent>> (id)
          )
          .fmap (instance => instance.get ('active'))
      );
    });
};

const adjustCurrentCost = (
  obj: Record<Data.ActivatableNameCostEvalTier>
): Record<Data.ActivatableNameAdjustedCostEvalTier> =>
  obj.merge (Record.of ({
    finalCost: match<number | List<number>, number> (obj.get ('finalCost'))
      .on ((e): e is List<number> => e instanceof List, currentCost => {
        const tier = obj.lookupWithDefault<'tier'> (1) ('tier');

        return currentCost.ifoldl<number> (
          sum => index => current =>
            index <= (tier - 1) ? sum + current : sum) (0);
      })
      .on (
        () => Maybe.isJust (obj.lookup ('tier'))
          && obj.get ('id') !== 'DISADV_34'
          && obj.get ('id') !== 'DISADV_50',
        currentCost => Maybe.fromMaybe (0) (
          obj.lookup ('tier').fmap (tier => currentCost * tier)
        )
      )
      .otherwise (() => obj.get ('finalCost') as number),
  }));

const getTier = (tier: number) => {
  return ` ${getRoman (tier)}`;
};

const getSpecialAbilityTier = (tier: number) => {
  return tier > 1 ? ` I-${getRoman (tier)}` : getTier (tier);
};

const getAdjustedTierName = (
  locale: Maybe<Record<Data.UIMessages>>,
  obj: Record<Data.ActivatableNameCost>,
  tier: number
) => {
  if (obj.get ('id') === 'SA_29' && tier === 4) {
    return ` ${translate (locale, 'mothertongue.short')}`;
  }
  else if (
    obj .get ('finalCost') instanceof List
    || getCategoryById (obj.get ('id')).equals (Maybe.pure (Categories.SPECIAL_ABILITIES))
  ) {
    return getSpecialAbilityTier (tier);
  }
  else {
    return getTier (tier);
  }
};

const hasTierName = (
  locale: Maybe<Record<Data.UIMessages>>,
  obj: Record<Data.ActivatableNameCost>,
  maybeTier: Maybe<number>
): Maybe<string> => {
  if (Maybe.isJust (maybeTier) && List.of ('DISADV_34', 'DISADV_50') .notElem (obj.get ('id'))) {
    const tier = Maybe.fromJust (maybeTier);

    return Maybe.pure (getAdjustedTierName (locale, obj, tier))
  }
  else {
    return Maybe.empty ();
  }
}

const adjustTierName = (
  locale: Maybe<Record<Data.UIMessages>>,
  addTierToCombinedTier?: boolean
) => (obj: Record<Data.ActivatableNameCost>): Record<Data.ActivatableNameCostEvalTier> => {
  const maybeTier = obj.lookup ('tier');

  return Maybe.fromMaybe<Record<Data.ActivatableNameCostEvalTier>> (obj) (
    hasTierName (locale, obj, maybeTier)
      .bind (Maybe.ensure (() => !addTierToCombinedTier))
      .fmap (tierName => obj .merge (Record.of<{ name: string; tierName?: string }> ({
        name: obj.get ('name') + tierName,
        tierName,
      })))
  );
};

/**
 * Calculates level name and level-based cost and (optionally) updates `name`.
 * @param locale
 * @param addTierToCombinedTier If true, does not add `tierName` to `name`.
 */
export const convertPerTierCostToFinalCost = (
  locale: Maybe<Record<Data.UIMessages>>,
  addTierToCombinedTier?: boolean
): ((obj: Record<Data.ActivatableNameCost>) => Record<Data.ActivatableNameAdjustedCostEvalTier>) =>
  pipe (
    adjustTierName (locale, addTierToCombinedTier),
    adjustCurrentCost
  );

interface SplittedActiveObjectsByCustomCost {
  defaultCostList: Record<Data.ActiveObject>[];
  customCostList: Record<Data.ActiveObject>[];
}

const getSplittedActiveObjectsByCustomCost =
  (entries: List<Record<Data.ActiveObject>>) =>
    entries.foldl<SplittedActiveObjectsByCustomCost> (
      res => obj => {
        if (Maybe.isJust (obj.lookup ('cost'))) {
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
      }
    ) ({ defaultCostList: [], customCostList: [] });

export const getActiveWithNoCustomCost =
  (entries: List<Record<Data.ActiveObject>>) =>
    List.of (
      ...getSplittedActiveObjectsByCustomCost (entries).defaultCostList
    );
