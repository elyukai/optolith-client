import { createSelector } from 'reselect';
import { ATTRIBUTES, CULTURES, PROFESSIONS, RACES } from '../constants/Categories';
import { Culture, Increasable, Profession, ProfessionVariant, Race } from '../types/view.d';
import * as ActivatableUtils from '../utils/ActivatableUtils';
import { filterAndSortObjects } from '../utils/FilterSortUtils';
import { getCategoryById } from '../utils/IDUtils';
import { isRequiringIncreasable, validateProfession } from '../utils/RequirementUtils';
import { filterByAvailability, isEntryFromCoreBook } from '../utils/RulesUtils';
import { isCombatTechniquesSelection } from '../utils/WikiUtils';
import { getStartEl } from './elSelectors';
import { getRuleBooksEnabled } from './rulesSelectors';
import { getCulturesSortOptions, getProfessionsSortOptions, getRacesSortOptions } from './sortOptionsSelectors';
import { getCulturesFilterText, getCurrentCultureId, getCurrentProfessionId, getCurrentProfessionVariantId, getCurrentRaceId, getCurrentRaceVariantId, getLocaleMessages, getProfessionsFilterText, getRacesFilterText, getSex, getWiki, getWikiCombatTechniques, getWikiCultures, getWikiProfessions, getWikiProfessionVariants, getWikiRaces, getWikiRaceVariants, getWikiSkills } from './stateSelectors';
import { getCulturesVisibilityFilter, getProfessionsGroupVisibilityFilter, getProfessionsVisibilityFilter } from './uisettingsSelectors';

export const getCurrentRace = createSelector(
	getWikiRaces,
	getCurrentRaceId,
	(races, raceId) => raceId ? races.get(raceId) : undefined
);

export const getCurrentRaceVariant = createSelector(
	getWikiRaceVariants,
	getCurrentRaceVariantId,
	(raceVariants, raceVariantId) => raceVariantId ? raceVariants.get(raceVariantId) : undefined
);

export const getCurrentCulture = createSelector(
	getWikiCultures,
	getCurrentCultureId,
	(cultures, cultureId) => cultureId ? cultures.get(cultureId) : undefined
);

export const getCurrentProfession = createSelector(
	getWikiProfessions,
	getCurrentProfessionId,
	(professions, professionId) => professionId ? professions.get(professionId) : undefined
);

export const getCurrentProfessionVariant = createSelector(
	getWikiProfessionVariants,
	getCurrentProfessionVariantId,
	(professionVariants, professionVariantId) => professionVariantId ? professionVariants.get(professionVariantId) : undefined
);

export const getAllRaces = createSelector(
	getWikiRaces,
	getWikiRaceVariants,
	getWikiCultures,
	(races, raceVariants, cultures) => {
		const list: Race[] = [];

		for (const [id, race] of races) {
			const {
				ap,
				attributeAdjustmentsText,
				automaticAdvantagesText,
				commonAdvantagesText,
				commonCultures,
				commonDisadvantagesText,
				lp,
				mov,
				name,
				spi,
				src,
				stronglyRecommendedAdvantagesText,
				stronglyRecommendedDisadvantagesText,
				tou,
				uncommonAdvantagesText,
				uncommonDisadvantagesText,
				variants: variantIds
			} = race;

			const filterCultures = (cultureIds: string[]) => cultureIds.filter(e => cultures.has(e)).map(e => cultures.get(e)!.name);

			const filteredCultures = filterCultures(commonCultures);

			const filteredVariants = variantIds.filter(e => raceVariants.has(e)).map(e => raceVariants.get(e)!);

			list.push({
				id,
				name,
				ap,
				lp,
				spi,
				tou,
				mov,
				attributeAdjustments: attributeAdjustmentsText,
				commonCultures: filteredCultures,
				automaticAdvantages: automaticAdvantagesText,
				stronglyRecommendedAdvantages: stronglyRecommendedAdvantagesText,
				stronglyRecommendedDisadvantages: stronglyRecommendedDisadvantagesText,
				commonAdvantages: commonAdvantagesText,
				commonDisadvantages: commonDisadvantagesText,
				uncommonAdvantages: uncommonAdvantagesText,
				uncommonDisadvantages: uncommonDisadvantagesText,
				variants: filteredVariants.map(e => {
					const {
						id,
						name,
						commonAdvantagesText,
						commonCultures,
						commonDisadvantagesText,
						uncommonAdvantagesText,
						uncommonDisadvantagesText
					} = e;
					return {
						id,
						name,
						commonCultures: filterCultures(commonCultures),
						commonAdvantages: commonAdvantagesText,
						commonDisadvantages: commonDisadvantagesText,
						uncommonAdvantages: uncommonAdvantagesText,
						uncommonDisadvantages: uncommonDisadvantagesText
					};
				}),
				src,
				category: RACES
			});
		}

		return list;
	}
);

export const getAvailableRaces = createSelector(
	getAllRaces,
	getRuleBooksEnabled,
	(list, availablility) => {
		return filterByAvailability(list, availablility);
	}
);

export const getFilteredRaces = createSelector(
	getAvailableRaces,
	getRacesFilterText,
	getRacesSortOptions,
	getLocaleMessages,
	(list, filterText, sortOptions, locale) => {
		return filterAndSortObjects(list, locale!.id, filterText, sortOptions);
	}
);

export const getAllCultures = createSelector(
	getWikiCultures,
	getWikiSkills,
	(cultures, skills) => {
		const list: Culture[] = [];

		for (const [id, culture] of cultures) {
			const {
				culturalPackageAdventurePoints,
				name,
				culturalPackageSkills,
				src,
				areaKnowledge,
				areaKnowledgeShort,
				languages,
				scripts,
				commonAdvantagesText,
				commonBlessedProfessions,
				commonDisadvantagesText,
				commonMagicProfessions,
				commonMundaneProfessions,
				commonNames,
				uncommonAdvantagesText,
				uncommonDisadvantagesText,
				commonSkills,
				uncommonSkills,
				socialStatus
			} = culture;

			list.push({
				id,
				name,
				areaKnowledge,
				areaKnowledgeShort,
				language: languages,
				script: scripts,
				socialStatus,
				commonAdvantages: commonAdvantagesText,
				commonBlessedProfessions,
				commonDisadvantages: commonDisadvantagesText,
				commonMagicProfessions,
				commonMundaneProfessions,
				commonSkills,
				uncommonSkills,
				commonNames,
				uncommonAdvantages: uncommonAdvantagesText,
				uncommonDisadvantages: uncommonDisadvantagesText,
				culturalPackageAdventurePoints,
				culturalPackageSkills: culturalPackageSkills.map(({ id, value }) => ({ name: skills.get(id)!.name, value })),
				src,
				category: CULTURES
			});
		}

		return list;
	}
);

export const getCommonCultures = createSelector(
	getCurrentRace,
	getCurrentRaceVariant,
	(race, raceVariant) => {
		const raceCultures = race && race.commonCultures;
		const raceVariantCultures = raceVariant && raceVariant.commonCultures;
		return [ ...(raceCultures || []), ...(raceVariantCultures || [])];
	}
);

export const getAvailableCultures = createSelector(
	getAllCultures,
	getRuleBooksEnabled,
	getCommonCultures,
	getCulturesVisibilityFilter,
	(list, availablility, commonCultures, visibility) => {
		if (visibility === 'common') {
			return filterByAvailability(list.filter(e => commonCultures.includes(e.id)), availablility);
		}
		return filterByAvailability(list, availablility);
	}
);

export const getFilteredCultures = createSelector(
	getAvailableCultures,
	getCulturesFilterText,
	getCulturesSortOptions,
	getLocaleMessages,
	(list, filterText, sortOptions, locale) => {
		return filterAndSortObjects(list, locale!.id, filterText, sortOptions);
	}
);

interface SkillGroupLists {
	physicalSkills: Increasable[];
	socialSkills: Increasable[];
	natureSkills: Increasable[];
	knowledgeSkills: Increasable[];
	craftSkills: Increasable[];
}

export const getAllProfessions = createSelector(
	getWiki,
	getWikiProfessions,
	getWikiProfessionVariants,
	getWikiCombatTechniques,
	getWikiSkills,
	getLocaleMessages,
	(wiki, professions, professionVariants, combatTechniquesState, skillsState, locale) => {
		const list: Profession[] = [];

		for (const [id, profession] of professions) {
			const {
				ap,
				name,
				subname,
				dependencies,
				prerequisites,
				specialAbilities,
				selections,
				combatTechniques,
				skills,
				spells,
				liturgicalChants,
				blessings,
				variants,
				prerequisitesStart,
				prerequisitesEnd,
				suggestedAdvantagesText,
				suggestedDisadvantagesText,
				unsuitableAdvantagesText,
				unsuitableDisadvantagesText,
				src,
				gr,
				subgr,
			} = profession;

			const {
				physicalSkills,
				socialSkills,
				natureSkills,
				knowledgeSkills,
				craftSkills,
			} = skills.reduce<SkillGroupLists>((obj, { id, value }) => {
				const { name, gr } = skillsState.get(id)!;

				let key: keyof SkillGroupLists = 'craftSkills';
				if (gr === 1) {
					key = 'physicalSkills';
				}
				else if (gr === 2) {
					key = 'socialSkills';
				}
				else if (gr === 3) {
					key = 'natureSkills';
				}
				else if (gr === 4) {
					key = 'knowledgeSkills';
				}

				return {
					...obj,
					[key]: [...obj[key], { name, value }],
				};
			}, {
				physicalSkills: [],
				socialSkills: [],
				natureSkills: [],
				knowledgeSkills: [],
				craftSkills: [],
			});

			const filteredVariants = variants.filter(e => professionVariants.has(e)).map(v => professionVariants.get(v)!);

			list.push({
				id,
				name,
				subname,
				ap,
				prerequisites: prerequisites.map((e, index) => {
					if (!isRequiringIncreasable(e)) {
						const { active, ...other } = e;
						return {
							active,
							...ActivatableUtils.convertPerTierCostToFinalCost(ActivatableUtils.getNameCostForWiki({ ...other, index }, wiki, locale))
						};
					}
					return e;
				}),
				prerequisitesModel: prerequisites,
				specialAbilities: specialAbilities.map(({ active, ...other }, index) => ({
					active,
					...ActivatableUtils.convertPerTierCostToFinalCost(ActivatableUtils.getNameCostForWiki({ ...other, index }, wiki, locale))
				})),
				selections: selections.map(e => {
					if (e.id === 'COMBAT_TECHNIQUES') {
						return {
							...e,
							sid: e.sid.map(id => combatTechniquesState.get(id)!.name)
						};
					}
					return e;
				}),
				combatTechniques: combatTechniques.map(({ id, value }) => ({ name: combatTechniquesState.get(id)!.name, value })),
				physicalSkills,
				socialSkills,
				natureSkills,
				knowledgeSkills,
				craftSkills,
				spells,
				liturgicalChants,
				blessings,
				variants: filteredVariants.map(v => {
					const {
						id,
						name,
						ap,
						combatTechniques: combatTechniquesVariant,
						skills: skillsVariant,
						concludingText,
						fullText,
						precedingText,
						spells: spellsVariant,
						dependencies: dependenciesVariant,
						prerequisites: variantRequires,
						selections: selectionsVariant,
						specialAbilities: specialAbilitiesVariant,
					} = v;
					return {
						id,
						name,
						ap,
						combatTechniques: combatTechniquesVariant.map(({ id, value }) => {
							const previousObject = combatTechniques.find(e => e.id === id);
							return { name: combatTechniquesState.get(id)!.name, value, previous: previousObject && previousObject.value };
						}),
						skills: skillsVariant.map(({ id, value }) => {
							const previousObject = skills.find(e => e.id === id);
							return { name: skillsState.get(id)!.name, value, previous: previousObject && previousObject.value };
						}),
						spells: spellsVariant.map(({ id, value }) => {
							const previousObject = spells.find(e => e.id === id);
							return { id, value, previous: previousObject && previousObject.value };
						}),
						dependencies: dependenciesVariant,
						prerequisitesModel: variantRequires,
						selections: selectionsVariant.map(e => {
							if (isCombatTechniquesSelection(e)) {
								return {
									...e,
									sid: e.sid.map(id => combatTechniquesState.get(id)!.name)
								};
							}
							return e;
						}),
						specialAbilities: specialAbilitiesVariant.map(({ active, ...other }, index) => ({
							active,
							...ActivatableUtils.convertPerTierCostToFinalCost(ActivatableUtils.getNameCostForWiki({ ...other, index }, wiki, locale))
						})),
						concludingText,
						fullText,
						precedingText
					};
				}),
				src,
				dependencies,
				prerequisitesStart,
				prerequisitesEnd,
				suggestedAdvantagesText,
				suggestedDisadvantagesText,
				unsuitableAdvantagesText,
				unsuitableDisadvantagesText,
				category: PROFESSIONS,
				gr,
				subgr,
			});
		}

		return list;
	}
);

export const getCommonProfessions = createSelector(
	getAllProfessions,
	getStartEl,
	getCurrentRaceId,
	getCurrentCulture,
	getSex,
	getProfessionsGroupVisibilityFilter,
	getProfessionsVisibilityFilter,
	(professions, startEl, currentRaceId, currentCulture, sex, groupVisibility, visibility) => {
		const filterProfession = (e: Profession | ProfessionVariant) => {
			const { dependencies, prerequisitesModel } = e;
			return validateProfession(dependencies, currentRaceId, currentCulture && currentCulture.id, sex) && !prerequisitesModel.some(d => {
				if (isRequiringIncreasable(d) && typeof d.id === 'string') {
					const category = getCategoryById(d.id);
					if (typeof category !== 'undefined' && category === ATTRIBUTES && d.value > startEl.maxAttributeValue) {
						return true;
					}
					return false;
				}
				return false;
			});
		};

		const filterProfessionExtended = (e: Profession) => {
			const typicalList = currentCulture!.commonProfessions[e.gr - 1];
			const commonVisible = visibility === 'all' || e.id === 'P_0' || (typeof typicalList === 'boolean' ? (typicalList === true && isEntryFromCoreBook(e)) : typicalList.list.includes(e.subgr) ? (typicalList.list.includes(e.subgr) !== typicalList.reverse && isEntryFromCoreBook(e)) : typicalList.reverse === true ? !typicalList.list.includes(e.id) && isEntryFromCoreBook(e) : typicalList.list.includes(e.id));
			// const commonVisible = visibility === 'all' || e.id === 'P_0' || (typeof typicalList === 'boolean' ? typicalList === true : (typicalList.list.includes(e.subgr) ? typicalList.list.includes(e.subgr) !== typicalList.reverse : typicalList.list.includes(e.id) !== typicalList.reverse));
			const groupVisible = groupVisibility === 0 || e.gr === 0 || groupVisibility === e.gr;
			return groupVisible && commonVisible;
		};

		return professions.filter(e => filterProfession(e) && filterProfessionExtended(e)).map(e => ({
			...e,
			variants: e.variants.filter(filterProfession)
		}));
	}
);

export const getAvailableProfessions = createSelector(
	getCommonProfessions,
	getRuleBooksEnabled,
	getProfessionsVisibilityFilter,
	(list, availablility, visibility) => {
		return visibility === 'all' ? filterByAvailability(list, availablility, entry => entry.id === 'P_0') : list;
	}
);

export const getFilteredProfessions = createSelector(
	getAvailableProfessions,
	getProfessionsFilterText,
	getProfessionsSortOptions,
	getLocaleMessages,
	(list, filterText, sortOptions, locale) => {
		return filterAndSortObjects(list, locale!.id, filterText, sortOptions);
	}
);
