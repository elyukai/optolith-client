import * as ActionTypes from '../constants/ActionTypes';
import { ReceiveDataTablesAction } from '../actions/ServerActions';
import AddEnergiesReducer, { AddEnergiesState } from './AddEnergiesReducer';
import AvatarReducer, { AvatarState } from './AvatarReducer';
import PhaseReducer, { PhaseState } from './PhaseReducer';
import RaceReducer, { RaceState } from './RaceReducer';
import CultureReducer, { CultureState } from './CultureReducer';
import ExperienceLevelsReducer, { ExperienceLevelsState } from './ExperienceLevelsReducer';
import ProfessionReducer, { ProfessionState } from './ProfessionReducer';
import ProfessionVariantReducer, { ProfessionVariantState } from './ProfessionVariantReducer';
import HistoryReducer, { HistoryState } from './HistoryReducer';
import InfoReducer, { InfoState } from './InfoReducer';
import ItemsReducer, { ItemsState } from './ItemsReducer';
import SexReducer, { SexState } from './SexReducer';
import AbilitiesReducer, { AbilitiesState } from './AbilitiesReducer';
import APReducer, { APState } from './APReducer';
import init from '../utils/init';
import RequirementsReducer from './RequirementsReducer';

export interface HeroState {
	readonly id: string | null;
	readonly name: string;
	readonly phase: PhaseState;
	readonly ap: APState;
	readonly avatar: AvatarState;
	readonly sex: SexState;
	readonly info: InfoState;
	readonly experienceLevels: ExperienceLevelsState;
	readonly races: RaceState;
	readonly cultures: CultureState;
	readonly professions: ProfessionState;
	readonly professionVariants: ProfessionVariantState;
	readonly abilities: AbilitiesState;
	readonly addEnergies: AddEnergiesState;
	readonly items: ItemsState;
	readonly history: HistoryState;
	readonly [id: string]: any;
}

const initialState = <HeroState>{
	// id: null,
	// name: '',
};

export default (state: HeroState = initialState, action: any): HeroState => {
	const validationResult = RequirementsReducer(state, action);
	const newState: HeroState = {
		id: state.id,
		name: state.name,
		phase: PhaseReducer(state.phase, action),
		ap: APReducer(state.ap, action, state, validationResult),
		avatar: AvatarReducer(state.avatar, action),
		sex: SexReducer(state.sex, action),
		info: InfoReducer(state.info, action),
		experienceLevels: ExperienceLevelsReducer(state.experienceLevels, action),
		races: RaceReducer(state.races, action),
		cultures: CultureReducer(state.cultures, action),
		professions: ProfessionReducer(state.professions, action),
		professionVariants: ProfessionVariantReducer(state.professionVariants, action),
		abilities: AbilitiesReducer(state.abilities, action, validationResult),
		addEnergies: AddEnergiesReducer(state.addEnergies, action),
		items: ItemsReducer(state.items, action),
		history: HistoryReducer(state.history, action)
	};

	const changed = Object.keys(newState).some((e: string) => newState[e] !== state[e]);

	if (changed) {
		return newState;
	}
	return state;
	// else if (action.type === ActionTypes.FETCH_CHARACTER_DATA) {
	// 	_updateAll(payload);
	// }
	// else if (action.type === ActionTypes.ASSIGN_RCP_ENTRIES) {
	// 	_assignRCP(payload.selections);
	// }
	// else if (action.type === ActionTypes.CLEAR_HERO || action.type === ActionTypes.CREATE_NEW_HERO) {
	// 	_assignRCP(payload.selections);
	// }
}
