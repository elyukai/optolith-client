import { createSelector } from 'reselect';
import { getAdvantages, getDisadvantages, getLocaleMessages, getSpecialAbilities, getWikiAdvantages, getWikiBlessings, getWikiCantrips, getWikiCombatTechniques, getWikiCombatTechniquesGroup, getWikiCultures, getWikiDisadvantages, getWikiFilterText, getWikiItemTemplates, getWikiItemTemplatesGroup, getWikiLiturgicalChants, getWikiLiturgicalChantsGroup, getWikiProfessions, getWikiProfessionsGroup, getWikiRaces, getWikiSkills, getWikiSkillsGroup, getWikiSpecialAbilities, getWikiSpecialAbilitiesGroup, getWikiSpells, getWikiSpellsGroup } from '../selectors/stateSelectors';
import { Profession } from '../types/wiki';
import { List } from '../utils/dataUtils';
import { filterObjects, sortObjects } from '../utils/FilterSortUtils';
import { translate } from '../utils/I18n';
import { getItems } from './equipmentSelectors';
import { getAllProfessions } from './rcpSelectors';

const getFirstPartWikiEntries = createSelector(
  getWikiBlessings,
  getWikiCantrips,
  getWikiCombatTechniques,
  getWikiCultures,
  getWikiItemTemplates,
  getItems,
  getAdvantages,
  getDisadvantages,
  getSpecialAbilities,
  // getWikiAdvantages,
  // getWikiAttributes,
  // getWikiBooks,
  // getWikiDisadvantages,
  // getWikiExperienceLevels,
  (
    blessings,
    cantrips,
    combatTechniques,
    cultures,
    itemTemplates,
    items,
    advantages,
    disadvantages,
    specialAbilties
  ) => {
    return List.of(
      ...blessings.elems(),
      ...cantrips.elems(),
      ...combatTechniques.elems(),
      ...cultures.elems(),
      ...itemTemplates.elems(),
      ...items,
      ...advantages.elems(),
      ...disadvantages.elems(),
      ...specialAbilties.elems(),
    );
  }
);

export const getAllWikiEntries = createSelector(
  getFirstPartWikiEntries,
  getWikiLiturgicalChants,
  getAllProfessions,
  getWikiRaces,
  getWikiSkills,
  getWikiSpells,
  (firstPart, liturgicalChants, professions, races, skills, spells) => {
    return firstPart.concat(
      List.of(
        ...liturgicalChants.elems(),
        ...professions,
        ...races.elems(),
        ...skills.elems(),
        ...spells.elems()
      )
    );
  }
);

export const getRacesSortedByName = createSelector(
  getWikiRaces,
  getLocaleMessages,
  (list, locale) => {
    return sortObjects([...list.values()], locale!.id);
  }
);

export const getPreparedRaces = createSelector(
  getRacesSortedByName,
  getWikiFilterText,
  (list, filterText) => {
    return filterObjects(list, filterText);
  }
);

export const getCulturesSortedByName = createSelector(
  getWikiCultures,
  getLocaleMessages,
  (list, locale) => {
    return sortObjects([...list.values()], locale!.id);
  }
);

export const getPreparedCultures = createSelector(
  getCulturesSortedByName,
  getWikiFilterText,
  (list, filterText) => {
    return filterObjects(list, filterText);
  }
);

export const getProfessionsSortedByName = createSelector(
  getWikiProfessions,
  getLocaleMessages,
  (list, locale) => {
    const key = (e: Profession) => e.src[0] ? e.src[0].id : 'US25000';
    return sortObjects([...list.values()], locale!.id, [{ key: 'name', keyOfProperty: 'm' }, { key: 'subname', keyOfProperty: 'm' }, { key }]);
  }
);

export const getProfessionsFilteredByOptions = createSelector(
  getProfessionsSortedByName,
  getWikiProfessionsGroup,
  (list, group) => {
    return group === undefined ? list : list.filter(e => e.gr === group);
  }
);

export const getPreparedProfessions = createSelector(
  getProfessionsFilteredByOptions,
  getWikiFilterText,
  (list, filterText) => {
    return filterObjects(list, filterText, { addProperty: 'subname', keyOfName: 'm' });
  }
);

export const getAdvantagesSortedByName = createSelector(
  getWikiAdvantages,
  getLocaleMessages,
  (list, locale) => {
    return sortObjects([...list.values()], locale!.id);
  }
);

export const getPreparedAdvantages = createSelector(
  getAdvantagesSortedByName,
  getWikiFilterText,
  (list, filterText) => {
    return filterObjects(list, filterText);
  }
);

export const getDisadvantagesSortedByName = createSelector(
  getWikiDisadvantages,
  getLocaleMessages,
  (list, locale) => {
    return sortObjects([...list.values()], locale!.id);
  }
);

export const getPreparedDisadvantages = createSelector(
  getDisadvantagesSortedByName,
  getWikiFilterText,
  (list, filterText) => {
    return filterObjects(list, filterText);
  }
);

export const getSkillsSortedByName = createSelector(
  getWikiSkills,
  getLocaleMessages,
  (list, locale) => {
    return sortObjects([...list.values()], locale!.id);
  }
);

export const getSkillsFilteredByOptions = createSelector(
  getSkillsSortedByName,
  getWikiSkillsGroup,
  (list, group) => {
    return group === undefined ? list : list.filter(e => e.gr === group);
  }
);

export const getPreparedSkills = createSelector(
  getSkillsFilteredByOptions,
  getWikiFilterText,
  (list, filterText) => {
    return filterObjects(list, filterText);
  }
);

export const getCombatTechniquesSortedByName = createSelector(
  getWikiCombatTechniques,
  getLocaleMessages,
  (list, locale) => {
    return sortObjects([...list.values()], locale!.id);
  }
);

export const getCombatTechniquesFilteredByOptions = createSelector(
  getCombatTechniquesSortedByName,
  getWikiCombatTechniquesGroup,
  (list, group) => {
    return group === undefined ? list : list.filter(e => e.gr === group);
  }
);

export const getPreparedCombatTechniques = createSelector(
  getCombatTechniquesFilteredByOptions,
  getWikiFilterText,
  (list, filterText) => {
    return filterObjects(list, filterText);
  }
);

export const getSpecialAbilitiesSortedByName = createSelector(
  getWikiSpecialAbilities,
  getLocaleMessages,
  (list, locale) => {
    return sortObjects([...list.values()], locale!.id);
  }
);

export const getSpecialAbilitiesFilteredByOptions = createSelector(
  getSpecialAbilitiesSortedByName,
  getWikiSpecialAbilitiesGroup,
  (list, group) => {
    return group === undefined ? list : list.filter(e => e.gr === group);
  }
);

export const getPreparedSpecialAbilities = createSelector(
  getSpecialAbilitiesFilteredByOptions,
  getWikiFilterText,
  (list, filterText) => {
    return filterObjects(list, filterText);
  }
);

export const getSpellsSortedByName = createSelector(
  getWikiSpells,
  getLocaleMessages,
  (list, locale) => {
    return sortObjects([...list.values()], locale!.id);
  }
);

export const getSpellsFilteredByOptions = createSelector(
  getSpellsSortedByName,
  getWikiSpellsGroup,
  (list, group) => {
    return group === undefined ? list : list.filter(e => e.gr === group);
  }
);

export const getPreparedSpells = createSelector(
  getSpellsFilteredByOptions,
  getWikiFilterText,
  (list, filterText) => {
    return filterObjects(list, filterText);
  }
);

export const getCantripsSortedByName = createSelector(
  getWikiCantrips,
  getLocaleMessages,
  (list, locale) => {
    return sortObjects([...list.values()], locale!.id);
  }
);

export const getPreparedCantrips = createSelector(
  getCantripsSortedByName,
  getWikiFilterText,
  (list, filterText) => {
    return filterObjects(list, filterText);
  }
);

export const getLiturgicalChantsSortedByName = createSelector(
  getWikiLiturgicalChants,
  getLocaleMessages,
  (list, locale) => {
    return sortObjects([...list.values()], locale!.id);
  }
);

export const getLiturgicalChantsFilteredByOptions = createSelector(
  getLiturgicalChantsSortedByName,
  getWikiLiturgicalChantsGroup,
  (list, group) => {
    return group === undefined ? list : list.filter(e => e.gr === group);
  }
);

export const getPreparedLiturgicalChants = createSelector(
  getLiturgicalChantsFilteredByOptions,
  getWikiFilterText,
  (list, filterText) => {
    return filterObjects(list, filterText);
  }
);

export const getBlessingsSortedByName = createSelector(
  getWikiBlessings,
  getLocaleMessages,
  (list, locale) => {
    return sortObjects([...list.values()], locale!.id);
  }
);

export const getPreparedBlessings = createSelector(
  getBlessingsSortedByName,
  getWikiFilterText,
  (list, filterText) => {
    return filterObjects(list, filterText);
  }
);

export const getItemTemplatesSortedByName = createSelector(
  getWikiItemTemplates,
  getLocaleMessages,
  (list, locale) => {
    return sortObjects([...list.values()], locale!.id);
  }
);

export const getItemTemplatesFilteredByOptions = createSelector(
  getItemTemplatesSortedByName,
  getWikiItemTemplatesGroup,
  (list, group) => {
    return group === undefined ? list : list.filter(e => e.gr === group);
  }
);

export const getPreparedItemTemplates = createSelector(
  getItemTemplatesFilteredByOptions,
  getWikiFilterText,
  (list, filterText) => {
    return filterObjects(list, filterText);
  }
);

export const getSpecialAbilityGroups = createSelector(
  getWikiSpecialAbilities,
  getLocaleMessages,
  (wiki, locale) => {
    const specialAbilities = [...wiki.values()];
    return sortObjects(translate(locale!, 'specialabilities.view.groups').map((name, index) => ({
      id: index + 1,
      name
    })).filter(({ id }) => specialAbilities.some(e => e.gr === id)), locale!.id);
  }
);
