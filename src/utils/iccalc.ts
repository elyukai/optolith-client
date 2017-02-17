import APStore from '../stores/APStore';

// AC = Activation Cost
// IC = Improvement Cost

export function getIC(ic: number, sr: number): number {
	const f = ic === 5 ? 15 : ic;
	if (sr < 12 || (ic === 5 && sr < 14)) {
		return f;
	} else {
		return (sr - (ic === 5 ? 13 : 11)) * f;
	}
}

export function final(ic: number, sr: number): number {
	if (sr) {
		let add = 1;
		if (ic < 0) {
			ic = Math.abs(ic);
			add = -1;
		}
		return getIC(ic, sr) * add;
	} else {
		return ic;
	}
}

export function check(cost: number): boolean {
	if (cost > 0) {
		const available = APStore.getAvailable();
		return cost <= available;
	}
	return true;
}

export const validate = (ic: number, sr: number): boolean => check(final(ic, sr));

export default validate;

export const checkDisAdvantages = (cost: number, index: number, target: number[], spent: number, total: number, add: boolean): boolean[] => {
	const absCost = add ? cost : -cost;
	const subValid = index > 0 ? target[index] + absCost <= 50 : true;
	const mainValid = target[0] + absCost <= 80;
	const totalValid = spent + cost <= total;

	return [ totalValid, mainValid, subValid ];
};
