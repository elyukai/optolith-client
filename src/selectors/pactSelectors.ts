import { createSelector } from 'reselect';
import { getPact } from './stateSelectors';

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
