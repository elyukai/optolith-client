import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import createOverlay from '../utils/createOverlay';
import Dialog from '../components/Dialog';
import React from 'react';

export default {
	load: function() {
		AppDispatcher.dispatch({
			actionType: ActionTypes.LOAD_RAW_INGAME_DATA
		});
	},
	previousPhase: function(){
		AppDispatcher.dispatch({
			actionType: ActionTypes.INGAME_PREVIOUS_PHASE
		});
	},
	nextPhase: function(){
		AppDispatcher.dispatch({
			actionType: ActionTypes.INGAME_NEXT_PHASE
		});
	},
	cast: function(){
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_INGAME_CAST
		});
	},
	stopCast: function(){
		AppDispatcher.dispatch({
			actionType: ActionTypes.CANCEL_INGAME_CAST
		});
	},
	useEndurance: function(id){
		AppDispatcher.dispatch({
			actionType: ActionTypes.INGAME_USE_ENDURANCE,
			id
		});
	},
	useAction: function(id){
		AppDispatcher.dispatch({
			actionType: ActionTypes.INGAME_USE_ACTION,
			id
		});
	},
	useFreeAction: function(id){
		AppDispatcher.dispatch({
			actionType: ActionTypes.INGAME_USE_FREE_ACTION,
			id
		});
	},
	activateFighter: function(){
		AppDispatcher.dispatch({
			actionType: ActionTypes.INGAME_ACTIVATE_FIGHTER
		});
	},
	deactivateFighter: function(){
		AppDispatcher.dispatch({
			actionType: ActionTypes.INGAME_DEACTIVATE_FIGHTER
		});
	},
	edit: function(id){
		AppDispatcher.dispatch({
			actionType: ActionTypes.INGAME_EDIT_START,
			id
		});
	},
	editValue: function(tag, value){
		AppDispatcher.dispatch({
			actionType: ActionTypes.INGAME_EDIT_UPDATE_VALUE,
			tag,
			value
		});
	},
	editCast: function(value){
		AppDispatcher.dispatch({
			actionType: ActionTypes.INGAME_EDIT_UPDATE_CAST_VALUE,
			value
		});
	},
	editDuplicate: function(value){
		AppDispatcher.dispatch({
			actionType: ActionTypes.INGAME_EDIT_UPDATE_DUPLICATE_VALUE,
			value
		});
	},
	closeEdit: function(){
		AppDispatcher.dispatch({
			actionType: ActionTypes.INGAME_EDIT_END
		});
	},
	addFighter: function(){
		AppDispatcher.dispatch({
			actionType: ActionTypes.INGAME_ADD_FIGHTER
		});
	},
	duplicateFighter: function(){
		AppDispatcher.dispatch({
			actionType: ActionTypes.INGAME_DUPLICATE_FIGHTER
		});
	},
	removeFighter: function(){
		AppDispatcher.dispatch({
			actionType: ActionTypes.INGAME_REMOVE_FIGHTER
		});
	},
	resetAll: function(){
		const resetAllFinal = () =>	AppDispatcher.dispatch({ actionType: ActionTypes.INGAME_RESET_ALL });
		createOverlay(
			<Dialog
				title='Liste zurücksetzen'
				buttons={[
					{ label: 'Ja', onClick: resetAllFinal },
					{ label: 'Nein' }
				]}>
				Bist du dir sicher, dass du die gesamte Liste zurücksetzen möchtest? Der Vorgang kann nicht rückgängig gemacht werden!
			</Dialog>
		);
	},
	resetPhases: function(){
		AppDispatcher.dispatch({
			actionType: ActionTypes.INGAME_RESET_PHASES
		});
	},
	resetHealth: function(){
		AppDispatcher.dispatch({
			actionType: ActionTypes.INGAME_RESET_HEALTH
		});
	},
	setOnline: function(value){
		AppDispatcher.dispatch({
			actionType: ActionTypes.INGAME_UPDATE_ONLINE_LINK,
			value
		});
	},
	save: function(){
		AppDispatcher.dispatch({
			actionType: ActionTypes.INGAME_SAVE
		});
	},
	switchOption: function(option){
		AppDispatcher.dispatch({
			actionType: ActionTypes.INGAME_SWITCH_OPTION,
			option
		});
	}
};
