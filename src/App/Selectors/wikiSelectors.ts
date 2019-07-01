import { equals } from "../../Data/Eq";
import { ident } from "../../Data/Function";
import { fmapF } from "../../Data/Functor";
import { any, filter, isInfixOf, List } from "../../Data/List";
import { guard, imapMaybe, Just, Maybe, maybe } from "../../Data/Maybe";
import { elems } from "../../Data/OrderedMap";
import { Record } from "../../Data/Record";
import { uncurryN, uncurryN3 } from "../../Data/Tuple/Curry";
import { CultureCombinedA_ } from "../Models/View/CultureCombined";
import { ProfessionCombined, ProfessionCombinedA_ } from "../Models/View/ProfessionCombined";
import { RaceCombinedA_ } from "../Models/View/RaceCombined";
import { CombatTechnique } from "../Models/Wiki/CombatTechnique";
import { ItemTemplate } from "../Models/Wiki/ItemTemplate";
import { LiturgicalChant } from "../Models/Wiki/LiturgicalChant";
import { Skill } from "../Models/Wiki/Skill";
import { SpecialAbility } from "../Models/Wiki/SpecialAbility";
import { Spell } from "../Models/Wiki/Spell";
import { NameBySex } from "../Models/Wiki/sub/NameBySex";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { filterRecordsByA, filterRecordsByName } from "../Utilities/filterBy";
import { compareLocale, translate } from "../Utilities/I18n";
import { pipe, pipe_ } from "../Utilities/pipe";
import { comparingR, sortRecordsBy, sortRecordsByName } from "../Utilities/sortBy";
import { DropdownOption } from "../Views/Universal/Dropdown";
import { getAllCultures, getAllProfessions, getAllRaces } from "./rcpSelectors";
import { getWikiProfessionsCombinedSortOptions } from "./sortOptionsSelectors";
import { getLocaleAsProp, getWikiAdvantages, getWikiBlessings, getWikiCantrips, getWikiCombatTechniques, getWikiCombatTechniquesGroup, getWikiDisadvantages, getWikiFilterText, getWikiItemTemplates, getWikiItemTemplatesGroup, getWikiLiturgicalChants, getWikiLiturgicalChantsGroup, getWikiProfessionsGroup, getWikiSkills, getWikiSkillsGroup, getWikiSpecialAbilities, getWikiSpecialAbilitiesGroup, getWikiSpells, getWikiSpellsGroup } from "./stateSelectors";

const PCA_ = ProfessionCombinedA_

export const getRacesSortedByName = createMaybeSelector (
  getLocaleAsProp,
  getAllRaces,
  uncurryN (l10n => sortRecordsBy ([comparingR (RaceCombinedA_.name) (compareLocale (l10n))]))
)

export const getPreparedRaces = createMaybeSelector (
  getWikiFilterText,
  getRacesSortedByName,
  // tslint:disable-next-line: no-unnecessary-callback-wrapper
  uncurryN (filter_text => filterRecordsByA ([RaceCombinedA_.name]) (filter_text))
)

export const getCulturesSortedByName = createMaybeSelector (
  getLocaleAsProp,
  getAllCultures,
  uncurryN (l10n => sortRecordsBy ([comparingR (CultureCombinedA_.name) (compareLocale (l10n))]))
)

export const getPreparedCultures = createMaybeSelector (
  getWikiFilterText,
  getCulturesSortedByName,
  // tslint:disable-next-line: no-unnecessary-callback-wrapper
  uncurryN (filter_text => filterRecordsByA ([CultureCombinedA_.name]) (filter_text))
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
                 NameBySex.A.f (n),
                 NameBySex.A.m (n)
               )
             : List (n),
           any (isInfixOf (filter_text))
         )
      || pipe_ (
           x,
           PCA_.subname,
           maybe (List<string> ())
                 (n => NameBySex.is (n)
                         ? List (
                             NameBySex.A.f (n),
                             NameBySex.A.m (n)
                           )
                         : List (n)),
           any (isInfixOf (filter_text))
         )
    )

export const getPreparedProfessions = createMaybeSelector (
  getWikiFilterText,
  getWikiProfessionsGroup,
  getProfessionsSortedByName,
  uncurryN3 (filter_text => gr => filter (isProfessionIncludedInFilter (filter_text) (gr)))
)

export const getAdvantagesSortedByName = createMaybeSelector (
  getLocaleAsProp,
  getWikiAdvantages,
  uncurryN (l10n => pipe (elems, sortRecordsByName (l10n)))
)

export const getPreparedAdvantages = createMaybeSelector (
  getWikiFilterText,
  getAdvantagesSortedByName,
  // tslint:disable-next-line: no-unnecessary-callback-wrapper
  uncurryN (filter_text => filterRecordsByName (filter_text))
)

export const getDisadvantagesSortedByName = createMaybeSelector (
  getLocaleAsProp,
  getWikiDisadvantages,
  uncurryN (l10n => pipe (elems, sortRecordsByName (l10n)))
)

export const getPreparedDisadvantages = createMaybeSelector (
  getWikiFilterText,
  getDisadvantagesSortedByName,
  // tslint:disable-next-line: no-unnecessary-callback-wrapper
  uncurryN (filter_text => filterRecordsByName (filter_text))
)

export const getSkillsSortedByName = createMaybeSelector (
  getLocaleAsProp,
  getWikiSkills,
  uncurryN (l10n => pipe (elems, sortRecordsByName (l10n)))
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
  getLocaleAsProp,
  getWikiCombatTechniques,
  uncurryN (l10n => pipe (elems, sortRecordsByName (l10n)))
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
  getLocaleAsProp,
  getWikiSpecialAbilities,
  uncurryN (l10n => pipe (elems, sortRecordsByName (l10n)))
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
  // tslint:disable-next-line: no-unnecessary-callback-wrapper
  uncurryN (filter_text => filterRecordsByName (filter_text))
)

export const getSpellsSortedByName = createMaybeSelector (
  getLocaleAsProp,
  getWikiSpells,
  uncurryN (l10n => pipe (elems, sortRecordsByName (l10n)))
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
  getLocaleAsProp,
  getWikiCantrips,
  uncurryN (l10n => pipe (elems, sortRecordsByName (l10n)))
)

export const getPreparedCantrips = createMaybeSelector (
  getWikiFilterText,
  getCantripsSortedByName,
  // tslint:disable-next-line: no-unnecessary-callback-wrapper
  uncurryN (filter_text => filterRecordsByName (filter_text))
)

export const getLiturgicalChantsSortedByName = createMaybeSelector (
  getLocaleAsProp,
  getWikiLiturgicalChants,
  uncurryN (l10n => pipe (elems, sortRecordsByName (l10n)))
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
  getLocaleAsProp,
  getWikiBlessings,
  uncurryN (l10n => pipe (elems, sortRecordsByName (l10n)))
)

export const getPreparedBlessings = createMaybeSelector (
  getWikiFilterText,
  getBlessingsSortedByName,
  // tslint:disable-next-line: no-unnecessary-callback-wrapper
  uncurryN (filter_text => filterRecordsByName (filter_text))
)

export const getItemTemplatesSortedByName = createMaybeSelector (
  getLocaleAsProp,
  getWikiItemTemplates,
  uncurryN (l10n => pipe (elems, sortRecordsByName (l10n)))
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
  getWikiSpecialAbilities,
  uncurryN (l10n => xmap => {
             const xs = elems (xmap)

             return pipe_ (
               translate (l10n) ("specialabilitygroups"),
               imapMaybe (i => x => fmapF (guard (any (pipe (SpecialAbility.A.gr, equals (i + 1)))
                                                      (xs)))
                                          (() => DropdownOption ({ id: Just (i + 1), name: x }))),
               sortRecordsByName (l10n)
             )
           })
)
