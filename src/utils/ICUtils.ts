/**
 * Returns the AP cost for the next increase.
 * @param ic The improvement cost. Ranges from 1 = A to 5 = E.
 * @param fromValue The value that should be increased.
 */
export function getIncreaseAP(ic: number, fromValue?: number): number {
	if (typeof fromValue === 'number') {
		fromValue++;
	}
	return getImprovementCost(ic, fromValue);
}

/**
 * Returns the AP cost for the given value range (increasing value).
 * @param ic The improvement cost. Ranges from 1 = A to 5 = E.
 * @param fromValue The previous value.
 * @param toValue The target value to which you want to get the accumulated AP cost for.
 */
export function getIncreaseRangeAP(ic: number, fromValue: number, toValue: number): number {
	return Array.from({ length: toValue - fromValue }).reduce<number>((cost, _, i) => {
		return cost + getIncreaseAP(ic, i + fromValue);
	}, 0);
}

/**
 * Returns the AP cost for the given value range (decreasing value).
 * @param ic The improvement cost. Ranges from 1 = A to 5 = E.
 * @param fromValue The previous value.
 * @param toValue The target value to which you want to get the accumulated AP cost for.
 */
export function getDecreaseRangeAP(ic: number, fromValue: number, toValue: number): number {
	return Array.from({ length: fromValue - toValue }).reduce<number>((cost, _, i) => {
		return cost + getDecreaseAP(ic, fromValue - i);
	}, 0);
}

/**
 * Returns the AP cost for the next decrease.
 * @param ic The improvement cost. Ranges from 1 = A to 5 = E.
 * @param fromValue The value that should be decreased.
 */
export function getDecreaseAP(ic: number, fromValue?: number): number {
	return getImprovementCost(ic, fromValue) * -1;
}

function getImprovementCost(ic: number, value?: number): number {
	if (ic === 5) {
		return getEImprovementCost(value);
	}
	return getAtoDImprovementCost(ic, value);
}

function getAtoDImprovementCost(ic: number, value?: number): number {
	if (typeof value === 'undefined' || value < 13) {
		return ic;
	}
	return (value - 11) * ic;
}

function getEImprovementCost(value?: number): number {
	if (typeof value === 'undefined' || value < 15) {
		return 15;
	}
	return (value - 13) * 15;
}

/**
 * Returns the string representing the IC id.
 * @param icId
 */
export function getICName(icId: number) {
	return ['A', 'B', 'C', 'D'][icId - 1];
}
