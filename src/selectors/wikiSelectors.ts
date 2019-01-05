import { CultureCombined, ProfessionCombined, RaceCombined } from '../App/Models/View/viewTypeHelpers';
import { Advantage, Blessing, Cantrip, CombatTechnique, Disadvantage, ItemTemplate, LiturgicalChant, Profession, Skill, SourceLink, SpecialAbility, Spell } from '../App/Models/Wiki/wikiTypeHelpers';
import { getLocaleAsProp, getWikiAdvantages, getWikiBlessings, getWikiCantrips, getWikiCombatTechniques, getWikiCombatTechniquesGroup, getWikiCultures, getWikiDisadvantages, getWikiFilterText, getWikiItemTemplates, getWikiItemTemplatesGroup, getWikiLiturgicalChants, getWikiLiturgicalChantsGroup, getWikiProfessions, getWikiProfessionsGroup, getWikiRaces, getWikiSkills, getWikiSkillsGroup, getWikiSpecialAbilities, getWikiSpecialAbilitiesGroup, getWikiSpells, getWikiSpellsGroup } from '../selectors/stateSelectors';
import { createMaybeSelector } from '../utils/createMaybeSelector';
import { List, Maybe, Record, Tuple } from '../utils/dataUtils';
import { filterObjects, sortObjects } from '../utils/FilterSortUtils';
import { translate } from '../utils/I18n';
import { getAllCultures, getAllProfessions, getAllRaces } from './rcpSelectors';

export type WikiSectionEntry =
  Record<Blessing>
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
  | Record<ProfessionCombined>;

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
  ) => List.of<WikiSectionEntry> (
    ...blessings.elems (),
    ...cantrips.elems (),
    ...combatTechniques.elems (),
    ...cultures,
    ...itemTemplates.elems (),
    ...advantages.elems (),
    ...disadvantages.elems (),
    ...specialAbilties.elems ()
  )
);

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
);

export const getRacesSortedByName = createMaybeSelector (
  getWikiRaces,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
);

export const getPreparedRaces = createMaybeSelector (
  getRacesSortedByName,
  getWikiFilterText,
  filterObjects
);

export const getCulturesSortedByName = createMaybeSelector (
  getWikiCultures,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
);

export const getPreparedCultures = createMaybeSelector (
  getCulturesSortedByName,
  getWikiFilterText,
  filterObjects
);

export const getProfessionsSortedByName = createMaybeSelector (
  getWikiProfessions,
  getLocaleAsProp,
  (list, locale) => {
    const key = (e: Record<Profession>) =>
      Maybe.maybe<Record<SourceLink>, string> ('US25000')
                                              (source => source.get ('id'))
                                              (List.uncons (e.get ('src')) .fmap (Tuple.fst));

    return sortObjects (
      list.elems (),
      locale.get ('id'),
      [
        { key: 'name', keyOfProperty: 'm' },
        { key: 'subname', keyOfProperty: 'm' },
        { key },
      ]
    );
  }
);

export const getProfessionsFilteredByOptions = createMaybeSelector (
  getProfessionsSortedByName,
  getWikiProfessionsGroup,
  (list, group) => group === undefined ? list : list.filter (e => e.lookup ('gr').equals (group))
);

export const getPreparedProfessions = createMaybeSelector (
  getProfessionsFilteredByOptions,
  getWikiFilterText,
  (list, filterText) => filterObjects (list, filterText, { addProperty: 'subname', keyOfName: 'm' })
);

export const getAdvantagesSortedByName = createMaybeSelector (
  getWikiAdvantages,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
);

export const getPreparedAdvantages = createMaybeSelector (
  getAdvantagesSortedByName,
  getWikiFilterText,
  filterObjects
);

export const getDisadvantagesSortedByName = createMaybeSelector (
  getWikiDisadvantages,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
);

export const getPreparedDisadvantages = createMaybeSelector (
  getDisadvantagesSortedByName,
  getWikiFilterText,
  filterObjects
);

export const getSkillsSortedByName = createMaybeSelector (
  getWikiSkills,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
);

export const getSkillsFilteredByOptions = createMaybeSelector (
  getSkillsSortedByName,
  getWikiSkillsGroup,
  (list, group) => group === undefined ? list : list.filter (e => e.lookup ('gr').equals (group))
);

export const getPreparedSkills = createMaybeSelector (
  getSkillsFilteredByOptions,
  getWikiFilterText,
  filterObjects
);

export const getCombatTechniquesSortedByName = createMaybeSelector (
  getWikiCombatTechniques,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
);

export const getCombatTechniquesFilteredByOptions = createMaybeSelector (
  getCombatTechniquesSortedByName,
  getWikiCombatTechniquesGroup,
  (list, group) => group === undefined ? list : list.filter (e => e.lookup ('gr').equals (group))
);

export const getPreparedCombatTechniques = createMaybeSelector (
  getCombatTechniquesFilteredByOptions,
  getWikiFilterText,
  filterObjects
);

export const getSpecialAbilitiesSortedByName = createMaybeSelector (
  getWikiSpecialAbilities,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
);

export const getSpecialAbilitiesFilteredByOptions = createMaybeSelector (
  getSpecialAbilitiesSortedByName,
  getWikiSpecialAbilitiesGroup,
  (list, group) => group === undefined ? list : list.filter (e => e.lookup ('gr').equals (group))
);

export const getPreparedSpecialAbilities = createMaybeSelector (
  getSpecialAbilitiesFilteredByOptions,
  getWikiFilterText,
  filterObjects
);

export const getSpellsSortedByName = createMaybeSelector (
  getWikiSpells,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
);

export const getSpellsFilteredByOptions = createMaybeSelector (
  getSpellsSortedByName,
  getWikiSpellsGroup,
  (list, group) => group === undefined ? list : list.filter (e => e.lookup ('gr').equals (group))
);

export const getPreparedSpells = createMaybeSelector (
  getSpellsFilteredByOptions,
  getWikiFilterText,
  filterObjects
);

export const getCantripsSortedByName = createMaybeSelector (
  getWikiCantrips,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
);

export const getPreparedCantrips = createMaybeSelector (
  getCantripsSortedByName,
  getWikiFilterText,
  filterObjects
);

export const getLiturgicalChantsSortedByName = createMaybeSelector (
  getWikiLiturgicalChants,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
);

export const getLiturgicalChantsFilteredByOptions = createMaybeSelector (
  getLiturgicalChantsSortedByName,
  getWikiLiturgicalChantsGroup,
  (list, group) => group === undefined ? list : list.filter (e => e.lookup ('gr').equals (group))
);

export const getPreparedLiturgicalChants = createMaybeSelector (
  getLiturgicalChantsFilteredByOptions,
  getWikiFilterText,
  filterObjects
);

export const getBlessingsSortedByName = createMaybeSelector (
  getWikiBlessings,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
);

export const getPreparedBlessings = createMaybeSelector (
  getBlessingsSortedByName,
  getWikiFilterText,
  filterObjects
);

export const getItemTemplatesSortedByName = createMaybeSelector (
  getWikiItemTemplates,
  getLocaleAsProp,
  (list, locale) => sortObjects (list.elems (), locale.get ('id'))
);

export const getItemTemplatesFilteredByOptions = createMaybeSelector (
  getItemTemplatesSortedByName,
  getWikiItemTemplatesGroup,
  (list, group) => group === undefined ? list : list.filter (e => e.lookup ('gr').equals (group))
);

export const getPreparedItemTemplates = createMaybeSelector (
  getItemTemplatesFilteredByOptions,
  getWikiFilterText,
  filterObjects
);

export const getSpecialAbilityGroups = createMaybeSelector (
  getWikiSpecialAbilities,
  getLocaleAsProp,
  (wikiSpecialAbilities, locale) => {
    const specialAbilities = wikiSpecialAbilities.elems ();

    return sortObjects (
      translate (locale, 'specialabilities.view.groups')
        .imap (index => name => Record.of ({
          id: index + 1,
          name,
        }))
        .filter (r => specialAbilities.any (e => e.get ('gr') === r.get ('id'))),
      locale.get ('id')
    );
  }
);
