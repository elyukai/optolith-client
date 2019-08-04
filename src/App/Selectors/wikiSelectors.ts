import { equals } from "../../Data/Eq";
import { ident } from "../../Data/Function";
import { fmapF } from "../../Data/Functor";
import { any, filter, isInfixOf, List, lower } from "../../Data/List";
import { fromMaybe, guard, imapMaybe, Just, Maybe, maybe } from "../../Data/Maybe";
import { elems, keysSet } from "../../Data/OrderedMap";
import { Record } from "../../Data/Record";
import { uncurryN, uncurryN3, uncurryN4 } from "../../Data/Tuple/Curry";
import { CultureCombinedA_ } from "../Models/View/CultureCombined";
import { ProfessionCombined, ProfessionCombinedA_ } from "../Models/View/ProfessionCombined";
import { ProfessionVariantCombined } from "../Models/View/ProfessionVariantCombined";
import { RaceCombinedA_ } from "../Models/View/RaceCombined";
import { Advantage } from "../Models/Wiki/Advantage";
import { Blessing } from "../Models/Wiki/Blessing";
import { Cantrip } from "../Models/Wiki/Cantrip";
import { CombatTechnique } from "../Models/Wiki/CombatTechnique";
import { Disadvantage } from "../Models/Wiki/Disadvantage";
import { ItemTemplate } from "../Models/Wiki/ItemTemplate";
import { LiturgicalChant } from "../Models/Wiki/LiturgicalChant";
import { ProfessionVariant } from "../Models/Wiki/ProfessionVariant";
import { Skill } from "../Models/Wiki/Skill";
import { SpecialAbility } from "../Models/Wiki/SpecialAbility";
import { Spell } from "../Models/Wiki/Spell";
import { NameBySex } from "../Models/Wiki/sub/NameBySex";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { filterRecordsByA, filterRecordsByName } from "../Utilities/filterBy";
import { compareLocale, translate } from "../Utilities/I18n";
import { pipe, pipe_ } from "../Utilities/pipe";
import { filterByAvailabilityF } from "../Utilities/RulesUtils";
import { comparingR, sortRecordsBy, sortRecordsByName } from "../Utilities/sortBy";
import { DropdownOption } from "../Views/Universal/Dropdown";
import { getAllCultures, getAllProfessions, getAllRaces } from "./rcpSelectors";
import { getWikiProfessionsCombinedSortOptions } from "./sortOptionsSelectors";
import { getLocaleAsProp, getWikiAdvantages, getWikiBlessings, getWikiBooks, getWikiCantrips, getWikiCombatTechniques, getWikiCombatTechniquesGroup, getWikiDisadvantages, getWikiFilterText, getWikiItemTemplates, getWikiItemTemplatesGroup, getWikiLiturgicalChants, getWikiLiturgicalChantsGroup, getWikiProfessionsGroup, getWikiSkills, getWikiSkillsGroup, getWikiSpecialAbilities, getWikiSpecialAbilitiesGroup, getWikiSpells, getWikiSpellsGroup } from "./stateSelectors";

const PCA = ProfessionCombined.A
const PCA_ = ProfessionCombinedA_
const PVA = ProfessionVariant.A
const PVCA = ProfessionVariantCombined.A

export const filterByWikiAvailablilty = createMaybeSelector (
  getWikiBooks,
  booksMap => filterByAvailabilityF (booksMap) (keysSet (booksMap)) (true)
)

export const getRacesSortedByName = createMaybeSelector (
  getLocaleAsProp,
  getAllRaces,
  uncurryN (l10n => sortRecordsBy ([comparingR (RaceCombinedA_.name) (compareLocale (l10n))]))
)

export const getPreparedRaces = createMaybeSelector (
  filterByWikiAvailablilty,
  getWikiFilterText,
  getRacesSortedByName,
  uncurryN3 (filterWiki => filter_text =>
              pipe (
                filterRecordsByA ([RaceCombinedA_.name]) (filter_text),
                filterWiki (RaceCombinedA_.src)
              ))
)

export const getCulturesSortedByName = createMaybeSelector (
  getLocaleAsProp,
  getAllCultures,
  uncurryN (l10n => sortRecordsBy ([comparingR (CultureCombinedA_.name) (compareLocale (l10n))]))
)

export const getPreparedCultures = createMaybeSelector (
  filterByWikiAvailablilty,
  getWikiFilterText,
  getCulturesSortedByName,
  uncurryN3 (filterWiki => filter_text =>
              pipe (
                filterRecordsByA ([CultureCombinedA_.name]) (filter_text),
                filterWiki (CultureCombinedA_.src)
              ))
)

export const getProfessionsSortedByName = createMaybeSelector (
  getWikiProfessionsCombinedSortOptions,
  getAllProfessions,
  uncurryN (sortRecordsBy)
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
  getLocaleAsProp,
  getWikiAdvantages,
  uncurryN3 (filterWiki => l10n =>
              pipe (
                elems,
                filterWiki (Advantage.A.src),
                sortRecordsByName (l10n)
              ))
)

export const getPreparedAdvantages = createMaybeSelector (
  getWikiFilterText,
  getAdvantagesSortedByName,
  // tslint:disable-next-line: no-unnecessary-callback-wrapper
  uncurryN (filter_text => filterRecordsByName (filter_text))
)

export const getDisadvantagesSortedByName = createMaybeSelector (
  filterByWikiAvailablilty,
  getLocaleAsProp,
  getWikiDisadvantages,
  uncurryN3 (filterWiki => l10n =>
              pipe (
                elems,
                filterWiki (Disadvantage.A.src),
                sortRecordsByName (l10n)
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
  getLocaleAsProp,
  getWikiSkills,
  uncurryN3 (filterWiki => l10n =>
              pipe (
                elems,
                filterWiki (Skill.A.src),
                sortRecordsByName (l10n)
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
  // tslint:disable-next-line: no-unnecessary-callback-wrapper
  uncurryN (filter_text => filterRecordsByName (filter_text))
)

export const getCombatTechniquesSortedByName = createMaybeSelector (
  filterByWikiAvailablilty,
  getLocaleAsProp,
  getWikiCombatTechniques,
  uncurryN3 (filterWiki => l10n =>
              pipe (
                elems,
                filterWiki (CombatTechnique.A.src),
                sortRecordsByName (l10n)
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
  // tslint:disable-next-line: no-unnecessary-callback-wrapper
  uncurryN (filter_text => filterRecordsByName (filter_text))
)

export const getSpecialAbilitiesSortedByName = createMaybeSelector (
  filterByWikiAvailablilty,
  getLocaleAsProp,
  getWikiSpecialAbilities,
  uncurryN3 (filterWiki => l10n =>
              pipe (
                elems,
                filterWiki (SpecialAbility.A.src),
                sortRecordsByName (l10n)
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
  getLocaleAsProp,
  getWikiSpells,
  uncurryN3 (filterWiki => l10n =>
              pipe (
                elems,
                filterWiki (Spell.A.src),
                sortRecordsByName (l10n)
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
  getLocaleAsProp,
  getWikiCantrips,
  uncurryN3 (filterWiki => l10n =>
              pipe (
                elems,
                filterWiki (Cantrip.A.src),
                sortRecordsByName (l10n)
              ))
)

export const getPreparedCantrips = createMaybeSelector (
  getWikiFilterText,
  getCantripsSortedByName,
  // tslint:disable-next-line: no-unnecessary-callback-wrapper
  uncurryN (filter_text => filterRecordsByName (filter_text))
)

export const getLiturgicalChantsSortedByName = createMaybeSelector (
  filterByWikiAvailablilty,
  getLocaleAsProp,
  getWikiLiturgicalChants,
  uncurryN3 (filterWiki => l10n =>
              pipe (
                elems,
                filterWiki (LiturgicalChant.A.src),
                sortRecordsByName (l10n)
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
  // tslint:disable-next-line: no-unnecessary-callback-wrapper
  uncurryN (filter_text => filterRecordsByName (filter_text))
)

export const getBlessingsSortedByName = createMaybeSelector (
  filterByWikiAvailablilty,
  getLocaleAsProp,
  getWikiBlessings,
  uncurryN3 (filterWiki => l10n =>
              pipe (
                elems,
                filterWiki (Blessing.A.src),
                sortRecordsByName (l10n)
              ))
)

export const getPreparedBlessings = createMaybeSelector (
  getWikiFilterText,
  getBlessingsSortedByName,
  // tslint:disable-next-line: no-unnecessary-callback-wrapper
  uncurryN (filter_text => filterRecordsByName (filter_text))
)

export const getItemTemplatesSortedByName = createMaybeSelector (
  filterByWikiAvailablilty,
  getLocaleAsProp,
  getWikiItemTemplates,
  uncurryN3 (filterWiki => l10n =>
              pipe (
                elems,
                filterWiki (ItemTemplate.A.src),
                sortRecordsByName (l10n)
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
  // tslint:disable-next-line: no-unnecessary-callback-wrapper
  uncurryN (filter_text => filterRecordsByName (filter_text))
)

export const getSpecialAbilityGroups = createMaybeSelector (
  getLocaleAsProp,
  getSpecialAbilitiesSortedByName,
  uncurryN (l10n => xs =>
             pipe_ (
               translate (l10n) ("specialabilitygroups"),
               imapMaybe (i => x => fmapF (guard (any (pipe (SpecialAbility.A.gr, equals (i + 1)))
                                                      (xs)))
                                          (() => DropdownOption ({ id: Just (i + 1), name: x }))),
               sortRecordsByName (l10n)
             ))
)
