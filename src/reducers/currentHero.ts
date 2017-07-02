import { first, last } from 'lodash';
import { Action, combineReducers } from 'redux';
import * as ActionTypes from '../constants/ActionTypes';
import { adventurePoints, AdventurePointsState } from './adventurePoints';
import { currentHeroTotal } from './currentHeroTotal';
import { dependentInstances, DependentInstancesState } from './dependentInstances';
import { el, ELState } from './el';
import { energies, EnergiesState } from './energies';
import { equipment, EquipmentState } from './equipment';
import { pets, PetsState } from './pets';
import { phase, PhaseState } from './phase';
import { profile, ProfileState } from './profile';
import { rcp, RCPState } from './rcp';
import { rules, RulesState } from './rules';

export interface CurrentHeroInstanceState {
	ap: AdventurePointsState;
	dependent: DependentInstancesState;
	el: ELState;
	energies: EnergiesState;
	equipment: EquipmentState;
	pets: PetsState;
	phase: PhaseState;
	profile: ProfileState;
	rcp: RCPState;
	rules: RulesState;
}

export interface CurrentHeroState {
	past: CurrentHeroInstanceState[];
	present: CurrentHeroInstanceState;
	future: CurrentHeroInstanceState[];
}

const currentHeroSlices = combineReducers<CurrentHeroInstanceState>({
	ap: adventurePoints,
	dependent: dependentInstances,
	el,
	energies,
	equipment,
	pets,
	phase,
	profile,
	rcp,
	rules
});

export function currentHero<A extends Action>(state: CurrentHeroState, action: A): CurrentHeroState {
	const { past, future, present } = state;
	switch (action.type) {
		case ActionTypes.UNDO: {
			const previous = last(past);
			const newPast = past.slice(0, past.length - 1);
			if (previous) {
				return {
					past: newPast,
					present: previous,
					future: [present, ...future]
				};
			}
			return state;
		}

		case ActionTypes.REDO: {
			const next = first(future);
			const newFuture = future.slice(1);
			if (next) {
				return {
					future: newFuture,
					present: next,
					past: [...past, present]
				};
			}
			return state;
		}

		case ActionTypes.RECEIVE_INITIAL_DATA: {
			const stateSlices = currentHeroSlices<A>(state.present, action);
			const finalState = currentHeroTotal(stateSlices, action);
			return {
				past: [...past, present],
				present: finalState,
				future: []
			};
		}

		default: {
			const stateSlices = currentHeroSlices<A>(state.present, action);
			const finalState = currentHeroTotal(stateSlices, action);
			return {
				past: [...past, present],
				present: finalState,
				future: []
			};
		}
	}
}
