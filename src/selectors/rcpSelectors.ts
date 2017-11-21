import { createSelector } from 'reselect';
import { ATTRIBUTES, CULTURES, PROFESSIONS, RACES } from '../constants/Categories';
import { ProfessionInstance, ProfessionVariantInstance } from '../types/data.d';
import { Culture, Increasable, Profession, Race } from '../types/view.d';
import * as ActivatableUtils from '../utils/ActivatableUtils';
import { getCategoryById } from '../utils/IDUtils';
import { isRequiringIncreasable, validateProfession } from '../utils/RequirementUtils';
import { filterByAvailability, isEntryFromCoreBook } from '../utils/RulesUtils';
import { getStartEl } from './elSelectors';
import { getRuleBooksEnabled } from './rulesSelectors';
import { getCultures, getCurrentCultureId, getCurrentProfessionId, getCurrentProfessionVariantId, getCurrentRaceId, getCurrentRaceVariantId, getDependentInstances, getLocaleMessages, getProfessions, getProfessionVariants, getRaces, getRaceVariants, getSex, getSkills } from './stateSelectors';
import { getCulturesVisibilityFilter, getProfessionsGroupVisibilityFilter, getProfessionsVisibilityFilter } from './uisettingsSelectors';

export const getCurrentRace = createSelector(
	getRaces,
	getCurrentRaceId,
	(races, raceId) => raceId ? races.get(raceId) : undefined
);

export const getCurrentRaceVariant = createSelector(
	getRaceVariants,
	getCurrentRaceVariantId,
	(raceVariants, raceVariantId) => raceVariantId ? raceVariants.get(raceVariantId) : undefined
);

export const getCurrentCulture = createSelector(
	getCultures,
	getCurrentCultureId,
	(cultures, cultureId) => cultureId ? cultures.get(cultureId) : undefined
);

export const getCurrentProfession = createSelector(
	getProfessions,
	getCurrentProfessionId,
	(professions, professionId) => professionId ? professions.get(professionId) : undefined
);

export const getCurrentProfessionVariant = createSelector(
	getProfessionVariants,
	getCurrentProfessionVariantId,
	(professionVariants, professionVariantId) => professionVariantId ? professionVariants.get(professionVariantId) : undefined
);

export const getAllRaces = createSelector(
	getRaces,
	getRaceVariants,
	getCultures,
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

export const getFilteredRaces = createSelector(
	getAllRaces,
	getRuleBooksEnabled,
	(list, availablility) => {
		return filterByAvailability(list, availablility);
	}
);

export const getAllCultures = createSelector(
	getCultures,
	getSkills,
	(cultures, skills) => {
		const list: Culture[] = [];

		for (const [id, culture] of cultures) {
			const {
				ap,
				name,
				talents,
				src,
				areaKnowledge,
				areaKnowledgeShort,
				languages,
				scripts,
				commonAdvantages,
				commonBlessedProfessions,
				commonDisadvantages,
				commonMagicProfessions,
				commonMundaneProfessions,
				commonNames,
				uncommonAdvantages,
				uncommonDisadvantages,
				typicalTalents,
				untypicalTalents,
				socialTiers
			} = culture;

			list.push({
				id,
				name,
				areaKnowledge,
				areaKnowledgeShort,
				language: languages,
				script: scripts,
				socialStatus: socialTiers,
				commonAdvantages,
				commonBlessedProfessions,
				commonDisadvantages,
				commonMagicProfessions,
				commonMundaneProfessions,
				commonSkills: typicalTalents,
				uncommonSkills: untypicalTalents,
				commonNames,
				uncommonAdvantages,
				uncommonDisadvantages,
				culturalPackageAp: ap,
				culturalPackageSkills: talents.map(([id, value]) => ({ name: skills.get(id)!.name, value })),
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

export const getFilteredCultures = createSelector(
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

export const getAllProfessions = createSelector(
	getProfessions,
	getProfessionVariants,
	getDependentInstances,
	getStartEl,
	getCurrentRaceId,
	getCurrentCulture,
	getSex,
	getProfessionsGroupVisibilityFilter,
	getProfessionsVisibilityFilter,
	getLocaleMessages,
	(professions, professionVariants, dependentState, startEl, currentRaceId, currentCulture, sex, groupVisibility, visibility, locale) => {
		const { combatTechniques: combatTechniquesState, talents: skillsState } = dependentState;
		const list: Profession[] = [];

		const filterProfession = (e: ProfessionInstance | ProfessionVariantInstance) => {
			const { dependencies, requires } = e;
			return validateProfession(dependencies, currentRaceId, currentCulture && currentCulture.id, sex) && !requires.some(d => {
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

		const filterProfessionExtended = (e: ProfessionInstance) => {
			const typicalList = currentCulture!.typicalProfessions[e.gr - 1];
			const commonVisible = visibility === 'all' || e.id === 'P_0' || (typeof typicalList === 'boolean' ? (typicalList === true && isEntryFromCoreBook(e)) : typicalList.list.includes(e.subgr) ? (typicalList.list.includes(e.subgr) !== typicalList.reverse && isEntryFromCoreBook(e)) : typicalList.list.includes(e.id) !== typicalList.reverse);
			// const commonVisible = visibility === 'all' || e.id === 'P_0' || (typeof typicalList === 'boolean' ? typicalList === true : (typicalList.list.includes(e.subgr) ? typicalList.list.includes(e.subgr) !== typicalList.reverse : typicalList.list.includes(e.id) !== typicalList.reverse));
			const groupVisible = groupVisibility === 0 || e.gr === 0 || groupVisibility === e.gr;
			return groupVisible && commonVisible;
		};

		const filteredProfessions = [...professions].filter(([_, entry]) => filterProfession(entry) && filterProfessionExtended(entry));

		for (const [id, profession] of filteredProfessions) {
			const {
				ap,
				name,
				subname,
				requires,
				specialAbilities,
				selections,
				combatTechniques,
				talents,
				spells,
				liturgies,
				blessings,
				variants,
				src
			} = profession;

			const skills: Increasable[][] = [[], [], [], [], []];

			for (const [id, value] of talents) {
				const { name, gr } = skillsState.get(id)!;
				skills[gr - 1].push({ name, value });
			}

			const filteredVariants = variants.filter(e => professionVariants.has(e)).map(v => professionVariants.get(v)!).filter(filterProfession);

			list.push({
				id,
				name,
				subname,
				ap,
				prerequisites: requires.map((e, index) => {
					if (!isRequiringIncreasable(e)) {
						const { active, ...other } = e;
						return {
							active,
							...ActivatableUtils.convertPerTierCostToFinalCost(ActivatableUtils.getNameCost({ ...other, index }, dependentState, true, locale!))
						};
					}
					return e;
				}),
				specialAbilities: specialAbilities.map(({ active, ...other }, index) => ({
					active,
					...ActivatableUtils.convertPerTierCostToFinalCost(ActivatableUtils.getNameCost({ ...other, index }, dependentState, true, locale!))
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
				combatTechniques: combatTechniques.map(([id, value]) => ({ name: combatTechniquesState.get(id)!.name, value })),
				physicalSkills: skills[0],
				socialSkills: skills[1],
				natureSkills: skills[2],
				knowledgeSkills: skills[3],
				craftSkills: skills[4],
				spells: spells.map(([id, value]) => ({ id, value })),
				liturgicalChants: liturgies.map(([id, value]) => ({ id, value })),
				blessings,
				variants: filteredVariants.map(v => {
					const { id, name, ap, combatTechniques: combatTechniquesVariant, talents: talentsVariant, concludingText, precedingText, spells: spellsVariant } = v;
					return {
						id,
						name,
						ap,
						combatTechniques: combatTechniquesVariant.map(([id, value]) => {
							const previousObject = combatTechniques.find(e => e[0] === id);
							return { name: combatTechniquesState.get(id)!.name, value, previous: previousObject && previousObject[1] };
						}),
						skills: talentsVariant.map(([id, value]) => {
							const previousObject = talents.find(e => e[0] === id);
							return { name: skillsState.get(id)!.name, value, previous: previousObject && previousObject[1] };
						}),
						spells: spellsVariant.map(([id, value]) => {
							const previousObject = spells.find(e => e[0] === id);
							return { id, value, previous: previousObject && previousObject[1] };
						}),
						concludingText,
						precedingText
					};
				}),
				src,
				category: PROFESSIONS
			});
		}

		return list;
	}
);

export const getFilteredProfessions = createSelector(
	getAllProfessions,
	getRuleBooksEnabled,
	(list, availablility) => {
		return filterByAvailability(list, availablility);
	}
);
