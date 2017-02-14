import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	load() {
		AppDispatcher.dispatch({
			type: ActionTypes.LOAD_RAW_INGAME_DATA
		});
	},
	previousPhase() {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_PREVIOUS_PHASE
		});
	},
	nextPhase() {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_NEXT_PHASE
		});
	},
	cast() {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_INGAME_CAST
		});
	},
	stopCast() {
		AppDispatcher.dispatch({
			type: ActionTypes.CANCEL_INGAME_CAST
		});
	},
	useEndurance(id: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_USE_ENDURANCE,
			id
		});
	},
	useAction(id: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_USE_ACTION,
			id
		});
	},
	useFreeAction(id: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_USE_FREE_ACTION,
			id
		});
	},
	activateFighter() {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_ACTIVATE_FIGHTER
		});
	},
	deactivateFighter() {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_DEACTIVATE_FIGHTER
		});
	},
	edit(id: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_EDIT_START,
			id
		});
	},
	editValue(tag: string, value: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_EDIT_UPDATE_VALUE,
			tag,
			value
		});
	},
	editCast(value: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_EDIT_UPDATE_CAST_VALUE,
			value
		});
	},
	editDuplicate(value: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_EDIT_UPDATE_DUPLICATE_VALUE,
			value
		});
	},
	closeEdit() {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_EDIT_END
		});
	},
	addFighter() {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_ADD_FIGHTER
		});
	},
	duplicateFighter() {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_DUPLICATE_FIGHTER
		});
	},
	removeFighter() {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_REMOVE_FIGHTER
		});
	},
	resetAll() {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_RESET_ALL
		});
	},
	resetPhases() {
		AppDispatcher.dispatch({
			type: ActionTypes.INGAME_RESET_PHASES
		});
	},
	resetHealth() {
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
	save() {
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
