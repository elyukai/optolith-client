import { createSelector } from 'reselect';
import { getAdvantages, getDisadvantages, getLocaleMessages, getSkills, getSpecialAbilities, getWikiAdvantages, getWikiAttributes, getWikiBlessings, getWikiBooks, getWikiCantrips, getWikiCombatTechniques, getWikiCombatTechniquesGroup, getWikiCultures, getWikiDisadvantages, getWikiExperienceLevels, getWikiFilterText, getWikiItemTemplates, getWikiItemTemplatesGroup, getWikiLiturgicalChants, getWikiLiturgicalChantsGroup, getWikiMainCategory, getWikiProfessions, getWikiProfessionsGroup, getWikiProfessionVariants, getWikiRaces, getWikiRaceVariants, getWikiSkills, getWikiSkillsGroup, getWikiSpecialAbilities, getWikiSpecialAbilitiesGroup, getWikiSpells, getWikiSpellsGroup } from '../selectors/stateSelectors';
import { SpecialAbilityInstance } from '../types/data';
import { Cantrip, CombatTechnique, Culture, ItemTemplate, LiturgicalChant, Profession, Race, Skill, Spell } from '../types/wiki';
import { AllSortOptions, filterObjects, sortObjects } from '../utils/FilterSortUtils';
import { _translate } from '../utils/I18n';
import { getItems } from './equipmentSelectors';
import { getAllProfessions } from './rcpSelectors';
import { getCombatTechniquesSortOrder, getCulturesSortOrder, getEquipmentSortOrder, getLiturgiesSortOrder, getProfessionsSortOrder, getRacesSortOrder, getSpecialAbilitiesSortOrder, getSpellsSortOrder, getTalentsSortOrder } from './uisettingsSelectors';

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
  (blessings, cantrips, combatTechniques, cultures, itemTemplates, items, advantages, disadvantages, specialAbilties) => {
    return [
      ...blessings.values(),
      ...cantrips.values(),
      ...combatTechniques.values(),
      ...cultures.values(),
      ...itemTemplates.values(),
      ...items,
      ...advantages.values(),
      ...disadvantages.values(),
      ...specialAbilties.values(),
      // ...advantages.values(),
      // ...attributes.values(),
      // ...books.values(),
      // ...disadvantages.values(),
      // ...experienceLevels.values(),
    ];
  }
);

export const getAllWikiEntries = createSelector(
  getFirstPartWikiEntries,
  getWikiLiturgicalChants,
  getAllProfessions,
  getWikiRaces,
  getWikiSkills,
  getWikiSpells,
  // getWikiProfessionVariants,
  // getWikiRaceVariants,
  // getWikiSpecialAbilities,
  (firstPart, liturgicalChants, professions, races, skills, spells) => {
    return [
      ...firstPart,
      ...liturgicalChants.values(),
      ...professions,
      // ...professionVariants.values(),
      ...races.values(),
      // ...raceVariants.values(),
      ...skills.values(),
      // ...specialAbilities.values(),
      ...spells.values()
    ];
  }
);

export const getRacesSortOptions = createSelector(
  getRacesSortOrder,
  sortOrder => {
		let sortOptions: AllSortOptions<Race> = 'name';
		if (sortOrder === 'cost') {
			sortOptions = ['ap', 'name'];
		}
		return sortOptions;
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

export const getCulturesSortOptions = createSelector(
  getCulturesSortOrder,
  sortOrder => {
		let sortOptions: AllSortOptions<Culture> = 'name';
		if (sortOrder === 'cost') {
			sortOptions = ['culturalPackageAdventurePoints', 'name'];
		}
		return sortOptions;
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

export const getProfessionsSortOptions = createSelector(
  getProfessionsSortOrder,
  sortOrder => {
    const key = (e: Profession) => e.src[0] ? e.src[0].id : 'US25000';
		let sortOptions: AllSortOptions<Profession> = [{ key: 'name', keyOfProperty: 'm' }, { key: 'subname', keyOfProperty: 'm' }, { key }];
		if (sortOrder === 'cost') {
			sortOptions = ['ap', { key: 'name', keyOfProperty: 'm' }, { key: 'subname', keyOfProperty: 'm' }, { key }];
		}
		return sortOptions;
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

export const getSkillsSortOptions = createSelector(
  getTalentsSortOrder,
  sortOrder => {
		let sortOptions: AllSortOptions<Skill> = 'name';
		if (sortOrder === 'ic') {
			sortOptions = ['ic', 'name'];
    }
		else if (sortOrder === 'group') {
			sortOptions = ['gr', 'name'];
    }
		return sortOptions;
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

export const getCombatTechniquesSortOptions = createSelector(
  getCombatTechniquesSortOrder,
  sortOrder => {
		let sortOptions: AllSortOptions<CombatTechnique> = 'name';
		if (sortOrder === 'ic') {
			sortOptions = ['ic', 'name'];
    }
		else if (sortOrder === 'group') {
			sortOptions = ['gr', 'name'];
    }
		return sortOptions;
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

export const getSpecialAbilitiesSortOptions = createSelector(
  getSpecialAbilitiesSortOrder,
  getLocaleMessages,
  (sortOrder, locale) => {
		let sortOptions: AllSortOptions<SpecialAbilityInstance> = 'name';
		if (sortOrder === 'groupname') {
			sortOptions = [{ key: 'gr', mapToIndex: _translate(locale, 'specialabilities.view.groups') }, 'name'];
    }
		return sortOptions;
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

export const getSpellsSortOptions = createSelector(
  getSpellsSortOrder,
  getLocaleMessages,
  (sortOrder, locale) => {
		let sortOptions: AllSortOptions<Spell> = 'name';
		if (sortOrder === 'property') {
			sortOptions = [{ key: 'property', mapToIndex: _translate(locale, 'spells.view.properties')}, 'name'];
    }
		else if (sortOrder === 'ic') {
			sortOptions = ['ic', 'name'];
    }
		else if (sortOrder === 'group') {
			sortOptions = ['gr', 'name'];
    }
		return sortOptions;
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

export const getCantripsSortOptions = createSelector(
  getSpellsSortOrder,
  getLocaleMessages,
  (sortOrder, locale) => {
		let sortOptions: AllSortOptions<Cantrip> = 'name';
		if (sortOrder === 'property') {
			sortOptions = [{ key: 'property', mapToIndex: _translate(locale, 'spells.view.properties')}, 'name'];
    }
		return sortOptions;
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

export const getLiturgicalChantsSortOptions = createSelector(
  getLiturgiesSortOrder,
  sortOrder => {
		let sortOptions: AllSortOptions<LiturgicalChant> = 'name';
		if (sortOrder === 'ic') {
			sortOptions = ['ic', 'name'];
    }
		else if (sortOrder === 'group') {
			sortOptions = ['gr', 'name'];
    }
		return sortOptions;
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

export const getItemTemplatesSortOptions = createSelector(
  getEquipmentSortOrder,
  getLocaleMessages,
  (sortOrder, locale) => {
		let sortOptions: AllSortOptions<ItemTemplate> = 'name';
		if (sortOrder === 'groupname') {
			const groups = _translate(locale, 'equipment.view.groups');
			sortOptions = [{ key: 'gr', mapToIndex: groups }, 'name'];
		}
		else if (sortOrder === 'weight') {
			sortOptions = [
				{ key: ({ weight = 0 }) => weight, reverse: true },
				'name'
			];
		}
		return sortOptions;
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
