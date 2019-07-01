import { equals } from "../../Data/Eq";
import { flip, ident, thrush } from "../../Data/Function";
import { fmap, fmapF } from "../../Data/Functor";
import { over } from "../../Data/Lens";
import { all, cons, Cons, consF, elem, elemF, filter, find, foldr, intercalate, List, ListI, map, subscriptF } from "../../Data/List";
import { alt, bind, bindF, ensure, fromMaybe, fromMaybe_, imapMaybe, Just, liftM2, liftM4, mapM, mapMaybe, maybe, Maybe } from "../../Data/Maybe";
import { elems, lookup, lookupF, OrderedMap } from "../../Data/OrderedMap";
import { uncurryN, uncurryN3, uncurryN4, uncurryN8 } from "../../Data/Pair";
import { Record } from "../../Data/Record";
import { traceShow } from "../../Debug/Trace";
import { Categories } from "../Constants/Categories";
import { ActiveObjectWithId } from "../Models/ActiveEntries/ActiveObjectWithId";
import { Sex } from "../Models/Hero/heroTypeHelpers";
import { ActivatableNameCostIsActive } from "../Models/View/ActivatableNameCostIsActive";
import { CultureCombined } from "../Models/View/CultureCombined";
import { IncreasableForView } from "../Models/View/IncreasableForView";
import { IncreasableListForView } from "../Models/View/IncreasableListForView";
import { ProfessionCombined, ProfessionCombinedA_, ProfessionCombinedL } from "../Models/View/ProfessionCombined";
import { ProfessionVariantCombined } from "../Models/View/ProfessionVariantCombined";
import { RaceCombined } from "../Models/View/RaceCombined";
import { CombatTechnique } from "../Models/Wiki/CombatTechnique";
import { Culture } from "../Models/Wiki/Culture";
import { ExperienceLevel } from "../Models/Wiki/ExperienceLevel";
import { L10nRecord } from "../Models/Wiki/L10n";
import { LiturgicalChant } from "../Models/Wiki/LiturgicalChant";
import { ProfessionRequireActivatable } from "../Models/Wiki/prerequisites/ActivatableRequirement";
import { isProfessionRequiringIncreasable, ProfessionRequireIncreasable } from "../Models/Wiki/prerequisites/IncreasableRequirement";
import { Profession } from "../Models/Wiki/Profession";
import { CombatTechniquesSelection, CombatTechniquesSelectionL } from "../Models/Wiki/professionSelections/CombatTechniquesSelection";
import { ProfessionSelectionsL } from "../Models/Wiki/professionSelections/ProfessionAdjustmentSelections";
import { ProfessionVariantSelectionsL } from "../Models/Wiki/professionSelections/ProfessionVariantAdjustmentSelections";
import { ProfessionVariant } from "../Models/Wiki/ProfessionVariant";
import { Race, RaceL } from "../Models/Wiki/Race";
import { RaceVariant, RaceVariantL } from "../Models/Wiki/RaceVariant";
import { Skill } from "../Models/Wiki/Skill";
import { Spell } from "../Models/Wiki/Spell";
import { CommonProfession } from "../Models/Wiki/sub/CommonProfession";
import { Die } from "../Models/Wiki/sub/Die";
import { IncreaseSkill } from "../Models/Wiki/sub/IncreaseSkill";
import { IncreaseSkillList } from "../Models/Wiki/sub/IncreaseSkillList";
import { NameBySex } from "../Models/Wiki/sub/NameBySex";
import { WikiModel, WikiModelRecord } from "../Models/Wiki/WikiModel";
import { ProfessionDependency, ProfessionPrerequisite, ProfessionSelectionIds } from "../Models/Wiki/wikiTypeHelpers";
import { getNameCostForWiki } from "../Utilities/Activatable/activatableActiveUtils";
import { convertPerTierCostToFinalCost } from "../Utilities/AdventurePoints/activatableCostUtils";
import { minus } from "../Utilities/Chars";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { filterAndSortRecordsBy } from "../Utilities/filterAndSortBy";
import { translate } from "../Utilities/I18n";
import { getCategoryById } from "../Utilities/IDUtils";
import { abs } from "../Utilities/mathUtils";
import { pipe, pipe_ } from "../Utilities/pipe";
import { validateProfession } from "../Utilities/Prerequisites/validatePrerequisitesUtils";
import { getFullProfessionName } from "../Utilities/rcpUtils";
import { filterByAvailability, filterByAvailabilityAndPred, isEntryFromCoreBook } from "../Utilities/RulesUtils";
import { getStartEl } from "./elSelectors";
import { getRuleBooksEnabled } from "./rulesSelectors";
import { getCulturesCombinedSortOptions, getProfessionsCombinedSortOptions, getRacesCombinedSortOptions } from "./sortOptionsSelectors";
import { getCulturesFilterText, getCurrentCultureId, getCurrentProfessionId, getCurrentProfessionVariantId, getCurrentRaceId, getCurrentRaceVariantId, getCustomProfessionName, getLocaleAsProp, getProfessionsFilterText, getRacesFilterText, getSex, getWiki, getWikiBooks, getWikiCultures, getWikiProfessions, getWikiProfessionVariants, getWikiRaces, getWikiRaceVariants, getWikiSkills } from "./stateSelectors";
import { getCulturesVisibilityFilter, getProfessionsGroupVisibilityFilter, getProfessionsVisibilityFilter } from "./uisettingsSelectors";

const WA = WikiModel.A
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
  getWikiSkills,
  getWikiCultures,
  uncurryN (skills => pipe (
                        elems,
                        map (wiki_entry =>
                              CultureCombined ({
                                mappedCulturalPackageSkills:
                                  mapMaybe  ((x: Record<IncreaseSkill>) => pipe_ (
                                              x,
                                              ISA.id,
                                              lookupF (skills),
                                              fmap (y => IncreasableForView ({
                                                           id: ISA.id (x),
                                                           name: SA.name (y),
                                                           value: ISA.value (x),
                                                         }))
                                            ))
                                            (CA.culturalPackageSkills (wiki_entry)),
                                wikiEntry: wiki_entry,
                              }))
                      ))
)

export const getCommonCultures = createMaybeSelector (
  getCurrentRace,
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
              fmap (visibility === "common"
                     ? flip (filterByAvailability (pipe (CCA.wikiEntry, CA.src)))
                            (filter (pipe (CCA.wikiEntry, CA.id, elemF (common_cultures)))
                                    (cs))
                     : flip (filterByAvailability (pipe (CCA.wikiEntry, CA.src)))
                            (cs)))
)

export const getFilteredCultures = createMaybeSelector (
  getCulturesFilterText,
  getCulturesCombinedSortOptions,
  getAvailableCultures,
  uncurryN3 (filter_text =>
             sort_options =>
               fmap (filterAndSortRecordsBy (0)
                                            ([pipe (CCA.wikiEntry, CA.name)])
                                            (sort_options)
                                            (filter_text)))
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

export const getAllProfessions = createMaybeSelector (
  getLocaleAsProp,
  getWiki,
  uncurryN (l10n =>
            wiki =>
              pipe_ (
                wiki,
                WA.professions,
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
                                  wiki,
                                  WA.skills,
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
                                )
                              )
                              ({
                                physicalSkills: List (),
                                socialSkills: List (),
                                natureSkills: List (),
                                knowledgeSkills: List (),
                                craftSkills: List (),
                              })
                      )

                  const filtered_variants =
                    mapMaybe (lookupF (WA.professionVariants (wiki)))
                             (PA.variants (p))

                  return ProfessionCombined ({
                    mappedAP: fromMaybe_<List<number> | number> (() => map (PVA.ap)
                                                                           (filtered_variants))
                                                                (PA.ap (p)),
                    mappedPrerequisites:
                      imapMaybe (mapProfessionPrerequisite (l10n) (wiki))
                                (PA.prerequisites (p)),
                    mappedSpecialAbilities:
                      imapMaybe (mapProfessionSpecialAbility (l10n) (wiki))
                                (PA.specialAbilities (p)),
                    mappedSelections:
                      thrush (PA.selections (p))
                             (mapProfessionSelection (wiki)),
                    mappedCombatTechniques:
                      thrush (PA.combatTechniques (p))
                             (mapMaybe (mapCombatTechnique (wiki))),
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
                             > (mapSpell (wiki))),
                    mappedLiturgicalChants:
                      thrush (PA.liturgicalChants (p))
                             (mapMaybe<
                               ListI<Profession["liturgicalChants"]>,
                               ListI<ProfessionCombined["mappedLiturgicalChants"]>
                             > (mapLiturgicalChant (wiki))),
                    mappedVariants:
                      map ((v: Record<ProfessionVariant>) =>
                        ProfessionVariantCombined ({
                          mappedPrerequisites:
                            imapMaybe (mapProfessionPrerequisite (l10n) (wiki))
                                      (PVA.prerequisites (v)),
                          mappedSpecialAbilities:
                            imapMaybe (mapProfessionSpecialAbility (l10n) (wiki))
                                      (PVA.specialAbilities (v)),
                          mappedSelections:
                            thrush (PVA.selections (v))
                                   (mapProfessionVariantSelection (wiki)),
                          mappedCombatTechniques:
                            thrush (PVA.combatTechniques (v))
                                   (mapMaybe (mapCombatTechniquePrevious (wiki)
                                                                         (PA.combatTechniques (p))
                                             )),
                          mappedSkills:
                            thrush (PVA.skills (v))
                                   (mapMaybe (mapSkillPrevious (wiki)
                                                               (PA.skills (p)))),
                          mappedSpells:
                            thrush (PVA.spells (v))
                                   (mapMaybe<
                                     ListI<Profession["spells"]>,
                                     ListI<ProfessionCombined["mappedSpells"]>
                                   > (mapSpellPrevious (wiki) (PA.spells (p)))),
                          mappedLiturgicalChants:
                            thrush (PVA.liturgicalChants (v))
                                   (mapMaybe<
                                     ListI<Profession["liturgicalChants"]>,
                                     ListI<ProfessionCombined["mappedLiturgicalChants"]>
                                   > (mapLiturgicalChantPrevious (wiki) (PA.liturgicalChants (p)))),
                          wikiEntry: v,
                        }))
                          (filtered_variants),
                    wikiEntry: p,
                  })
                })
              ))
)

const mapProfessionPrerequisite =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
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
        getNameCostForWiki (l10n) (wiki),
        fmap (pipe (
          convertPerTierCostToFinalCost (false) (l10n),
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
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
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
      getNameCostForWiki (l10n) (wiki),
      traceShow ("getNameCostForWiki"),
      fmap (pipe (
        convertPerTierCostToFinalCost (false) (l10n),
        nameAndCost =>
          ActivatableNameCostIsActive ({
            nameAndCost,
            isActive: ProfessionRequireActivatable.A.active (e),
          })
      ))
    )

const mapCombatTechniquesSelectionNames =
  (wiki: WikiModelRecord) =>
    over (CombatTechniquesSelectionL.sid)
         (mapMaybe (pipe (
                     lookupF (WA.combatTechniques (wiki)),
                     fmap (CTA.name)
                   )))

const mapProfessionSelection =
  (wiki: WikiModelRecord) =>
    over (PSL[ProfessionSelectionIds.COMBAT_TECHNIQUES])
         (fmap (mapCombatTechniquesSelectionNames (wiki)))

const mapProfessionVariantSelection =
  (wiki: WikiModelRecord) =>
    over (PVSL[ProfessionSelectionIds.COMBAT_TECHNIQUES])
         (fmap (sel =>
                 CombatTechniquesSelection.is (sel)
                   ? mapCombatTechniquesSelectionNames (wiki) (sel)
                   : sel))

const mapIncreaseSkill =
  <a>
  (wikiAcc: (w: WikiModelRecord) => OrderedMap<string, a>) =>
  (nameAcc: (x: a) => string) =>
  (wiki: WikiModelRecord) =>
  (e: Record<IncreaseSkill>) =>
    pipe_ (
      e,
      ISA.id,
      lookupF (wikiAcc (wiki)),
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
  (wikiAcc: (w: WikiModelRecord) => OrderedMap<string, a>) =>
  (nameAcc: (x: a) => string) =>
  (wiki: WikiModelRecord) =>
  (e: Record<IncreaseSkill> | Record<IncreaseSkillList>) =>
    IncreaseSkill.is (e)
      ? mapIncreaseSkill (wikiAcc) (nameAcc) (wiki) (e)
      : pipe_ (
          e,
          ISLA.id,
          mapM (lookupF (wikiAcc (wiki))),
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

const mapCombatTechnique = mapIncreaseSkill (WA.combatTechniques) (CTA.name)

const mapSpell = mapIncreaseSkillOrList (WA.spells) (SPA.name)

const mapLiturgicalChant = mapIncreaseSkillOrList (WA.liturgicalChants) (LCA.name)

const mapIncreaseSkillPrevious =
  <a>
  (wikiAcc: (w: WikiModelRecord) => OrderedMap<string, a>) =>
  (nameAcc: (x: a) => string) =>
  (wiki: WikiModelRecord) =>
  (main_xs: List<Record<IncreaseSkill> | Record<IncreaseSkillList>>) =>
  (e: Record<IncreaseSkill>) =>
    pipe_ (
      e,
      ISA.id,
      lookupF (wikiAcc (wiki)),
      fmap (pipe (
        nameAcc,
        name =>
          IncreasableForView ({
            id: ISA.id (e),
            name,
            previous: pipe_ (
              main_xs,
              find (incsk => IncreaseSkill.is (incsk)
                               ? pipe_ (e, ISA.id, equals (ISA.id (incsk)))
                               : false),
              fmap (IncreaseSkill.AL.value)
            ),
            value: ISA.value (e),
          })
      ))
    )

const mapIncreaseSkillListPrevious =
  <a>
  (wikiAcc: (w: WikiModelRecord) => OrderedMap<string, a>) =>
  (nameAcc: (x: a) => string) =>
  (wiki: WikiModelRecord) =>
  (main_xs: List<Record<IncreaseSkill> | Record<IncreaseSkillList>>) =>
  (e: Record<IncreaseSkill> | Record<IncreaseSkillList>) =>
    IncreaseSkill.is (e)
      ? mapIncreaseSkillPrevious (wikiAcc) (nameAcc) (wiki) (main_xs) (e)
      : pipe_ (
          e,
          ISLA.id,
          mapM (lookupF (wikiAcc (wiki))),
          fmap (pipe (
            map (nameAcc),
            name =>
              IncreasableListForView ({
                id: ISLA.id (e) as Cons<string>,
                name,
                previous: pipe_ (
                  main_xs,
                  find (incsk => IncreaseSkill.is (incsk)
                                   ? false
                                   : pipe_ (e, ISLA.id, all (elemF (ISLA.id (incsk))))),
                  fmap (IncreaseSkill.AL.value)
                ),
                value: ISLA.value (e),
              })
          ))
        )

const mapSkillPrevious = mapIncreaseSkillPrevious (WA.skills) (SA.name)

const mapCombatTechniquePrevious = mapIncreaseSkillPrevious (WA.combatTechniques) (CTA.name)

const mapSpellPrevious = mapIncreaseSkillListPrevious (WA.spells) (SPA.name)

const mapLiturgicalChantPrevious = mapIncreaseSkillListPrevious (WA.liturgicalChants) (LCA.name)

const isCustomProfession = (e: Record<ProfessionCombined>) => ProfessionCombinedA_.id (e) === "P_0"

const filterProfessionOrVariant =
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
                  if (isProfessionRequiringIncreasable (d)) {
                    const category = getCategoryById (PRIA.id (d))

                    const isAttribute = Maybe.elemF (category) (Categories.ATTRIBUTES)
                    const isGreaterThanMax = PRIA.value (d) > ELA.maxAttributeValue (start_el)

                    return isAttribute && isGreaterThanMax
                  }

                  return true
                }))
  }

const filterProfession =
  (wiki_books: WikiModel["books"]) =>
  (group_visibility: number) =>
  (visibility: string) =>
  (current_sex: Sex) =>
  (current_race_id: string) =>
  (current_culture: Record<Culture>) =>
  (start_el: Record<ExperienceLevel>) =>
  (e: Record<ProfessionCombined>) => {
    const prof_gr = pipe_ (e, PCA.wikiEntry, PA.gr)

    const mcommon_profs_for_gr = pipe_ (current_culture, CA.commonProfessions, subscriptF (prof_gr))

    const isSubgrCommon =
      pipe (
        CommonProfession.A.list,
        elem<string | number> (ProfessionCombinedA_.subgr (e))
      )

    const common_visible =
      visibility === "all"
      || isCustomProfession (e)
      || Maybe.and (fmapF (mcommon_profs_for_gr)
                          (common_profs_for_gr => {
                            const is_from_core_book = isEntryFromCoreBook (ProfessionCombinedA_.src)
                                                                          (wiki_books)
                                                                          (e)
                            if (typeof common_profs_for_gr === "boolean") {
                              return is_from_core_book
                            }

                            const is_subgr_common = isSubgrCommon (common_profs_for_gr)
                            const is_reverse = CommonProfession.A.reverse (common_profs_for_gr)

                            return is_subgr_common
                              ? (is_subgr_common !== is_reverse && is_from_core_book)
                              : is_reverse
                                ? !is_subgr_common && is_from_core_book
                                : is_subgr_common
                          }))

    /**
      * const commonVisible = visibility === 'all' || e.id === 'P_0'
      * || (typeof typicalList === 'boolean' ? typicalList === true :
      * (typicalList.list.includes(e.subgr) ? typicalList.list.includes(e.subgr)
      * !== typicalList.reverse : typicalList.list.includes(e.id)
      * !== typicalList.reverse))
    */

    const group_visible =
      group_visibility === 0
      || isCustomProfession (e)
      || group_visibility === ProfessionCombinedA_.gr (e)

    return filterProfessionOrVariant (current_sex)
                                     (current_race_id)
                                     (CA.id (current_culture))
                                     (start_el)
                                     (pipe_ (e, PCA.wikiEntry, PA.dependencies))
                                     (pipe_ (e, PCA.wikiEntry, PA.prerequisites))
      && group_visible
      && common_visible
  }

const filterProfessionVariant =
  (current_sex: Sex) =>
  (current_race_id: string) =>
  (current_culture_id: string) =>
  (start_el: Record<ExperienceLevel>) =>
  (e: Record<ProfessionVariantCombined>) =>
    filterProfessionOrVariant (current_sex)
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
  getCurrentRaceId,
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
                                (professions)

                       ))
)

export const getAvailableProfessions = createMaybeSelector (
  getProfessionsVisibilityFilter,
  getCommonProfessions,
  getRuleBooksEnabled,
  uncurryN3 (visibility =>
              liftM2 (xs =>
                      availability => visibility === "all"
                                      ? filterByAvailabilityAndPred (ProfessionCombinedA_.src)
                                                                    (isCustomProfession)
                                                                    (availability)
                                                                    (xs)
                                      : xs))
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
                                               (filter_text)
                       ))
)

export const getCurrentFullProfessionName = createMaybeSelector (
  getLocaleAsProp,
  getWiki,
  getSex,
  getCurrentProfessionId,
  getCurrentProfessionVariantId,
  getCustomProfessionName,
  (l10n, wiki, msex, mprof_id, mprof_var_id, mcustom_prof_name) =>
    fmapF (msex)
          (sex => getFullProfessionName (l10n)
                                        (WA.professions (wiki))
                                        (WA.professionVariants (wiki))
                                        (sex)
                                        (mprof_id)
                                        (mprof_var_id)
                                        (mcustom_prof_name))
)

export const getRandomSizeCalcStr = createMaybeSelector (
  getLocaleAsProp,
  getCurrentRace,
  getCurrentRaceVariant,
  (l10n, mrace, mrace_var) => {
    const msize_base = alt (bindF (RA.sizeBase) (mrace))
                           (bindF (RVA.sizeBase) (mrace_var))

    const msize_randoms = alt (bindF (RA.sizeRandom) (mrace))
                              (bindF (RVA.sizeRandom) (mrace_var))

    return liftM2 ((base: number) => (randoms: List<Record<Die>>) => {
                    const dice_tag = translate (l10n) ("dice.short")

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

const getSign = (x: number) => x < 0 ? minus : "+"

export const getRandomWeightCalcStr = createMaybeSelector (
  getLocaleAsProp,
  getCurrentRace,
  (l10n, mrace) => {
    const mweight_base = fmap (RA.weightBase) (mrace)
    const mweight_randoms = fmap (RA.weightRandom) (mrace)

    return liftM2 ((base: number) => (randoms: List<Record<Die>>) => {
                    const size_tag = translate (l10n) ("size")
                    const dice_tag = translate (l10n) ("dice.short")

                    return pipe_ (
                      randoms,
                      map (die => {
                        const sides = Die.A.sides (die)
                        const amount = Die.A.amount (die)
                        const sign = getSign (sides)

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
