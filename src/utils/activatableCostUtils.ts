import R from 'ramda';
import { Categories } from '../constants/Categories';
import { WikiState } from '../reducers/wikiReducer';
import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki.d';
import { translate } from './I18n';
import { getCategoryById } from './IDUtils';
import { getRoman } from './NumberUtils';
import { getWikiEntry } from './WikiUtils';
import { exists } from './exists';
import { getHeroStateListItem } from './heroStateUtils';
import { isActive } from './isActive';
import { match } from './match';
import { Maybe } from './dataUtils';
import { getSelectOptionCost } from './selectionUtils';

const getEntrySpecificCost = (
  wiki: WikiState,
  wikiEntry: Wiki.Activatable,
  obj: Data.ActiveObjectWithId,
  state?: Data.HeroDependent,
  active?: Data.ActiveObject[],
  costToAdd?: boolean,
) => {
  const { id, sid, tier } = obj;
  const { cost, select } = wikiEntry;

  return match<string, number | number[] | undefined>(id)
    .on([
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
    ].includes, () => {
      const getCostForId = R.pipe(
        getWikiEntry<Wiki.Skillish>(wiki),
        m => m.map(entry => (cost as number[])[entry.ic - 1]),
        Maybe.fromMaybe(0)
      );

      return getCostForId(sid as string);
    })
    .on(['DISADV_34', 'DISADV_50'].includes, () => {
      return Maybe.of(active)
        .map(active => {
          const compareMaxTier = (
            previousMax: number,
            active: Data.ActiveObject,
          ) => {
            return exists(active.tier)
              && active.tier > previousMax
              && active.cost === undefined
              ? active.tier
              : previousMax;
          };

          const compareSubMaxTier = (
            maxCurrentTier: number,
          ) => (
            previousMax: number,
            active: Data.ActiveObject,
          ) => {
            return exists(active.tier)
              && active.tier > previousMax
              && active.tier < maxCurrentTier
              && active.cost === undefined
              ? active.tier
              : previousMax;
          };

          const maxCurrentTier = active.reduce(
            compareMaxTier,
            0,
          );

          const subMaxCurrentTier = active.reduce(
            compareSubMaxTier(maxCurrentTier),
            0,
          );

          if (
            exists(tier)
            && maxCurrentTier > tier
            || active.filter(e => e.tier === tier).length > (costToAdd ? 0 : 1)
          ) {
            return 0;
          }
          else {
            return (cost as number) * (tier! - subMaxCurrentTier);
          }
        })
        .valueOr((cost as number) * tier!);
    })
    .on('DISADV_33', () => {
      if (
        sid === 7
        && Maybe.of(active).map(R.pipe(
          arr => R.filter(e => e.sid === 7 && !exists(e.cost), arr),
          filtered => filtered.length,
          R.lt(costToAdd ? 0 : 1),
        ))
      ) {
        return 0;
      }
      else {
        return getSelectOptionCost(wikiEntry, sid).value;
      }
    })
    .on('DISADV_36', () => {
      return R.ifElse(
        R.both(exists, R.pipe(
          (arr: Data.ActiveObject[]) => R.filter(e => !exists(e.cost), arr),
          filtered => filtered.length,
          R.lt(costToAdd ? 2 : 3),
        )),
        R.always(0),
        R.always(cost as number),
      )(active);
    })
    .on('SA_9', () => {
      return R.defaultTo(0, Maybe.of(wiki.skills.get(sid as string))
        .map(skill => {
          return R.defaultTo(skill.ic, Maybe.of(state).map(state => {
            return Maybe.of(state.specialAbilities.get(id)).map(R.pipe(
              instance => instance.active,
              R.reduce<Data.ActiveObject, number>((c, obj) => {
                return obj.sid === sid && !exists(obj.cost) ? R.inc(c) : c;
              }, 0),
              R.add(costToAdd ? 1 : 0),
              R.multiply(skill.ic)
            )).value;
          }).value);
        }).value
      );
    })
    .on('SA_29', () => tier === 4 ? 0 : cost as number)
    .on('SA_72', () => {
      return Maybe.of(active)
        .map(R.pipe(
          arr => R.filter(e => !exists(e.cost), arr),
          arr => arr.length,
          R.add(costToAdd ? 0 : -1),
          index => [10, 20, 40][index]
        ))
        .value;
    })
    .on('SA_87', () => {
      return Maybe.of(active)
        .map(R.pipe(
          arr => R.filter(e => !exists(e.cost), arr),
          arr => arr.length,
          R.add(costToAdd ? 0 : -1),
          index => [15, 25, 45][index]
        ))
        .value;
    })
    .on('SA_255', () => {
      const cond = (id: string, state: Data.HeroDependent | undefined) => {
        return isActive(Maybe.of(state).map(state => state.disadvantages.get(id)));
      };

      const decreaseCost = (
        id: string,
        state: Data.HeroDependent | undefined,
      ) => (cost: number) => {
        return cond(id, state) ? cost - 10 : cost;
      };

      return R.pipe(
        decreaseCost('DISADV_17', state),
        decreaseCost('DISADV_18', state),
      )(cost as number);
    })
    .on('SA_533', () => {
      return match<string | number | undefined, number>(sid)
        .on(isString, sid => {
          type F = Maybe<Data.HeroDependent>;
          type Selection = string | number | undefined;

          return Maybe.of(wiki.skills.get(sid)).map(entry => {
            return R.pipe(
              (state: F) => state.map(v => v.specialAbilities)
                .map(v => v.get('SA_531'))
                .map(v => v.active)
                .map(v => v && v[0] && v[0].sid),
              sid => match<Selection, Maybe<Wiki.Skill>>(sid.value)
                .on(isString, sid => Maybe.of(wiki.skills.get(sid)))
                .otherwise(Maybe.Nothing)
                .map(firstEntry => {
                  return (cost as number[])[entry.ic - 1] + firstEntry.ic;
                }).value
            )(Maybe.of(state));
          }).valueOr(0);
        })
        .otherwise(() => 0);
    })
    .on('SA_699', () => {
      return R.defaultTo(cost as number, Maybe.of(state)
        .map(v => v.specialAbilities)
        .map(v => v.get('SA_29'))
        .map(v => v.active)
        .map(R.find<Data.ActiveObject>(R.propEq('sid', sid)))
        .map(base => base.tier)
        .map<number>(
          R.ifElse(R.equals(4), R.always(0), R.always(undefined))
        )
        .value
      );
    })
    .otherwise(() => {
      if (Array.isArray(select) && cost === 'sel') {
        return getSelectOptionCost(wikiEntry, sid).value;
      }

      return;
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
  obj: Data.ActiveObjectWithId,
  wiki: WikiState,
  state?: Data.HeroDependent,
  costToAdd?: boolean,
): Maybe<number | number[]> => {
  const { id, cost: customCost } = obj;

  return getWikiEntry<Wiki.Activatable>(wiki, id)
    .map(wikiEntry => {
      type F = Maybe<Data.HeroDependent>;

      const { category, cost } = wikiEntry;

      return R.pipe(
        (state: F) => state.map(R.pipe(
          getHeroStateListItem<Data.ActivatableDependent>(id),
          state => state.map(instance => instance.active),
          active => active.value,
        )),
        active => active.value,
        active => {
          if (typeof customCost === 'number') {
            return customCost;
          }
          else {
            return R.defaultTo(
              cost as number | number[],
              getEntrySpecificCost(
                wiki,
                wikiEntry,
                obj,
                state,
                active,
                costToAdd,
              )
            );
          }
        },
        currentCost => {
          if (category === Categories.DISADVANTAGES) {
            return typeof currentCost === 'object'
              ? currentCost.map(e => -e)
              : -currentCost;
          }
          return currentCost;
        }
      )(Maybe.of(state));
    });
};

interface AdjustedCost extends Data.ActivatableNameCost {
  currentCost: number;
}

const adjustCurrentCost = (
  obj: Data.ActivatableNameCost,
): AdjustedCost => R.merge(obj, {
  currentCost: match<number | number[], number>(obj.currentCost)
    .on(Array.isArray, currentCost => {
      const { tier = 1 } = obj;
      return currentCost.reduce((sum, current, index) => {
        return index <= (tier - 1) ? sum + current : sum;
      }, 0);
    })
    .on(() => {
      return typeof obj.tier === 'number'
        && obj.id !== 'DISADV_34'
        && obj.id !== 'DISADV_50'
        && typeof obj.cost !== 'number';
    }, currentCost => currentCost * obj.tier!)
    .otherwise(R.always(obj.currentCost as number))
});

const getTier = (tier: number) => {
  return ` ${getRoman(tier)}`;
};

const getSpecialAbilityTier = (tier: number) => {
  return tier > 1 ? ` I-${getRoman(tier)}` : getTier(tier);
};

const adjustTierName = (
  locale?: Data.UIMessages,
  addTierToCombinedTier?: boolean,
) => (obj: AdjustedCost): Data.ActivatableNameCostEvalTier => {
  let tierName;

  if (
    typeof obj.tier === 'number'
    && obj.id !== 'DISADV_34'
    && obj.id !== 'DISADV_50'
    && typeof obj.cost !== 'number'
  ) {
    if (obj.id === 'SA_29' && obj.tier === 4) {
      tierName = ` ${translate(locale, 'mothertongue.short')}`;
    }
    else if (
      Array.isArray(obj.currentCost)
      || getCategoryById(obj.id).equals(Maybe.Just(Categories.SPECIAL_ABILITIES))
    ) {
      tierName = getSpecialAbilityTier(obj.tier);
    }
    else {
      tierName = getTier(obj.tier);
    }
  }

  return R.merge(obj, {
    combinedName: addTierToCombinedTier !== true && tierName
      ? obj.combinedName + tierName
      : obj.combinedName,
    tierName,
  });
};

/**
 * Calculates level name and level-based cost and (optionally) updates
 * `combinedName`.
 * @param locale
 * @param addTierToCombinedTier If true, does not add `tierName` to
 * `combinedName`.
 */
export const convertPerTierCostToFinalCost = (
  locale?: Data.UIMessages,
  addTierToCombinedTier?: boolean,
): ((obj: Data.ActivatableNameCost) => Data.ActivatableNameCostEvalTier) => {
  return R.pipe(
    adjustCurrentCost,
    adjustTierName(locale, addTierToCombinedTier),
  );
};

interface SplittedActiveObjectsByCustomCost {
  defaultCostList: Data.ActiveObject[];
  customCostList: Data.ActiveObject[];
}

const getSplittedActiveObjectsByCustomCost = (entries: Data.ActiveObject[]) => {
  return entries.reduce<SplittedActiveObjectsByCustomCost>((res, obj) => {
    if (typeof obj.cost === 'number') {
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
  }, {
    defaultCostList: [],
    customCostList: [],
  });
}

export const getActiveWithNoCustomCost = (entries: Data.ActiveObject[]) => {
  return getSplittedActiveObjectsByCustomCost(entries).defaultCostList;
}
