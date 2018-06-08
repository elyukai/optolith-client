import R from 'ramda';
import { WikiState } from '../reducers/wikiReducer';
import { AdventurePointsObject } from '../selectors/adventurePointsSelectors';
import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki.d';
import { sortObjects } from './FilterSortUtils';
import { getBlessedTraditionInstanceIdByNumericId } from './IDUtils';
import { getTraditionOfAspect } from './LiturgyUtils';
import { getWikiEntry } from './WikiUtils';
import { isAdditionDisabled } from './activatableInactiveValidationUtils';
import { countActiveSkillEntries } from './activatableSkillUtils';
import { convertMapToValues, setM } from './collectionUtils';
import { countActiveGroupEntries } from './entryGroupUtils';
import { exists } from './exists';
import { getAllEntriesByGroup } from './heroStateUtils';
import { isActive } from './isActive';
import { match } from './match';
import { Maybe } from './maybe';
import { findSelectOption, getActiveSecondarySelections, getActiveSelections, getRequiredSelections } from './selectionUtils';
import { getBlessedTradition, getMagicalTraditions } from './traditionUtils';
import { validatePrerequisites, validateTier } from './validatePrerequisitesUtils';

const getIsNoActiveSelection = (instance: Maybe<Data.ActivatableDependent>) => {
  const activeSelections = getActiveSelections(instance);
  return (e: Wiki.SelectionObject) => !activeSelections.includes(e.id);
};

const getIsNoRequiredSelection = (instance: Maybe<Data.ActivatableDependent>) => {
  const requiredSelections = getRequiredSelections(instance);
  return (e: Wiki.SelectionObject) => !requiredSelections.includes(e.id);
};

const getEntrySpecificSelections = (
  wiki: WikiState,
  instance: Maybe<Data.ActivatableDependent>,
  state: Data.HeroDependent,
  entry: Wiki.Activatable,
) => {
  return match<string, Maybe<Wiki.SelectionObject[]>>(entry.id)
    .on([
      'ADV_4',
      'ADV_17',
      'ADV_47',
    ].includes, () =>
      Maybe.of(entry.select)
        .map(select => {
          const isNoActiveSelection = getIsNoActiveSelection(instance);
          const isNoRequiredSelection = getIsNoRequiredSelection(instance);

          return select.filter(e =>
            isNoActiveSelection(e) && isNoRequiredSelection(e)
          );
        })
    )
    .on('ADV_16', () =>
      Maybe.of(entry.select)
        .map(select => {
          const activeSelections = getActiveSelections(instance);
          const isNoRequiredSelection = getIsNoRequiredSelection(instance);

          return R.filter(e => activeSelections.filter(s => s === e.id).length < 2R.both(
            e => R.lt(
              R.length(R.filter(R.equals(e.id), activeSelections)),
              2,
            ),
            e => R.not(R.contains(e.id, requiredSelections)),
          ), select);
        })
    )
    .on([
      'ADV_28',
      'ADV_29',
    ].includes, () =>
      Maybe.of(entry.select)
        .map(select => {
          const requiredSelections = getRequiredSelections(instance);

          return R.filter(
            e => R.not(R.contains(e.id, requiredSelections)),
            select,
          );
        })
    )
    .on([
      'ADV_32',
      'DISADV_24',
    ].includes, id =>
      Maybe.of(entry.select)
        .map(select => {
          const flippedId = id === 'DISADV_24' ? 'ADV_32' : id;

          const activeSelections = getActiveSelections(
            Maybe.of(state.disadvantages.get(flippedId))
          );

          const requiredSelections = getRequiredSelections(instance);

          return R.filter(R.both(
            e => R.lt(
              R.length(R.filter(R.equals(e.id), activeSelections)),
              2,
            ),
            e => R.not(R.contains(e.id, requiredSelections)),
          ), select);
        })
    )
    .on([
      'DISADV_1',
      'DISADV_34',
      'DISADV_50',
    ].includes, () =>
      Maybe.of(entry.select)
        .map(select => {
          const requiredSelections = getRequiredSelections(instance);

          return R.filter(
            e => R.not(R.contains(e.id, requiredSelections)),
            select,
          );
        })
    )
    .on([
      'DISADV_33',
      'DISADV_37',
      'DISADV_51',
    ].includes, id =>
      Maybe.of(entry.select)
        .map(select => {
          const activeSelections = getActiveSelections(instance);
          const requiredSelections = getRequiredSelections(instance);

          return R.ifElse(
            R.equals('DISADV_33'),
            R.always(R.filter(R.either(
              e => R.contains(e.id, [7, 8]),
              R.both(
                e => R.not(R.contains(e.id, activeSelections)),
                e => R.not(R.contains(e.id, requiredSelections)),
              ),
            ), select)),
            R.always(R.filter(R.both(
              e => R.not(R.contains(e.id, activeSelections)),
              e => R.not(R.contains(e.id, requiredSelections)),
            ), select)),
          )(id);
        })
    )
    .on('DISADV_36', () =>
      Maybe.of(entry.select)
        .map(select => {
          const activeSelections = getActiveSelections(instance);
          const requiredSelections = getRequiredSelections(instance);

          return R.filter(R.both(
            e => R.not(R.contains(e.id, activeSelections)),
            e => R.not(R.contains(e.id, requiredSelections)),
          ), select);
        })
    )
    .on('DISADV_48', () =>
      Maybe.of(entry.select)
        .map(select => {
          const activeSelections = getActiveSelections(instance);
          const requiredSelections = getRequiredSelections(instance);

          return R.filter(R.ifElse(
            R.both(
              R.either(
                R.always(R.defaultTo(
                  false,
                  Maybe.of(state.advantages.get('ADV_40'))
                    .map(e => R.gt(e.active.length, 0)).value,
                )),
                R.always(R.defaultTo(
                  false,
                  Maybe.of(state.advantages.get('ADV_46'))
                    .map(e => R.gt(e.active.length, 0)).value,
                )),
              ),
              e => Maybe.of(wiki.skills.get(e.id as string))
                .map(skill => R.equals(skill.ic, 2))
                .valueOr(false),
            ),
            R.F,
            R.both(
              e => R.not(R.contains(e.id, activeSelections)),
              e => R.not(R.contains(e.id, requiredSelections)),
            ),
          ), select);
        })
    )
    .on('SA_3', () =>
      Maybe.of(entry.select)
        .map(select => {
          const activeSelections = getActiveSelections(instance);
          const requiredSelections = getRequiredSelections(instance);

          return R.filter(R.allPass([
            (e: Wiki.SelectionObject) => R.not(R.contains(
              e.id,
              activeSelections,
            )),
            (e: Wiki.SelectionObject) => R.not(R.contains(
              e.id,
              requiredSelections,
            )),
            (e: Wiki.SelectionObject) => R.both(
              exists,
              req => validatePrerequisites(wiki, state, req, entry.id)
            )(e.req),
          ]), select);
        })
    )
    .on('SA_9', () => {
      const counter = getActiveSecondarySelections(instance);
      return Maybe.of(entry.select)
        .map(select => {
          const requiredSelections = getRequiredSelections(instance);

          return R.filter(e => {
            return match<string | number, boolean>(e.id)
              .on(id => R.not(R.contains(id, requiredSelections)), R.F)
              .on(counter.has, id => {
                const arr = Maybe.of(counter.get(id));

                return Maybe.ofPred(isString, id)
                  .map(state.skills.get)
                  .bind(skill => arr.map(arr =>
                    arr.length < 3 && skill.value >= 6 * (arr.length + 1)
                  ))
                  .valueOr(false);
              })
              .otherwise(id => Maybe.ofPred(isString, id)
                .map(state.skills.get)
                .map(skill => skill.value >= 6)
                .valueOr(false)
              );
          }, select);
        })
        .map(R.map(e => {
          const id = e.id as string;
          const arr = counter.get(id);
          return {
            ...e,
            cost: arr ? e.cost! * (arr.length + 1) : e.cost,
            applications: e.applications && e.applications.filter(n => {
              const isInactive = !arr || !arr.includes(n.id);
              const arePrerequisitesMet =
                typeof n.prerequisites !== 'object' ||
                validatePrerequisites(wiki, state, n.prerequisites, id);

              return isInactive && arePrerequisitesMet;
            })
          };
        }));
    })
    .on('SA_28', () =>
      Maybe.of(entry.select)
        .map(select => {
          const activeSelections = getActiveSelections(instance);
          const requiredSelections = getRequiredSelections(instance);

          return R.filter(e => {
            return match<string | number, boolean>(e.id)
              .on(id => R.not(R.contains(id, requiredSelections)), R.F)
              .otherwise(id => {
                return R.defaultTo(false, Maybe.of(e.talent)
                  .map(talent => {
                    return Maybe.of(state.skills.get(talent[0]))
                      .map(skill => {
                        return R.both(
                          () => R.not(R.contains(id, activeSelections)),
                          () => R.gte(skill.value, talent[1])
                        )();
                      })
                      .value;
                  })
                  .value);
              });
          }, select);
        })
    )
    .on('SA_29', () =>
      Maybe.of(entry.select)
        .map(select => {
          const requiredSelections = getRequiredSelections(instance);

          const active = instance
            .map(e => e.active)
            .valueOr<Data.ActiveObject[]>([]);

          return R.filter(e =>
            !requiredSelections.includes(e.id)
            && active.every(n => n.sid !== e.id), select);
        })
    )
    .on('SA_72', () => {
      const getPropertiesWithValidSpells = R.pipe(
        (list: Data.ActivatableSkillDependent[]) => R.filter(
          e => e.value >= 10, list
        ),
        list => R.reduce((coll, obj) => {
          return R.defaultTo(
            coll,
            Maybe.of(wiki.spells.get(obj.id))
              .map(spell => {
                return setM(
                  spell.property,
                  R.defaultTo(0, coll.get(spell.property)) + 1,
                )(coll);
              })
              .value
          );
        }, new Map() as ReadonlyMap<number, number>, list),
        list => [...list].reduce<number[]>(
          (list, prop) => prop[1] >= 3 ? R.append(prop[0], list) : list,
          []
        ),
      );

      return Maybe.of(entry.select)
        .map(select => {
          const propertiesWithValidSpells =
            getPropertiesWithValidSpells(
              convertMapToValues(state.spells)
            );

          const activeSelections = getActiveSelections(instance);
          const requiredSelections = getRequiredSelections(instance);

          return R.filter(
            R.allPass([
              (e: Wiki.SelectionObject) => R.not(R.contains(
                e.id,
                activeSelections,
              )),
              (e: Wiki.SelectionObject) => R.not(R.contains(
                e.id,
                requiredSelections,
              )),
              (e: Wiki.SelectionObject) => R.not(R.contains(
                e.id,
                propertiesWithValidSpells,
              )),
            ]),
            select
          );
        });
    })
    .on('SA_81', () =>
      Maybe.of(entry.select)
        .map(select => {
          return Maybe.of(state.specialAbilities.get('SA_72'))
            .map(propertyKnowledge => {
              const activePropertyKnowledges =
                getActiveSelections(Maybe.Just(propertyKnowledge));
              const activeSelections =
                getActiveSelections(instance);
              const requiredSelections =
                getRequiredSelections(instance);

              return R.filter(
                R.allPass([
                  (e: Wiki.SelectionObject) => R.not(R.contains(
                    e.id,
                    activeSelections,
                  )),
                  (e: Wiki.SelectionObject) => R.not(R.contains(
                    e.id,
                    requiredSelections,
                  )),
                  (e: Wiki.SelectionObject) => R.not(R.contains(
                    e.id,
                    activePropertyKnowledges,
                  )),
                ]),
                select
              );
            })
            .value;
        })
    )
    .on('SA_87', () => {
      const getAspectsWithValidLiturgicalChants = R.pipe(
        (list: Data.ActivatableSkillDependent[]) => R.filter(
          e => e.value >= 10, list
        ),
        list => R.reduce((coll, obj) => {
          return R.defaultTo(
            coll,
            Maybe.of(wiki.liturgicalChants.get(obj.id))
              .map(chant => {
                return chant.aspects.reduce((coll, aspect) => {
                  return setM(
                    aspect,
                    R.defaultTo(0, coll.get(aspect)) + 1,
                  )(coll)
                }, coll);
              })
              .value
          );
        }, new Map() as ReadonlyMap<number, number>, list),
        list => [...list].reduce<number[]>(
          (list, prop) => prop[1] >= 3 ? R.append(prop[0], list) : list,
          []
        ),
      );

      return Maybe.of(entry.select)
        .bind(select => {
          const aspectsWithValidLiturgicalChants =
            getAspectsWithValidLiturgicalChants(
              convertMapToValues(state.spells)
            );

          const activeSelections = getActiveSelections(instance);
          const requiredSelections = getRequiredSelections(instance);

          return getBlessedTradition(state.specialAbilities)
            .map(tradition => {
              return R.filter(
                R.allPass([
                  (e: Wiki.SelectionObject) => R.equals(
                    getBlessedTraditionInstanceIdByNumericId(
                      getTraditionOfAspect(e.id as number)
                    ),
                    Maybe.Just(tradition.id),
                  ),
                  (e: Wiki.SelectionObject) => R.not(R.contains(
                    e.id,
                    activeSelections,
                  )),
                  (e: Wiki.SelectionObject) => R.not(R.contains(
                    e.id,
                    requiredSelections,
                  )),
                  (e: Wiki.SelectionObject) => R.not(R.contains(
                    e.id,
                    aspectsWithValidLiturgicalChants,
                  )),
                ]),
                select
              );
            });
        });
    })
    .on('SA_231', () =>
      Maybe.of(entry.select)
        .map(select => {
          const activeSelections = getActiveSelections(instance);
          const requiredSelections = getRequiredSelections(instance);

          return R.filter(
            R.allPass([
              (e: Wiki.SelectionObject) => R.not(R.contains(
                e.id,
                activeSelections,
              )),
              (e: Wiki.SelectionObject) => R.not(R.contains(
                e.id,
                requiredSelections,
              )),
              (e: Wiki.SelectionObject) =>
                Maybe.of(state.spells.get(e.id as string))
                  .map(R.pipe(
                    spell => spell.value,
                    R.lte(10),
                  ))
                  .valueOr(false),
            ]),
            select
          );
        })
    )
    .on('SA_338', () =>
      Maybe.of(entry.select)
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
      Maybe.of(entry.select)
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
      Maybe.of(entry.select)
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
      Maybe.of(entry.select)
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
