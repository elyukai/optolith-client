import Core, { CoreArguments, CoreInstance } from './Core';

interface ItemInstanceCore extends CoreInstance {
	addpenalties: boolean;
	ammunition: string;
	at: string;
	combattechnique: string;
	damageBonus: string;
	damageDiceNumber: string;
	damageDiceSides: string;
	damageFlat: string;
	enc: string;
	gr: number;
	isTemplateLocked: boolean;
	length: string;
	name: string;
	number: string;
	pa: string;
	price: string;
	pro: string;
	reach: string;
	reloadtime: string;
	stp: string;
	template: string;
	weight: string;
	where: string;
}

export interface ItemInstance extends ItemInstanceCore {
	range: string[];
}

export interface ItemEditorInstance extends ItemInstanceCore {
	range1?: string;
	range2?: string;
	range3?: string;
}

export interface ItemArguments extends CoreArguments {
	name: string;
	price: string;
	weight: string;
	number: string;
	where: string;
	gr: number;
	combattechnique: string;
	damageDiceNumber: string;
	damageDiceSides: string;
	damageFlat: string;
	damageBonus: string;
	at: string;
	pa: string;
	reach: string;
	length: string;
	stp: string;
	range: string[];
	reloadtime: string;
	ammunition: string;
	pro: string;
	enc: string;
	addpenalties: boolean;
	template: string;
	isTemplateLocked: boolean;
}

export interface ItemEditorArguments extends ItemArguments {
	range1?: string;
	range2?: string;
	range3?: string;
}

export default class Item extends Core implements ItemInstance {

	addpenalties: boolean;
	ammunition: string;
	at: string;
	combattechnique: string;
	damageBonus: string;
	damageDiceNumber: string;
	damageDiceSides: string;
	damageFlat: string;
	enc: string;
	gr: number;
	isTemplateLocked: boolean;
	length: string;
	number: string;
	name: string;
	pa: string;
	price: string;
	pro: string;
	range: string[];
	reach: string;
	reloadtime: string;
	stp: string;
	template: string;
	weight: string;
	where: string;
	
	constructor(args: ItemArguments) {
		super(args);
		const {
			price,
			weight,
			number,
			where,
			gr,
			combattechnique,
			damageDiceNumber,
			damageDiceSides,
			damageFlat,
			damageBonus,
			at,
			pa,
			reach,
			length,
			stp,
			range,
			reloadtime,
			ammunition,
			pro,
			enc,
			addpenalties,
			template,
			isTemplateLocked
		} = args;

		this.price = price;
		this.weight = weight;
		this.number = number;
		this.gr = gr;
		
		this.combattechnique = combattechnique;
		this.damageDiceNumber = damageDiceNumber;
		this.damageDiceSides = damageDiceSides;
		this.damageFlat = damageFlat;
		this.damageBonus = damageBonus;
		this.at = at;
		this.pa = pa;
		this.reach = reach;
		this.length = length;
		this.stp = stp;
		this.range = range;
		this.reloadtime = reloadtime;
		this.ammunition = ammunition;
		this.pro = pro;
		this.enc = enc;
		this.addpenalties = addpenalties;

		this.where = where;
		this.template = template;
		this.isTemplateLocked = isTemplateLocked || false;
	}

	static prepareDataForStore(target: ItemEditorInstance): ItemArguments {
		const range = [];
		for (const name in target) {
			const value = target[name];
			switch (name) {
				case 'price':
				case 'weight':
					target[name] = value ? (typeof value === 'number' ? value : parseInt(value.replace(',','.'))) : value;
					break;

				case 'number':
					target[name] = value ? (typeof value === 'number' ? value : parseInt(value)) : value;
					break;

				case 'damageDiceNumber':
				case 'damageFlat':
				case 'damageBonus':
				case 'length':
				case 'at':
				case 'pa':
				case 'stp':
				case 'reloadtime':
				case 'pro':
				case 'enc':
					target[name] = value ? parseInt(value) : value;
					break;

				case 'range1':
					range[0] = value;
					break;

				case 'range2':
					range[1] = value;
					break;

				case 'range3':
					range[2] = value;
					break;

				default:
					target[name] = value;
			}
		}
		delete target.range1;
		delete target.range2;
		delete target.range3;
		return { ...target, range };
	}

	static prepareDataForEditor(target: ItemInstance): ItemEditorInstance {
		const newTarget: ItemInstance = { ...target };
		const addTarget = {
			range1: newTarget.range[0],
			range2: newTarget.range[1],
			range3: newTarget.range[2]
		}
		delete newTarget.range;
		return { ...newTarget, ...addTarget };
	}
}
