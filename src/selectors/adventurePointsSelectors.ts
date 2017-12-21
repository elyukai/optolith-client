import { createSelector } from 'reselect';
import { AdventurePointsState } from '../reducers/adventurePoints';
import { AppState } from '../reducers/app';
import { calculateAdventurePointsSpentDifference } from '../utils/ActivatableUtils';
import { getIncreaseRangeAP, getIncreaseAP } from '../utils/ICUtils';
import { getAdvantagesForEdit, getDisadvantagesForEdit, getSpecialAbilitiesForEdit } from './activatableSelectors';
import { getAdvantages, getAttributes, getBlessings, getCantrips, getCombatTechniques, getDisadvantages, getLiturgicalChants, getSkills, getSpecialAbilities, getSpells, getWiki, getWikiCombatTechniques, getWikiLiturgicalChants, getWikiSkills, getWikiSpells } from './stateSelectors';

export const getAp = (state: AppState) => state.currentHero.present.ap;
export const getTotal = (state: AppState) => state.currentHero.present.ap.total;
export const getSpent = (state: AppState) => state.currentHero.present.ap.spent;
export const getAvailable = (state: AppState) => getTotal(state) - getSpent(state);

export function getLeft(state: AdventurePointsState) {
	return state.total - state.spent;
}

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
	(...cost: number[]) => {
		return cost.reduce((a, b) => a + b, 0);
	}
);
