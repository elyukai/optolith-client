import { equals } from "../../Data/Eq"
import { ident, thrush } from "../../Data/Function"
import { fmap, fmapF } from "../../Data/Functor"
import { over } from "../../Data/Lens"
import { all, cons, Cons, consF, elemF, filter, find, foldr, intercalate, List, ListI, map, subscriptF } from "../../Data/List"
import { alt, any, bind, ensure, fromMaybe, fromMaybe_, imapMaybe, Just, liftM2, liftM4, mapM, mapMaybe, maybe, Maybe } from "../../Data/Maybe"
import { abs, add } from "../../Data/Num"
import { elems, lookup, lookupF, OrderedMap } from "../../Data/OrderedMap"
import { Record } from "../../Data/Record"
import { PairF } from "../../Data/Tuple"
import { uncurryN, uncurryN3, uncurryN4, uncurryN8 } from "../../Data/Tuple/Curry"
import { Category } from "../Constants/Categories"
import { ProfessionId, RaceId } from "../Constants/Ids"
import { ActiveObjectWithId } from "../Models/ActiveEntries/ActiveObjectWithId"
import { Sex } from "../Models/Hero/heroTypeHelpers"
import { ActivatableNameCostIsActive } from "../Models/View/ActivatableNameCostIsActive"
import { CultureCombined } from "../Models/View/CultureCombined"
import { IncreasableForView } from "../Models/View/IncreasableForView"
import { IncreasableListForView } from "../Models/View/IncreasableListForView"
import { ProfessionCombined, ProfessionCombinedA_, ProfessionCombinedL } from "../Models/View/ProfessionCombined"
import { ProfessionVariantCombined } from "../Models/View/ProfessionVariantCombined"
import { RaceCombined } from "../Models/View/RaceCombined"
import { CombatTechnique } from "../Models/Wiki/CombatTechnique"
import { Culture } from "../Models/Wiki/Culture"
import { ExperienceLevel } from "../Models/Wiki/ExperienceLevel"
import { LiturgicalChant } from "../Models/Wiki/LiturgicalChant"
import { ProfessionRequireActivatable } from "../Models/Wiki/prerequisites/ActivatableRequirement"
import { RequireIncreasable } from "../Models/Wiki/prerequisites/IncreasableRequirement"
import { ProfessionRequireIncreasable } from "../Models/Wiki/prerequisites/ProfessionRequireIncreasable"
import { Profession } from "../Models/Wiki/Profession"
import { CombatTechniquesSelection, CombatTechniquesSelectionL } from "../Models/Wiki/professionSelections/CombatTechniquesSelection"
import { ProfessionSelectionsL } from "../Models/Wiki/professionSelections/ProfessionAdjustmentSelections"
import { ProfessionVariantSelectionsL } from "../Models/Wiki/professionSelections/ProfessionVariantAdjustmentSelections"
import { ProfessionVariant } from "../Models/Wiki/ProfessionVariant"
import { Race, RaceL } from "../Models/Wiki/Race"
import { RaceVariant, RaceVariantL } from "../Models/Wiki/RaceVariant"
import { Skill } from "../Models/Wiki/Skill"
import { Spell } from "../Models/Wiki/Spell"
import { CommonProfession } from "../Models/Wiki/sub/CommonProfession"
import { Die } from "../Models/Wiki/sub/Die"
import { IncreaseSkill } from "../Models/Wiki/sub/IncreaseSkill"
import { IncreaseSkillList } from "../Models/Wiki/sub/IncreaseSkillList"
import { NameBySex } from "../Models/Wiki/sub/NameBySex"
import { StaticData, StaticDataRecord } from "../Models/Wiki/WikiModel"
import { ProfessionDependency, ProfessionPrerequisite, ProfessionSelectionIds } from "../Models/Wiki/wikiTypeHelpers"
import { getNameCostForWiki } from "../Utilities/Activatable/activatableActiveUtils"
import { convertPerTierCostToFinalCost } from "../Utilities/AdventurePoints/activatableCostUtils"
import { minus, plusmn } from "../Utilities/Chars"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { filterAndSortRecordsBy } from "../Utilities/filterAndSortBy"
import { translate } from "../Utilities/I18n"
import { getCategoryById } from "../Utilities/IDUtils"
import { pipe, pipe_ } from "../Utilities/pipe"
import { validateProfession } from "../Utilities/Prerequisites/validatePrerequisitesUtils"
import { getFullProfessionName } from "../Utilities/rcpUtils"
import { filterByAvailability, filterByAvailabilityAndPred, isEntryFromCoreBook } from "../Utilities/RulesUtils"
import { getStartEl } from "./elSelectors"
import { getRuleBooksEnabled } from "./rulesSelectors"
import { getCulturesCombinedSortOptions, getProfessionsCombinedSortOptions, getRacesCombinedSortOptions } from "./sortOptionsSelectors"
import { getCultureId, getCulturesFilterText, getCurrentCultureId, getCurrentProfessionId, getCurrentProfessionVariantId, getCurrentRaceId, getCurrentRaceVariantId, getCustomProfessionName, getProfessionsFilterText, getRaceId, getRacesFilterText, getRaceVariantId, getSex, getWiki, getWikiBooks, getWikiCultures, getWikiProfessions, getWikiProfessionVariants, getWikiRaces, getWikiRaceVariants, getWikiSkills } from "./stateSelectors"
import { getCulturesVisibilityFilter, getProfessionsGroupVisibilityFilter, getProfessionsVisibilityFilter } from "./uisettingsSelectors"

const SDA = StaticData.A
const ELA = ExperienceLevel.A
const RA = Race.A
const RL = RaceL
const RVA = RaceVariant.A
const RVL = RaceVariantL
const RCA = RaceCombined.A
const CA = Culture.A
const CCA = CultureCombined.A
const PA = Profession.A
const PVA = ProfessionVariant.A
const PCA = ProfessionCombined.A
const PCL = ProfessionCombinedL
const PVCA = ProfessionVariantCombined.A
const ISA = IncreaseSkill.A
const ISLA = IncreaseSkillList.A
const SA = Skill.A
const SPA = Spell.A
const CTA = CombatTechnique.A
const LCA = LiturgicalChant.A
const PRIA = ProfessionRequireIncreasable.A
const PSL = ProfessionSelectionsL
const PVSL = ProfessionVariantSelectionsL

export const getRace = createMaybeSelector (
  getWikiRaces,
  getRaceId,
  (races, raceId) => bind (raceId)
                          (lookupF (races))
)

export const getCurrentRace = createMaybeSelector (
  getWikiRaces,
  getCurrentRaceId,
  (races, raceId) => bind (raceId)
                          (lookupF (races))
)

export const getRaceVariant = createMaybeSelector (
  getWikiRaceVariants,
  getRaceVariantId,
  (raceVariants, raceVariantId) => bind (raceVariantId)
                                        (lookupF (raceVariants))
)

export const getCurrentRaceVariant = createMaybeSelector (
  getWikiRaceVariants,
  getCurrentRaceVariantId,
  (raceVariants, raceVariantId) => bind (raceVariantId)
                                        (lookupF (raceVariants))
)

export const getCulture = createMaybeSelector (
  getWikiCultures,
  getCultureId,
  (cultures, cultureId) => bind (cultureId)
                                (lookupF (cultures))
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
  getRuleBooksEnabled,
  getAllRaces,
  uncurryN (filterByAvailability (pipe (RCA.wikiEntry, RA.src)))
)

export const getFilteredRaces = createMaybeSelector (
  getRacesCombinedSortOptions,
  getRacesFilterText,
  getAvailableRaces,
  uncurryN3 (filterAndSortRecordsBy (0) ([ pipe (RCA.wikiEntry, RA.name) ]))
)

export const getAllCultures = createMaybeSelector (
  getWikiSkills,
  getWikiCultures,
  uncurryN (skills => pipe (
                        elems,
                        map (wiki_entry =>
                              CultureCombined ({
                                mappedCulturalPackageSkills:
                                  mapMaybe ((x: Record<IncreaseSkill>) => pipe_ (
                                             x,
                                             ISA.id,
                                             lookupF (skills),
                                             fmap (PairF (ISA.value (x)))
                                           ))
                                           (CA.culturalPackageSkills (wiki_entry)),
                                wikiEntry: wiki_entry,
                              }))
                      ))
)

export const getCommonCultures = createMaybeSelector (
  getRace,
  getCurrentRaceVariant,
  (mrace, mrace_variant) => {
    const mrace_cultures = fmapF (mrace) (RA.commonCultures)

    const mrace_variant_cultures = fmapF (mrace_variant) (RVA.commonCultures)

    return List (
      ...fromMaybe (List<string> ()) (mrace_cultures),
      ...fromMaybe (List<string> ()) (mrace_variant_cultures)
    )
  }
)

export const getAvailableCultures = createMaybeSelector (
  getCommonCultures,
  getCulturesVisibilityFilter,
  getAllCultures,
  getRuleBooksEnabled,
  uncurryN4 (common_cultures =>
             visibility =>
             cs =>
             av =>
              visibility === "common"
                ? filterByAvailability (pipe (CCA.wikiEntry, CA.src))
                                       (av)
                                       (filter (pipe (
                                                 CCA.wikiEntry,
                                                 CA.id,
                                                 elemF (common_cultures)
                                               ))
                                               (cs))
                : filterByAvailability (pipe (CCA.wikiEntry, CA.src))
                                       (av)
                                       (cs))
)

export const getFilteredCultures = createMaybeSelector (
  getCulturesCombinedSortOptions,
  getCulturesFilterText,
  getAvailableCultures,
  uncurryN3 (filterAndSortRecordsBy (0) ([ pipe (CCA.wikiEntry, CA.name) ]))
)

interface SkillGroupLists {
  physicalSkills: List<Record<IncreasableForView>>
  socialSkills: List<Record<IncreasableForView>>
  natureSkills: List<Record<IncreasableForView>>
  knowledgeSkills: List<Record<IncreasableForView>>
  craftSkills: List<Record<IncreasableForView>>
}

const getGroupSliceKey = (gr: number): keyof SkillGroupLists => {
  switch (gr) {
    case 1:
      return "physicalSkills"

    case 2:
      return "socialSkills"

    case 3:
      return "natureSkills"

    case 4:
      return "knowledgeSkills"

    default:
      return "craftSkills"
  }
}

const mapProfessionPrerequisite =
  (staticData: StaticDataRecord) =>
  (index: number) =>
  (e: ListI<Profession["prerequisites"]>):
  Maybe<ListI<ProfessionCombined["mappedPrerequisites"]>> => {
    if (ProfessionRequireActivatable.is (e)) {
      return pipe_ (
        ActiveObjectWithId ({
          id: ProfessionRequireActivatable.A.id (e),
          index,
          sid2: ProfessionRequireActivatable.A.sid2 (e),
          sid: ProfessionRequireActivatable.A.sid (e),
          tier: ProfessionRequireActivatable.A.tier (e),
        }),
        getNameCostForWiki (staticData),
        fmap (pipe (
          convertPerTierCostToFinalCost (true) (staticData),
          nameAndCost =>
            ActivatableNameCostIsActive ({
              nameAndCost,
              isActive: ProfessionRequireActivatable.A.active (e),
            })
        ))
      )
    }

    return Just (e)
  }

const mapProfessionSpecialAbility =
  (staticData: StaticDataRecord) =>
  (index: number) =>
  (e: ListI<Profession["specialAbilities"]>) =>
    pipe_ (
      ActiveObjectWithId ({
        id: ProfessionRequireActivatable.A.id (e),
        index,
        sid2: ProfessionRequireActivatable.A.sid2 (e),
        sid: ProfessionRequireActivatable.A.sid (e),
        tier: ProfessionRequireActivatable.A.tier (e),
      }),
      getNameCostForWiki (staticData),
      fmap (pipe (
        convertPerTierCostToFinalCost (true) (staticData),
        nameAndCost =>
          ActivatableNameCostIsActive ({
            nameAndCost,
            isActive: ProfessionRequireActivatable.A.active (e),
          })
      ))
    )

const mapCombatTechniquesSelectionNames =
  (staticData: StaticDataRecord) =>
    over (CombatTechniquesSelectionL.sid)
         (mapMaybe (pipe (
                     lookupF (SDA.combatTechniques (staticData)),
                     fmap (CTA.name)
                   )))

const mapProfessionSelection =
  (staticData: StaticDataRecord) =>
    over (PSL[ProfessionSelectionIds.COMBAT_TECHNIQUES])
         (fmap (mapCombatTechniquesSelectionNames (staticData)))

const mapProfessionVariantSelection =
  (staticData: StaticDataRecord) =>
    over (PVSL[ProfessionSelectionIds.COMBAT_TECHNIQUES])
         (fmap (sel =>
                 CombatTechniquesSelection.is (sel)
                   ? mapCombatTechniquesSelectionNames (staticData) (sel)
                   : sel))

const mapIncreaseSkill =
  <a>
  (wikiAcc: (w: StaticDataRecord) => OrderedMap<string, a>) =>
  (nameAcc: (x: a) => string) =>
  (staticData: StaticDataRecord) =>
  (e: Record<IncreaseSkill>) =>
    pipe_ (
      e,
      ISA.id,
      lookupF (wikiAcc (staticData)),
      fmap (pipe (
        nameAcc,
        name =>
          IncreasableForView ({
            id: ISA.id (e),
            name,
            value: ISA.value (e),
          })
      ))
    )

const mapIncreaseSkillOrList =
  <a>
  (wikiAcc: (w: StaticDataRecord) => OrderedMap<string, a>) =>
  (nameAcc: (x: a) => string) =>
  (staticData: StaticDataRecord) =>
  (e: Record<IncreaseSkill> | Record<IncreaseSkillList>) =>
    IncreaseSkill.is (e)
      ? mapIncreaseSkill (wikiAcc) (nameAcc) (staticData) (e)
      : pipe_ (
          e,
          ISLA.id,
          mapM (lookupF (wikiAcc (staticData))),
          fmap (pipe (
            map (nameAcc),
            name =>
              IncreasableListForView ({
                id: ISLA.id (e) as Cons<string>,
                name,
                value: ISLA.value (e),
              })
          ))
        )

const mapCombatTechnique = mapIncreaseSkill (SDA.combatTechniques) (CTA.name)

const mapSpell = mapIncreaseSkillOrList (SDA.spells) (SPA.name)

const mapLiturgicalChant = mapIncreaseSkillOrList (SDA.liturgicalChants) (LCA.name)

const mapIncreaseSkillPrevious =
  (base: number) =>
  <A>
  (wikiAcc: (w: StaticDataRecord) => OrderedMap<string, A>) =>
  (nameAcc: (x: A) => string) =>
  (staticData: StaticDataRecord) =>
  (main_xs: List<Record<IncreaseSkill> | Record<IncreaseSkillList>>) =>
  (e: Record<IncreaseSkill>) =>
    pipe_ (
      e,
      ISA.id,
      lookupF (wikiAcc (staticData)),
      fmap (pipe (
        nameAcc,
        name => {
          const previous = pipe_ (
              main_xs,
              find (incsk => IncreaseSkill.is (incsk)
                               ? pipe_ (e, ISA.id, equals (ISA.id (incsk)))
                               : false),
              fmap (pipe (
                IncreaseSkill.AL.value,
                add (base)
              ))
            )

          const value = ISA.value (e)

          return IncreasableForView ({
            id: ISA.id (e),
            name,
            previous,
            value: maybe (value + base) (add (value)) (previous),
          })
        }
      ))
    )

const mapIncreaseSkillListPrevious =
  (base: number) =>
  <A>
  (wikiAcc: (w: StaticDataRecord) => OrderedMap<string, A>) =>
  (nameAcc: (x: A) => string) =>
  (staticData: StaticDataRecord) =>
  (main_xs: List<Record<IncreaseSkill> | Record<IncreaseSkillList>>) =>
  (e: Record<IncreaseSkill> | Record<IncreaseSkillList>) =>
    IncreaseSkill.is (e)
      ? mapIncreaseSkillPrevious (base) (wikiAcc) (nameAcc) (staticData) (main_xs) (e)
      : pipe_ (
          e,
          ISLA.id,
          mapM (lookupF (wikiAcc (staticData))),
          fmap (pipe (
            map (nameAcc),
            name => {
              const previous = pipe_ (
                  main_xs,
                  find (incsk => IncreaseSkill.is (incsk)
                                   ? false
                                   : pipe_ (e, ISLA.id, all (elemF (ISLA.id (incsk))))),
                  fmap (pipe (
                    IncreaseSkill.AL.value,
                    add (base)
                  ))
                )

              const value = ISLA.value (e)

              return IncreasableListForView ({
                id: ISLA.id (e) as Cons<string>,
                name,
                previous,
                value: maybe (value + base) (add (value)) (previous),
              })
            }
          ))
        )

const mapSkillPrevious = mapIncreaseSkillPrevious (0) (SDA.skills) (SA.name)

const mapCombatTechniquePrevious = mapIncreaseSkillPrevious (6) (SDA.combatTechniques) (CTA.name)

const mapSpellPrevious = mapIncreaseSkillListPrevious (0) (SDA.spells) (SPA.name)

const mapLiturgicalChantPrevious = mapIncreaseSkillListPrevious (0)
                                                                (SDA.liturgicalChants)
                                                                (LCA.name)

export const getAllProfessions = createMaybeSelector (
  getWiki,
  staticData =>
    pipe_ (
      staticData,
      SDA.professions,
      elems,
      map (p => {
        const {
          physicalSkills,
          socialSkills,
          natureSkills,
          knowledgeSkills,
          craftSkills,
        } = pipe_ (
              p,
              PA.skills,
              foldr ((incsk: Record<IncreaseSkill>) => (acc: SkillGroupLists) =>
                      pipe_ (
                        staticData,
                        SDA.skills,
                        lookup (ISA.id (incsk)),
                        maybe (acc)
                              (skill => {
                                const key = getGroupSliceKey (SA.gr (skill))

                                return {
                                  ...acc,
                                  [key]: cons (acc [key])
                                              (IncreasableForView ({
                                                id: ISA.id (incsk),
                                                name: SA.name (skill),
                                                value: ISA.value (incsk),
                                              })),
                                }
                              })
                      ))
                    ({
                      physicalSkills: List (),
                      socialSkills: List (),
                      natureSkills: List (),
                      knowledgeSkills: List (),
                      craftSkills: List (),
                    })
            )

        const filtered_variants =
          mapMaybe (lookupF (SDA.professionVariants (staticData)))
                   (PA.variants (p))

        return ProfessionCombined ({
          mappedAP: fromMaybe_<List<number> | number> (() => map (PVA.ap)
                                                                 (filtered_variants))
                                                      (PA.ap (p)),
          mappedPrerequisites:
            imapMaybe (mapProfessionPrerequisite (staticData))
                      (PA.prerequisites (p)),
          mappedSpecialAbilities:
            imapMaybe (mapProfessionSpecialAbility (staticData))
                      (PA.specialAbilities (p)),
          mappedSelections:
            thrush (PA.selections (p))
                   (mapProfessionSelection (staticData)),
          mappedCombatTechniques:
            thrush (PA.combatTechniques (p))
                   (mapMaybe (mapCombatTechnique (staticData))),
          mappedPhysicalSkills: physicalSkills,
          mappedSocialSkills: socialSkills,
          mappedNatureSkills: natureSkills,
          mappedKnowledgeSkills: knowledgeSkills,
          mappedCraftSkills: craftSkills,
          mappedSpells:
            thrush (PA.spells (p))
                   (mapMaybe<
                     ListI<Profession["spells"]>,
                     ListI<ProfessionCombined["mappedSpells"]>
                   > (mapSpell (staticData))),
          mappedLiturgicalChants:
            thrush (PA.liturgicalChants (p))
                   (mapMaybe<
                     ListI<Profession["liturgicalChants"]>,
                     ListI<ProfessionCombined["mappedLiturgicalChants"]>
                   > (mapLiturgicalChant (staticData))),
          mappedVariants:
            map ((v: Record<ProfessionVariant>) =>
              ProfessionVariantCombined ({
                mappedPrerequisites:
                  imapMaybe (mapProfessionPrerequisite (staticData))
                            (PVA.prerequisites (v)),
                mappedSpecialAbilities:
                  imapMaybe (mapProfessionSpecialAbility (staticData))
                            (PVA.specialAbilities (v)),
                mappedSelections:
                  thrush (PVA.selections (v))
                         (mapProfessionVariantSelection (staticData)),
                mappedCombatTechniques:
                  mapMaybe (mapCombatTechniquePrevious (staticData)
                                                       (PA.combatTechniques (p)))
                           (PVA.combatTechniques (v)),
                mappedSkills:
                  thrush (PVA.skills (v))
                         (mapMaybe (mapSkillPrevious (staticData)
                                                     (PA.skills (p)))),
                mappedSpells:
                  thrush (PVA.spells (v))
                         (mapMaybe<
                           ListI<Profession["spells"]>,
                           ListI<ProfessionCombined["mappedSpells"]>
                         > (mapSpellPrevious (staticData) (PA.spells (p)))),
                mappedLiturgicalChants:
                  thrush (PVA.liturgicalChants (v))
                         (mapMaybe<
                           ListI<Profession["liturgicalChants"]>,
                           ListI<ProfessionCombined["mappedLiturgicalChants"]>
                         > (mapLiturgicalChantPrevious (staticData) (PA.liturgicalChants (p)))),
                wikiEntry: v,
              }))
                (filtered_variants),
          wikiEntry: p,
        })
      })
    )
)

const isCustomProfession = (e: Record<ProfessionCombined>) => ProfessionCombinedA_.id (e)
                                                              === ProfessionId.CustomProfession

const areProfessionOrVariantPrerequisitesValid =
  (current_sex: Sex) =>
  (current_race_id: string) =>
  (current_culture_id: string) =>
  (start_el: Record<ExperienceLevel>) =>
  (dependencies: List<ProfessionDependency>) =>
  (prerequisites: List<ProfessionPrerequisite>): boolean => {
    const isProfessionValid = validateProfession (dependencies)
                                                 (current_sex)
                                                 (current_race_id)
                                                 (current_culture_id)

    return isProfessionValid
      && thrush (prerequisites)
                (all (d => {
                  if (RequireIncreasable.is (d)) {
                    const category = getCategoryById (PRIA.id (d))

                    const isAttribute = Maybe.elemF (category) (Category.ATTRIBUTES)
                    const isGreaterThanMax = PRIA.value (d) > ELA.maxAttributeValue (start_el)

                    return isAttribute && isGreaterThanMax
                  }

                  return true
                }))
  }

const filterProfession =
  (wiki_books: StaticData["books"]) =>
  (group_visibility: number) =>
  (visibility: string) =>
  (current_sex: Sex) =>
  (current_race_id: string) =>
  (current_culture: Record<Culture>) =>
  (start_el: Record<ExperienceLevel>) =>
  (e: Record<ProfessionCombined>) => {
    // Custom profession always visible
    if (isCustomProfession (e)) {
      return true
    }

    // Group of current profession
    const gr = ProfessionCombinedA_.gr (e)

    // All groups must be visible or it must be of selected group
    if (group_visibility !== 0 && group_visibility !== gr) {
      return false
    }

    // The visibility rules for common professions of the current profession's
    // group
    const mcommon_profs_for_gr = pipe_ (current_culture, CA.commonProfessions, subscriptF (gr - 1))

    const is_common =

      // Either its not restricted to common professions
      visibility === "all"

      // Or it must be a common profession
      || maybe (true)
               ((common_profs_for_gr: boolean | Record<CommonProfession>) => {
                 // Entry must be from core book if everything from the group or
                 // a subgroup this entry belongs to is common
                 const is_from_core_book = isEntryFromCoreBook (ProfessionCombinedA_.src)
                                                               (wiki_books)
                                                               (e)

                 if (typeof common_profs_for_gr === "boolean") {
                   // Group must be common and it must be from core book
                   return common_profs_for_gr && is_from_core_book
                 }

                 // Check if the passed id or subgroup is in the list
                 const isCommon = elemF (CommonProfession.A.list (common_profs_for_gr))

                 const is_id_included = isCommon (ProfessionCombinedA_.id (e))

                 const is_subgr_included = isCommon (ProfessionCombinedA_.subgr (e))

                 const is_included = is_id_included || is_subgr_included

                 const is_reverse = CommonProfession.A.reverse (common_profs_for_gr)

                 return is_reverse

                   // if reversed, the entry does not need to be in the list to be common
                   ? !is_included && is_from_core_book

                   // if not reversed, the entry must be in the list to be common
                   : is_included && is_from_core_book
               })
               (mcommon_profs_for_gr)

    if (!is_common) {
      return false
    }

    return areProfessionOrVariantPrerequisitesValid (current_sex)
                                                    (current_race_id)
                                                    (CA.id (current_culture))
                                                    (start_el)
                                                    (ProfessionCombinedA_.dependencies (e))
                                                    (ProfessionCombinedA_.prerequisites (e))
  }

const filterProfessionVariant =
  (current_sex: Sex) =>
  (current_race_id: string) =>
  (current_culture_id: string) =>
  (start_el: Record<ExperienceLevel>) =>
  (e: Record<ProfessionVariantCombined>) =>
    areProfessionOrVariantPrerequisitesValid (current_sex)
                                             (current_race_id)
                                             (current_culture_id)
                                             (start_el)
                                             (pipe_ (e, PVCA.wikiEntry, PVA.dependencies))
                                             (pipe_ (e, PVCA.wikiEntry, PVA.prerequisites))

export const getCommonProfessions = createMaybeSelector (
  getWikiBooks,
  getAllProfessions,
  getProfessionsGroupVisibilityFilter,
  getProfessionsVisibilityFilter,
  getStartEl,
  getRaceId,
  getCurrentCulture,
  getSex,
  uncurryN8 (wiki_books =>
             professions =>
             group_visibility =>
             visibility =>
               liftM4 (start_el =>
                       race_id =>
                       culture =>
                       sex =>
                         mapMaybe (pipe (
                                    ensure (filterProfession (wiki_books)
                                                             (group_visibility)
                                                             (visibility)
                                                             (sex)
                                                             (race_id)
                                                             (culture)
                                                             (start_el)),
                                    fmap (over (PCL.mappedVariants)
                                               (filter (filterProfessionVariant (sex)
                                                                                (race_id)
                                                                                (CA.id (culture))
                                                                                (start_el))))
                                  ))
                                (professions)))
)

export const getAvailableProfessions = createMaybeSelector (
  getProfessionsVisibilityFilter,
  getRuleBooksEnabled,
  getCommonProfessions,
  uncurryN3 (visibility =>
             availability =>
              fmap (xs => visibility === "all"
                          ? filterByAvailabilityAndPred (ProfessionCombinedA_.src)
                                                        (isCustomProfession)
                                                        (availability)
                                                        (xs)
                          : filterByAvailability (ProfessionCombinedA_.src)
                                                 (availability)
                                                 (xs)))
)

export const getFilteredProfessions = createMaybeSelector (
  getProfessionsFilterText,
  getProfessionsCombinedSortOptions,
  getSex,
  getAvailableProfessions,
  uncurryN4 (filter_text =>
             sort_options =>
               liftM2 (sex =>
                        filterAndSortRecordsBy (0)
                                               ([
                                                 pipe (
                                                   PCA.wikiEntry,
                                                   PA.name,
                                                   n => NameBySex.is (n)
                                                     ? NameBySex.A[sex] (n)
                                                     : n
                                                 ),
                                                 pipe (
                                                   PCA.wikiEntry,
                                                   PA.subname,
                                                   maybe ("")
                                                         (n => NameBySex.is (n)
                                                                 ? NameBySex.A[sex] (n)
                                                                 : n)
                                                 ),
                                                 pipe (
                                                   PCA.mappedVariants,
                                                   map (pipe (
                                                    PVCA.wikiEntry,
                                                    PVA.name,
                                                    ident,
                                                    n => NameBySex.is (n)
                                                           ? NameBySex.A[sex] (n)
                                                           : n
                                                   ))
                                                 ),
                                               ])
                                               (sort_options)
                                               (filter_text)))
)

export const getCurrentFullProfessionName = createMaybeSelector (
  getWiki,
  getSex,
  getCurrentProfessionId,
  getCurrentProfessionVariantId,
  getCustomProfessionName,
  (staticData, msex, mprof_id, mprof_var_id, mcustom_prof_name) =>
    fmapF (msex)
          (sex => getFullProfessionName (staticData)
                                        (SDA.professions (staticData))
                                        (SDA.professionVariants (staticData))
                                        (sex)
                                        (mprof_id)
                                        (mprof_var_id)
                                        (mcustom_prof_name))
)

const getSign = (x: number) => x < 0 ? minus : "+"

export const getRandomSizeCalcStr = createMaybeSelector (
  getWiki,
  getRace,
  getCurrentRaceVariant,
  (staticData, mrace, mrace_var) => {
    const msize_base = alt (bind (mrace) (RA.sizeBase))
                           (fmapF (mrace_var) (RVA.sizeBase))

    const msize_randoms = alt (bind (mrace) (RA.sizeRandom))
                              (fmapF (mrace_var) (RVA.sizeRandom))

    return liftM2 ((base: number) => (randoms: List<Record<Die>>) => {
                    const dice_tag = translate (staticData) ("general.dice")

                    return pipe_ (
                      randoms,
                      map (die => {
                        const sides = Die.A.sides (die)
                        const amount = Die.A.amount (die)
                        const sign = getSign (sides)

                        return `${sign} ${amount}${dice_tag}${abs (sides)}`
                      }),
                      consF (`${base}`),
                      intercalate (" ")
                    )
                  })
                  (msize_base)
                  (msize_randoms)
  }
)

export const getRandomWeightCalcStr = createMaybeSelector (
  getWiki,
  getRace,
  (staticData, mrace) => {
    const mweight_base = fmap (RA.weightBase) (mrace)
    const mweight_randoms = fmap (RA.weightRandom) (mrace)
    const is_humans = any (pipe (RA.id, equals<string> (RaceId.Humans))) (mrace)

    return liftM2 ((base: number) => (randoms: List<Record<Die>>) => {
                    const size_tag = translate (staticData) ("personaldata.size")
                    const dice_tag = translate (staticData) ("general.dice")

                    return pipe_ (
                      randoms,
                      map (die => {
                        const sides = Die.A.sides (die)
                        const amount = Die.A.amount (die)
                        const sign = is_humans ? plusmn : getSign (sides)

                        return `${sign} ${amount}${dice_tag}${abs (sides)}`
                      }),
                      consF (`${minus} ${base}`),
                      consF (size_tag),
                      intercalate (" ")
                    )
                  })
                  (mweight_base)
                  (mweight_randoms)
  }
)

export const getAutomaticAdvantages = createMaybeSelector (
  getRace,
  maybe (List<string> ()) (RA.automaticAdvantages)
)
