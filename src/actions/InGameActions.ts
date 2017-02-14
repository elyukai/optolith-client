import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export function load() {
	AppDispatcher.dispatch({
		type: ActionTypes.LOAD_RAW_INGAME_DATA
	});
}

export function previousPhase() {
	AppDispatcher.dispatch({
		type: ActionTypes.INGAME_PREVIOUS_PHASE
	});
}

export function nextPhase() {
	AppDispatcher.dispatch({
		type: ActionTypes.INGAME_NEXT_PHASE
	});
}

export function cast() {
	AppDispatcher.dispatch({
		type: ActionTypes.UPDATE_INGAME_CAST
	});
}

export function stopCast() {
	AppDispatcher.dispatch({
		type: ActionTypes.CANCEL_INGAME_CAST
	});
}

export function useEndurance(id: string) {
	AppDispatcher.dispatch({
		type: ActionTypes.INGAME_USE_ENDURANCE,
		id
	});
}

export function useAction(id: string) {
	AppDispatcher.dispatch({
		type: ActionTypes.INGAME_USE_ACTION,
		id
	});
}

export function useFreeAction(id: string) {
	AppDispatcher.dispatch({
		type: ActionTypes.INGAME_USE_FREE_ACTION,
		id
	});
}

export function activateFighter() {
	AppDispatcher.dispatch({
		type: ActionTypes.INGAME_ACTIVATE_FIGHTER
	});
}

export function deactivateFighter() {
	AppDispatcher.dispatch({
		type: ActionTypes.INGAME_DEACTIVATE_FIGHTER
	});
}

export function edit(id: string) {
	AppDispatcher.dispatch({
		type: ActionTypes.INGAME_EDIT_START,
		id
	});
}

export function editValue(tag: string, value: string) {
	AppDispatcher.dispatch({
		type: ActionTypes.INGAME_EDIT_UPDATE_VALUE,
		tag,
		value
	});
}

export function editCast(value: string) {
	AppDispatcher.dispatch({
		type: ActionTypes.INGAME_EDIT_UPDATE_CAST_VALUE,
		value
	});
}

export function editDuplicate(value: string) {
	AppDispatcher.dispatch({
		type: ActionTypes.INGAME_EDIT_UPDATE_DUPLICATE_VALUE,
		value
	});
}

export function closeEdit() {
	AppDispatcher.dispatch({
		type: ActionTypes.INGAME_EDIT_END
	});
}

export function addFighter() {
	AppDispatcher.dispatch({
		type: ActionTypes.INGAME_ADD_FIGHTER
	});
}

export function duplicateFighter() {
	AppDispatcher.dispatch({
		type: ActionTypes.INGAME_DUPLICATE_FIGHTER
	});
}

export function removeFighter() {
	AppDispatcher.dispatch({
		type: ActionTypes.INGAME_REMOVE_FIGHTER
	});
}

export function resetAll() {
	AppDispatcher.dispatch({
		type: ActionTypes.INGAME_RESET_ALL
	});
}

export function resetPhases() {
	AppDispatcher.dispatch({
		type: ActionTypes.INGAME_RESET_PHASES
	});
}

export function resetHealth() {
	AppDispatcher.dispatch({
		type: ActionTypes.INGAME_RESET_HEALTH
	});
}

export function setOnline(value: string) {
	AppDispatcher.dispatch({
		type: ActionTypes.INGAME_UPDATE_ONLINE_LINK,
		value
	});
}

export function save() {
	AppDispatcher.dispatch({
		type: ActionTypes.INGAME_SAVE
	});
}

export function switchOption(option: boolean) {
	AppDispatcher.dispatch({
		type: ActionTypes.INGAME_SWITCH_OPTION,
		option
	});
}
