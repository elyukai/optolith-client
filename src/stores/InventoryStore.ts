import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import ActionTypes from '../constants/ActionTypes';
import { Item } from '../utils/DataUtils';

var _itemsById = {
	ITEM_1: new Item({
		id: 'ITEM_1',
		name: 'Mörderstorchsäbel',
		price: 100,
		weight: 1.2,
		number: 1,
		where: 'Gürtel',
		gr: 1,
		combattechnique: 'CT_12',
		damageDiceNumber: 1,
		damageDiceSides: 6,
		damageFlat: 6,
		damageBonus: 14,
		at: -1,
		pa: 0,
		reach: 2,
		length: 76,
		stp: 0,
		range: [0, 0, 0],
		reloadtime: 0,
		ammunition: null,
		pro: 0,
		enc: 0,
		addpenalties: false
	}),
	ITEM_2: new Item({
		id: 'ITEM_2',
		name: 'Bogen des Rakorium Muntagonus',
		price: 1234,
		weight: 0.9,
		number: 1,
		where: 'Fliegt',
		gr: 2,
		combattechnique: 'CT_2',
		damageDiceNumber: 2,
		damageDiceSides: 6,
		damageFlat: 0,
		damageBonus: 0,
		at: 0,
		pa: 0,
		reach: 0,
		length: 123,
		stp: 0,
		range: [90, 60, 90],
		reloadtime: 1,
		ammunition: null,
		pro: 0,
		enc: 0,
		addpenalties: false
	}),
	ITEM_3: new Item({
		id: 'ITEM_3',
		name: 'Rüstung des Widderhorns',
		price: 30,
		weight: 4,
		number: 1,
		where: '',
		gr: 3,
		combattechnique: '',
		damageDiceNumber: 0,
		damageDiceSides: 6,
		damageFlat: 0,
		damageBonus: 0,
		at: 0,
		pa: 0,
		reach: 0,
		length: 123,
		stp: 0,
		range: [90, 60, 90],
		reloadtime: 1,
		ammunition: null,
		pro: 4,
		enc: 2,
		addpenalties: true
	})
};
var _items = ['ITEM_1','ITEM_2','ITEM_3'];
var _itemTemplatesById = {};
var _itemTemplates = [];
var _filterText = '';
var _sortOrder = 'name';

function _init(raw) {
	for (const id in raw) {
		_itemTemplatesById[id] = new Item({ ...raw[id], isTemplateLocked: true });
		_itemTemplates.push(id);
	}
}

function _updateFilterText(text) {
	_filterText = text;
}

function _updateSortOrder(option) {
	_sortOrder = option;
}

function _addItem(raw, id) {
	// if ([1,2].includes(data.gr)) {
	// 	data.ddn = parseInt(data.ddn) || 0;
	// 	data.df = parseInt(data.df) || 0;
	// 	data.length = parseInt(data.length) || 0;
	// }
	// if (data.gr === 1) {
	// 	data.db = parseInt(data.db) || 0;
	// 	data.at = parseInt(data.at) || 0;
	// 	data.pa = parseInt(data.pa) || 0;
	// 	data.reach = parseInt(data.reach) || 0;
	// 	data.stp = parseInt(data.stp) || 0;
	// }
	// else if (data.gr === 2) {
	// 	data.rb1 = parseInt(data.rb1) || 0;
	// 	data.rb2 = parseInt(data.rb2) || 0;
	// 	data.rb3 = parseInt(data.rb3) || 0;
	// 	data.range = [ data.rb1, data.rb2, data.rb3 ];
	// 	data.rt = parseInt(data.rt) || 0;
	// }
	// else if (data.gr === 3) {
	// 	data.pro = parseInt(data.pro) || 0;
	// 	data.enc = parseInt(data.enc) || 0;
	// }
	_itemsById[id] = new Item({ ...Item.prepareDataForStore(raw), id });
	_items.push(id);
}

function _saveItem(raw) {
	_itemsById[raw.id] = new Item(Item.prepareDataForStore(raw));
}

function _removeItem(id) {
	delete _itemsById[id];
	_items.some((e,i) => {
		if (e === id) {
			_items.splice(i, 1);
			return true;
		}
		return false;
	});
}

class _InventoryStore extends Store {

	get(id) {
		return _itemsById[id];
	}

	getAll() {
		return _items.map(e => _itemsById[e]);
	}

	getTemplate(id) {
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

	getForEditor(id) {
		return Item.prepareDataForEditor(_itemsById[id]);
	}

}

const InventoryStore = new _InventoryStore();

InventoryStore.dispatchToken = AppDispatcher.register(payload => {

	switch( payload.type ) {

		case ActionTypes.FILTER_ITEMS:
			_updateFilterText(payload.text);
			break;

		case ActionTypes.SORT_ITEMS:
			_updateSortOrder(payload.option);
			break;

		case ActionTypes.ADD_ITEM:
			_addItem(payload.item, 'ITEM_' + (_items[_items.length - 1] ? _items[_items.length - 1].split('_')[1] + 1 : 1));
			break;

		case ActionTypes.SAVE_ITEM:
			_saveItem(payload.item);
			break;

		case ActionTypes.REMOVE_ITEM:
			_removeItem(payload.id);
			break;

		case ActionTypes.RECEIVE_RAW_LISTS:
			_init(payload.items);
			break;

		default:
			return true;
	}

	InventoryStore.emitChange();

	return true;

});

export default InventoryStore;
