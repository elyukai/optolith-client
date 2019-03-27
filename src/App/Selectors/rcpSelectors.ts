import { flip } from "../../Data/Function";
import { fmap } from "../../Data/Functor";
import { over } from "../../Data/Lens";
import { map } from "../../Data/List";
import { bind, mapMaybe } from "../../Data/Maybe";
import { elems, lookupF } from "../../Data/OrderedMap";
import { uncurryN, uncurryN3 } from "../../Data/Pair";
import { CultureCombined } from "../Models/View/CultureCombined";
import { ProfessionCombined } from "../Models/View/ProfessionCombined";
import { RaceCombined } from "../Models/View/RaceCombined";
import { Culture } from "../Models/Wiki/Culture";
import { Profession } from "../Models/Wiki/Profession";
import { ProfessionVariant } from "../Models/Wiki/ProfessionVariant";
import { Race, RaceL } from "../Models/Wiki/Race";
import { RaceVariant, RaceVariantL } from "../Models/Wiki/RaceVariant";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { filterAndSortRecordsBy } from "../Utilities/filterAndSortBy";
import { pipe } from "../Utilities/pipe";
import { filterByAvailability } from "../Utilities/RulesUtils";
import { getStartEl } from "./elSelectors";
import { getRuleBooksEnabled } from "./rulesSelectors";
import { getCulturesSortOptions, getProfessionsSortOptions, getRacesCombinedSortOptions } from "./sortOptionsSelectors";
import { getCulturesFilterText, getCurrentCultureId, getCurrentProfessionId, getCurrentProfessionVariantId, getCurrentRaceId, getCurrentRaceVariantId, getCustomProfessionName, getLocaleAsProp, getLocaleMessages, getProfessionsFilterText, getRacesFilterText, getSex, getWiki, getWikiCultures, getWikiProfessions, getWikiProfessionVariants, getWikiRaces, getWikiRaceVariants, getWikiSkills } from "./stateSelectors";
import { getCulturesVisibilityFilter, getProfessionsGroupVisibilityFilter, getProfessionsVisibilityFilter } from "./uisettingsSelectors";

const RA = Race.A_
const RL = RaceL
const RVA = RaceVariant.A_
const RVL = RaceVariantL
const RCA = RaceCombined.A_
const CA = Culture.A_
const CCA = CultureCombined.A_
const PA = Profession.A_
const PVA = ProfessionVariant.A_
const PCA = ProfessionCombined.A_

export const getCurrentRace = createMaybeSelector (
  getWikiRaces,
  getCurrentRaceId,
  (races, raceId) => bind (raceId)
                          (lookupF (races))
)

export const getCurrentRaceVariant = createMaybeSelector (
  getWikiRaceVariants,
  getCurrentRaceVariantId,
  (raceVariants, raceVariantId) => bind (raceVariantId)
                                        (lookupF (raceVariants))
)

export const getCurrentCulture = createMaybeSelector (
  getWikiCultures,
  getCurrentCultureId,
  (cultures, cultureId) => bind (cultureId)
                                (lookupF (cultures))
)

export const getCurrentProfession = createMaybeSelector (
  getWikiProfessions,
  getCurrentProfessionId,
  (professions, professionId) => bind (professionId)
                                      (lookupF (professions))
)

export const getCurrentProfessionVariant = createMaybeSelector (
  getWikiProfessionVariants,
  getCurrentProfessionVariantId,
  (professionVariants, professionVariantId) => bind (professionVariantId)
                                                    (lookupF (professionVariants))
)

export const getAllRaces = createMaybeSelector (
  getWikiCultures,
  getWikiRaceVariants,
  getWikiRaces,
  uncurryN3 (cultures =>
             race_variants => {
               const getAvailableCulturesNames =
                 mapMaybe (pipe (lookupF (cultures), fmap (CA.name)))

               return pipe (
                 elems,
                 map (race =>
                       RaceCombined ({
                         mappedVariants:
                           mapMaybe (pipe (
                                      lookupF (race_variants),
                                      fmap (over (RVL.commonCultures)
                                                 (getAvailableCulturesNames))
                                    ))
                                    (RA.variants (race)),
                         wikiEntry: over (RL.commonCultures)
                                         (getAvailableCulturesNames)
                                         (race),
                       }))
               )
             })
)

export const getAvailableRaces = createMaybeSelector (
  getAllRaces,
  getRuleBooksEnabled,
  uncurryN (races => fmap (flip (filterByAvailability (pipe (RCA.wikiEntry, RA.src)))
                                (races)))
)

export const getFilteredRaces = createMaybeSelector (
  getRacesCombinedSortOptions,
  getRacesFilterText,
  getAvailableRaces,
  uncurryN3 (sort_options =>
             filter_text =>
               fmap (filterAndSortRecordsBy (0)
                                            ([pipe (RCA.wikiEntry, RA.name)])
                                            (sort_options)
                                            (filter_text)))
)

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
                  increaseSkill => skills.lookup (increaseSkill.get ("id"))
                    .fmap (
                      skill => increaseSkill.merge (Record.of ({
                        name: skill.get ("name"),
                      }))
                    )
                )
                (culture.get ("culturalPackageSkills")),
          })
        )
    )
)

export const getCommonCultures = createMaybeSelector (
  getCurrentRace,
  getCurrentRaceVariant,
  (maybeRace, maybeRaceVariant) => {
    const raceCultures = maybeRace.fmap (
      race => race.get ("commonCultures")
    )

    const raceVariantCultures = maybeRaceVariant.fmap (
      raceVariant => raceVariant.get ("commonCultures")
    )

    return List.of<string> (
      ...Maybe.fromMaybe (List.of<string> ()) (raceCultures),
      ...Maybe.fromMaybe (List.of<string> ()) (raceVariantCultures)
    )
  }
)

export const getAvailableCultures = createMaybeSelector (
  getAllCultures,
  getRuleBooksEnabled,
  getCommonCultures,
  getCulturesVisibilityFilter,
  (list, maybeAvailablility, commonCultures, visibility) =>
    maybeAvailablility.fmap (
      availablility => visibility === "common"
        ? filterByAvailability (
          list.filter (e => commonCultures.elem (e.get ("id"))),
          availablility
        )
        : filterByAvailability (list, availablility)
    )
)

export const getFilteredCultures = createMaybeSelector (
  getAvailableCultures,
  getCulturesFilterText,
  getCulturesSortOptions,
  getLocaleAsProp,
  (maybeList, filterText, sortOptions, locale) => maybeList.fmap (
    list => filterAndSortObjects (
      list,
      locale.get ("id"),
      filterText,
      sortOptions as AllSortOptions<CultureCombined>
    )
  )
)

interface SkillGroupLists {
  physicalSkills: List<Record<IncreasableView>>
  socialSkills: List<Record<IncreasableView>>
  natureSkills: List<Record<IncreasableView>>
  knowledgeSkills: List<Record<IncreasableView>>
  craftSkills: List<Record<IncreasableView>>
}

const getGroupSliceKey = (gr: number): keyof SkillGroupLists => {
  if (gr === 1) {
    return "physicalSkills"
  }
  else if (gr === 2) {
    return "socialSkills"
  }
  else if (gr === 3) {
    return "natureSkills"
  }
  else if (gr === 4) {
    return "knowledgeSkills"
  }
  else {
    return "craftSkills"
  }
}

export const getAllProfessions = createMaybeSelector (
  getWiki,
  getLocaleMessages,
  (wiki, locale) => {
    return wiki.get ("professions").elems ().map<Record<ProfessionCombined>> (
      profession => {
        const {
          physicalSkills,
          socialSkills,
          natureSkills,
          knowledgeSkills,
          craftSkills,
        } = profession.get ("skills").foldl<SkillGroupLists> (
          objByGroups => increasableObj => {
            const maybeSkill = wiki.get ("skills").lookup (increasableObj.get ("id"))

            return Maybe.fromMaybe (objByGroups) (
              maybeSkill.fmap (
                skill => {
                  const key = getGroupSliceKey (skill.get ("gr"))

                  return {
                    ...objByGroups,
                    [key]: objByGroups[key].append (
                      increasableObj.merge (
                        Record.of ({
                          name: skill.get ("name"),
                        })
                      )
                    ),
                  }
                }
              )
            )
          }
        ) (
          {
            physicalSkills: List.of (),
            socialSkills: List.of (),
            natureSkills: List.of (),
            knowledgeSkills: List.of (),
            craftSkills: List.of (),
          }
        )

        const filteredVariants = Maybe.mapMaybe
          ((variantId: string) => OrderedMap.lookup<string, Record<ProfessionVariant>>
            (variantId)
            (wiki.get ("professionVariants")))
          (profession.get ("variants"))

        return profession.merge (
          Record.of<MappedProfession> ({
            mappedPrerequisites: Maybe.catMaybes (
              profession.get ("prerequisites").imap<
                Maybe<ListElement<MappedProfession["mappedPrerequisites"]>>
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
                          active: e.get ("active"),
                        })) as Record<ActivatableNameCostActive>
                      )
                  }

                  return Just (e)
                }
              )
            ),
            mappedSpecialAbilities: Maybe.catMaybes (
              profession.get ("specialAbilities").imap (
                index => e => getNameCostForWiki (
                  e.merge (Record.of ({ index })) as any as Record<ActiveObjectWithId>,
                  wiki,
                  locale
                )
                  .fmap (convertPerTierCostToFinalCost (locale))
                  .fmap (
                    obj => obj.merge (Record.of ({
                      active: e.get ("active"),
                    })) as Record<ActivatableNameCostActive>
                  )
              )
            ),
            selections: profession.get ("selections").map (e => {
              if (isCombatTechniquesSelection (e)) {
                return e.modify<"sid"> (
                  sid => Maybe.mapMaybe<string, string> (
                    id => wiki.get ("combatTechniques").lookup (id)
                      .fmap (entry => entry.get ("name"))
                  ) (sid)
                ) ("sid")
              }

              return e
            }),
            mappedCombatTechniques: Maybe.mapMaybe<Record<IncreaseSkill>, Record<IncreasableView>> (
              e => wiki.get ("combatTechniques")
                .lookup (e.get ("id"))
                .fmap (
                  wikiEntry => e.merge (Record.of ({
                    name: wikiEntry.get ("name"),
                  }))
                )
            ) (profession.get ("combatTechniques")),
            mappedPhysicalSkills: physicalSkills,
            mappedSocialSkills: socialSkills,
            mappedNatureSkills: natureSkills,
            mappedKnowledgeSkills: knowledgeSkills,
            mappedCraftSkills: craftSkills,
            mappedSpells: Maybe.mapMaybe<Record<IncreaseSkill>, Record<IncreasableView>> (
              e => wiki.get ("spells")
                .lookup (e.get ("id"))
                .fmap (
                  wikiEntry => e.merge (Record.of ({
                    name: wikiEntry.get ("name"),
                  }))
                )
            ) (profession.get ("spells")),
            mappedLiturgicalChants: Maybe.mapMaybe<Record<IncreaseSkill>, Record<IncreasableView>> (
              e => wiki.get ("liturgicalChants")
                .lookup (e.get ("id"))
                .fmap (
                  wikiEntry => e.merge (Record.of ({
                    name: wikiEntry.get ("name"),
                  }))
                )
            ) (profession.get ("liturgicalChants")),
            mappedVariants: filteredVariants.map<Record<ProfessionVariantCombined>> (
              professionVariant => professionVariant.merge (
                Record.of<MappedProfessionVariant> ({
                  mappedPrerequisites: Maybe.catMaybes (
                    professionVariant.get ("prerequisites").imap<
                      Maybe<ListElement<MappedProfession["mappedPrerequisites"]>>
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
                                active: e.get ("active"),
                              })) as Record<ActivatableNameCostActive>
                            )
                        }

                        return Just (e)
                      }
                    )
                  ),
                  mappedSpecialAbilities: Maybe.catMaybes (
                    professionVariant.get ("specialAbilities").imap (
                      index => e => getNameCostForWiki (
                        e.merge (Record.of ({ index })) as any as Record<ActiveObjectWithId>,
                        wiki,
                        locale
                      )
                        .fmap (convertPerTierCostToFinalCost (locale))
                        .fmap (
                          obj => obj.merge (Record.of ({
                            active: e.get ("active"),
                          })) as Record<ActivatableNameCostActive>
                        )
                    )
                  ),
                  selections: professionVariant.get ("selections").map (e => {
                    if (isCombatTechniquesSelection (e)) {
                      return e.modify<"sid"> (
                        sid => Maybe.mapMaybe<string, string> (
                          id => wiki.get ("combatTechniques").lookup (id)
                            .fmap (entry => entry.get ("name"))
                        ) (sid)
                      ) ("sid")
                    }

                    return e
                  }),
                  mappedCombatTechniques:
                    Maybe.mapMaybe<Record<IncreaseSkill>, Record<IncreasableView>> (
                      e => wiki.get ("combatTechniques")
                        .lookup (e.get ("id"))
                        .fmap (
                          wikiEntry => e.mergeMaybe (Record.of ({
                            name: wikiEntry.get ("name"),
                            previous: profession.get ("combatTechniques")
                              .find (a => a.get ("id") === e.get ("id"))
                              .fmap (a => a.get ("value")),
                          })) as Record<IncreasableView>
                        )
                    ) (professionVariant.get ("combatTechniques")),
                  mappedSkills: Maybe.mapMaybe<Record<IncreaseSkill>, Record<IncreasableView>> (
                    e => wiki.get ("skills")
                      .lookup (e.get ("id"))
                      .fmap (
                        wikiEntry => e.mergeMaybe (Record.of ({
                          name: wikiEntry.get ("name"),
                          previous: profession.get ("skills")
                            .find (a => a.get ("id") === e.get ("id"))
                            .fmap (a => a.get ("value")),
                        })) as Record<IncreasableView>
                      )
                  ) (professionVariant.get ("skills")),
                  mappedSpells: Maybe.mapMaybe<Record<IncreaseSkill>, Record<IncreasableView>> (
                    e => wiki.get ("spells")
                      .lookup (e.get ("id"))
                      .fmap (
                        wikiEntry => e.mergeMaybe (Record.of ({
                          name: wikiEntry.get ("name"),
                          previous: profession.get ("spells")
                            .find (a => a.get ("id") === e.get ("id"))
                            .fmap (a => a.get ("value")),
                        })) as Record<IncreasableView>
                      )
                  ) (professionVariant.get ("spells")),
                  mappedLiturgicalChants:
                    Maybe.mapMaybe<Record<IncreaseSkill>, Record<IncreasableView>> (
                      e => wiki.get ("liturgicalChants")
                        .lookup (e.get ("id"))
                        .fmap (
                          wikiEntry => e.mergeMaybe (Record.of ({
                            name: wikiEntry.get ("name"),
                            previous: profession.get ("liturgicalChants")
                              .find (a => a.get ("id") === e.get ("id"))
                              .fmap (a => a.get ("value")),
                          })) as Record<IncreasableView>
                        )
                    ) (professionVariant.get ("liturgicalChants")),
                })
              )
            ),
          })
        )
      }
    )
  }
)

const isCustomProfession = (e: Record<ProfessionCombined>) => e.get ("id") === "P_0"

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
                e.get ("dependencies"),
                sex,
                currentRaceId,
                currentCulture.fmap (culture => culture.get ("id"))
              )

              const attributeCategory = Just (Categories.ATTRIBUTES)

              return isProfessionValid && e.get ("prerequisites").all (d => {
                if (isProfessionRequiringIncreasable (d)) {
                  const category = getCategoryById (d.get ("id"))

                  const isAttribute = category.equals (attributeCategory)
                  const isGreaterThanMax = d.get ("value") > startEl.get ("maxAttributeValue")

                  return isAttribute && isGreaterThanMax
                }

                return true
              })
            }

            const filterProfessionExtended = (
              culture: Record<Culture>,
              e: Record<ProfessionCombined>
            ): boolean => {
              const maybeCommonList = culture
                  .get ("commonProfessions")
                  .subscript (e.get ("gr") - 1)

              const commonVisible =
                visibility === "all"
                || isCustomProfession (e)
                || Maybe.fromMaybe (false) (
                  maybeCommonList.fmap (
                    commonList => typeof commonList === "boolean"
                      ? (commonList === true && isEntryFromCoreBook (e))
                      : commonList.get ("list").elem (e.get ("subgr"))
                        ? (commonList.get ("list").elem (e.get ("subgr"))
                          !== commonList.get ("reverse")
                          && isEntryFromCoreBook (e))
                        : commonList.get ("reverse") === true
                          ? !commonList.get ("list").elem (e.get ("id")) && isEntryFromCoreBook (e)
                          : commonList.get ("list").elem (e.get ("id"))
                  )
              )

              /**
               * const commonVisible = visibility === 'all' || e.id === 'P_0'
               * || (typeof typicalList === 'boolean' ? typicalList === true :
               * (typicalList.list.includes(e.subgr) ? typicalList.list.includes(e.subgr)
               * !== typicalList.reverse : typicalList.list.includes(e.id)
               * !== typicalList.reverse))
              */

              const groupVisible =
                groupVisibility === 0
                || isCustomProfession (e)
                || groupVisibility === e.get ("gr")

              return groupVisible && commonVisible
            }

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
                e => e.modify<"mappedVariants"> (List.filter (
                  filterProfession as (e: Record<ProfessionVariantCombined>) => boolean
                ))
                                                ("mappedVariants")
              )
          }
        )
      )
    )
)

export const getAvailableProfessions = createMaybeSelector (
  getCommonProfessions,
  getRuleBooksEnabled,
  getProfessionsVisibilityFilter,
  (list, maybeAvailablility, visibility) =>
    Maybe.maybe<true | OrderedSet<string>, List<Record<ProfessionCombined>>> (list) (
      availablility => visibility === "all"
        ? filterByAvailability (list, availablility, isCustomProfession)
        : list
    ) (maybeAvailablility)
)

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
                              addProperty: "subname",
                              keyOfName: sex,
                            }

                            return filterAndSortObjects (
                              list,
                              locale.get ("id"),
                              filterText,
                              sortOptions as AllSortOptions<ProfessionCombined>,
                              filterOptions
                            )
                          }
                        )
                      )
                    )
)

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
                                   (wiki .get ("professions"))
                                   (wiki .get ("professionVariants"))
                                   (sex)
                                   (maybeProfessionId)
                                   (maybeProfessionVariantId)
                                   (maybeCustomProfessionName)
    )
)
