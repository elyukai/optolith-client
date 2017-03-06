import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import { initItem } from '../utils/InitUtils';
import Store from './Store';

type Action = AddItemAction | RemoveItemAction | SetItemAction | SetItemsSortOrderAction | ReceiveDataTablesAction | ReceiveHeroDataAction | SetDucatesAction | SetSilverthalersAction | SetHellersAction | SetKreutzersAction;

class EquipmentStoreStatic extends Store {
	private itemsById: { [id: string]: ItemInstance } = {};
	private items: string[] = [];
	private itemTemplatesById: { [id: string]: ItemInstance } = {};
	private itemTemplates: string[] = [];
	private filterText = '';
	private sortOrder = 'name';
	private purse = {
		d: '0',
		h: '0',
		k: '0',
		s: '0',
	};
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.SET_ITEMS_SORT_ORDER:
					this.updateSortOrder(action.payload.sortOrder);
					break;

				case ActionTypes.SET_DUCATES:
					this.purse.d = action.payload.value;
					break;

				case ActionTypes.SET_SILVERTHALERS:
					this.purse.s = action.payload.value;
					break;

				case ActionTypes.SET_HELLERS:
					this.purse.h = action.payload.value;
					break;

				case ActionTypes.SET_KREUTZERS:
					this.purse.k = action.payload.value;
					break;

				case ActionTypes.ADD_ITEM:
					this.addItem(action.payload.data, 'ITEM_' + (this.items[this.items.length - 1] ? this.items[this.items.length - 1].split('_')[1] + 1 : 1));
					break;

				case ActionTypes.SET_ITEM:
					this.saveItem(action.payload.id, action.payload.data);
					break;

				case ActionTypes.REMOVE_ITEM:
					this.removeItem(action.payload.id);
					break;

				case ActionTypes.RECEIVE_DATA_TABLES:
					this.init(action.payload.data.items);
					break;

				case ActionTypes.RECEIVE_HERO_DATA:
					this.updateAll(action.payload.data.belongings);
					break;

				default:
					return true;
			}
			this.emitChange();
			return true;
		});
	}

	get(id: string) {
		return this.itemsById[id];
	}

	getAll() {
		return this.items.map(e => this.itemsById[e]);
	}

	getAllById() {
		return this.itemsById;
	}

	getTemplate(id: string) {
		return this.itemTemplatesById[id];
	}

	getAllTemplates() {
		return this.itemTemplates.map(e => this.itemTemplatesById[e]);
	}

	getFilterText() {
		return this.filterText;
	}

	getSortOrder() {
		return this.sortOrder;
	}

	getPurse() {
		return this.purse;
	}

	private init(raw: { [id: string]: RawItem }) {
		for (const id in raw) {
			if (raw.hasOwnProperty(id)) {
				this.itemTemplatesById[id] = initItem({ ...raw[id], amount: 1, isTemplateLocked: true });
				this.itemTemplates.push(id);
			}
		}
	}

	private updateAll({ items, purse }: { items: { [id: string]: ItemInstance; }; purse: { d: string; s: string; h: string; k: string; }}) {
		for (const id in items) {
			if (items.hasOwnProperty(id)) {
				this.itemsById[id] = items[id];
				this.items.push(id);
			}
		}
		this.purse = purse;
	}

	private updateSortOrder(option: string) {
		this.sortOrder = option;
	}

	private addItem(raw: ItemInstance, id: string) {
		this.itemsById[id] = { ...raw, id };
		this.items.push(id);
	}

	private saveItem(id: string, item: ItemInstance) {
		this.itemsById[id] = item;
	}

	private removeItem(id: string) {
		delete this.itemsById[id];
		this.items.some((e, i) => {
			if (e === id) {
				this.items.splice(i, 1);
				return true;
			}
			return false;
		});
	}
}

const EquipmentStore = new EquipmentStoreStatic();

export default EquipmentStore;
