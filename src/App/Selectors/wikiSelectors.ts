import { List } from "../../Data/List";
import { elems } from "../../Data/OrderedMap";
import { Record } from "../../Data/Record";
import { CultureCombined } from "../Models/View/CultureCombined";
import { ProfessionCombined } from "../Models/View/ProfessionCombined";
import { RaceCombined } from "../Models/View/RaceCombined";
import { Advantage } from "../Models/Wiki/Advantage";
import { Blessing } from "../Models/Wiki/Blessing";
import { Cantrip } from "../Models/Wiki/Cantrip";
import { CombatTechnique } from "../Models/Wiki/CombatTechnique";
import { Disadvantage } from "../Models/Wiki/Disadvantage";
import { ItemTemplate } from "../Models/Wiki/ItemTemplate";
import { LiturgicalChant } from "../Models/Wiki/LiturgicalChant";
import { Skill } from "../Models/Wiki/Skill";
import { SpecialAbility } from "../Models/Wiki/SpecialAbility";
import { Spell } from "../Models/Wiki/Spell";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { filterRecordsByName } from "../Utilities/filterBy";
import { getAllCultures, getAllProfessions, getAllRaces } from './rcpSelectors';
import { getLocaleAsProp, getWikiAdvantages, getWikiBlessings, getWikiCantrips, getWikiCombatTechniques, getWikiCombatTechniquesGroup, getWikiCultures, getWikiDisadvantages, getWikiFilterText, getWikiItemTemplates, getWikiItemTemplatesGroup, getWikiLiturgicalChants, getWikiLiturgicalChantsGroup, getWikiProfessions, getWikiProfessionsGroup, getWikiRaces, getWikiSkills, getWikiSkillsGroup, getWikiSpecialAbilities, getWikiSpecialAbilitiesGroup, getWikiSpells, getWikiSpellsGroup } from "./stateSelectors";

export type WikiSectionEntry = Record<Blessing>
                             | Record<Cantrip>
                             | Record<CombatTechnique>
                             | Record<ItemTemplate>
                             | Record<Advantage>
                             | Record<Disadvantage>
                             | Record<SpecialAbility>
                             | Record<LiturgicalChant>
                             | Record<Spell>
                             | Record<Skill>
                             | Record<RaceCombined>
                             | Record<CultureCombined>
                             | Record<ProfessionCombined>

const getFirstPartWikiEntries = createMaybeSelector (
  getWikiBlessings,
  getWikiCantrips,
  getWikiCombatTechniques,
  getAllCultures,
  getWikiItemTemplates,
  getWikiAdvantages,
  getWikiDisadvantages,
  getWikiSpecialAbilities,
  (
    blessings,
    cantrips,
    combatTechniques,
    cultures,
    itemTemplates,
    advantages,
    disadvantages,
    specialAbilties
  ) => List<WikiSectionEntry> (
    ...elems (blessings),
    ...elems (cantrips),
    ...elems (combatTechniques),
    ...cultures,
    ...elems (itemTemplates),
    ...elems (advantages),
    ...elems (disadvantages),
    ...elems (specialAbilties)
  )
)

export const getAllWikiEntries = createMaybeSelector (
  getFirstPartWikiEntries,
  getWikiLiturgicalChants,
  getAllProfessions,
  getAllRaces,
  getWikiSkills,
  getWikiSpells,
  (firstPart, liturgicalChants, professions, races, skills, spells) => firstPart.mappend (
    List.of<WikiSectionEntry> (
      ...liturgicalChants.elems (),
      ...professions,
      ...races,
      ...skills.elems (),
      ...spells.elems ()
    )
  )
)

export const getRacesSortedByName = createMaybeSelector (
  getWikiRaces,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
)

export const getPreparedRaces = createMaybeSelector (
  getWikiFilterText,
  getRacesSortedByName,
  filterRecordsByName
)

export const getCulturesSortedByName = createMaybeSelector (
  getWikiCultures,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
)

export const getPreparedCultures = createMaybeSelector (
  getWikiFilterText,
  getCulturesSortedByName,
  filterRecordsByName
)

export const getProfessionsSortedByName = createMaybeSelector (
  getWikiProfessions,
  getLocaleAsProp,
  (list, locale) => {
    const key = (e: Record<Profession>) =>
      Maybe.maybe<Record<SourceLink>, string> ('US25000')
                                              (source => source.get ('id'))
                                              (List.uncons (e.get ('src')) .fmap (Tuple.fst))

    return sortObjects (
      list.elems (),
      locale.get ('id'),
      [
        { key: 'name', keyOfProperty: 'm' },
        { key: 'subname', keyOfProperty: 'm' },
        { key },
      ]
    )
  }
)

export const getProfessionsFilteredByOptions = createMaybeSelector (
  getProfessionsSortedByName,
  getWikiProfessionsGroup,
  (list, group) => group === undefined ? list : list.filter (e => e.lookup ('gr').equals (group))
)

export const getPreparedProfessions = createMaybeSelector (
  getProfessionsFilteredByOptions,
  getWikiFilterText,
  (list, filterText) => filterObjects (list, filterText, { addProperty: 'subname', keyOfName: 'm' })
)

export const getAdvantagesSortedByName = createMaybeSelector (
  getWikiAdvantages,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
)

export const getPreparedAdvantages = createMaybeSelector (
  getWikiFilterText,
  getAdvantagesSortedByName,
  filterRecordsByName
)

export const getDisadvantagesSortedByName = createMaybeSelector (
  getWikiDisadvantages,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
)

export const getPreparedDisadvantages = createMaybeSelector (
  getWikiFilterText,
  getDisadvantagesSortedByName,
  filterRecordsByName
)

export const getSkillsSortedByName = createMaybeSelector (
  getWikiSkills,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
)

export const getSkillsFilteredByOptions = createMaybeSelector (
  getSkillsSortedByName,
  getWikiSkillsGroup,
  (list, group) => group === undefined ? list : list.filter (e => e.lookup ('gr').equals (group))
)

export const getPreparedSkills = createMaybeSelector (
  getWikiFilterText,
  getSkillsFilteredByOptions,
  filterRecordsByName
)

export const getCombatTechniquesSortedByName = createMaybeSelector (
  getWikiCombatTechniques,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
)

export const getCombatTechniquesFilteredByOptions = createMaybeSelector (
  getCombatTechniquesSortedByName,
  getWikiCombatTechniquesGroup,
  (list, group) => group === undefined ? list : list.filter (e => e.lookup ('gr').equals (group))
)

export const getPreparedCombatTechniques = createMaybeSelector (
  getWikiFilterText,
  getCombatTechniquesFilteredByOptions,
  filterRecordsByName
)

export const getSpecialAbilitiesSortedByName = createMaybeSelector (
  getWikiSpecialAbilities,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
)

export const getSpecialAbilitiesFilteredByOptions = createMaybeSelector (
  getSpecialAbilitiesSortedByName,
  getWikiSpecialAbilitiesGroup,
  (list, group) => group === undefined ? list : list.filter (e => e.lookup ('gr').equals (group))
)

export const getPreparedSpecialAbilities = createMaybeSelector (
  getWikiFilterText,
  getSpecialAbilitiesFilteredByOptions,
  filterRecordsByName
)

export const getSpellsSortedByName = createMaybeSelector (
  getWikiSpells,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
)

export const getSpellsFilteredByOptions = createMaybeSelector (
  getSpellsSortedByName,
  getWikiSpellsGroup,
  (list, group) => group === undefined ? list : list.filter (e => e.lookup ('gr').equals (group))
)

export const getPreparedSpells = createMaybeSelector (
  getWikiFilterText,
  getSpellsFilteredByOptions,
  filterRecordsByName
)

export const getCantripsSortedByName = createMaybeSelector (
  getWikiCantrips,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
)

export const getPreparedCantrips = createMaybeSelector (
  getWikiFilterText,
  getCantripsSortedByName,
  filterRecordsByName
)

export const getLiturgicalChantsSortedByName = createMaybeSelector (
  getWikiLiturgicalChants,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
)

export const getLiturgicalChantsFilteredByOptions = createMaybeSelector (
  getLiturgicalChantsSortedByName,
  getWikiLiturgicalChantsGroup,
  (list, group) => group === undefined ? list : list.filter (e => e.lookup ('gr').equals (group))
)

export const getPreparedLiturgicalChants = createMaybeSelector (
  getWikiFilterText,
  getLiturgicalChantsFilteredByOptions,
  filterRecordsByName
)

export const getBlessingsSortedByName = createMaybeSelector (
  getWikiBlessings,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
)

export const getPreparedBlessings = createMaybeSelector (
  getWikiFilterText,
  getBlessingsSortedByName,
  filterRecordsByName
)

export const getItemTemplatesSortedByName = createMaybeSelector (
  getWikiItemTemplates,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
)

export const getItemTemplatesFilteredByOptions = createMaybeSelector (
  getItemTemplatesSortedByName,
  getWikiItemTemplatesGroup,
  (list, group) => group === undefined ? list : list.filter (e => e.lookup ('gr').equals (group))
)

export const getPreparedItemTemplates = createMaybeSelector (
  getWikiFilterText,
  getItemTemplatesFilteredByOptions,
  filterRecordsByName
)

export const getSpecialAbilityGroups = createMaybeSelector (
  getWikiSpecialAbilities,
  getLocaleAsProp,
  (wikiSpecialAbilities, locale) => {
    const specialAbilities = wikiSpecialAbilities.elems ()

    return sortObjects (
      translate (locale, 'specialabilities.view.groups')
        .imap (index => name => Record.of ({
          id: index + 1,
          name,
        }))
        .filter (r => specialAbilities.any (e => e.get ('gr') === r.get ('id'))),
      locale.get ('id')
    )
  }
)
