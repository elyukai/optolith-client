import { equals } from "../../Data/Eq"
import { ident } from "../../Data/Function"
import { any, filter, isInfixOf, List, lower, map } from "../../Data/List"
import { fromMaybe, Maybe, maybe } from "../../Data/Maybe"
import { elems, keysSet } from "../../Data/OrderedMap"
import { Record } from "../../Data/Record"
import { uncurryN, uncurryN3, uncurryN4 } from "../../Data/Tuple/Curry"
import { numIdNameToDropdown } from "../Models/NumIdName"
import { CultureCombinedA_ } from "../Models/View/CultureCombined"
import { ProfessionCombined, ProfessionCombinedA_ } from "../Models/View/ProfessionCombined"
import { ProfessionVariantCombined } from "../Models/View/ProfessionVariantCombined"
import { RaceCombinedA_ } from "../Models/View/RaceCombined"
import { Advantage } from "../Models/Wiki/Advantage"
import { Blessing } from "../Models/Wiki/Blessing"
import { Cantrip } from "../Models/Wiki/Cantrip"
import { CombatTechnique } from "../Models/Wiki/CombatTechnique"
import { Disadvantage } from "../Models/Wiki/Disadvantage"
import { ItemTemplate } from "../Models/Wiki/ItemTemplate"
import { LiturgicalChant } from "../Models/Wiki/LiturgicalChant"
import { ProfessionVariant } from "../Models/Wiki/ProfessionVariant"
import { Skill } from "../Models/Wiki/Skill"
import { SpecialAbility } from "../Models/Wiki/SpecialAbility"
import { Spell } from "../Models/Wiki/Spell"
import { NameBySex } from "../Models/Wiki/sub/NameBySex"
import { StaticData } from "../Models/Wiki/WikiModel"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { filterRecordsByA, filterRecordsByName } from "../Utilities/filterBy"
import { compareLocale } from "../Utilities/I18n"
import { pipe, pipe_ } from "../Utilities/pipe"
import { filterByAvailabilityF } from "../Utilities/RulesUtils"
import { comparingR, sortByMulti, sortRecordsByName } from "../Utilities/sortBy"
import { getAllCultures } from "./cultureSelectors"
import { getAllProfessions } from "./professionSelectors"
import { getAllRaces } from "./raceSelectors"
import { getWikiProfessionsCombinedSortOptions } from "./sortOptionsSelectors"
import { getWiki, getWikiAdvantages, getWikiBlessings, getWikiBooks, getWikiCantrips, getWikiCombatTechniques, getWikiCombatTechniquesGroup, getWikiDisadvantages, getWikiFilterText, getWikiItemTemplates, getWikiItemTemplatesGroup, getWikiLiturgicalChants, getWikiLiturgicalChantsGroup, getWikiProfessionsGroup, getWikiSkills, getWikiSkillsGroup, getWikiSpecialAbilities, getWikiSpecialAbilitiesGroup, getWikiSpells, getWikiSpellsGroup } from "./stateSelectors"

const PCA = ProfessionCombined.A
const PCA_ = ProfessionCombinedA_
const PVA = ProfessionVariant.A
const PVCA = ProfessionVariantCombined.A

export const filterByWikiAvailablilty = createMaybeSelector (
  getWikiBooks,
  booksMap => filterByAvailabilityF (booksMap) (keysSet (booksMap)) (true)
)

export const getRacesSortedByName = createMaybeSelector (
  getWiki,
  getAllRaces,
  uncurryN (
    staticData => sortByMulti ([ comparingR (RaceCombinedA_.name) (compareLocale (staticData)) ])
  )
)

export const getPreparedRaces = createMaybeSelector (
  filterByWikiAvailablilty,
  getWikiFilterText,
  getRacesSortedByName,
  uncurryN3 (filterWiki => filter_text =>
              pipe (
                filterRecordsByA ([ RaceCombinedA_.name ]) (filter_text),
                filterWiki (RaceCombinedA_.src),
              ))
)

export const getCulturesSortedByName = createMaybeSelector (
  getWiki,
  getAllCultures,
  uncurryN (
    staticData => sortByMulti ([ comparingR (CultureCombinedA_.name) (compareLocale (staticData)) ])
  )
)

export const getPreparedCultures = createMaybeSelector (
  filterByWikiAvailablilty,
  getWikiFilterText,
  getCulturesSortedByName,
  uncurryN3 (filterWiki => filter_text =>
              pipe (
                filterRecordsByA ([ CultureCombinedA_.name ]) (filter_text),
                filterWiki (CultureCombinedA_.src)
              ))
)

export const getProfessionsSortedByName = createMaybeSelector (
  getWikiProfessionsCombinedSortOptions,
  getAllProfessions,
  uncurryN (sortByMulti)
)

const isProfessionIncludedInFilter =
  (filter_text: string) =>
  (mselected_gr: Maybe<number>) =>
  (x: Record<ProfessionCombined>) =>
    pipe_ (x, PCA_.gr, gr => Maybe.all (equals (gr)) (mselected_gr))
    && (
      filter_text === ""
      || pipe_ (
           x,
           PCA_.name,
           n => NameBySex.is (n)
                  ? List (
                      lower (NameBySex.A.f (n)),
                      lower (NameBySex.A.m (n))
                    )
                  : List (lower (n)),
           any (isInfixOf (lower (filter_text)))
         )
      || pipe_ (
           x,
           PCA_.subname,
           maybe (List<string> ())
                 (n => NameBySex.is (n)
                         ? List (
                             lower (NameBySex.A.f (n)),
                             lower (NameBySex.A.m (n))
                           )
                         : List (lower (n))),
           any (isInfixOf (lower (filter_text)))
         )
      || pipe_ (
           x,
           PCA.mappedVariants,
           any (pipe (
             PVCA.wikiEntry,
             PVA.name,
             ident,
             n => NameBySex.is (n)
                    ? List (
                        lower (NameBySex.A.f (n)),
                        lower (NameBySex.A.m (n))
                      )
                    : List (lower (n)),
             any (isInfixOf (lower (filter_text)))
           ))
         )
    )

export const getPreparedProfessions = createMaybeSelector (
  filterByWikiAvailablilty,
  getWikiFilterText,
  getWikiProfessionsGroup,
  getProfessionsSortedByName,
  uncurryN4 (filterWiki => filter_text => gr =>
              pipe (
                filter (isProfessionIncludedInFilter (filter_text) (gr)),
                filterWiki (PCA_.src)
              ))
)

export const getAdvantagesSortedByName = createMaybeSelector (
  filterByWikiAvailablilty,
  getWiki,
  getWikiAdvantages,
  uncurryN3 (filterWiki => staticData =>
              pipe (
                elems,
                filterWiki (Advantage.A.src),
                sortRecordsByName (staticData)
              ))
)

export const getPreparedAdvantages = createMaybeSelector (
  getWikiFilterText,
  getAdvantagesSortedByName,
  uncurryN (filter_text => filterRecordsByName (filter_text))
)

export const getDisadvantagesSortedByName = createMaybeSelector (
  filterByWikiAvailablilty,
  getWiki,
  getWikiDisadvantages,
  uncurryN3 (filterWiki => staticData =>
              pipe (
                elems,
                filterWiki (Disadvantage.A.src),
                sortRecordsByName (staticData)
              ))
)

export const getPreparedDisadvantages = createMaybeSelector (
  getWikiFilterText,
  getDisadvantagesSortedByName,

  // tslint:disable-next-line: no-unnecessary-callback-wrapper
  uncurryN (filter_text => filterRecordsByName (filter_text))
)

export const getSkillsSortedByName = createMaybeSelector (
  filterByWikiAvailablilty,
  getWiki,
  getWikiSkills,
  uncurryN3 (filterWiki => staticData =>
              pipe (
                elems,
                filterWiki (Skill.A.src),
                sortRecordsByName (staticData)
              ))
)

export const getSkillsFilteredByOptions = createMaybeSelector (
  getWikiSkillsGroup,
  getSkillsSortedByName,
  uncurryN (mgr => maybe (ident as ident<List<Record<Skill>>>)
                         (gr => filter (pipe (Skill.A.gr, equals (gr))))
                         (mgr))
)

export const getPreparedSkills = createMaybeSelector (
  getWikiFilterText,
  getSkillsFilteredByOptions,
  uncurryN (filter_text => filterRecordsByName (filter_text))
)

export const getCombatTechniquesSortedByName = createMaybeSelector (
  filterByWikiAvailablilty,
  getWiki,
  getWikiCombatTechniques,
  uncurryN3 (filterWiki => staticData =>
              pipe (
                elems,
                filterWiki (CombatTechnique.A.src),
                sortRecordsByName (staticData)
              ))
)

export const getCombatTechniquesFilteredByOptions = createMaybeSelector (
  getWikiCombatTechniquesGroup,
  getCombatTechniquesSortedByName,
  uncurryN (mgr => maybe (ident as ident<List<Record<CombatTechnique>>>)
                         (gr => filter (pipe (CombatTechnique.A.gr, equals (gr))))
                         (mgr))
)

export const getPreparedCombatTechniques = createMaybeSelector (
  getWikiFilterText,
  getCombatTechniquesFilteredByOptions,
  uncurryN (filter_text => filterRecordsByName (filter_text))
)

export const getSpecialAbilitiesSortedByName = createMaybeSelector (
  filterByWikiAvailablilty,
  getWiki,
  getWikiSpecialAbilities,
  uncurryN3 (filterWiki => staticData =>
              pipe (
                elems,
                filterWiki (SpecialAbility.A.src),
                sortRecordsByName (staticData)
              ))
)

export const getSpecialAbilitiesFilteredByOptions = createMaybeSelector (
  getWikiSpecialAbilitiesGroup,
  getSpecialAbilitiesSortedByName,
  uncurryN (mgr => maybe (ident as ident<List<Record<SpecialAbility>>>)
                         (gr => filter (pipe (SpecialAbility.A.gr, equals (gr))))
                         (mgr))
)

export const getPreparedSpecialAbilities = createMaybeSelector (
  getWikiFilterText,
  getSpecialAbilitiesFilteredByOptions,
  uncurryN (filterRecordsByA ([
                               SpecialAbility.A.name,
                               pipe (SpecialAbility.A.nameInWiki, fromMaybe ("")),
                             ]))
)

export const getSpellsSortedByName = createMaybeSelector (
  filterByWikiAvailablilty,
  getWiki,
  getWikiSpells,
  uncurryN3 (filterWiki => staticData =>
              pipe (
                elems,
                filterWiki (Spell.A.src),
                sortRecordsByName (staticData)
              ))
)

export const getSpellsFilteredByOptions = createMaybeSelector (
  getWikiSpellsGroup,
  getSpellsSortedByName,
  uncurryN (mgr => maybe (ident as ident<List<Record<Spell>>>)
                         (gr => filter (pipe (Spell.A.gr, equals (gr))))
                         (mgr))
)

export const getPreparedSpells = createMaybeSelector (
  getWikiFilterText,
  getSpellsFilteredByOptions,

  // tslint:disable-next-line: no-unnecessary-callback-wrapper
  uncurryN (filter_text => filterRecordsByName (filter_text))
)

export const getCantripsSortedByName = createMaybeSelector (
  filterByWikiAvailablilty,
  getWiki,
  getWikiCantrips,
  uncurryN3 (filterWiki => staticData =>
              pipe (
                elems,
                filterWiki (Cantrip.A.src),
                sortRecordsByName (staticData)
              ))
)

export const getPreparedCantrips = createMaybeSelector (
  getWikiFilterText,
  getCantripsSortedByName,
  uncurryN (filter_text => filterRecordsByName (filter_text))
)

export const getLiturgicalChantsSortedByName = createMaybeSelector (
  filterByWikiAvailablilty,
  getWiki,
  getWikiLiturgicalChants,
  uncurryN3 (filterWiki => staticData =>
              pipe (
                elems,
                filterWiki (LiturgicalChant.A.src),
                sortRecordsByName (staticData)
              ))
)

export const getLiturgicalChantsFilteredByOptions = createMaybeSelector (
  getWikiLiturgicalChantsGroup,
  getLiturgicalChantsSortedByName,
  uncurryN (mgr => maybe (ident as ident<List<Record<LiturgicalChant>>>)
                         (gr => filter (pipe (LiturgicalChant.A.gr, equals (gr))))
                         (mgr))
)

export const getPreparedLiturgicalChants = createMaybeSelector (
  getWikiFilterText,
  getLiturgicalChantsFilteredByOptions,
  uncurryN (filter_text => filterRecordsByName (filter_text))
)

export const getBlessingsSortedByName = createMaybeSelector (
  filterByWikiAvailablilty,
  getWiki,
  getWikiBlessings,
  uncurryN3 (filterWiki => staticData =>
              pipe (
                elems,
                filterWiki (Blessing.A.src),
                sortRecordsByName (staticData)
              ))
)

export const getPreparedBlessings = createMaybeSelector (
  getWikiFilterText,
  getBlessingsSortedByName,
  uncurryN (filter_text => filterRecordsByName (filter_text))
)

export const getItemTemplatesSortedByName = createMaybeSelector (
  filterByWikiAvailablilty,
  getWiki,
  getWikiItemTemplates,
  uncurryN3 (filterWiki => staticData =>
              pipe (
                elems,
                filterWiki (ItemTemplate.A.src),
                sortRecordsByName (staticData)
              ))
)

export const getItemTemplatesFilteredByOptions = createMaybeSelector (
  getWikiItemTemplatesGroup,
  getItemTemplatesSortedByName,
  uncurryN (mgr => maybe (ident as ident<List<Record<ItemTemplate>>>)
                         (gr => filter (pipe (ItemTemplate.A.gr, equals (gr))))
                         (mgr))
)

export const getPreparedItemTemplates = createMaybeSelector (
  getWikiFilterText,
  getItemTemplatesFilteredByOptions,
  uncurryN (filter_text => filterRecordsByName (filter_text))
)

export const getSpecialAbilityGroups = createMaybeSelector (
  getWiki,
  staticData => pipe_ (
    staticData,
    StaticData.A.specialAbilityGroups,
    elems,
    map (numIdNameToDropdown),
    sortRecordsByName (staticData)
  )
)
