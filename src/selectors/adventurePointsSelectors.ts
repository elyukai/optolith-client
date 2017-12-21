import { createSelector } from 'reselect';
import { calculateAdventurePointsSpentDifference } from '../utils/ActivatableUtils';
import { getAdvantagesDisadvantagesSubMax } from '../utils/APUtils';
import { getIncreaseAP, getIncreaseRangeAP } from '../utils/ICUtils';
import { getAdvantagesForEdit, getDisadvantagesForEdit, getSpecialAbilitiesForEdit } from './activatableSelectors';
import { getAdvantages, getAttributes, getBlessings, getCantrips, getCombatTechniques, getDependentInstances, getDisadvantages, getEnergies, getLiturgicalChants, getSkills, getSpecialAbilities, getSpells, getTotalAdventurePoints, getWiki, getWikiCombatTechniques, getWikiLiturgicalChants, getWikiSkills, getWikiSpells } from './stateSelectors';

export const getAdventurePointsSpentForAttributes = createSelector(
	getAttributes,
	list => [...list.values()].reduce((sum, { value }) => {
		return sum + getIncreaseRangeAP(5, 8, value);
	}, 0)
);

export const getAdventurePointsSpentForSkills = createSelector(
	getSkills,
	getWikiSkills,
	(list, wikiList) => [...list.values()].reduce((sum, { id, value }) => {
		const skill = wikiList.get(id)!;
		return sum + getIncreaseRangeAP(skill.ic, 0, value);
	}, 0)
);

export const getAdventurePointsSpentForCombatTechniques = createSelector(
	getCombatTechniques,
	getWikiCombatTechniques,
	(list, wikiList) => [...list.values()].reduce((sum, { id, value }) => {
		const combatTechnique = wikiList.get(id)!;
		return sum + getIncreaseRangeAP(combatTechnique.ic, 6, value);
	}, 0)
);

export const getAdventurePointsSpentForSpells = createSelector(
	getSpells,
	getWikiSpells,
	(list, wikiList) => [...list.values()].reduce((sum, { id, value, active }) => {
		if (!active) {
			return sum;
		}
		const spell = wikiList.get(id)!;
		return sum + getIncreaseAP(spell.ic) + getIncreaseRangeAP(spell.ic, 0, value);
	}, 0)
);

export const getAdventurePointsSpentForLiturgicalChants = createSelector(
	getLiturgicalChants,
	getWikiLiturgicalChants,
	(list, wikiList) => [...list.values()].reduce((sum, { id, value, active }) => {
		if (!active) {
			return sum;
		}
		const liturgicalChant = wikiList.get(id)!;
		return sum + getIncreaseAP(liturgicalChant.ic) + getIncreaseRangeAP(liturgicalChant.ic, 0, value);
	}, 0)
);

export const getAdventurePointsSpentForCantrips = createSelector(
	getCantrips,
	list => [...list.values()].filter(e => e.active).length
);

export const getAdventurePointsSpentForBlessings = createSelector(
	getBlessings,
	list => [...list.values()].filter(e => e.active).length
);

export const getAdventurePointsSpentForAdvantages = createSelector(
	getAdvantagesForEdit,
	getAdvantages,
	getWiki,
	(list, state, wiki) => {
		const baseAP = list.reduce((sum, obj) => sum + obj.cost, 0);
		const diffAP = calculateAdventurePointsSpentDifference(list, state, wiki);
		return baseAP + diffAP;
	}
);

export const getAdventurePointsSpentForMagicalAdvantages = createSelector(
	getAdvantagesForEdit,
	getAdvantages,
	getWiki,
	(list, state, wiki) => {
		const filteredList = list.filter(e => e.instance.gr === 2);
		const baseAP = filteredList.reduce((sum, obj) => sum + obj.cost, 0);
		const diffAP = calculateAdventurePointsSpentDifference(filteredList, state, wiki);
		return baseAP + diffAP;
	}
);

export const getAdventurePointsSpentForBlessedAdvantages = createSelector(
	getAdvantagesForEdit,
	getAdvantages,
	getWiki,
	(list, state, wiki) => {
		const filteredList = list.filter(e => e.instance.gr === 3);
		const baseAP = filteredList.reduce((sum, obj) => sum + obj.cost, 0);
		const diffAP = calculateAdventurePointsSpentDifference(filteredList, state, wiki);
		return baseAP + diffAP;
	}
);

export const getAdventurePointsSpentForDisadvantages = createSelector(
	getDisadvantagesForEdit,
	getDisadvantages,
	getWiki,
	(list, state, wiki) => {
		const baseAP = list.reduce((sum, obj) => sum + obj.cost, 0);
		const diffAP = calculateAdventurePointsSpentDifference(list, state, wiki);
		return baseAP + diffAP;
	}
);

export const getAdventurePointsSpentForMagicalDisadvantages = createSelector(
	getDisadvantagesForEdit,
	getDisadvantages,
	getWiki,
	(list, state, wiki) => {
		const filteredList = list.filter(e => e.instance.gr === 2);
		const baseAP = filteredList.reduce((sum, obj) => sum + obj.cost, 0);
		const diffAP = calculateAdventurePointsSpentDifference(filteredList, state, wiki);
		return baseAP + diffAP;
	}
);

export const getAdventurePointsSpentForBlessedDisadvantages = createSelector(
	getDisadvantagesForEdit,
	getDisadvantages,
	getWiki,
	(list, state, wiki) => {
		const filteredList = list.filter(e => e.instance.gr === 3);
		const baseAP = filteredList.reduce((sum, obj) => sum + obj.cost, 0);
		const diffAP = calculateAdventurePointsSpentDifference(filteredList, state, wiki);
		return baseAP + diffAP;
	}
);

export const getMagicalAdvantagesDisadvantagesAdventurePointsMaximum = createSelector(
	getDependentInstances,
	dependent => {
		return getAdvantagesDisadvantagesSubMax(dependent, 1);
	}
);

export const getAdventurePointsSpentForSpecialAbilities = createSelector(
	getSpecialAbilitiesForEdit,
	getSpecialAbilities,
	getWiki,
	(list, state, wiki) => {
		const baseAP = list.reduce((sum, obj) => sum + obj.cost, 0);
		const diffAP = calculateAdventurePointsSpentDifference(list, state, wiki);
		return baseAP + diffAP;
	}
);

export const getAdventurePointsSpentForEnergies = createSelector(
	getEnergies,
	energies => {
		const {
			addedArcaneEnergy,
			addedKarmaPoints,
			addedLifePoints,
			permanentArcaneEnergy: {
				redeemed: redeemedArcaneEnergy
			},
			permanentKarmaPoints: {
				redeemed: redeemedKarmaPoints
			},
		} = energies;
		const addedArcaneEnergyCost = getIncreaseRangeAP(4, 0, addedArcaneEnergy);
		const addedKarmaPointsCost = getIncreaseRangeAP(4, 0, addedKarmaPoints);
		const addedLifePointsCost = getIncreaseRangeAP(4, 0, addedLifePoints);
		const boughtBackArcaneEnergyCost = redeemedArcaneEnergy * 2;
		const boughtBackKarmaPointsCost = redeemedKarmaPoints * 2;
		return addedArcaneEnergyCost + addedKarmaPointsCost + addedLifePointsCost + boughtBackArcaneEnergyCost + boughtBackKarmaPointsCost;
	}
);

export const getAdventurePointsSpent = createSelector(
	getAdventurePointsSpentForAttributes,
	getAdventurePointsSpentForSkills,
	getAdventurePointsSpentForCombatTechniques,
	getAdventurePointsSpentForSpells,
	getAdventurePointsSpentForLiturgicalChants,
	getAdventurePointsSpentForCantrips,
	getAdventurePointsSpentForBlessings,
	getAdventurePointsSpentForAdvantages,
	getAdventurePointsSpentForDisadvantages,
	getAdventurePointsSpentForSpecialAbilities,
	getAdventurePointsSpentForEnergies,
	(...cost: number[]) => {
		return cost.reduce((a, b) => a + b, 0);
	}
);

export const getAvailableAdventurePoints = createSelector(
	getTotalAdventurePoints,
	getAdventurePointsSpent,
	(total, spent) => total - spent
);
