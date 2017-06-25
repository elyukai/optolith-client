import { combineReducers } from 'redux';
import { adventurePoints, AdventurePointsState } from './adventurePoints';
import { dependentInstances, DependentInstancesState } from './dependentInstances';
import { el, ELState } from './el';
import { energies, EnergiesState } from './energies';
import { equipment, EquipmentState } from './equipment';
import { history, HistoryState } from './history';
import { pets, PetsState } from './pets';
import { phase, PhaseState } from './phase';
import { profile, ProfileState } from './profile';
import { rcp, RCPState } from './rcp';
import { rules, RulesState } from './rules';

export interface CurrentHeroState {
	ap: AdventurePointsState;
	dependent: DependentInstancesState;
	el: ELState;
	energies: EnergiesState;
	equipment: EquipmentState;
	history: HistoryState;
	pets: PetsState;
	phase: PhaseState;
	profile: ProfileState;
	rcp: RCPState;
	rules: RulesState;
}

export const currentHero = combineReducers<CurrentHeroState>({
	ap: adventurePoints,
	dependent: dependentInstances,
	el,
	energies,
	equipment,
	history,
	pets,
	phase,
	profile,
	rcp,
	rules
});
