import { IncreasableInstance } from '../types/data.d';
import { validate } from './APUtils';
import { getDecreaseAP, getIncreaseAP } from './ICUtils';

export function set(obj: IncreasableInstance, value: number): IncreasableInstance {
	return ({ ...obj, value });
}

export function add(obj: IncreasableInstance, value: number): IncreasableInstance {
	return ({ ...obj, value: obj.value + value });
}

export function remove(obj: IncreasableInstance, value: number): IncreasableInstance {
	return ({ ...obj, value: obj.value - value });
}

export function addPoint(obj: IncreasableInstance): IncreasableInstance {
	return ({ ...obj, value: obj.value + 1 });
}

export function removePoint(obj: IncreasableInstance): IncreasableInstance {
	return ({ ...obj, value: obj.value - 1 });
}

export function getIncreaseCost(obj: IncreasableInstance, availableAP: number, negativeApValid: boolean): number | undefined {
	const { ic, value } = obj;
	const cost = getIncreaseAP(ic, value);
	const validCost = validate(cost, availableAP, negativeApValid);
	return !validCost ? undefined : cost;
}

export function getDecreaseCost(obj: IncreasableInstance): number {
	const { ic, value } = obj;
	return getDecreaseAP(ic, value);
}
