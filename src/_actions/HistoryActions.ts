import AppDispatcher from '../dispatcher/AppDispatcher';
import HistoryStore from '../stores/HistoryStore';

export default {
	undoLastAction(): void {
		const lastAction = HistoryStore.getUndo();
		lastAction.undoAction = true;
		AppDispatcher.dispatch(lastAction);
	}
};
