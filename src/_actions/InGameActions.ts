import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	load(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.LOAD_RAW_INGAME_DATA
		});
	},
	previousPhase(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_PREVIOUS_PHASE
		});
	},
	nextPhase(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_NEXT_PHASE
		});
	},
	cast(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_INGAME_CAST
		});
	},
	stopCast(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.CANCEL_INGAME_CAST
		});
	},
	useEndurance(id: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_USE_ENDURANCE,
			id
		});
	},
	useAction(id: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_USE_ACTION,
			id
		});
	},
	useFreeAction(id: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_USE_FREE_ACTION,
			id
		});
	},
	activateFighter(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_ACTIVATE_FIGHTER
		});
	},
	deactivateFighter(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_DEACTIVATE_FIGHTER
		});
	},
	edit(id: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_EDIT_START,
			id
		});
	},
	editValue(tag: string, value: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_EDIT_UPDATE_VALUE,
			tag,
			value
		});
	},
	editCast(value: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_EDIT_UPDATE_CAST_VALUE,
			value
		});
	},
	editDuplicate(value: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_EDIT_UPDATE_DUPLICATE_VALUE,
			value
		});
	},
	closeEdit(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_EDIT_END
		});
	},
	addFighter(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_ADD_FIGHTER
		});
	},
	duplicateFighter(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_DUPLICATE_FIGHTER
		});
	},
	removeFighter(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_REMOVE_FIGHTER
		});
	},
	resetAll(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_RESET_ALL
		});
	},
	resetPhases(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_RESET_PHASES
		});
	},
	resetHealth(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_RESET_HEALTH
		});
	},
	setOnline(value){
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_UPDATE_ONLINE_LINK,
			value
		});
	},
	save(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_SAVE
		});
	},
	switchOption(option){
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_SWITCH_OPTION,
			option
		});
	}
};
