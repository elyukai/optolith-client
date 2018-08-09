/**
 * Get the needed options for `Activatable` entries that are available to
 * activate.
 *
 * @file src/utils/activatableInactiveUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { AdventurePointsObject } from '../selectors/adventurePointsSelectors';
import * as Data from '../types/data';
import * as Wiki from '../types/wiki';
import { isAdditionDisabled } from './activatableInactiveValidationUtils';
import { countActiveSkillEntries } from './activatableSkillUtils';
import { List, Maybe, OrderedMap, Record, Tuple } from './dataUtils';
import { countActiveGroupEntries } from './entryGroupUtils';
import { sortObjects } from './FilterSortUtils';
import { getAllEntriesByGroup } from './heroStateUtils';
import { getBlessedTraditionInstanceIdByNumericId } from './IDUtils';
import { isActive } from './isActive';
import { getTraditionOfAspect } from './liturgicalChantUtils';
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
  state: Record<Data.HeroDependent>,
  sliceKey: 'liturgicalChants' | 'spells',
) => {
  const addToCounterByKey = sliceKey === 'liturgicalChants'
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

  return state.get(sliceKey).elems()
    .filter(e => e.get('value') >= 10)
    .foldl<OrderedMap<number, number>>(
      map => obj =>
        Maybe.fromMaybe(
          map,
          (wiki.get(sliceKey).lookup(
            obj.get('id')
          ) as Maybe<Record<Wiki.Spell | Wiki.LiturgicalChant>>)
            .map(addToCounterByKey(map))
        ),
      OrderedMap.empty()
    )
    .foldlWithKey<List<number>>(
      list => key => value => value >= 3 ? list.append(key) : list,
      List.of()
    );
};

const getEntrySpecificSelections = (
  wiki: Record<Wiki.WikiAll>,
  instance: Maybe<Record<Data.ActivatableDependent>>,
  state: Record<Data.HeroDependent>,
  entry: Wiki.Activatable,
) => {
  return match<string, Maybe<List<Record<Wiki.SelectionObject>>>>(entry.get('id'))
    .on(
      [
        'ADV_4',
        'ADV_17',
        'ADV_47',
      ].includes,
      () => entry.lookup('select')
        .map(
          select => select.filter(getIsNoRequiredOrActiveSelection(instance))
        )
    )
    .on(
      'ADV_16',
      () => entry.lookup('select')
        .map(select => {
          const hasLessThanTwoSameIdActiveSelections =
            getLessThanTwoSameIdActiveSelections(instance);

          const isNoRequiredSelection = getIsNoRequiredSelection(instance);

          return select.filter(
            e =>
              hasLessThanTwoSameIdActiveSelections(e)
              && isNoRequiredSelection(e)
          );
        })
    )
    .on(
      [
        'ADV_28',
        'ADV_29',
      ].includes,
      () => entry.lookup('select')
        .map(select => select.filter(getIsNoRequiredSelection(instance)))
    )
    .on(
      [
        'ADV_32',
        'DISADV_24',
      ].includes,
      id => entry.lookup('select')
        .map(select => {
          const flippedId = id === 'DISADV_24' ? 'ADV_32' : id;

          const hasLessThanTwoSameIdActiveSelections =
            getLessThanTwoSameIdActiveSelections(
              state.get('disadvantages').lookup(flippedId)
            );

          const isNoRequiredSelection = getIsNoRequiredSelection(instance);

          return select.filter(
            e =>
              hasLessThanTwoSameIdActiveSelections(e)
              && isNoRequiredSelection(e)
          );
        })
    )
    .on(
      [
        'DISADV_1',
        'DISADV_34',
        'DISADV_50',
      ].includes,
      () => entry.lookup('select')
        .map(select => select.filter(getIsNoRequiredSelection(instance)))
    )
    .on(
      [
        'DISADV_33',
        'DISADV_37',
        'DISADV_51',
      ].includes,
      id => entry.lookup('select')
        .map(select => {
          const isNoRequiredOrActiveSelection =
            getIsNoRequiredOrActiveSelection(instance);

          if (id === 'DISADV_33') {
            const specialIds = List.of(7, 8);

            return select.filter(
              e =>
                specialIds.elem(e.get('id') as number)
                || isNoRequiredOrActiveSelection(e)
            );
          }
          else {
            return select.filter(isNoRequiredOrActiveSelection);
          }
        })
    )
    .on(
      'DISADV_36',
      () => entry.lookup('select')
        .map(
          select => select.filter(getIsNoRequiredOrActiveSelection(instance))
        )
    )
    .on(
      'DISADV_48',
      () => entry.lookup('select')
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

          return select.filter(
            e =>
              (
                (isAdvantageActive('ADV_40') || isAdvantageActive('ADV_46'))
                && isSkillOfIcB(e)
              )
              || isNoRequiredOrActiveSelection(e)
          );
        })
    )
    .on(
      'SA_3',
      () => entry.lookup('select')
        .map(select => {
          const isNoRequiredOrActiveSelection =
            getIsNoRequiredOrActiveSelection(instance);

          return select.filter(
            e =>
              isNoRequiredOrActiveSelection(e)
              && Maybe.fromMaybe(false, e.lookup('req').map(
                req => validatePrerequisites(wiki, state, req, entry.get('id'))
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
                    .bind(
                      skill => counter.lookup(e.get('id'))
                        .map(
                          arr =>
                            arr.length() < 3
                            && skill.get('value') >= (arr.length() + 1) * 6
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
            applications: e.lookup('applications').map(
              apps => apps.filter(n => {
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
    .on(
      'SA_28',
      () => entry.lookup('select')
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
                  .bind(
                    talent => state.get('skills').lookup(Tuple.fst(talent))
                      .map(
                        skill =>
                          isNoActiveSelection(e)
                          && skill.get('value') >= Tuple.snd(talent)
                      )
                  )
              );
            }
          });
        })
    )
    .on(
      'SA_29',
      () => entry.lookup('select')
        .map(select => {
          const isNoRequiredSelection = getIsNoRequiredSelection(instance);

          const active = Maybe.fromMaybe<List<Record<Data.ActiveObject>>>(
            List.of(),
            instance.map(e => e.get('active'))
          );

          return select.filter(
            e =>
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
    .on(
      'SA_81',
      () => entry.lookup('select')
        .map(select => {
          const isNoActivePropertyKnowledge =
            getIsNoActiveSelection(
              state.get('specialAbilities').lookup('SA_72')
            );

          const isNoRequiredOrActiveSelection =
            getIsNoRequiredOrActiveSelection(instance);

          return select.filter(
            e =>
              isNoRequiredOrActiveSelection(e)
              && isNoActivePropertyKnowledge(e)
          );
        })
    )
    .on(
      'SA_87',
      () => entry.lookup('select')
        .bind(select => {
          const aspectsWithValidChants = getCategoriesWithSkillsAbove10(
            wiki, state, 'liturgicalChants'
          );

          const isNoRequiredOrActiveSelection =
            getIsNoRequiredOrActiveSelection(instance);

          return getBlessedTradition(state.get('specialAbilities'))
            .map(
              tradition => select.filter(
                e =>
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
    .on(
      'SA_231',
      () => entry.lookup('select')
        .map(select => {
          const isNoRequiredOrActiveSelection =
            getIsNoRequiredOrActiveSelection(instance);

          return select.filter(
            e =>
              isNoRequiredOrActiveSelection(e)
              && Maybe.fromMaybe(
                false,
                state.get('spells').lookup(e.get('id') as string)
                  .map(spell => spell.get('value') >= 10)
              )
          );
        })
    )
    .on(
      'SA_338',
      () => entry.lookup('select')
        .map(select => {
          const activeSelections = getActiveSelections(instance);

          if (isActive(instance)) {
            const selectedPath = instance
              .bind(e => e.get('active').head())
              .bind(e => e.lookup('sid'))
              .bind(e => findSelectOption(entry, Maybe.Just(e)))
              .bind(obj => obj.lookup('gr'));

            const highestLevel = activeSelections
              .map(List.map(
                selection => findSelectOption(entry, Maybe.Just(selection))
                  .bind(e => e.lookup('tier'))
              ))
              .map(Maybe.catMaybes)
              .map(List.maximum)
              .map(e => e + 1);

            return select.filter(
              e =>
                selectedPath.equals(e.lookup('gr'))
                && e.lookup('tier').equals(highestLevel)
            );
          }
          else {
            const just1 = Maybe.Just(1);

            return select.filter(e => e.lookup('tier').equals(just1));
          }
        })
    )
    .on(
      [
        'SA_414',
        'SA_663',
      ].includes,
      () => entry.lookup('select')
        .map(select => {
          const isNoRequiredOrActiveSelection =
            getIsNoRequiredOrActiveSelection(instance);

          type GetInstance = (target: Maybe<string>) =>
            Maybe<Record<Data.ActivatableSkillDependent>>;

          const getInstance: GetInstance = entry.get('id') === 'SA_414'
            ? target => target.bind(state.get('spells').lookup)
            : target => target.bind(state.get('liturgicalChants').lookup);

          type GetWikiEntry = (target: Maybe<string>) =>
          Maybe<Record<Wiki.Spell> | Record<Wiki.LiturgicalChant>>;

          const createGetWikiEntry: GetWikiEntry = entry.get('id') === 'SA_414'
            ? target => target.bind(wiki.get('spells').lookup)
            : target => target.bind(wiki.get('liturgicalChants').lookup);

          return select.foldl<List<Record<Wiki.SelectionObject>>>(
            arr => e => {
              const targetInstance = getInstance(e.lookup('target'));
              const targetWikiEntry = createGetWikiEntry(e.lookup('target'));

              if (
                isNoRequiredOrActiveSelection(e)
                && validatePrerequisites(
                  wiki,
                  state,
                  Maybe.fromMaybe(List.of(), e.lookup('req')),
                  entry.get('id')
                )
                && Maybe.isJust(targetWikiEntry)
                && Maybe.isJust(targetInstance)
                && targetInstance.map(target => target.get('value'))
                  .gte(e.lookup('tier').map(tier => tier * 4 + 4))
              ) {
                const target = Maybe.fromJust(targetWikiEntry);

                return arr.append(e.insert(
                  'name',
                  `${target.get('name')}: ${e.get('name')}`
                ));
              }

              return arr;
            },
            List.of()
          );
        })
    )
    .on(
      'SA_639',
      () => entry.lookup('select')
        .map(select => {
          const isNoRequiredOrActiveSelection =
            getIsNoRequiredOrActiveSelection(instance);

          return select.filter(
            e =>
              isNoRequiredOrActiveSelection(e)
              && validatePrerequisites(
                wiki,
                state,
                Maybe.fromMaybe(List.of(), e.lookup('req')),
                entry.get('id'),
              )
          );
        })
    )
    .on(
      'SA_699',
      () => wiki.get('specialAbilities').lookup('SA_29')
        .bind(
          languagesWikiEntry => languagesWikiEntry.lookup('select')
            .map(select => {
              interface AvailableLanguage {
                id: number;
                tier: number;
              }

              const availableLanguages: List<Record<AvailableLanguage>> =
                Maybe.fromMaybe(
                  List.of(),
                  state.get('specialAbilities').lookup('SA_29')
                    .map(
                      lang => lang.get('active')
                        .foldl<List<Record<AvailableLanguage>>>(
                          arr => obj =>
                            Maybe.fromMaybe(
                              arr,
                              obj.lookup('tier').bind(
                                tier => obj.lookup('sid')
                                  .bind(Maybe.ensure(x => x === 3 || x === 4))
                                  .map(sid => arr.append(Record.of({
                                    id: sid as number,
                                    tier
                                  })))
                              )
                            ),
                          List.of()
                        )
                    )
                );

              const justTrue = Maybe.Just(true);
              const just4 = Maybe.Just(4);

              return select.foldl<List<Record<Wiki.SelectionObject>>>(
                acc => e => {
                  const language = availableLanguages.find(
                    l => l.get('id') === e.get('id')
                  );

                  const firstForLanguage = instance
                    .map(
                      just => just.get('active').all(
                        a => a.lookup('sid').equals(just.lookup('id'))
                      )
                    );

                  if (
                    Maybe.isJust(language)
                    && firstForLanguage.equals(justTrue)
                  ) {
                    const isMotherTongue = language
                      .bind(languageRec => languageRec.lookup('tier'))
                      .equals(just4);

                    if (isMotherTongue) {
                      return acc.append(e.insert('cost', 0));
                    }

                    return acc.append(e);
                  }

                  return acc;
                },
                List.of()
              );
            })
        )
    )
    .otherwise(
      () => entry.lookup('select')
        .map(
          select => select.filter(getIsNoRequiredOrActiveSelection(instance))
        )
    );
};

interface InactiveOptions {
  cost?: string | number | List<number>;
  tiers?: number;
  minTier?: number;
  maxTier?: number;
  customCostDisabled?: boolean;
}

const getOtherOptions = (
  wiki: Record<Wiki.WikiAll>,
  instance: Maybe<Record<Data.ActivatableDependent>>,
  state: Record<Data.HeroDependent>,
  adventurePoints: Record<AdventurePointsObject>,
  entry: Wiki.Activatable,
) => {
  return match<string, Maybe<Record<InactiveOptions>>>(entry.get('id'))
    .on(
      'DISADV_59',
      () => Maybe.ensure(
        n => n < 3,
        countActiveSkillEntries(state, 'spells')
      )
        .map(activeSpells => Record.of<InactiveOptions>({
          maxTier: 3 - activeSpells
        }))
    )
    .on(
      'SA_17',
      () => state.get('skills').lookup('TAL_51')
        .bind(
          skill51 => state.get('skills').lookup('TAL_51')
            .bind(
              skill55 => Maybe.ensure(
                x => x >= 12,
                skill51.get('value') + skill55.get('value')
              )
                .map(() => Record.of({}))
            )
        )
    )
    .on(
      'SA_18',
      () => Maybe.ensure(
        x => x > 0,
        getAllEntriesByGroup(
          wiki.get('combatTechniques'),
          state.get('combatTechniques'),
          2,
        )
          .filter(e => e.get('value') >= 10)
          .length()
      )
        .map(() => Record.of({}))
    )
    .on(
      [
        'SA_70',
        'SA_255',
        'SA_345',
        'SA_346',
        'SA_676',
        'SA_681',
      ].includes,
      () => Maybe.ensure(
        list => list.length() === 0,
        getMagicalTraditions(state.get('specialAbilities'))
      )
        .map(() => Record.of({}))
    )
    .on(
      [
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
      ].includes,
      () =>
        getBlessedTradition(state.get('specialAbilities'))
          .map(() => Record.of({}))
    )
    .on('SA_72', () => Maybe.Just(Record.of<InactiveOptions>({
      cost: [10, 20, 40][Maybe.fromMaybe(
        0,
        instance.map(e => e.get('active').length())
      )]
    })))
    .on('SA_87', () => Maybe.Just(Record.of<InactiveOptions>({
      cost: [15, 25, 45][Maybe.fromMaybe(
        0,
        instance.map(e => e.get('active').length())
      )]
    })))
    .on(
      'SA_533',
      () =>
        state.get('specialAbilities').lookup('SA_531')
          .bind(specialAbility => specialAbility.get('active').head())
          .bind(active => active.lookup('sid'))
          .bind(sid => wiki.get('skills').lookup(sid as string))
          .map(skill => Record.of<InactiveOptions>({
            cost: (entry.get('cost') as List<number>).map(
              e => e + skill.get('ic')
            )
          }))
    )
    .on(
      [
        'SA_544',
        'SA_545',
        'SA_546',
        'SA_547',
        'SA_548',
      ].includes,
      () =>
        Maybe.ensure(
          () => {
            const isAdvantageActive = (id: string) =>
              isActive(state.get('advantages').lookup(id));

            const isDisadvantageActive = (id: string) =>
              isActive(state.get('disadvantages').lookup(id));

            let max = 3;

            if (isAdvantageActive('ADV_79')) {
              max += Maybe.fromMaybe(
                1,
                state.get('advantages').lookup('ADV_79')
                  .bind(obj => obj.get('active').head())
                  .bind(active => active.lookup('tier'))
              );
            }
            else if (isDisadvantageActive('DISADV_72')) {
              max -= Maybe.fromMaybe(
                1,
                state.get('disadvantages').lookup('DISADV_72')
                  .bind(obj => obj.get('active').head())
                  .bind(active => active.lookup('tier'))
              );
            }

            const isLessThanMax = () =>
              countActiveGroupEntries(wiki, state, 24) < max;

            return (isAdvantageActive('ADV_77') && isLessThanMax())
              || isAdvantageActive('ADV_12');
          },
          Record.of({})
        )
    )
    .on(
      [
        'SA_549',
        'SA_550',
        'SA_551',
        'SA_552',
        'SA_553',
      ].includes,
      () =>
        Maybe.ensure(
          () => {
            const isAdvantageActive = (id: string) =>
              isActive(state.get('advantages').lookup(id));

            const isDisadvantageActive = (id: string) =>
              isActive(state.get('disadvantages').lookup(id));

            let max = 3;

            if (isAdvantageActive('ADV_80')) {
              max += Maybe.fromMaybe(
                1,
                state.get('advantages').lookup('ADV_80')
                  .bind(obj => obj.get('active').head())
                  .bind(active => active.lookup('tier'))
              );
            }
            else if (isDisadvantageActive('DISADV_73')) {
              max -= Maybe.fromMaybe(
                1,
                state.get('disadvantages').lookup('DISADV_73')
                  .bind(obj => obj.get('active').head())
                  .bind(active => active.lookup('tier'))
              );
            }

            const isLessThanMax = () =>
              countActiveGroupEntries(wiki, state, 27) < max;

            return (isAdvantageActive('ADV_78') && isLessThanMax())
              || isActive(state.get('advantages').lookup('ADV_12'));
          },
          Record.of({})
        )
    )
    .on('SA_667', () => state.lookup('pact').map(
      e => Record.of<InactiveOptions>({
        maxTier: e.get('level')
      })
    ))
    .on(
      [
        'SA_677',
        'SA_678',
        'SA_679',
        'SA_680',
      ].includes,
      () =>
        Maybe.ensure(
          () => adventurePoints.get('spentOnMagicalAdvantages') <= 25 &&
            adventurePoints.get('spentOnMagicalDisadvantages') <= 25 &&
            getMagicalTraditions(state.get('specialAbilities')).length() === 0,
          Record.of({})
        )
    )
    .otherwise(() => Maybe.Just(Record.of({})));
};

/**
 * Calculates whether an Activatable is valid to add or not and, if valid,
 * calculates and filters necessary properties and selection lists. Returns a
 * Maybe of the result or `undefined` if invalid.
 */
export const getInactiveView = (
  wiki: Record<Wiki.WikiAll>,
  instance: Maybe<Record<Data.ActivatableDependent>>,
  state: Record<Data.HeroDependent>,
  validExtendedSpecialAbilities: List<string>,
  locale: Record<Data.UIMessages>,
  adventurePoints: Record<AdventurePointsObject>,
  id: string
): Maybe<Record<Data.DeactiveViewObject>> => {
  return getWikiEntry<Wiki.Activatable>(wiki, id)
    .bind(entry => {
      const prerequisites = entry.get('prerequisites');
      const maxTier = prerequisites instanceof OrderedMap ? validateTier(
        wiki,
        state,
        prerequisites,
        Maybe.maybe(List.of(), e => e.get('dependencies'), instance),
        id,
      ) : Maybe.Nothing();

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

        const maybeOtherOptions = getOtherOptions(
          wiki,
          instance,
          state,
          adventurePoints,
          entry,
        );

        return maybeOtherOptions.bind(
          otherOptions =>
            Maybe.ensure(
              select => !Maybe.isJust(select)
                || Maybe.fromJust(select).length() > 0,
              specificSelections.alt(entry.lookup('select'))
            )
              .map(
                select =>
                  otherOptions.mergeMaybe(Record.of({
                    id,
                    name: entry.get('name'),
                    cost: entry.get('cost'),
                    input: entry.lookup('input'),
                    tiers: entry.lookup('tiers'),
                    maxTier,
                    instance,
                    wiki: entry,
                    sel: select.map(sel => sortObjects(sel, locale.get('id')))
                  })) as Record<Data.DeactiveViewObject>
              )
        );
      }

      return Maybe.Nothing();
    });
}
