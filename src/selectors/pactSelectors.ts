import { createSelector } from 'reselect';
import { isPactRequirement } from '../utils/RequirementUtils';
import { getPact, getSpecialAbilities, getWikiSpecialAbilities } from './stateSelectors';

export const isPactValid = createSelector(
	getPact,
	pact => {
		if (pact !== null) {
			const validDomain = typeof pact.domain === 'number' || pact.domain.length > 0;
			const validName = pact.name.length > 0;
			return validDomain && validName;
		}
		return false;
	}
);

export const getValidPact = createSelector(
	getPact,
	isPactValid,
	(pact, isValid) => {
		if (isValid) {
			return pact!;
		}
		return undefined;
	}
);

export const isPactEditable = createSelector(
	getSpecialAbilities,
	getWikiSpecialAbilities,
	(specialAbilities, wiki) => {
		return ![...specialAbilities.values()].some(e => {
			if (e.active.length === 0) {
				return false;
			}
			const { prerequisites } = wiki.get(e.id)!;
			if (Array.isArray(prerequisites)) {
				return prerequisites.some(e => e !== 'RCP' && isPactRequirement(e));
			}
			else if (prerequisites.has(1)) {
				return prerequisites.get(1)!.some(e => e !== 'RCP' && isPactRequirement(e));
			}
			return false;
		});
	}
);
