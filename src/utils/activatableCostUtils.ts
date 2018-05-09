import R from 'ramda';
import { Categories } from '../constants/Categories';
import { WikiState } from '../reducers/wikiReducer';
import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki.d';
import { _translate } from './I18n';
import { getCategoryById } from './IDUtils';
import { getRoman } from './NumberUtils';
import { getWikiEntry } from './WikiUtils';
import { exists, matchExists, maybe } from './exists';
import { getHeroStateListItem } from './heroStateUtils';
import { isActive } from './isActive';
import { match } from './match';
import { Maybe, MaybeFunctor } from './maybe';
import { getSelectOptionCost } from './selectionUtils';

/**
 * Returns the AP you get when removing the ActiveObject.
 * @param obj The ActiveObject with origin id.
 * @param wiki The wiki state.
 * @param dependent The current hero's state.
 * @param costToAdd If the cost are going to be added or removed from AP left.
 */
export function getCost(
  obj: Data.ActiveObjectWithId,
  wiki: WikiState,
  state?: Data.HeroDependent,
  costToAdd?: boolean,
): number | number[] {
  const { id, sid, tier, cost: customCost } = obj;
  const wikiEntry = getWikiEntry<Wiki.Activatable>(wiki, id)!;
  const { cost, category, select } = wikiEntry;

  const active = maybe((state: Data.HeroDependent) => {
    return maybe(
      (instance: Data.ActivatableDependent) => instance.active
    )(
      getHeroStateListItem<Data.ActivatableDependent>(
        state,
        id,
      )
    )
  })(state);

  let currentCost: number | number[] | undefined;

  if (customCost !== undefined) {
    currentCost = customCost;
  }
  else {
    currentCost = match<string, number | number[] | undefined>(id)
      .on(id => [
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
      ].includes(id), () => {
        return match<string | number | undefined, number>(sid)
          .on(isString, sid => {
            return maybe(
              (entry: Wiki.Skillish) => (cost as number[])[entry.ic - 1],
              0
            )(getWikiEntry<Wiki.Skillish>(wiki, sid));
          })
          .otherwise(() => 0);
      })
      .on(id => [
        'DISADV_34',
        'DISADV_50',
      ].includes(id), () => {
        return match<Data.ActiveObject[] | undefined, number | undefined>(active)
          .on(matchExists(), active => {
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
          .otherwise(() => (cost as number) * tier!);
      })
      .on('DISADV_33', () => {
        if (
          sid === 7
          && maybe((active: Data.ActiveObject[]) => {
            return active.filter(e => {
              return e.sid === 7 && !exists(e.cost);
            }).length > (costToAdd ? 0 : 1);
          })(active)
        ) {
          return 0;
        }
        else {
          return getSelectOptionCost(wikiEntry, sid);
        }
      })
      .on('DISADV_36', () => {
        return R.ifElse(
          R.both(exists, (active: Data.ActiveObject[]) => {
            return R.filter(e => !exists(e.cost), active).length > (costToAdd ? 2 : 3);
          }),
          R.always(0),
          R.always(cost as number),
        )(active);
      })
      .on('SA_9', () => {
        return R.defaultTo(0, Maybe(wiki.skills.get(sid as string)).fmap(skill => {
          return R.defaultTo(skill.ic, Maybe(state).fmap(state => {
            return Maybe(state.specialAbilities.get(id)).fmap(R.pipe(
              instance => instance.active,
              R.reduce<Data.ActiveObject, number>((c, obj) => {
                return obj.sid === sid && !exists(obj.cost) ? R.inc(c) : c;
              }, 0),
              R.add(costToAdd ? 1 : 0),
              R.multiply(skill.ic)
            )).value;
          }).value);
        }).value);
      })
      .on('SA_29', () => tier === 4 ? 0 : cost as number)
      .on('SA_72', () => {
        return Maybe(active)
          .fmap(R.pipe(
            arr => R.filter(e => !exists(e.cost), arr),
            arr => arr.length,
            R.add(costToAdd ? 0 : -1),
            index => [10, 20, 40][index]
          ))
          .value;
      })
      .on('SA_87', () => {
        return Maybe(active)
          .fmap(R.pipe(
            arr => R.filter(e => !exists(e.cost), arr),
            arr => arr.length,
            R.add(costToAdd ? 0 : -1),
            index => [15, 25, 45][index]
          ))
          .value;
      })
      .on('SA_255', () => {
        const cond = (id: string, state: Data.HeroDependent | undefined) => {
          return exists(state) && isActive(state.disadvantages.get(id));
        };

        return R.pipe(
          (cost: number) => {
            if (cond('DISADV_17', state)) {
              return cost - 10;
            }
            return cost;
          },
          cost => {
            if (cond('DISADV_18', state)) {
              return cost - 10;
            }
            return cost;
          },
        )(cost as number);
      })
      .on('SA_533', () => {
        return match<string | number | undefined, number>(sid)
          .on(isString, sid => {
            type F = MaybeFunctor<Data.HeroDependent | undefined>;
            type Selection = string | number | undefined;
            type Skill = Wiki.Skill | undefined;

            return R.defaultTo(0, Maybe(wiki.skills.get(sid)).fmap(entry => {
              return R.pipe(
                (state: F) => state.fmap(v => v.specialAbilities)
                  .fmap(v => v.get('SA_531'))
                  .fmap(v => v.active)
                  .fmap(v => v && v[0] && v[0].sid),
                sid => match<Selection, MaybeFunctor<Skill>>(sid.value)
                  .on(isString, sid => Maybe(wiki.skills.get(sid)))
                  .otherwise(() => Maybe(undefined))
                  .fmap(firstEntry => {
                    return (cost as number[])[entry.ic - 1] + firstEntry.ic;
                  }).value
              )(Maybe(state));
            }).value);
          })
          .otherwise(() => 0);
      })
      .on('SA_699', () => {
        return R.defaultTo(cost as number, Maybe(state)
          .fmap(v => v.specialAbilities)
          .fmap(v => v.get('SA_29'))
          .fmap(v => v.active)
          .fmap(R.find<Data.ActiveObject>(R.propEq('sid', sid)))
          .fmap(base => base.tier)
          .fmap<number | undefined>(
            R.ifElse(R.equals(4), R.always(0), R.always(undefined))
          )
          .value
        );
      })
      .otherwise(() => {
        if (Array.isArray(select) && cost === 'sel') {
          return getSelectOptionCost(wikiEntry, sid);
        }

        return;
      });

    if (currentCost === undefined) {
      currentCost = cost as number | number[];
    }
  }

  if (category === Categories.DISADVANTAGES) {
    currentCost = typeof currentCost === 'object' ? currentCost.map(e => -e) : -currentCost;
  }

  return currentCost;
}

export function convertPerTierCostToFinalCost(obj: Data.ActivatableNameCost, locale?: Data.UIMessages, addTierToCombinedTier?: boolean): Data.ActivatableNameCostEvalTier {
  const { id, tier, cost } = obj;
  let { currentCost, combinedName } = obj;
  let tierName;

  // R.ifElse(isObject, () => {
  //   const { tier = 1 } = obj;
  //   currentCost = currentCost.reduce((sum, current, index) => index <= (tier - 1) ? sum + current : sum, 0);
  //   tierName = tier > 1 ? ` I-${getRoman(tier)}` : ` ${getRoman(tier)}`;
  // }, () => {
  //   R.ifElse(() => R.all(R.equals(true), [
  //     isNumber(tier),
  //     R.not(isNumber(cost)),
  //     R.not(R.equals(id, 'DISADV_34')),
  //     R.not(R.equals(id, 'DISADV_50')),
  //   ]), () => {
  //     currentCost *= tier;
  //     if (id === 'SA_29' && tier === 4) {
  //       tierName = ` ${_translate(locale, 'mothertongue.short')}`;
  //     }
  //     else if (getCategoryById(obj.id) === 'SPECIAL_ABILITIES') {
  //       tierName = tier > 1 ? ` I-${getRoman(tier)}` : ` ${getRoman(tier)}`;
  //     }
  //     else {
  //       tierName = ` ${getRoman(tier)}`;
  //     }
  //   }, () => {

  //   })
  // })(currentCost);

  if (Array.isArray(currentCost)) {
    const { tier = 1 } = obj;
    currentCost = currentCost.reduce((sum, current, index) => index <= (tier - 1) ? sum + current : sum, 0);
    tierName = tier > 1 ? ` I-${getRoman(tier)}` : ` ${getRoman(tier)}`;
  }
  else if (typeof tier === 'number' && id !== 'DISADV_34' && id !== 'DISADV_50' && typeof cost !== 'number') {
    currentCost *= tier;
    if (id === 'SA_29' && tier === 4) {
      tierName = ` ${_translate(locale, 'mothertongue.short')}`;
    }
    else if (getCategoryById(obj.id) === 'SPECIAL_ABILITIES') {
      tierName = tier > 1 ? ` I-${getRoman(tier)}` : ` ${getRoman(tier)}`;
    }
    else {
      tierName = ` ${getRoman(tier)}`;
    }
  }

  if (addTierToCombinedTier !== true && tierName) {
    combinedName += tierName;
  }

  return {
    ...obj,
    tierName,
    combinedName,
    currentCost
  };
}
