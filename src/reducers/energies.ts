import { AddArcaneEnergyPointAction, AddBoughtBackAEPointAction, AddBoughtBackKPPointAction, AddKarmaPointAction, AddLifePointAction, AddLostAEPointAction, AddLostAEPointsAction, AddLostKPPointAction, AddLostKPPointsAction, AddLostLPPointAction, AddLostLPPointsAction, RemoveArcaneEnergyPointAction, RemoveBoughtBackAEPointAction, RemoveBoughtBackKPPointAction, RemoveKarmaPointAction, RemoveLifePointAction, RemoveLostAEPointAction, RemoveLostKPPointAction, RemoveLostLPPointAction } from '../actions/AttributesActions';
import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import { SetSelectionsAction } from '../actions/ProfessionActions';
import * as ActionTypes from '../constants/ActionTypes';

type Action = AddArcaneEnergyPointAction | AddKarmaPointAction | AddLifePointAction | LoadHeroAction | CreateHeroAction | AddBoughtBackAEPointAction | AddBoughtBackKPPointAction | AddLostAEPointAction | AddLostAEPointsAction | AddLostKPPointAction | AddLostKPPointsAction | RemoveBoughtBackAEPointAction | RemoveBoughtBackKPPointAction | RemoveLostAEPointAction | RemoveLostKPPointAction | SetSelectionsAction | RemoveArcaneEnergyPointAction | RemoveKarmaPointAction | RemoveLifePointAction | AddLostLPPointAction | AddLostLPPointsAction | RemoveLostLPPointAction;

export interface EnergiesState {
	addedLifePoints: number;
	addedArcaneEnergy: number;
	addedKarmaPoints: number;
	permanentLifePoints: {
		lost: number;
	};
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
	permanentLifePoints: {
		lost: 0
	},
	permanentArcaneEnergy: {
		lost: 0,
		redeemed: 0
	},
	permanentKarmaPoints: {
		lost: 0,
		redeemed: 0
	}
};

export function energies(state: EnergiesState = initialState, action: Action): EnergiesState {
	switch (action.type) {
		case ActionTypes.CREATE_HERO:
			return {
				addedLifePoints: 0,
				addedArcaneEnergy: 0,
				addedKarmaPoints: 0,
				permanentLifePoints: {
					lost: 0
				},
				permanentArcaneEnergy: {
					lost: 0,
					redeemed: 0
				},
				permanentKarmaPoints: {
					lost: 0,
					redeemed: 0
				}
			};

		case ActionTypes.LOAD_HERO: {
			const {
				ae,
				kp,
				lp,
				permanentLP,
				permanentAE: {
					lost: lostAE,
					redeemed: redeemedAE
				},
				permanentKP: {
					lost: lostKP,
					redeemed: redeemedKP
				}
			} = action.payload.data.attr;
			return {
				addedLifePoints: lp,
				addedArcaneEnergy: ae,
				addedKarmaPoints: kp,
				permanentLifePoints: permanentLP ? {
					lost: permanentLP.lost
				} : state.permanentLifePoints,
				permanentArcaneEnergy: {
					lost: lostAE,
					redeemed: redeemedAE
				},
				permanentKarmaPoints: {
					lost: lostKP,
					redeemed: redeemedKP
				}
			};
		}

		case ActionTypes.ADD_LIFE_POINT:
			return { ...state, addedLifePoints: state.addedLifePoints + 1 };

		case ActionTypes.ADD_ARCANE_ENERGY_POINT:
			return { ...state, addedArcaneEnergy: state.addedArcaneEnergy + 1 };

		case ActionTypes.ADD_KARMA_POINT:
			return { ...state, addedKarmaPoints: state.addedKarmaPoints + 1 };

		case ActionTypes.REMOVE_LIFE_POINT:
			return { ...state, addedLifePoints: state.addedLifePoints - 1 };

		case ActionTypes.REMOVE_ARCANE_ENERGY_POINT:
			return { ...state, addedArcaneEnergy: state.addedArcaneEnergy - 1 };

		case ActionTypes.REMOVE_KARMA_POINT:
			return { ...state, addedKarmaPoints: state.addedKarmaPoints - 1 };

		case ActionTypes.ADD_BOUGHT_BACK_AE_POINT:
			return {
				...state,
				permanentArcaneEnergy: {
					...state.permanentArcaneEnergy,
					redeemed: state.permanentArcaneEnergy.redeemed + 1
				}
			};

		case ActionTypes.ADD_BOUGHT_BACK_KP_POINT:
			return {
				...state,
				permanentKarmaPoints: {
					...state.permanentKarmaPoints,
					redeemed: state.permanentKarmaPoints.redeemed + 1
				}
			};

		case ActionTypes.REMOVE_BOUGHT_BACK_AE_POINT:
			return {
				...state,
				permanentArcaneEnergy: {
					...state.permanentArcaneEnergy,
					redeemed: state.permanentArcaneEnergy.redeemed - 1
				}
			};

		case ActionTypes.REMOVE_BOUGHT_BACK_KP_POINT:
			return {
				...state,
				permanentKarmaPoints: {
					...state.permanentKarmaPoints,
					redeemed: state.permanentKarmaPoints.redeemed - 1
				}
			};

		case ActionTypes.ADD_LOST_LP_POINT:
			return {
				...state,
				permanentLifePoints: {
					lost: state.permanentLifePoints.lost + 1
				}
			};

		case ActionTypes.ADD_LOST_AE_POINT:
			return {
				...state,
				permanentArcaneEnergy: {
					...state.permanentArcaneEnergy,
					lost: state.permanentArcaneEnergy.lost + 1
				}
			};

		case ActionTypes.ADD_LOST_KP_POINT:
			return {
				...state,
				permanentKarmaPoints: {
					...state.permanentKarmaPoints,
					lost: state.permanentKarmaPoints.lost + 1
				}
			};

		case ActionTypes.REMOVE_LOST_LP_POINT:
			return {
				...state,
				permanentLifePoints: {
					lost: state.permanentLifePoints.lost - 1
				}
			};

		case ActionTypes.REMOVE_LOST_AE_POINT: {
			const { lost, redeemed } = state.permanentArcaneEnergy;
			return {
				...state,
				permanentArcaneEnergy: {
					redeemed: lost === redeemed ? redeemed - 1 : redeemed,
					lost: lost - 1
				}
			};
		}

		case ActionTypes.REMOVE_LOST_KP_POINT: {
			const { lost, redeemed } = state.permanentKarmaPoints;
			return {
				...state,
				permanentKarmaPoints: {
					redeemed: lost === redeemed ? redeemed - 1 : redeemed,
					lost: lost - 1
				}
			};
		}

		case ActionTypes.ADD_LOST_LP_POINTS:
			return {
				...state,
				permanentLifePoints: {
					lost: state.permanentLifePoints.lost + action.payload.value
				}
			};

		case ActionTypes.ADD_LOST_AE_POINTS:
			return {
				...state,
				permanentArcaneEnergy: {
					...state.permanentArcaneEnergy,
					lost: state.permanentArcaneEnergy.lost + action.payload.value
				}
			};

		case ActionTypes.ADD_LOST_KP_POINTS:
			return {
				...state,
				permanentKarmaPoints: {
					...state.permanentKarmaPoints,
					lost: state.permanentKarmaPoints.lost + action.payload.value
				}
			};

		default:
			return state;
	}
}
