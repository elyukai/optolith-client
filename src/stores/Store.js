import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

export default class Store extends EventEmitter {
	
	emitChange() {
		this.emit(CHANGE_EVENT);
	}

	addChangeListener(callback) {
		this.on(CHANGE_EVENT, callback);
	}

	removeChangeListener(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}
}
