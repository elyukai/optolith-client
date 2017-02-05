import AppDispatcher from '../dispatcher/AppDispatcher';
import HistoryStore from '../stores/HistoryStore';

export default {
	undoLastAction() {
		const lastAction = HistoryStore.getUndo();
		lastAction.undoAction = true;
		AppDispatcher.dispatch(lastAction);
	}
};
