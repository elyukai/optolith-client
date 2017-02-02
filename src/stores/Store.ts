import { EventEmitter } from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';

const CHANGE_EVENT = 'change';

export default class Store extends EventEmitter {
	readonly dispatchToken: string;

	constructor(callback?: (action: any) => true) {
		super();
		if (callback) {
			this.dispatchToken = AppDispatcher.register(callback);
		}
	}

	emitChange() {
		this.emit(CHANGE_EVENT);
	}

	addChangeListener(callback: () => void) {
		this.on(CHANGE_EVENT, callback);
	}

	removeChangeListener(callback: () => void) {
		this.removeListener(CHANGE_EVENT, callback);
	}
}
