import { combineReducers } from 'redux';
import * as ActionTypes from '../constants/ActionTypes';
import { reduceReducers } from '../utils/reduceReducers';
import { undo, UndoState } from '../utils/undo';
import { adventurePoints, AdventurePointsState } from './adventurePoints';
import { currentHeroPost } from './currentHeroPost';
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

export interface CurrentHeroState extends UndoState<CurrentHeroInstanceState> {}

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

export const currentHero = undo(reduceReducers(currentHeroSlices, currentHeroPost), [ActionTypes.RECEIVE_INITIAL_DATA, ActionTypes.CREATE_HERO, ActionTypes.LOAD_HERO, ActionTypes.ASSIGN_RCP_OPTIONS, ActionTypes.SAVE_HERO]);
