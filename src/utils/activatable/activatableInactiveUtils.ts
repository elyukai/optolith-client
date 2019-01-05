/**
 * Get the needed options for `Activatable` entries that are available to
 * activate.
 *
 * @file src/utils/activatableInactiveUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import * as R from 'ramda';
import * as Wiki from '../../App/Models/Wiki/wikiTypeHelpers';
import { AdventurePointsObject } from '../../selectors/adventurePointsSelectors';
import * as Data from '../../types/data';
import { Just, List, Maybe, OrderedMap, Record, RecordInterface, Tuple } from '../dataUtils';
import { countActiveGroupEntries } from '../entryGroupUtils';
import { sortObjects } from '../FilterSortUtils';
import { getAllEntriesByGroup } from '../heroStateUtils';
import { getBlessedTraditionInstanceIdByNumericId } from '../IDUtils';
import { getTraditionOfAspect } from '../liturgicalChantUtils';
import { match } from '../match';
import { validateLevel, validatePrerequisites } from '../prerequisites/validatePrerequisitesUtils';
import { isString } from '../typeCheckUtils';
import { getWikiEntryFromSlice } from '../WikiUtils';
import { isAdditionDisabled } from './activatableInactiveValidationUtils';
import { getModifierByActiveLevel } from './activatableModifierUtils';
import { countActiveSkillEntries } from './activatableSkillUtils';
import { isActive } from './isActive';
import { findSelectOption, getActiveSecondarySelections, getActiveSelections, getRequiredSelections } from './selectionUtils';
import { getBlessedTradition, getMagicalTraditions } from './traditionUtils';

const getIsNoActiveSelection =
  R.pipe (
    getActiveSelections,
    Maybe.fromMaybe (List.empty ()),
    activeSelections => R.pipe (
      Record.get<Wiki.SelectionObject, 'id'> ('id'),
      List.notElem_ (activeSelections)
    )
  );

const getLessThanTwoSameIdActiveSelections =
  R.pipe (
    getActiveSelections,
    Maybe.fromMaybe (List.empty ()),
    activeSelections => R.pipe (
      Record.get<Wiki.SelectionObject, 'id'> ('id'),
      id => List.lengthL (activeSelections.filter (R.equals (id))) < 2
    )
  );

const getIsNoRequiredSelection =
  R.pipe (
    getRequiredSelections,
    Maybe.fromMaybe (List.empty ()),
    requiredSelections => R.pipe (
      Record.get<Wiki.SelectionObject, 'id'> ('id'),
      List.notElem_ (requiredSelections)
    )
  );

const getIsNoRequiredOrActiveSelection =
  (instance: Maybe<Record<Data.ActivatableDependent>>) => {
    const isNoActiveSelection = getIsNoActiveSelection (instance);
    const isNoRequiredSelection = getIsNoRequiredSelection (instance);

    return (e: Record<Wiki.SelectionObject>) =>
      isNoActiveSelection (e) && isNoRequiredSelection (e);
  };

const addToSkillCategoryCounter = (map: OrderedMap<number, number>) =>
  map.alter (
    prop => prop
      .fmap (count => count + 1)
      .alt (Maybe.pure (0))
  );

const getCategoriesWithSkillsAbove10 = (
  wiki: Record<Wiki.WikiAll>,
  state: Record<Data.HeroDependent>,
  sliceKey: 'liturgicalChants' | 'spells'
) => {
  const addToCounterByKey = sliceKey === 'liturgicalChants'
    ? (map: OrderedMap<number, number>) =>
        (skill: Record<Wiki.LiturgicalChant | Wiki.Spell>) =>
          (skill as Record<Wiki.LiturgicalChant>).get ('aspects').foldl (addToSkillCategoryCounter)
            (map)
    : (map: OrderedMap<number, number>) =>
        (skill: Record<Wiki.LiturgicalChant | Wiki.Spell>) =>
          addToSkillCategoryCounter (map) (
            (skill as Record<Wiki.Spell>).get ('property')
          );

  return OrderedMap.elems (state.get (sliceKey))
    .filter (e => e.get ('value') >= 10)
    .foldl<OrderedMap<number, number>> (
      map => obj =>
        Maybe.fromMaybe (map) (
          (wiki.get (sliceKey).lookup (
            obj.get ('id')
          ) as Maybe<Record<Wiki.Spell | Wiki.LiturgicalChant>>)
            .fmap (addToCounterByKey (map))
        )
    ) (OrderedMap.empty ())
    .foldlWithKey<List<number>> (
      list => key => value => value >= 3 ? list.append (key) : list
    ) (List.empty ());
};

const getEntrySpecificSelections = (
  wiki: Record<Wiki.WikiAll>,
  instance: Maybe<Record<Data.ActivatableDependent>>,
  state: Record<Data.HeroDependent>,
  entry: Wiki.Activatable
) => {
  return match<string, Maybe<List<Record<Wiki.SelectionObject>>>> (entry.get ('id'))
    .on (
      List.elem_ (List.of (
        'ADV_4',
        'ADV_17',
        'ADV_47'
      )),
      () => entry.lookup ('select')
        .fmap (
          select => select.filter (getIsNoRequiredOrActiveSelection (instance))
        )
    )
    .on (
      'ADV_16',
      () => entry.lookup ('select')
        .fmap (select => {
          const hasLessThanTwoSameIdActiveSelections =
            getLessThanTwoSameIdActiveSelections (instance);

          const isNoRequiredSelection = getIsNoRequiredSelection (instance);

          return select.filter (
            e =>
              hasLessThanTwoSameIdActiveSelections (e)
              && isNoRequiredSelection (e)
          );
        })
    )
    .on (
      List.elem_ (List.of ('ADV_28', 'ADV_29')),
      () => entry.lookup ('select')
        .fmap (select => select.filter (getIsNoRequiredSelection (instance)))
    )
    .on (
      List.elem_ (List.of ('ADV_32', 'DISADV_24')),
      id => entry.lookup ('select')
        .fmap (select => {
          const flippedId = id === 'DISADV_24' ? 'ADV_32' : id;

          const hasLessThanTwoSameIdActiveSelections =
            getLessThanTwoSameIdActiveSelections (
              state.get ('disadvantages').lookup (flippedId)
            );

          const isNoRequiredSelection = getIsNoRequiredSelection (instance);

          return select.filter (
            e =>
              hasLessThanTwoSameIdActiveSelections (e)
              && isNoRequiredSelection (e)
          );
        })
    )
    .on (
      List.elem_ (List.of (
        'DISADV_1',
        'DISADV_34',
        'DISADV_50'
      )),
      () => entry.lookup ('select')
        .fmap (select => select.filter (getIsNoRequiredSelection (instance)))
    )
    .on (
      List.elem_ (List.of (
        'DISADV_33',
        'DISADV_37',
        'DISADV_51'
      )),
      id => entry.lookup ('select')
        .fmap (select => {
          const isNoRequiredOrActiveSelection =
            getIsNoRequiredOrActiveSelection (instance);

          if (id === 'DISADV_33') {
            const specialIds = List.of (7, 8);

            return select.filter (
              e =>
                specialIds.elem (e.get ('id') as number)
                || isNoRequiredOrActiveSelection (e)
            );
          }
          else {
            return select.filter (isNoRequiredOrActiveSelection);
          }
        })
    )
    .on (
      'DISADV_36',
      () => entry.lookup ('select')
        .fmap (
          select => select.filter (getIsNoRequiredOrActiveSelection (instance))
        )
    )
    .on (
      'DISADV_48',
      () => entry.lookup ('select')
        .fmap (select => {
          const isNoRequiredOrActiveSelection =
            getIsNoRequiredOrActiveSelection (instance);

          const isAdvantageActive = (id: string) =>
            isActive (state.get ('advantages').lookup (id));

          const isSkillOfIcB = (e: Record<Wiki.SelectionObject>) =>
            Maybe.fromMaybe (false) (
              wiki.get ('skills').lookup (e.get ('id') as string)
                .fmap (skill => skill.get ('ic') === 2)
            );

          return select.filter (
            e =>
              (
                (isAdvantageActive ('ADV_40') || isAdvantageActive ('ADV_46'))
                && isSkillOfIcB (e)
              )
              || isNoRequiredOrActiveSelection (e)
          );
        })
    )
    .on (
      'SA_3',
      () => entry.lookup ('select')
        .fmap (select => {
          const isNoRequiredOrActiveSelection =
            getIsNoRequiredOrActiveSelection (instance);

          return select.filter (
            e =>
              isNoRequiredOrActiveSelection (e)
              && Maybe.fromMaybe (false) (e.lookup ('req').fmap (
                req => validatePrerequisites (wiki, state, req, entry.get ('id'))
              ))
          );
        })
    )
    .on ('SA_9', () => {
      const maybeCounter = getActiveSecondarySelections (instance);

      return entry.lookup ('select')
        .fmap (select => {
          const isNoRequiredSelection = getIsNoRequiredSelection (instance);

          const isValidSelection = Maybe.isJust (maybeCounter)
            ? (e: Record<Wiki.SelectionObject>) => {
              const counter = Maybe.fromJust (maybeCounter);

              if (isNoRequiredSelection (e)) {
                return false;
              }
              else if (counter.member (e.get ('id'))) {
                return Maybe.fromMaybe (false) (
                  Maybe.ensure (isString) (e.get ('id'))
                    .bind (
                      id => OrderedMap.lookup<string, Record<Data.SkillDependent>>
                        (id)
                        (state.get ('skills'))
                    )
                    .bind (
                      skill => counter.lookup (e.get ('id'))
                        .fmap (
                          arr =>
                            arr.length () < 3
                            && skill.get ('value') >= (arr.length () + 1) * 6
                        )
                    )
                );
              }
              else {
                return Maybe.fromMaybe (false) (
                  Maybe.ensure (isString) (e.get ('id'))
                    .bind (
                      id => OrderedMap.lookup<string, Record<Data.SkillDependent>>
                        (id)
                        (state.get ('skills'))
                    )
                    .fmap (skill => skill.get ('value') >= 6)
                );
              }
            }
            : (e: Record<Wiki.SelectionObject>) => {
              if (isNoRequiredSelection (e)) {
                return false;
              }
              else {
                return Maybe.fromMaybe (false) (
                  Maybe.ensure (isString) (e.get ('id'))
                    .bind (
                      id => OrderedMap.lookup<string, Record<Data.SkillDependent>>
                        (id)
                        (state.get ('skills'))
                    )
                    .fmap (skill => skill.get ('value') >= 6)
                );
              }
            };

          return select.filter (isValidSelection);
        })
        .fmap (select => select.map (e => {
          const id = e.get ('id') as string;

          const list = maybeCounter.bind (counter => counter.lookup (id));

          return e.mergeMaybe (Record.of ({
            cost: Maybe.isJust (list)
              ? e.lookup ('cost')
                .fmap (cost => cost * (Maybe.fromJust (list).length () + 1))
              : e.lookup ('cost'),
            applications: e.lookup ('applications').fmap (
              apps => apps.filter (n => {
                const isInactive = !Maybe.isJust (list)
                  || !Maybe.fromJust (list).elem (n.get ('id'));

                const req = n.lookup ('prerequisites');

                const arePrerequisitesMet =
                  !Maybe.isJust (req) ||
                  validatePrerequisites (wiki, state, Maybe.fromJust (req), id);

                return isInactive && arePrerequisitesMet;
              })
            ),
          })) as Record<Wiki.SelectionObject>;
        }));
    })
    .on (
      'SA_28',
      () => entry.lookup ('select')
        .fmap (select => {
          const isNoActiveSelection = getIsNoActiveSelection (instance);
          const isNoRequiredSelection = getIsNoRequiredSelection (instance);

          return select.filter (e => {
            if (isNoRequiredSelection (e)) {
              return false;
            }
            else {
              return Maybe.fromMaybe (false) (
                e.lookup ('talent')
                  .bind (
                    talent => state.get ('skills').lookup (Tuple.fst (talent))
                      .fmap (
                        skill =>
                          isNoActiveSelection (e)
                          && skill.get ('value') >= Tuple.snd (talent)
                      )
                  )
              );
            }
          });
        })
    )
    .on (
      'SA_29',
      () => entry.lookup ('select')
        .fmap (select => {
          const isNoRequiredSelection = getIsNoRequiredSelection (instance);

          const active = Maybe.fromMaybe<List<Record<Data.ActiveObject>>> (List.of ()) (
            instance.fmap (e => e.get ('active'))
          );

          return select.filter (
            e =>
              isNoRequiredSelection (e)
              && active.all (n => !n.lookup ('sid').equals (e.lookup ('id')))
          );
        })
    )
    .on ('SA_72', () => {
      return entry.lookup ('select')
        .fmap (select => {
          const propertiesWithValidSpells = getCategoriesWithSkillsAbove10 (
            wiki, state, 'spells'
          );

          const isNoRequiredOrActiveSelection =
            getIsNoRequiredOrActiveSelection (instance);

          return select.filter (e => {
            return isNoRequiredOrActiveSelection (e)
              && !propertiesWithValidSpells.elem (e.get ('id') as number);
          });
        });
    })
    .on (
      'SA_81',
      () => entry.lookup ('select')
        .fmap (select => {
          const isNoActivePropertyKnowledge =
            getIsNoActiveSelection (
              state.get ('specialAbilities').lookup ('SA_72')
            );

          const isNoRequiredOrActiveSelection =
            getIsNoRequiredOrActiveSelection (instance);

          return select.filter (
            e =>
              isNoRequiredOrActiveSelection (e)
              && isNoActivePropertyKnowledge (e)
          );
        })
    )
    .on (
      'SA_87',
      () => entry.lookup ('select')
        .bind (select => {
          const aspectsWithValidChants = getCategoriesWithSkillsAbove10 (
            wiki, state, 'liturgicalChants'
          );

          const isNoRequiredOrActiveSelection =
            getIsNoRequiredOrActiveSelection (instance);

          return getBlessedTradition (state.get ('specialAbilities'))
            .fmap (
              tradition => select.filter (
                e =>
                  getBlessedTraditionInstanceIdByNumericId (
                    getTraditionOfAspect (e.get ('id') as number)
                  )
                    .equals (Maybe.pure (tradition.get ('id')))
                  && isNoRequiredOrActiveSelection (e)
                  && !aspectsWithValidChants.elem (e.get ('id') as number)
              )
            )
        })
    )
    .on (
      'SA_231',
      () => entry.lookup ('select')
        .fmap (select => {
          const isNoRequiredOrActiveSelection =
            getIsNoRequiredOrActiveSelection (instance);

          return select.filter (
            e =>
              isNoRequiredOrActiveSelection (e)
              && Maybe.fromMaybe (false) (
                state.get ('spells').lookup (e.get ('id') as string)
                  .fmap (spell => spell.get ('value') >= 10)
              )
          );
        })
    )
    .on (
      'SA_338',
      () => entry.lookup ('select')
        .fmap (select => {
          const activeSelections = getActiveSelections (instance);

          if (isActive (instance)) {
            const selectedPath = instance
              .fmap (e => e.get ('active'))
              .bind (Maybe.listToMaybe)
              .bind (e => e.lookup ('sid'))
              .bind (e => findSelectOption (entry, Maybe.pure (e)))
              .bind (obj => obj.lookup ('gr'));

            const highestLevel = activeSelections
              .fmap (List.map (
                selection => findSelectOption (entry, Maybe.pure (selection))
                  .bind (e => e.lookup ('tier'))
              ))
              .fmap (Maybe.catMaybes)
              .fmap (List.maximum)
              .fmap (e => e + 1);

            return select.filter (
              e =>
                selectedPath.equals (e.lookup ('gr'))
                && e.lookup ('tier').equals (highestLevel)
            );
          }
          else {
            const just1 = Maybe.pure (1);

            return select.filter (e => e.lookup ('tier').equals (just1));
          }
        })
    )
    .on (
      List.elem_ (List.of ('SA_414', 'SA_663')),
      () => entry.lookup ('select')
        .fmap (select => {
          const isNoRequiredOrActiveSelection =
            getIsNoRequiredOrActiveSelection (instance);

          type GetInstance = (target: Maybe<string>) =>
            Maybe<Record<Data.ActivatableSkillDependent>>;

          const getInstance: GetInstance = entry.get ('id') === 'SA_414'
            ? target => target.bind (
              id => OrderedMap.lookup<string, Record<Data.ActivatableSkillDependent>>
                (id)
                (state.get ('spells'))
            )
            : target => target.bind (
              id => OrderedMap.lookup<string, Record<Data.ActivatableSkillDependent>>
                (id)
                (state.get ('liturgicalChants'))
            );

          type GetWikiEntry = (target: Maybe<string>) =>
          Maybe<Record<Wiki.Spell> | Record<Wiki.LiturgicalChant>>;

          const createGetWikiEntry: GetWikiEntry = entry.get ('id') === 'SA_414'
            ? target => target.bind (
              id => OrderedMap.lookup<string, Record<Wiki.Spell>>
                (id)
                (wiki.get ('spells'))
            )
            : target => target.bind (
              id => OrderedMap.lookup<string, Record<Wiki.LiturgicalChant>>
                (id)
                (wiki.get ('liturgicalChants'))
            );

          return select.foldl<List<Record<Wiki.SelectionObject>>> (
            arr => e => {
              const targetInstance = getInstance (e.lookup ('target'));
              const targetWikiEntry = createGetWikiEntry (e.lookup ('target'));

              if (
                isNoRequiredOrActiveSelection (e)
                && validatePrerequisites (
                  wiki,
                  state,
                  Maybe.fromMaybe<List<Wiki.AllRequirements>> (List.of ()) (e.lookup ('req')),
                  entry.get ('id')
                )
                && Maybe.isJust (targetWikiEntry)
                && Maybe.isJust (targetInstance)
                && targetInstance.fmap (target => target.get ('value'))
                  .gte (e.lookup ('tier').fmap (tier => tier * 4 + 4))
              ) {
                const target = Maybe.fromJust (targetWikiEntry);

                return arr.append (
                  e.insert ('name') (`${target.get ('name')}: ${e.get ('name')}`)
                );
              }

              return arr;
            }
          ) (List.of ());
        })
    )
    .on (
      'SA_639',
      () => entry.lookup ('select')
        .fmap (select => {
          const isNoRequiredOrActiveSelection =
            getIsNoRequiredOrActiveSelection (instance);

          return select.filter (
            e =>
              isNoRequiredOrActiveSelection (e)
              && validatePrerequisites (
                wiki,
                state,
                Maybe.fromMaybe<List<Wiki.AllRequirements>> (List.of ()) (e.lookup ('req')),
                entry.get ('id')
              )
          );
        })
    )
    .on (
      'SA_699',
      () => getWikiEntryFromSlice (wiki) ('specialAbilities') ('SA_29')
        .bind (
          languagesWikiEntry => languagesWikiEntry.lookup ('select')
            .fmap (select => {
              interface AvailableLanguage {
                id: number;
                tier: number;
              }

              const availableLanguages =
                Maybe.fromMaybe<List<Record<AvailableLanguage>>> (List.of ()) (
                  state.get ('specialAbilities').lookup ('SA_29')
                    .fmap (
                      lang => lang.get ('active')
                        .foldl<List<Record<AvailableLanguage>>> (
                          arr => obj =>
                            Maybe.fromMaybe (arr) (
                              obj.lookup ('tier').bind (
                                tier => obj.lookup ('sid')
                                  .bind (Maybe.ensure (x => x === 3 || x === 4))
                                  .fmap (sid => arr.append (Record.of ({
                                    id: sid as number,
                                    tier,
                                  })))
                              )
                            )
                        ) (List.of ())
                    )
                );

              const justTrue = Maybe.pure (true);
              const just4 = Maybe.pure (4);

              return select.foldl<List<Record<Wiki.SelectionObject>>> (
                acc => e => {
                  const language = availableLanguages.find (
                    l => l.get ('id') === e.get ('id')
                  );

                  const firstForLanguage = instance
                    .fmap (
                      just => just.get ('active').all (
                        a => a.lookup ('sid').equals (just.lookup ('id'))
                      )
                    );

                  if (
                    Maybe.isJust (language)
                    && firstForLanguage.equals (justTrue)
                  ) {
                    const isMotherTongue = language
                      .bind (languageRec => languageRec.lookup ('tier'))
                      .equals (just4);

                    if (isMotherTongue) {
                      return acc.append (e.insert ('cost') (0));
                    }

                    return acc.append (e);
                  }

                  return acc;
                }
              ) (List.of ());
            })
        )
    )
    .otherwise (
      () => entry.lookup ('select')
        .fmap (
          select => select.filter (getIsNoRequiredOrActiveSelection (instance))
        )
    );
};

interface InactiveOptions {
  cost?: string | number | List<number>;
  minTier?: number;
  maxTier?: number;
  customCostDisabled?: boolean;
}

const getOtherOptions = (
  wiki: Record<Wiki.WikiAll>,
  instance: Maybe<Record<Data.ActivatableDependent>>,
  state: Record<Data.HeroDependent>,
  adventurePoints: Record<AdventurePointsObject>,
  entry: Wiki.Activatable
) => {
  return match<string, Maybe<Record<InactiveOptions>>> (entry.get ('id'))
    .on (
      'DISADV_59',
      () => Maybe.ensure ((n: number) => n < 3) (countActiveSkillEntries (state, 'spells'))
        .fmap (activeSpells => Record.of<InactiveOptions> ({
          maxTier: -activeSpells + 3,
        }))
    )
    .on (
      'SA_17',
      () => state.get ('skills').lookup ('TAL_51')
        .bind (
          skill51 => state.get ('skills').lookup ('TAL_51')
            .bind (
              skill55 => Maybe.ensure ((x: number) => x >= 12) (
                skill51.get ('value') + skill55.get ('value')
              )
                .fmap (Record.empty)
            )
        )
    )
    .on (
      'SA_18',
      () => Maybe.ensure ((x: number) => x > 0) (
        getAllEntriesByGroup (
          wiki.get ('combatTechniques'),
          state.get ('combatTechniques'),
          2
        )
          .filter (e => e.get ('value') >= 10)
          .length ()
      )
        .fmap (Record.empty)
    )
    .on (
      List.elem_ (List.of (
        'SA_70',
        'SA_255',
        'SA_345',
        'SA_346',
        'SA_676',
        'SA_681'
      )),
      () => Maybe.ensure (List.null) (getMagicalTraditions (state.get ('specialAbilities')))
        .fmap (Record.empty)
    )
    .on (
      List.elem_ (List.of (
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
        'SA_698'
      )),
      () =>
        getBlessedTradition (state.get ('specialAbilities'))
          .fmap (Record.empty)
    )
    .on (
      List.elem_ (List.of ('SA_72', 'SA_87')),
      () => Maybe.return (entry.get ('cost'))
        .bind (Maybe.ensure ((e): e is List<number> => List.isList (e)))
        .bind (
          costs => instance.fmap (e => e.get ('active').length ())
            .bind (active => costs.subscript (active))
        )
        .fmap (cost => Record.of<InactiveOptions> ({ cost }))
    )
    .on (
      'SA_533',
      () =>
        state.get ('specialAbilities').lookup ('SA_531')
          .fmap (specialAbility => specialAbility.get ('active'))
          .bind (Maybe.listToMaybe)
          .bind (active => active.lookup ('sid'))
          .bind (sid => wiki.get ('skills').lookup (sid as string))
          .fmap (skill => Record.of<InactiveOptions> ({
            cost: (entry.get ('cost') as List<number>).map (
              e => e + skill.get ('ic')
            ),
          }))
    )
    .on (
      List.elem_ (List.of (
        'SA_544',
        'SA_545',
        'SA_546',
        'SA_547',
        'SA_548'
      )),
      () => Maybe.ensure<Record<InactiveOptions>> (
        () => {
          const isAdvantageActive = R.pipe (
            OrderedMap.lookup_ (state .get ('advantages')),
            isActive
          );

          const max = getModifierByActiveLevel
            (state.get ('advantages').lookup ('ADV_79'))
            (state.get ('disadvantages').lookup ('DISADV_72'))
            (Just (3));

          const isLessThanMax = () => countActiveGroupEntries (wiki, state, 24) < max;

          return (isAdvantageActive ('ADV_77') && isLessThanMax ())
            || isAdvantageActive ('ADV_12');
        }
      ) (Record.empty ())
    )
    .on (
      List.elem_ (List.of (
        'SA_549',
        'SA_550',
        'SA_551',
        'SA_552',
        'SA_553'
      )),
      () => Maybe.ensure<Record<InactiveOptions>> (
        () => {
          const isAdvantageActive = R.pipe (
            OrderedMap.lookup_ (state .get ('advantages')),
            isActive
          );

          const max = getModifierByActiveLevel
            (state.get ('advantages').lookup ('ADV_80'))
            (state.get ('disadvantages').lookup ('DISADV_73'))
            (Just (3));

          const isLessThanMax = () => countActiveGroupEntries (wiki, state, 27) < max;

          return (isAdvantageActive ('ADV_78') && isLessThanMax ())
            || isAdvantageActive ('ADV_12');
        }
      ) (Record.empty ())
    )
    .on ('SA_667', () => state.lookup ('pact').fmap (
      e => Record.of<InactiveOptions> ({
        maxTier: e.get ('level'),
      })
    ))
    .on (
      List.elem_ (List.of (
        'SA_677',
        'SA_678',
        'SA_679',
        'SA_680'
      )),
      () =>
        Maybe.ensure<Record<InactiveOptions>> (
          () => adventurePoints.get ('spentOnMagicalAdvantages') <= 25
            && adventurePoints.get ('spentOnMagicalDisadvantages') <= 25
            && List.null (getMagicalTraditions (state.get ('specialAbilities')))
        ) (Record.empty ())
    )
    .otherwise (() => Maybe.pure (Record.of ({})));
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
  wikiEntry: Wiki.Activatable
): Maybe<Record<Data.DeactiveViewObject>> => {
  const id = wikiEntry .get ('id');
  const prerequisites = wikiEntry .get ('prerequisites');
  const maxTier = prerequisites instanceof OrderedMap
    ? validateLevel (
      wiki,
      state,
      prerequisites,
      Maybe.maybe<
        Record<Data.ActivatableDependent>,
        Data.ActivatableDependent['dependencies']
      > (List.empty ()) (e => e.get ('dependencies')) (instance),
      id
    )
    : Maybe.empty ();

  const isNotValid = isAdditionDisabled (
    wiki,
    instance,
    state,
    validExtendedSpecialAbilities,
    wikiEntry,
    maxTier
  );

  if (!isNotValid) {
    const specificSelections = getEntrySpecificSelections (
      wiki,
      instance,
      state,
      wikiEntry
    );

    const maybeOtherOptions = getOtherOptions (
      wiki,
      instance,
      state,
      adventurePoints,
      wikiEntry
    );

    return maybeOtherOptions.bind (
      otherOptions =>
        Maybe.ensure<Maybe<List<Record<Wiki.SelectionObject>>>> (
          select => !Maybe.isJust (select) || !List.null (Maybe.fromJust (select))
        ) (specificSelections)
          .fmap (
            select =>
              Record.ofMaybe<Data.DeactiveViewObject> ({
                id,
                name: wikiEntry.get ('name'),
                cost: wikiEntry.get ('cost'),
                maxTier,
                stateEntry: instance,
                wikiEntry: wikiEntry as Record<RecordInterface<Wiki.Activatable>>,
                sel: select.fmap (sel => sortObjects (sel, locale.get ('id'))),
              })
                .merge (otherOptions)
          )
    );
  }

  return Maybe.empty ();
};
