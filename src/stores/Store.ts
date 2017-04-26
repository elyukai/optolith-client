import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

export class Store extends EventEmitter {
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
