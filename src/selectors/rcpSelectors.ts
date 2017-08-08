import { createSelector } from 'reselect';
import { ATTRIBUTES } from '../constants/Categories';
import { AppState } from '../reducers/app';
import { ProfessionInstance, ProfessionVariantInstance } from '../types/data.d';
import { Culture, Increasable, Profession, Race } from '../types/view.d';
import { getCategoryById } from '../utils/IDUtils';
import { isRequiringIncreasable, validateProfession } from '../utils/RequirementUtils';
import { getStartEl } from './elSelectors';
import { getCombatTechniques, getSex, getSkills } from './stateSelectors';
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

			list.push({
				id,
				name,
				ap,
				lp,
				spi,
				tou,
				mov,
				attributeAdjustments: attributeAdjustmentsText,
				commonCultures: commonCultures.map(e => cultures.get(e)!.name),
				automaticAdvantages: automaticAdvantagesText,
				stronglyRecommendedAdvantages: stronglyRecommendedAdvantagesText,
				stronglyRecommendedDisadvantages: stronglyRecommendedDisadvantagesText,
				commonAdvantages: commonAdvantagesText,
				commonDisadvantages: commonDisadvantagesText,
				uncommonAdvantages: uncommonAdvantagesText,
				uncommonDisadvantages: uncommonDisadvantagesText,
				src
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
				talents
			} = culture;

			list.push({
				id,
				name,
				culturalPackageAp: ap,
				culturalPackageSkills: talents.map(([id, value]) => ({ name: skills.get(id)!.name, value })),
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
	getCombatTechniques,
	getSkills,
	getStartEl,
	getCurrentRaceId,
	getCurrentCulture,
	getSex,
	getProfessionsFromExpansionsVisibility,
	getProfessionsGroupVisibilityFilter,
	getProfessionsVisibilityFilter,
	(professions, professionVariants, combatTechniquesState, skillsState, startEl, currentRaceId, currentCulture, sex, extensionVisibility, groupVisibility, visibility) => {
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
			const extensionVisible = visibility === 'all' || (e.src.id === 'US25001' ? commonVisible : extensionVisibility);
			return groupVisible && extensionVisible;
		};

		const filteredProfessions = [...professions].filter(([_, entry]) => filterProfession(entry) && filterProfessionExtended(entry));

		for (const [id, profession] of filteredProfessions) {
			const {
				ap,
				name,
				subname,
				combatTechniques,
				talents,
				variants
			} = profession;

			const skills: Increasable[][] = [[], [], [], [], []];

			for (const [id, value] of talents) {
				const { name, gr } = skillsState.get(id)!;
				skills[gr - 1].push({ name, value });
			}

			const filteredVariants = variants.map(v => professionVariants.get(v)!).filter(filterProfession);

			list.push({
				id,
				name,
				subname,
				ap,
				combatTechniques: combatTechniques.map(function mapCTs([id, value]) {return { name: combatTechniquesState.get(id)!.name, value }; }),
				physicalSkills: skills[0],
				socialSkills: skills[1],
				natureSkills: skills[2],
				knowledgeSkills: skills[3],
				craftSkills: skills[4],
				variants: filteredVariants.map(v => {
					const { id, name, ap, combatTechniques, talents } = v;
					return {
						id,
						name,
						ap,
						combatTechniques: combatTechniques.map(([id, value]) => ({ name: combatTechniquesState.get(id)!.name, value })),
						skills: talents.map(([id, value]) => ({ name: skillsState.get(id)!.name, value }))
					};
				})
			});
		}

		return list;
	}
);
