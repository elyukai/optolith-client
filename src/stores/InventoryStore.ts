import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import Item from '../data/Item';
import Store from './Store';

type Action = AddItemAction | RemoveItemAction | SetItemAction | SetItemsSortOrderAction | ReceiveDataTablesAction | ReceiveHeroDataAction;

let _itemsById: { [id: string]: ItemInstance } = {};
let _items: string[] = [];
let _itemTemplatesById: { [id: string]: ItemInstance } = {};
let _itemTemplates: string[] = [];
let _filterText = '';
let _sortOrder = 'name';
let _purse = {
	d: 0,
	s: 0,
	h: 0,
	k: 0
};

function _init(raw: { [id: string]: RawItem }) {
	for (const id in raw) {
		_itemTemplatesById[id] = new Item({ ...raw[id], amount: 1, isTemplateLocked: true });
		_itemTemplates.push(id);
	}
}

function _updateAll({ items, purse }: { items: { [id: string]: ItemInstance; }; purse: { d: number; s: number; h: number; k: number; }}) {
	for (const id in items) {
		_itemsById[id] = new Item({ ...items[id] });
		_items.push(id);
	}
	_purse = purse;
}

function _updateSortOrder(option: string) {
	_sortOrder = option;
}

function _addItem(raw: ItemInstance, id: string) {
	_itemsById[id] = new Item({ ...raw, id });
	_items.push(id);
}

function _saveItem(id: string, item: ItemInstance) {
	_itemsById[id] = new Item(item);
}

function _removeItem(id: string) {
	delete _itemsById[id];
	_items.some((e,i) => {
		if (e === id) {
			_items.splice(i, 1);
			return true;
		}
		return false;
	});
}

class InventoryStoreStatic extends Store {

	get(id: string) {
		return _itemsById[id];
	}

	getAll() {
		return _items.map(e => _itemsById[e]);
	}

	getAllById() {
		return _itemsById;
	}

	getTemplate(id: string) {
		return _itemTemplatesById[id];
	}

	getAllTemplates() {
		return _itemTemplates.map(e => _itemTemplatesById[e]);
	}

	getFilterText() {
		return _filterText;
	}

	getSortOrder() {
		return _sortOrder;
	}

	getPurse() {
		return _purse;
	}

}

const InventoryStore = new InventoryStoreStatic((action: Action) => {
	switch( action.type ) {
		case ActionTypes.SET_ITEMS_SORT_ORDER:
			_updateSortOrder(action.payload.sortOrder);
			break;

		case ActionTypes.ADD_ITEM:
			_addItem(action.payload.data, 'ITEM_' + (_items[_items.length - 1] ? _items[_items.length - 1].split('_')[1] + 1 : 1));
			break;

		case ActionTypes.SET_ITEM:
			_saveItem(action.payload.id, action.payload.data);
			break;

		case ActionTypes.REMOVE_ITEM:
			_removeItem(action.payload.id);
			break;

		case ActionTypes.RECEIVE_DATA_TABLES:
			_init(action.payload.data.items);
			break;

		case ActionTypes.RECEIVE_HERO_DATA:
			_updateAll(action.payload.data.inventory);
			break;

		default:
			return true;
	}

	InventoryStore.emitChange();
	return true;
});

export default InventoryStore;
