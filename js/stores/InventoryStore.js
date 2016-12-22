import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import ActionTypes from '../constants/ActionTypes';

var _itemsById = {};
var _items = [];
var _filterText = '';
var _sortOrder = 'name';

function _updateFilterText(text) {
	_filterText = text;
}

function _updateSortOrder(option) {
	_sortOrder = option;
}

class _InventoryStore extends Store {

	get(id) {
		return _itemsById[id];
	}

	getAll() {
		return _items.map(e => _itemsById[e]);
	}

	getFilterText() {
		return _filterText;
	}

	getSortOrder() {
		return _sortOrder;
	}

}

const InventoryStore = new _InventoryStore();

InventoryStore.dispatchToken = AppDispatcher.register(payload => {

	switch( payload.actionType ) {

		case ActionTypes.FILTER_ITEMS:
			_updateFilterText(payload.text);
			break;

		case ActionTypes.SORT_ITEMS:
			_updateSortOrder(payload.option);
			break;

		default:
			return true;
	}

	InventoryStore.emitChange();

	return true;

});

export default InventoryStore;
