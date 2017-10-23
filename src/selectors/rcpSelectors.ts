import { createSelector } from 'reselect';
import { ATTRIBUTES, CULTURES, PROFESSIONS, RACES } from '../constants/Categories';
import { AppState } from '../reducers/app';
import { ProfessionInstance, ProfessionVariantInstance } from '../types/data.d';
import { Culture, Increasable, Profession, Race } from '../types/view.d';
import * as ActivatableUtils from '../utils/ActivatableUtils';
import { getCategoryById } from '../utils/IDUtils';
import { isRequiringIncreasable, validateProfession } from '../utils/RequirementUtils';
import { getStartEl } from './elSelectors';
import { getDependentInstances, getLocaleMessages, getSex, getSkills } from './stateSelectors';
import { getProfessionsFromExpansionsVisibility, getProfessionsGroupVisibilityFilter, getProfessionsVisibilityFilter } from './uisettingsSelectors';

export const getRaces = (state: AppState) => state.currentHero.present.dependent.races;
export const getCultures = (state: AppState) => state.currentHero.present.dependent.cultures;
export const getProfessions = (state: AppState) => state.currentHero.present.dependent.professions;
export const getProfessionVariants = (state: AppState) => state.currentHero.present.dependent.professionVariants;

export const getCurrentRaceId = (state: AppState) => state.currentHero.present.rcp.race;
export const getCurrentCultureId = (state: AppState) => state.currentHero.present.rcp.culture;
export const getCurrentProfessionId = (state: AppState) => state.currentHero.present.rcp.profession;
export const getCurrentProfessionVariantId = (state: AppState) => state.currentHero.present.rcp.professionVariant;

export const getCurrentRace = createSelector(
	getRaces,
	getCurrentRaceId,
	(races, raceId) => raceId ? races.get(raceId) : undefined
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
	getCultures,
	(races, cultures) => {
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
				uncommonDisadvantagesText
			} = race;

			const filteredCultures = commonCultures.filter(e => cultures.has(e)).map(e => cultures.get(e)!.name);

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
				src,
				category: RACES
			});
		}

		return list;
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
	race => race && race.commonCultures
);

export const getAllProfessions = createSelector(
	getProfessions,
	getProfessionVariants,
	getDependentInstances,
	getStartEl,
	getCurrentRaceId,
	getCurrentCulture,
	getSex,
	getProfessionsFromExpansionsVisibility,
	getProfessionsGroupVisibilityFilter,
	getProfessionsVisibilityFilter,
	getLocaleMessages,
	(professions, professionVariants, dependentState, startEl, currentRaceId, currentCulture, sex, extensionVisibility, groupVisibility, visibility, locale) => {
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
			const commonVisible = e.id === 'P_0' || (typeof typicalList === 'boolean' ? typicalList === true : (typicalList.list.includes(e.subgr) ? typicalList.list.includes(e.subgr) !== typicalList.reverse : typicalList.list.includes(e.id) !== typicalList.reverse));
			const groupVisible = groupVisibility === 0 || e.gr === 0 || groupVisibility === e.gr;
			const extensionVisible = e.id === 'P_0' || visibility === 'all' || (e.src.some(e => e.id === 'US25001') ? commonVisible : extensionVisibility);
			return groupVisible && extensionVisible;
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
					const { id, name, ap, combatTechniques: combatTechniquesVariant, talents: talentsVariant, concludingText, precedingText } = v;
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
