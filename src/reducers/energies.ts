export interface EnergiesState {
	addedLifePoints: number;
	addedArcaneEnergy: number;
	addedKarmaPoints: number;
	permanentArcaneEnergy: {
		lost: number;
		redeemed: number;
	};
	permanentKarmaPoints: {
		lost: number;
		redeemed: number;
	};
}

const initialState: EnergiesState = {
	addedLifePoints: 0,
	addedArcaneEnergy: 0,
	addedKarmaPoints: 0,
	permanentArcaneEnergy: {
		lost: 0,
		redeemed: 0,
	},
	permanentKarmaPoints: {
		lost: 0,
		redeemed: 0,
	}
};

export function energies(state: EnergiesState = initialState, action: Action): EnergiesState {
	return state;
}
