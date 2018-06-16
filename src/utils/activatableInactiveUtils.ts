import R from 'ramda';
import { AdventurePointsObject } from '../selectors/adventurePointsSelectors';
import * as Data from '../types/data.d';
import { HeroDependent } from '../types/data.d';
import * as Wiki from '../types/wiki.d';
import { isAdditionDisabled } from './activatableInactiveValidationUtils';
import { countActiveSkillEntries } from './activatableSkillUtils';
import { List, Maybe, OrderedMap, Record, Tuple } from './dataUtils';
import { countActiveGroupEntries } from './entryGroupUtils';
import { exists } from './exists';
import { sortObjects } from './FilterSortUtils';
import { getAllEntriesByGroup } from './heroStateUtils';
import { getBlessedTraditionInstanceIdByNumericId } from './IDUtils';
import { isActive } from './isActive';
import { getTraditionOfAspect } from './LiturgyUtils';
import { match } from './match';
import { findSelectOption, getActiveSecondarySelections, getActiveSelections, getRequiredSelections } from './selectionUtils';
import { getBlessedTradition, getMagicalTraditions } from './traditionUtils';
import { validatePrerequisites, validateTier } from './validatePrerequisitesUtils';
import { getWikiEntry } from './WikiUtils';

const getIsNoActiveSelection =
  (instance: Maybe<Record<Data.ActivatableDependent>>) => {
    const activeSelections = Maybe.fromMaybe(
      List.of<string | number>(),
      getActiveSelections(instance)
    );

    return (e: Record<Wiki.SelectionObject>) =>
      !activeSelections.elem(e.get('id'));
  };

const getLessThanTwoSameIdActiveSelections =
  (instance: Maybe<Record<Data.ActivatableDependent>>) => {
    const activeSelections = Maybe.fromMaybe(
      List.of<string | number>(),
      getActiveSelections(instance)
    );

    return (e: Record<Wiki.SelectionObject>) =>
      activeSelections.filter(s => s === e.get('id')).length() < 2
  };

const getIsNoRequiredSelection =
  (instance: Maybe<Record<Data.ActivatableDependent>>) => {
    const requiredSelections = Maybe.fromMaybe(
      List.of<string | number | List<number>>(),
      getRequiredSelections(instance)
    );

    return (e: Record<Wiki.SelectionObject>) =>
      !requiredSelections.elem(e.get('id'));
  };

const getIsNoRequiredOrActiveSelection =
  (instance: Maybe<Record<Data.ActivatableDependent>>) => {
    const isNoActiveSelection = getIsNoActiveSelection(instance);
    const isNoRequiredSelection = getIsNoRequiredSelection(instance);

    return (e: Record<Wiki.SelectionObject>) =>
      isNoActiveSelection(e) && isNoRequiredSelection(e);
  };

const addToSkillCategoryCounter = (map: OrderedMap<number, number>) =>
  map.alter(
    prop => prop
      .map(count => count + 1)
      .alt(Maybe.Just(0))
  );

const getCategoriesWithSkillsAbove10 = (
  wiki: Record<Wiki.WikiAll>,
  state: Record<HeroDependent>,
  key: 'liturgicalChants' | 'spells',
) => {
  const addToCounterByKey = key === 'liturgicalChants'
    ? (map: OrderedMap<number, number>) =>
        (skill: Record<Wiki.LiturgicalChant | Wiki.Spell>) =>
          (skill as Record<Wiki.LiturgicalChant>).get('aspects').foldl(
            addToSkillCategoryCounter,
            map
          )
    : (map: OrderedMap<number, number>) =>
        (skill: Record<Wiki.LiturgicalChant | Wiki.Spell>) =>
          addToSkillCategoryCounter(map)(
            (skill as Record<Wiki.Spell>).get('property')
          );

  return state.get(key).elems()
    .filter(e => e.get('value') >= 10)
    .foldl<OrderedMap<number, number>>(map => obj => {
      return Maybe.fromMaybe(
        map,
        (wiki.get(key).lookup(
          obj.get('id')
        ) as Maybe<Record<Wiki.Spell | Wiki.LiturgicalChant>>)
          .map(addToCounterByKey(map))
      )
    }, OrderedMap.empty())
    .foldlWithKey<List<number>>(list => key => value => {
      return value >= 3 ? list.append(key) : list
    }, List.of());
};

const getEntrySpecificSelections = (
  wiki: Record<Wiki.WikiAll>,
  instance: Maybe<Record<Data.ActivatableDependent>>,
  state: Record<Data.HeroDependent>,
  entry: Wiki.Activatable,
) => {
  return match<string, Maybe<List<Record<Wiki.SelectionObject>>>>(entry.get('id'))
    .on([
      'ADV_4',
      'ADV_17',
      'ADV_47',
    ].includes, () =>
      entry.lookup('select')
        .map(select =>
          select.filter(getIsNoRequiredOrActiveSelection(instance))
        )
    )
    .on('ADV_16', () =>
      entry.lookup('select')
        .map(select => {
          const hasLessThanTwoSameIdActiveSelections =
            getLessThanTwoSameIdActiveSelections(instance);

          const isNoRequiredSelection = getIsNoRequiredSelection(instance);

          return select.filter(e =>
            hasLessThanTwoSameIdActiveSelections(e)
            && isNoRequiredSelection(e)
          );
        })
    )
    .on([
      'ADV_28',
      'ADV_29',
    ].includes, () =>
      entry.lookup('select')
        .map(select => select.filter(getIsNoRequiredSelection(instance)))
    )
    .on([
      'ADV_32',
      'DISADV_24',
    ].includes, id =>
      entry.lookup('select')
        .map(select => {
          const flippedId = id === 'DISADV_24' ? 'ADV_32' : id;

          const hasLessThanTwoSameIdActiveSelections =
            getLessThanTwoSameIdActiveSelections(
              state.get('disadvantages').lookup(flippedId)
            );

          const isNoRequiredSelection = getIsNoRequiredSelection(instance);

          return select.filter(e =>
            hasLessThanTwoSameIdActiveSelections(e)
            && isNoRequiredSelection(e)
          );
        })
    )
    .on([
      'DISADV_1',
      'DISADV_34',
      'DISADV_50',
    ].includes, () =>
      entry.lookup('select')
        .map(select => select.filter(getIsNoRequiredSelection(instance)))
    )
    .on([
      'DISADV_33',
      'DISADV_37',
      'DISADV_51',
    ].includes, id =>
      entry.lookup('select')
        .map(select => {
          const isNoRequiredOrActiveSelection =
            getIsNoRequiredOrActiveSelection(instance);

          if (id === 'DISADV_33') {
            const specialIds = List.of(7, 8);
            return select.filter(e =>
              specialIds.elem(e.get('id') as number)
              || isNoRequiredOrActiveSelection(e)
            );
          }
          else {
            return select.filter(isNoRequiredOrActiveSelection);
          }
        })
    )
    .on('DISADV_36', () =>
      entry.lookup('select')
        .map(select =>
          select.filter(getIsNoRequiredOrActiveSelection(instance))
        )
    )
    .on('DISADV_48', () =>
      entry.lookup('select')
        .map(select => {
          const isNoRequiredOrActiveSelection =
            getIsNoRequiredOrActiveSelection(instance);

          const isAdvantageActive = (id: string) =>
            isActive(state.get('advantages').lookup(id));

          const isSkillOfIcB = (e: Record<Wiki.SelectionObject>) =>
            Maybe.fromMaybe(
              false,
              wiki.get('skills').lookup(e.get('id') as string)
                .map(skill => skill.get('ic') === 2)
            );

          return select.filter(e => {
            return (isAdvantageActive('ADV_40') || isAdvantageActive('ADV_46'))
              && isSkillOfIcB(e)
              || isNoRequiredOrActiveSelection(e);
          });
        })
    )
    .on('SA_3', () =>
      entry.lookup('select')
        .map(select => {
          const isNoRequiredOrActiveSelection =
            getIsNoRequiredOrActiveSelection(instance);

          return select.filter(e =>
            isNoRequiredOrActiveSelection(e)
            && Maybe.fromMaybe(false, e.lookup('req').map(req =>
              validatePrerequisites(wiki, state, req, entry.get('id'))
            ))
          );
        })
    )
    .on('SA_9', () => {
      const maybeCounter = getActiveSecondarySelections(instance);

      return entry.lookup('select')
        .map(select => {
          const isNoRequiredSelection = getIsNoRequiredSelection(instance);

          const isValidSelection = Maybe.isJust(maybeCounter)
            ? (e: Record<Wiki.SelectionObject>) => {
              const counter = Maybe.fromJust(maybeCounter);

              if (isNoRequiredSelection(e)) {
                return false;
              }
              else if (counter.member(e.get('id'))) {
                return Maybe.fromMaybe(
                  false,
                  Maybe.ensure(isString, e.get('id'))
                    .bind(state.get('skills').lookup)
                    .bind(skill => counter.lookup(e.get('id'))
                      .map(arr =>
                        arr.length() < 3
                        && skill.get('value') >= 6 * (arr.length() + 1)
                      )
                    )
                );
              }
              else {
                return Maybe.fromMaybe(
                  false,
                  Maybe.ensure(isString, e.get('id'))
                    .bind(state.get('skills').lookup)
                    .map(skill => skill.get('value') >= 6)
                );
              }
            }
            : (e: Record<Wiki.SelectionObject>) => {
              if (isNoRequiredSelection(e)) {
                return false;
              }
              else {
                return Maybe.fromMaybe(
                  false,
                  Maybe.ensure(isString, e.get('id'))
                    .bind(state.get('skills').lookup)
                    .map(skill => skill.get('value') >= 6)
                );
              }
            };

          return select.filter(isValidSelection);
        })
        .map(select => select.map(e => {
          const id = e.get('id') as string;

          const list = maybeCounter.bind(counter => counter.lookup(id));

          return e.mergeMaybe(Record.of({
            cost: Maybe.isJust(list)
              ? e.lookup('cost')
                .map(cost => cost * (Maybe.fromJust(list).length() + 1))
              : e.lookup('cost'),
            applications: e.lookup('applications').map(apps =>
              apps.filter(n => {
                const isInactive = !Maybe.isJust(list)
                  || !Maybe.fromJust(list).elem(n.get('id'));

                const req = n.lookup('prerequisites');

                const arePrerequisitesMet =
                  !Maybe.isJust(req) ||
                  validatePrerequisites(wiki, state, Maybe.fromJust(req), id);

                return isInactive && arePrerequisitesMet;
              })
            )
          })) as Record<Wiki.SelectionObject>;
        }));
    })
    .on('SA_28', () =>
      entry.lookup('select')
        .map(select => {
          const isNoActiveSelection = getIsNoActiveSelection(instance);
          const isNoRequiredSelection = getIsNoRequiredSelection(instance);

          return select.filter(e => {
            if (isNoRequiredSelection(e)) {
              return false;
            }
            else {
              return Maybe.fromMaybe(
                false,
                e.lookup('talent')
                  .bind(talent =>
                    state.get('skills').lookup(Tuple.fst(talent))
                      .map(skill =>
                        isNoActiveSelection(e)
                        && skill.get('value') >= Tuple.snd(talent)
                      )
                  )
              );
            }
          });
        })
    )
    .on('SA_29', () =>
      entry.lookup('select')
        .map(select => {
          const isNoRequiredSelection = getIsNoRequiredSelection(instance);

          const active = Maybe.fromMaybe<List<Record<Data.ActiveObject>>>(
            List.of(),
            instance.map(e => e.get('active'))
          );

          return select.filter(e =>
            isNoRequiredSelection(e)
            && active.all(n => !n.lookup('sid').equals(e.lookup('id')))
          );
        })
    )
    .on('SA_72', () => {
      return entry.lookup('select')
        .map(select => {
          const propertiesWithValidSpells = getCategoriesWithSkillsAbove10(
            wiki, state, 'spells'
          );

          const isNoRequiredOrActiveSelection =
            getIsNoRequiredOrActiveSelection(instance);

          return select.filter(e => {
            return isNoRequiredOrActiveSelection(e)
              && !propertiesWithValidSpells.elem(e.get('id') as number);
          });
        });
    })
    .on('SA_81', () =>
      entry.lookup('select')
        .map(select => {
          const isNoActivePropertyKnowledge =
            getIsNoActiveSelection(
              state.get('specialAbilities').lookup('SA_72')
            );

          const isNoRequiredOrActiveSelection =
            getIsNoRequiredOrActiveSelection(instance);

          return select.filter(e =>
            isNoRequiredOrActiveSelection(e)
            && isNoActivePropertyKnowledge(e)
          );
        })
    )
    .on('SA_87', () =>
      entry.lookup('select')
        .bind(select => {
          const aspectsWithValidChants = getCategoriesWithSkillsAbove10(
            wiki, state, 'liturgicalChants'
          );

          const isNoRequiredOrActiveSelection =
            getIsNoRequiredOrActiveSelection(instance);

          return getBlessedTradition(state.get('specialAbilities'))
            .map(tradition =>
              select.filter(e =>
                getBlessedTraditionInstanceIdByNumericId(
                  getTraditionOfAspect(e.get('id') as number)
                )
                  .equals(Maybe.Just(tradition.get('id')))
                && isNoRequiredOrActiveSelection(e)
                && !aspectsWithValidChants.elem(e.get('id') as number)
              )
            )
        })
    )
    .on('SA_231', () =>
      entry.lookup('select')
        .map(select => {
          const isNoRequiredOrActiveSelection =
            getIsNoRequiredOrActiveSelection(instance);

          return select.filter(e =>
            isNoRequiredOrActiveSelection(e)
            && Maybe.fromMaybe(
              false,
              state.get('spells').lookup(e.get('id') as string)
                .map(spell => spell.get('value') >= 10)
            )
          );
        })
    )
    .on('SA_338', () =>
      entry.lookup('select')
        .map(select => {
          const activeSelections = getActiveSelections(instance);

          if (isActive(instance)) {
            const selectedPath = instance
              .map(e => e.active[0])
              .map(e => e.sid)
              .bind(e => findSelectOption(entry, e))
              .map(obj => obj.gr);

            const highestLevel = Math.max(...Maybe.catMaybes(
              activeSelections.map(e => {
                return findSelectOption(entry, e).map(e => e.tier);
              })
            ));

            return select.filter(e =>
              selectedPath.equals(Maybe.of(e.gr)) &&
              e.tier === highestLevel + 1
            );
          }
          else {
            return R.filter(e => e.tier === 1, select);
          }
        })
    )
    .on([
      'SA_414',
      'SA_663',
    ].includes, () =>
      entry.lookup('select')
        .map(select => {
          const activeSelections = getActiveSelections(instance);
          const requiredSelections = getRequiredSelections(instance);

          type GetInstance = (target: string | undefined) =>
            Data.ActivatableSkillDependent | undefined;

          const getInstance: GetInstance = entry.id === 'SA_414'
            ? target => state.spells.get(target!)
            : target => state.liturgicalChants.get(target!);

          type GetWikiEntry = (target: string | undefined) =>
          Wiki.Spell | Wiki.LiturgicalChant | undefined;

          const getWikiEntry: GetWikiEntry = entry.id === 'SA_414'
            ? target => wiki.spells.get(target!)
            : target => wiki.liturgicalChants.get(target!);

          return select.reduce<Wiki.SelectionObject[]>((arr, e) => {
            const targetInstance = getInstance(e.target);
            const targetWikiEntry = getWikiEntry(e.target);

            if (
              !activeSelections.includes(e.id)
              && validatePrerequisites(wiki, state, e.req!, entry.id)
              && !requiredSelections.includes(e.id)
              && targetWikiEntry
              && targetInstance
              && targetInstance.value >= e.tier! * 4 + 4
            ) {
              return [
                ...arr,
                { ...e, name: `${targetWikiEntry.name}: ${e.name}` }
              ];
            }
            return arr;
          }, []);
        })
    )
    .on('SA_639', () =>
      entry.lookup('select')
        .map(select => {
          const activeSelections = getActiveSelections(instance);
          const requiredSelections = getRequiredSelections(instance);

          return R.filter(e => {
            return !activeSelections.includes(e.id)
              && !requiredSelections.includes(e.id)
              && validatePrerequisites(
                  wiki,
                  state,
                  e.prerequisites!,
                  entry.id,
                );
          }, select);
        })
    )
    .on('SA_699', () =>
      Maybe.of(wiki.specialAbilities.get('SA_29'))
        .bind(languagesWikiEntry => {
          return Maybe.of(languagesWikiEntry.select)
            .map(select => {
              interface AvailableLanguage {
                id: number;
                tier: number;
              }

              const availableLanguages: AvailableLanguage[] =
                Maybe.of(state.specialAbilities.get('SA_29'))
                  .map(lang => {
                    return lang.active.reduce<AvailableLanguage[]>(
                      (arr, obj) => {
                        if (obj.tier === 3 || obj.tier === 4) {
                          return [
                            ...arr,
                            {
                              id: obj.sid as number,
                              tier: obj.tier
                            }
                          ];
                        }
                        return arr;
                      },
                      []
                    );
                  })
                  .valueOr([]);

              return select.reduce<Wiki.SelectionObject[]>((acc, e) => {
                const language = Maybe.of(availableLanguages.find(l => {
                  return l.id === e.id;
                }));

                const firstForLanguage = instance
                  .map(e => e.active)
                  .map(active => !active.every(a => {
                    return a.sid === e.id;
                  }));

                if (Maybe.isJust(language) && firstForLanguage) {
                  const isMotherTongue = language.valueOr().tier === 4;

                  if (isMotherTongue) {
                    return R.append({ ...e, cost: 0 }, acc);
                  }

                  return R.append(e, acc);
                }

                return acc;
              }, []);
            });
        })
    )
    .otherwise(() =>
      entry.lookup('select')
        .map(select => {
          const activeSelections = getActiveSelections(instance);
          const requiredSelections = getRequiredSelections(instance);

          return R.filter(R.both(
            e => R.not(R.contains(e.id, activeSelections)),
            e => R.not(R.contains(e.id, requiredSelections)),
          ), select);
        })
    );
};

interface InactiveOptions {
  cost?: string | number | number[];
  tiers?: number;
  minTier?: number;
  maxTier?: number;
  customCostDisabled?: boolean;
}

const getOtherOptions = (
  wiki: WikiState,
  instance: Data.ActivatableDependent,
  state: Data.HeroDependent,
  adventurePoints: AdventurePointsObject,
  entry: Wiki.Activatable,
) => {
  return match<string, Maybe<InactiveOptions>>(entry.id)
    .on('DISADV_59', () => {
      return R.ifElse(
        R.gt(3),
        activeSpells => ({ maxTier: 3 - activeSpells }),
        () => undefined,
      )(countActiveSkillEntries(state, "spells"));
    })
    .on('SA_17', () => {
      return R.ifElse(
        R.lte(12),
        activeSpells => ({ maxTier: 3 - activeSpells }),
        () => undefined,
      )(R.add(
        R.defaultTo(0, Maybe.of(state.skills.get('TAL_51'))
          .map(skill => skill.value)
          .value
        ),
        R.defaultTo(0, Maybe.of(state.skills.get('TAL_55'))
          .map(skill => skill.value)
          .value
        )
      ));
    })
    .on('SA_18', () => {
      return R.ifElse(
        R.lt(0),
        R.always({}),
        () => undefined,
      )(R.length(R.filter(
        e => e.value >= 10,
        getAllEntriesByGroup(
          wiki.combatTechniques,
          state.combatTechniques,
          2,
        )
      )));
    })
    .on([
      'SA_70',
      'SA_255',
      'SA_345',
      'SA_346',
      'SA_676',
      'SA_681',
    ].includes, () => {
      return Maybe.ofPred(
        R.pipe<Data.ActivatableDependent[], number, boolean>(
          R.length,
          R.equals(0),
        ),
        getMagicalTraditions(state.specialAbilities)
      )
        .map(() => ({}));
    })
    .on([
      'SA_86',
      'SA_682',
      'SA_683',
      'SA_684',
      'SA_685',
      'SA_686',
      'SA_687',
      'SA_688',
      'SA_689',
      'SA_690',
      'SA_691',
      'SA_692',
      'SA_693',
      'SA_694',
      'SA_695',
      'SA_696',
      'SA_697',
      'SA_698',
    ].includes, () => {
      return getBlessedTradition(state.specialAbilities)
        .map(() => ({}));
    })
    .on('SA_72', () => ({ cost: [10, 20, 40][instance.active.length] }))
    .on('SA_87', () => ({ cost: [15, 25, 45][instance.active.length] }))
    .on('SA_533', () => {
      return Maybe.of(state.specialAbilities.get('SA_531'))
        .map(specialAbility => specialAbility.active[0])
        .map(active => active.sid)
        .map(sid => wiki.skills.get(sid as string))
        .map(skill => {
          return { cost: (entry.cost as number[]).map(e => e + skill.ic) };
        })
        .value;
    })
    .on([
      'SA_544',
      'SA_545',
      'SA_546',
      'SA_547',
      'SA_548',
    ].includes, () => {
      return ifOrUndefined(
        R.either(
          R.both(
            () => isActive(state.advantages.get('ADV_77')),
            () => R.pipe(
              (max: number) => {
                if (isActive(state.advantages.get('ADV_79'))) {
                  return max + R.defaultTo(
                    1,
                    Maybe.of(state.advantages.get('ADV_79'))
                      .map(obj => obj.active[0])
                      .map(active => active.tier)
                      .value
                  );
                }
                else if (isActive(state.advantages.get('DISADV_72'))) {
                  return max - R.defaultTo(
                    1,
                    Maybe.of(state.advantages.get('DISADV_72'))
                      .map(obj => obj.active[0])
                      .map(active => active.tier)
                      .value
                  );
                }

                return max;
              },
              R.lt(countActiveGroupEntries(wiki, state, 24)),
            )(3),
          ),
          () => isActive(state.advantages.get('ADV_12')),
        ),
        () => ({}),
      )(undefined);
    })
    .on([
      'SA_549',
      'SA_550',
      'SA_551',
      'SA_552',
      'SA_553',
    ].includes, () => {
      return ifOrUndefined(
        R.either(
          R.both(
            () => isActive(state.advantages.get('ADV_78')),
            () => R.pipe(
              (max: number) => {
                if (isActive(state.advantages.get('ADV_80'))) {
                  return max + R.defaultTo(
                    1,
                    Maybe.of(state.advantages.get('ADV_80'))
                      .map(obj => obj.active[0])
                      .map(active => active.tier)
                      .value
                  );
                }
                else if (isActive(state.advantages.get('DISADV_73'))) {
                  return max - R.defaultTo(
                    1,
                    Maybe.of(state.advantages.get('DISADV_73'))
                      .map(obj => obj.active[0])
                      .map(active => active.tier)
                      .value
                  );
                }

                return max;
              },
              R.lt(countActiveGroupEntries(wiki, state, 27)),
            )(3),
          ),
          () => isActive(state.advantages.get('ADV_12')),
        ),
        () => ({}),
      )(undefined);
    })
    .on('SA_667', () => ({ maxTier: state.pact!.level }))
    .on([
      'SA_677',
      'SA_678',
      'SA_679',
      'SA_680',
    ].includes, R.ifElse(
      () => {
        return adventurePoints.spentOnMagicalAdvantages <= 25 &&
          adventurePoints.spentOnMagicalDisadvantages <= 25 &&
          getMagicalTraditions(state.specialAbilities).length === 0;
      },
      () => ({}),
      () => undefined
    ) as () => ({} | undefined))
    .otherwise(() => ({}));
};

/**
 * Calculates whether an Activatable is valid to add or not and, if valid,
 * calculates and filters necessary properties and selection lists. Returns a
 * Maybe of the result or `undefined` if invalid.
 * @param wiki
 * @param instance
 * @param state
 * @param validExtendedSpecialAbilities
 * @param locale
 * @param adventurePoints
 */
export const getInactiveView = (
  wiki: WikiState,
  instance: Data.ActivatableDependent,
  state: Data.HeroDependent,
  validExtendedSpecialAbilities: string[],
  locale: Data.UIMessages,
  adventurePoints: AdventurePointsObject,
): Maybe<Data.DeactiveViewObject> => {
  const { id, dependencies } = instance;

  return getWikiEntry<Wiki.Activatable>(wiki, id)
    .bind(entry => {
      const { cost, name, input, tiers, prerequisites} = entry;

      const maxTier = prerequisites instanceof Map ? validateTier(
        wiki,
        state,
        prerequisites,
        dependencies,
        id,
      ) : undefined;

      const isValid = isAdditionDisabled(
        wiki,
        instance,
        state,
        validExtendedSpecialAbilities,
        entry,
        maxTier,
      );

      if (isValid) {
        const specificSelections = getEntrySpecificSelections(
          wiki,
          instance,
          state,
          entry,
        );

        const otherOptions = getOtherOptions(
          wiki,
          instance,
          state,
          adventurePoints,
          entry,
        );

        type OptionalSelect = Wiki.SelectionObject[] | undefined;

        return Maybe.of(specificSelections.valueOr(entry.select))
          .map(sel => {
            if (!exists(sel) || R.gt(R.length(sel), 0)) {
              return {
                id,
                name,
                cost,
                input,
                tiers,
                maxTier,
                instance,
                wiki: entry,
                ...otherOptions,
                sel: ifOrUndefined<OptionalSelect, OptionalSelect>(
                  sel => exists(sel),
                  sel => sortObjects(sel!, locale.id),
                )(sel)
              };
            }

            return;
          });
      }

      return Maybe.Nothing();
    });
}
