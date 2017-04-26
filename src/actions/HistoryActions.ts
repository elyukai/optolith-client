import { AppDispatcher } from '../dispatcher/AppDispatcher';
import { HistoryStore } from '../stores/HistoryStore';
import { ActivateDisAdvAction, DeactivateDisAdvAction } from './DisAdvActions';
import { ActivateSpecialAbilityAction, DeactivateSpecialAbilityAction } from './SpecialAbilitiesActions';

export type UndoTriggerActions = ActivateDisAdvAction | DeactivateDisAdvAction | ActivateSpecialAbilityAction | DeactivateSpecialAbilityAction;

export function undoLastAction() {
	const lastAction = HistoryStore.getUndo();
	if (lastAction) {
		lastAction.undo = true;
		AppDispatcher.dispatch(lastAction);
	}
}
