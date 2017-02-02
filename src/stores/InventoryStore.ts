import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import * as ActionTypes from '../constants/ActionTypes';
import Item from '../data/Item';

type Action = AddItemAction | RemoveItemAction | SetItemAction | SetItemsSortOrderAction | ReceiveDataTablesAction;

let _itemsById: { [id: string]: Item } = {
	ITEM_1: new Item({
		id: 'ITEM_1',
		name: 'Mörderstorchsäbel',
		price: '100',
		weight: '1.2',
		number: '1',
		where: 'Gürtel',
		gr: 1,
		combatTechnique: 'CT_12',
		damageDiceNumber: '1',
		damageDiceSides: '6',
		damageFlat: '6',
		damageBonus: '14',
		at: '-1',
		pa: '0',
		reach: '2',
		length: '76',
		stp: '0',
		range: ['0', '0', '0'],
		reloadTime: '0',
		ammunition: null,
		pro: '0',
		enc: '0',
		addPenalties: false,
		template: 'ITEMTPL_0'
	}),
	ITEM_2: new Item({
		id: 'ITEM_2',
		name: 'Bogen des Rakorium Muntagonus',
		price: '1234',
		weight: '0.9',
		number: '1',
		where: 'Fliegt',
		gr: 2,
		combatTechnique: 'CT_2',
		damageDiceNumber: '2',
		damageDiceSides: '6',
		damageFlat: '0',
		damageBonus: '0',
		at: '0',
		pa: '0',
		reach: '0',
		length: '123',
		stp: '0',
		range: ['90', '60', '90'],
		reloadTime: '1',
		ammunition: null,
		pro: '0',
		enc: '0',
		addPenalties: false,
		template: 'ITEMTPL_0'
	}),
	ITEM_3: new Item({
		id: 'ITEM_3',
		name: 'Rüstung des Widderhorns',
		price: '30',
		weight: '4',
		number: '1',
		where: '',
		gr: 3,
		combatTechnique: '',
		damageDiceNumber: '0',
		damageDiceSides: '6',
		damageFlat: '0',
		damageBonus: '0',
		at: '0',
		pa: '0',
		reach: '0',
		length: '123',
		stp: '0',
		range: ['90', '60', '90'],
		reloadTime: '1',
		ammunition: null,
		pro: '4',
		enc: '2',
		addPenalties: true,
		template: 'ITEMTPL_0'
	})
};
let _items = ['ITEM_1','ITEM_2','ITEM_3'];
let _itemTemplatesById: { [id: string]: Item } = {};
let _itemTemplates: string[] = [];
let _filterText = '';
let _sortOrder = 'name';

function _init(raw: { [id: string]: RawItem }) {
	for (const id in raw) {
		_itemTemplatesById[id] = new Item({ ...raw[id], isTemplateLocked: true });
		_itemTemplates.push(id);
	}
}

function _updateSortOrder(option: string) {
	_sortOrder = option;
}

function _addItem(raw: RawItem, id: string) {
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
	_itemsById[id] = new Item({ ...raw, id });
	_items.push(id);
}

function _saveItem(id: string, item: Item) {
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

}

const InventoryStore = new InventoryStoreStatic((action: Action) => {
	console.log(InventoryStore.constructor.name, InventoryStore.dispatchToken, action);

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

		default:
			return true;
	}

	InventoryStore.emitChange();

	return true;

});

export default InventoryStore;
