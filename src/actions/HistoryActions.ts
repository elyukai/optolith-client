import AppDispatcher from '../dispatcher/AppDispatcher';
import HistoryStore from '../stores/HistoryStore';

export function undoLastAction() {
	const lastAction = HistoryStore.getUndo() as DefaultAction;
	if (lastAction) {
		lastAction.undo = true;
		AppDispatcher.dispatch(lastAction);
	}
}
