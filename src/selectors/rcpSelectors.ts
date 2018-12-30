import { Categories } from '../constants/Categories';
import { ActivatableNameCostActive, ActiveObjectWithId } from '../types/data';
import { getNameCostForWiki } from '../utils/activatable/activatableActiveUtils';
import { convertPerTierCostToFinalCost } from '../utils/adventurePoints/activatableCostUtils';
import { createMaybeSelector } from '../utils/createMaybeSelector';
import { Just, List, ListElement, Maybe, OrderedMap, OrderedSet, Record } from '../utils/dataUtils';
import { AllSortOptions, filterAndSortObjects, FilterOptions } from '../utils/FilterSortUtils';
import { getCategoryById } from '../utils/IDUtils';
import { validateProfession } from '../utils/prerequisites/validatePrerequisitesUtils';
import { getFullProfessionName } from '../utils/rcpUtils';
import { filterByAvailability, isEntryFromCoreBook } from '../utils/RulesUtils';
import { CultureCombined, IncreasableView, MappedProfession, MappedProfessionVariant, ProfessionCombined, ProfessionVariantCombined, RaceCombined } from '../utils/viewData/viewTypeHelpers';
import { isProfessionRequiringActivatable, isProfessionRequiringIncreasable } from '../utils/wikiData/prerequisites/DependentRequirement';
import { Culture, IncreaseSkill, Profession, ProfessionVariant, Race, RaceVariant } from '../utils/wikiData/wikiTypeHelpers';
import { isCombatTechniquesSelection } from '../utils/WikiUtils';
import { getStartEl } from './elSelectors';
import { getRuleBooksEnabled } from './rulesSelectors';
import { getCulturesSortOptions, getProfessionsSortOptions, getRacesSortOptions } from './sortOptionsSelectors';
import { getCulturesFilterText, getCurrentCultureId, getCurrentProfessionId, getCurrentProfessionVariantId, getCurrentRaceId, getCurrentRaceVariantId, getCustomProfessionName, getLocaleAsProp, getLocaleMessages, getProfessionsFilterText, getRacesFilterText, getSex, getWiki, getWikiCultures, getWikiProfessions, getWikiProfessionVariants, getWikiRaces, getWikiRaceVariants, getWikiSkills } from './stateSelectors';
import { getCulturesVisibilityFilter, getProfessionsGroupVisibilityFilter, getProfessionsVisibilityFilter } from './uisettingsSelectors';

export const getCurrentRace = createMaybeSelector (
  getWikiRaces,
  getCurrentRaceId,
  (races, raceId) => raceId.bind (
    id => OrderedMap.lookup<string, Record<Race>> (id) (races)
  )
);

export const getCurrentRaceVariant = createMaybeSelector (
  getWikiRaceVariants,
  getCurrentRaceVariantId,
  (raceVariants, raceVariantId) => raceVariantId.bind (
    id => OrderedMap.lookup<string, Record<RaceVariant>> (id) (raceVariants)
  )
);

export const getCurrentCulture = createMaybeSelector (
  getWikiCultures,
  getCurrentCultureId,
  (cultures, cultureId) => cultureId.bind (
    id => OrderedMap.lookup<string, Record<Culture>> (id) (cultures)
  )
);

export const getCurrentProfession = createMaybeSelector (
  getWikiProfessions,
  getCurrentProfessionId,
  (professions, professionId) => professionId.bind (
    id => OrderedMap.lookup<string, Record<Profession>> (id) (professions)
  )
);

export const getCurrentProfessionVariant = createMaybeSelector (
  getWikiProfessionVariants,
  getCurrentProfessionVariantId,
  (professionVariants, professionVariantId) => professionVariantId.bind (
    id => OrderedMap.lookup<string, Record<ProfessionVariant>> (id)
                                                               (professionVariants)
  )
);

export const getAllRaces = createMaybeSelector (
  getWikiRaces,
  getWikiRaceVariants,
  getWikiCultures,
  (races, raceVariants, cultures) => {
    const filterCultures = Maybe.mapMaybe<string, string> (
      id => cultures.lookup (id).fmap (culture => culture.get ('name'))
    );

    return races.elems ().map<Record<RaceCombined>> (
      race => race
        .modify<'commonCultures'> (filterCultures)
                                  ('commonCultures')
        .merge (Record.of ({
          mappedVariants: Maybe.mapMaybe<string, Record<RaceVariant>>
            (id => OrderedMap.lookup<string, Record<RaceVariant>> (id) (raceVariants))
            (race.get ('variants'))
            .map (
              raceVariant => raceVariant.modify<'commonCultures'> (filterCultures)
                                                                  ('commonCultures')
            ),
        }))
    );
  }
);

export const getAvailableRaces = createMaybeSelector (
  getAllRaces,
  getRuleBooksEnabled,
  (list, maybeAvailablility) => maybeAvailablility.fmap (
    availablility => filterByAvailability (list, availablility)
  )
);

export const getFilteredRaces = createMaybeSelector (
  getAvailableRaces,
  getRacesFilterText,
  getRacesSortOptions,
  getLocaleAsProp,
  (maybeList, filterText, sortOptions, locale) => maybeList.fmap (
    list => filterAndSortObjects (
      list,
      locale.get ('id'),
      filterText,
      sortOptions as AllSortOptions<RaceCombined>
    )
  )
);

export const getAllCultures = createMaybeSelector (
  getWikiCultures,
  getWikiSkills,
  (cultures, skills) =>
    cultures.elems ().map<Record<CultureCombined>> (
      culture => culture
        .merge (
          Record.of ({
            mappedCulturalPackageSkills:
              Maybe.mapMaybe<Record<IncreaseSkill>, Record<IncreasableView>> (
                  increaseSkill => skills.lookup (increaseSkill.get ('id'))
                    .fmap (
                      skill => increaseSkill.merge (Record.of ({
                        name: skill.get ('name'),
                      }))
                    )
                )
                (culture.get ('culturalPackageSkills')),
          })
        )
    )
);

export const getCommonCultures = createMaybeSelector (
  getCurrentRace,
  getCurrentRaceVariant,
  (maybeRace, maybeRaceVariant) => {
    const raceCultures = maybeRace.fmap (
      race => race.get ('commonCultures')
    );

    const raceVariantCultures = maybeRaceVariant.fmap (
      raceVariant => raceVariant.get ('commonCultures')
    );

    return List.of<string> (
      ...Maybe.fromMaybe (List.of<string> ()) (raceCultures),
      ...Maybe.fromMaybe (List.of<string> ()) (raceVariantCultures)
    );
  }
);

export const getAvailableCultures = createMaybeSelector (
  getAllCultures,
  getRuleBooksEnabled,
  getCommonCultures,
  getCulturesVisibilityFilter,
  (list, maybeAvailablility, commonCultures, visibility) =>
    maybeAvailablility.fmap (
      availablility => visibility === 'common'
        ? filterByAvailability (
          list.filter (e => commonCultures.elem (e.get ('id'))),
          availablility
        )
        : filterByAvailability (list, availablility)
    )
);

export const getFilteredCultures = createMaybeSelector (
  getAvailableCultures,
  getCulturesFilterText,
  getCulturesSortOptions,
  getLocaleAsProp,
  (maybeList, filterText, sortOptions, locale) => maybeList.fmap (
    list => filterAndSortObjects (
      list,
      locale.get ('id'),
      filterText,
      sortOptions as AllSortOptions<CultureCombined>
    )
  )
);

interface SkillGroupLists {
  physicalSkills: List<Record<IncreasableView>>;
  socialSkills: List<Record<IncreasableView>>;
  natureSkills: List<Record<IncreasableView>>;
  knowledgeSkills: List<Record<IncreasableView>>;
  craftSkills: List<Record<IncreasableView>>;
}

const getGroupSliceKey = (gr: number): keyof SkillGroupLists => {
  if (gr === 1) {
    return 'physicalSkills';
  }
  else if (gr === 2) {
    return 'socialSkills';
  }
  else if (gr === 3) {
    return 'natureSkills';
  }
  else if (gr === 4) {
    return 'knowledgeSkills';
  }
  else {
    return 'craftSkills';
  }
};

export const getAllProfessions = createMaybeSelector (
  getWiki,
  getLocaleMessages,
  (wiki, locale) => {
    return wiki.get ('professions').elems ().map<Record<ProfessionCombined>> (
      profession => {
        const {
          physicalSkills,
          socialSkills,
          natureSkills,
          knowledgeSkills,
          craftSkills,
        } = profession.get ('skills').foldl<SkillGroupLists> (
          objByGroups => increasableObj => {
            const maybeSkill = wiki.get ('skills').lookup (increasableObj.get ('id'));

            return Maybe.fromMaybe (objByGroups) (
              maybeSkill.fmap (
                skill => {
                  const key = getGroupSliceKey (skill.get ('gr'));

                  return {
                    ...objByGroups,
                    [key]: objByGroups[key].append (
                      increasableObj.merge (
                        Record.of ({
                          name: skill.get ('name'),
                        })
                      )
                    ),
                  };
                }
              )
            );
          }
        ) (
          {
            physicalSkills: List.of (),
            socialSkills: List.of (),
            natureSkills: List.of (),
            knowledgeSkills: List.of (),
            craftSkills: List.of (),
          }
        );

        const filteredVariants = Maybe.mapMaybe
          ((variantId: string) => OrderedMap.lookup<string, Record<ProfessionVariant>>
            (variantId)
            (wiki.get ('professionVariants')))
          (profession.get ('variants'));

        return profession.merge (
          Record.of<MappedProfession> ({
            mappedPrerequisites: Maybe.catMaybes (
              profession.get ('prerequisites').imap<
                Maybe<ListElement<MappedProfession['mappedPrerequisites']>>
              >(
                index => e => {
                  if (isProfessionRequiringActivatable (e)) {
                    return getNameCostForWiki (
                      e.merge (Record.of ({ index })) as any as Record<ActiveObjectWithId>,
                      wiki,
                      locale
                    )
                      .fmap (convertPerTierCostToFinalCost (locale))
                      .fmap (
                        obj => obj.merge (Record.of ({
                          active: e.get ('active'),
                        })) as Record<ActivatableNameCostActive>
                      );
                  }

                  return Just (e);
                }
              )
            ),
            mappedSpecialAbilities: Maybe.catMaybes (
              profession.get ('specialAbilities').imap (
                index => e => getNameCostForWiki (
                  e.merge (Record.of ({ index })) as any as Record<ActiveObjectWithId>,
                  wiki,
                  locale
                )
                  .fmap (convertPerTierCostToFinalCost (locale))
                  .fmap (
                    obj => obj.merge (Record.of ({
                      active: e.get ('active'),
                    })) as Record<ActivatableNameCostActive>
                  )
              )
            ),
            selections: profession.get ('selections').map (e => {
              if (isCombatTechniquesSelection (e)) {
                return e.modify<'sid'> (
                  sid => Maybe.mapMaybe<string, string> (
                    id => wiki.get ('combatTechniques').lookup (id)
                      .fmap (entry => entry.get ('name'))
                  ) (sid)
                ) ('sid');
              }

              return e;
            }),
            mappedCombatTechniques: Maybe.mapMaybe<Record<IncreaseSkill>, Record<IncreasableView>> (
              e => wiki.get ('combatTechniques')
                .lookup (e.get ('id'))
                .fmap (
                  wikiEntry => e.merge (Record.of ({
                    name: wikiEntry.get ('name'),
                  }))
                )
            ) (profession.get ('combatTechniques')),
            mappedPhysicalSkills: physicalSkills,
            mappedSocialSkills: socialSkills,
            mappedNatureSkills: natureSkills,
            mappedKnowledgeSkills: knowledgeSkills,
            mappedCraftSkills: craftSkills,
            mappedSpells: Maybe.mapMaybe<Record<IncreaseSkill>, Record<IncreasableView>> (
              e => wiki.get ('spells')
                .lookup (e.get ('id'))
                .fmap (
                  wikiEntry => e.merge (Record.of ({
                    name: wikiEntry.get ('name'),
                  }))
                )
            ) (profession.get ('spells')),
            mappedLiturgicalChants: Maybe.mapMaybe<Record<IncreaseSkill>, Record<IncreasableView>> (
              e => wiki.get ('liturgicalChants')
                .lookup (e.get ('id'))
                .fmap (
                  wikiEntry => e.merge (Record.of ({
                    name: wikiEntry.get ('name'),
                  }))
                )
            ) (profession.get ('liturgicalChants')),
            mappedVariants: filteredVariants.map<Record<ProfessionVariantCombined>> (
              professionVariant => professionVariant.merge (
                Record.of<MappedProfessionVariant> ({
                  mappedPrerequisites: Maybe.catMaybes (
                    professionVariant.get ('prerequisites').imap<
                      Maybe<ListElement<MappedProfession['mappedPrerequisites']>>
                    >(
                      index => e => {
                        if (isProfessionRequiringActivatable (e)) {
                          return getNameCostForWiki (
                            e.merge (Record.of ({ index })) as any as Record<ActiveObjectWithId>,
                            wiki,
                            locale
                          )
                            .fmap (convertPerTierCostToFinalCost (locale))
                            .fmap (
                              obj => obj.merge (Record.of ({
                                active: e.get ('active'),
                              })) as Record<ActivatableNameCostActive>
                            );
                        }

                        return Just (e);
                      }
                    )
                  ),
                  mappedSpecialAbilities: Maybe.catMaybes (
                    professionVariant.get ('specialAbilities').imap (
                      index => e => getNameCostForWiki (
                        e.merge (Record.of ({ index })) as any as Record<ActiveObjectWithId>,
                        wiki,
                        locale
                      )
                        .fmap (convertPerTierCostToFinalCost (locale))
                        .fmap (
                          obj => obj.merge (Record.of ({
                            active: e.get ('active'),
                          })) as Record<ActivatableNameCostActive>
                        )
                    )
                  ),
                  selections: professionVariant.get ('selections').map (e => {
                    if (isCombatTechniquesSelection (e)) {
                      return e.modify<'sid'> (
                        sid => Maybe.mapMaybe<string, string> (
                          id => wiki.get ('combatTechniques').lookup (id)
                            .fmap (entry => entry.get ('name'))
                        ) (sid)
                      ) ('sid');
                    }

                    return e;
                  }),
                  mappedCombatTechniques:
                    Maybe.mapMaybe<Record<IncreaseSkill>, Record<IncreasableView>> (
                      e => wiki.get ('combatTechniques')
                        .lookup (e.get ('id'))
                        .fmap (
                          wikiEntry => e.mergeMaybe (Record.of ({
                            name: wikiEntry.get ('name'),
                            previous: profession.get ('combatTechniques')
                              .find (a => a.get ('id') === e.get ('id'))
                              .fmap (a => a.get ('value')),
                          })) as Record<IncreasableView>
                        )
                    ) (professionVariant.get ('combatTechniques')),
                  mappedSkills: Maybe.mapMaybe<Record<IncreaseSkill>, Record<IncreasableView>> (
                    e => wiki.get ('skills')
                      .lookup (e.get ('id'))
                      .fmap (
                        wikiEntry => e.mergeMaybe (Record.of ({
                          name: wikiEntry.get ('name'),
                          previous: profession.get ('skills')
                            .find (a => a.get ('id') === e.get ('id'))
                            .fmap (a => a.get ('value')),
                        })) as Record<IncreasableView>
                      )
                  ) (professionVariant.get ('skills')),
                  mappedSpells: Maybe.mapMaybe<Record<IncreaseSkill>, Record<IncreasableView>> (
                    e => wiki.get ('spells')
                      .lookup (e.get ('id'))
                      .fmap (
                        wikiEntry => e.mergeMaybe (Record.of ({
                          name: wikiEntry.get ('name'),
                          previous: profession.get ('spells')
                            .find (a => a.get ('id') === e.get ('id'))
                            .fmap (a => a.get ('value')),
                        })) as Record<IncreasableView>
                      )
                  ) (professionVariant.get ('spells')),
                  mappedLiturgicalChants:
                    Maybe.mapMaybe<Record<IncreaseSkill>, Record<IncreasableView>> (
                      e => wiki.get ('liturgicalChants')
                        .lookup (e.get ('id'))
                        .fmap (
                          wikiEntry => e.mergeMaybe (Record.of ({
                            name: wikiEntry.get ('name'),
                            previous: profession.get ('liturgicalChants')
                              .find (a => a.get ('id') === e.get ('id'))
                              .fmap (a => a.get ('value')),
                          })) as Record<IncreasableView>
                        )
                    ) (professionVariant.get ('liturgicalChants')),
                })
              )
            ),
          })
        )
      }
    );
  }
);

const isCustomProfession = (e: Record<ProfessionCombined>) => e.get ('id') === 'P_0';

export const getCommonProfessions = createMaybeSelector (
  getAllProfessions,
  getStartEl,
  getCurrentRaceId,
  getCurrentCulture,
  getSex,
  getProfessionsGroupVisibilityFilter,
  getProfessionsVisibilityFilter,
  (
    professions,
    maybeStartEl,
    currentRaceId,
    currentCulture,
    maybeSex,
    groupVisibility,
    visibility
  ) =>
    Maybe.fromMaybe (professions) (
      maybeSex.bind (
        sex => maybeStartEl.fmap (
          startEl => {
            const filterProfession = (
              e: Record<ProfessionCombined> | Record<ProfessionVariantCombined>
            ): boolean => {
              const isProfessionValid = validateProfession (
                e.get ('dependencies'),
                sex,
                currentRaceId,
                currentCulture.fmap (culture => culture.get ('id'))
              );

              const attributeCategory = Just (Categories.ATTRIBUTES);

              return isProfessionValid && e.get ('prerequisites').all (d => {
                if (isProfessionRequiringIncreasable (d)) {
                  const category = getCategoryById (d.get ('id'));

                  const isAttribute = category.equals (attributeCategory);
                  const isGreaterThanMax = d.get ('value') > startEl.get ('maxAttributeValue');

                  return isAttribute && isGreaterThanMax;
                }

                return true;
              });
            };

            const filterProfessionExtended = (
              culture: Record<Culture>,
              e: Record<ProfessionCombined>
            ): boolean => {
              const maybeCommonList = culture
                  .get ('commonProfessions')
                  .subscript (e.get ('gr') - 1);

              const commonVisible =
                visibility === 'all'
                || isCustomProfession (e)
                || Maybe.fromMaybe (false) (
                  maybeCommonList.fmap (
                    commonList => typeof commonList === 'boolean'
                      ? (commonList === true && isEntryFromCoreBook (e))
                      : commonList.get ('list').elem (e.get ('subgr'))
                        ? (commonList.get ('list').elem (e.get ('subgr'))
                          !== commonList.get ('reverse')
                          && isEntryFromCoreBook (e))
                        : commonList.get ('reverse') === true
                          ? !commonList.get ('list').elem (e.get ('id')) && isEntryFromCoreBook (e)
                          : commonList.get ('list').elem (e.get ('id'))
                  )
              );

              /**
               * const commonVisible = visibility === 'all' || e.id === 'P_0'
               * || (typeof typicalList === 'boolean' ? typicalList === true :
               * (typicalList.list.includes(e.subgr) ? typicalList.list.includes(e.subgr)
               * !== typicalList.reverse : typicalList.list.includes(e.id)
               * !== typicalList.reverse));
              */

              const groupVisible =
                groupVisibility === 0
                || isCustomProfession (e)
                || groupVisibility === e.get ('gr');

              return groupVisible && commonVisible;
            };

            return professions
              .filter (
                Maybe.fromMaybe (
                  filterProfession as (e: Record<ProfessionCombined>) => boolean
                )
                                (
                                  currentCulture.fmap (
                                    culture => (e: Record<ProfessionCombined>) =>
                                      filterProfession (e) && filterProfessionExtended (culture, e)
                                  )
                                )
              )
              .map (
                e => e.modify<'mappedVariants'> (List.filter (
                  filterProfession as (e: Record<ProfessionVariantCombined>) => boolean
                ))
                                                ('mappedVariants')
              );
          }
        )
      )
    )
);

export const getAvailableProfessions = createMaybeSelector (
  getCommonProfessions,
  getRuleBooksEnabled,
  getProfessionsVisibilityFilter,
  (list, maybeAvailablility, visibility) =>
    Maybe.maybe<true | OrderedSet<string>, List<Record<ProfessionCombined>>> (list) (
      availablility => visibility === 'all'
        ? filterByAvailability (list, availablility, isCustomProfession)
        : list
    ) (maybeAvailablility)
);

export const getFilteredProfessions = createMaybeSelector (
  getAvailableProfessions,
  getProfessionsFilterText,
  getProfessionsSortOptions,
  getLocaleAsProp,
  getSex,
  (list, filterText, maybeSortOptions, locale, maybeSex) =>
    Maybe.fromMaybe (list)
                    (
                      maybeSex.bind (
                        sex => maybeSortOptions.fmap (
                          sortOptions => {
                            const filterOptions: FilterOptions<ProfessionCombined> = {
                              addProperty: 'subname',
                              keyOfName: sex,
                            };

                            return filterAndSortObjects (
                              list,
                              locale.get ('id'),
                              filterText,
                              sortOptions as AllSortOptions<ProfessionCombined>,
                              filterOptions
                            );
                          }
                        )
                      )
                    )
);

export const getCurrentFullProfessionName = createMaybeSelector (
  getLocaleAsProp,
  getWiki,
  getSex,
  getCurrentProfessionId,
  getCurrentProfessionVariantId,
  getCustomProfessionName,
  (
    locale,
    wiki,
    maybeSex,
    maybeProfessionId,
    maybeProfessionVariantId,
    maybeCustomProfessionName
  ) =>
    maybeSex .fmap (
      sex => getFullProfessionName (locale)
                                   (wiki .get ('professions'))
                                   (wiki .get ('professionVariants'))
                                   (sex)
                                   (maybeProfessionId)
                                   (maybeProfessionVariantId)
                                   (maybeCustomProfessionName)
    )
);
