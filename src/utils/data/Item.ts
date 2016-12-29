import Core, { CoreArguments, CoreInstance } from './Core';

export interface ItemInstance extends CoreInstance {
	addpenalties: string;
	ammunition: string;
	at: string;
	combattechnique: string;
	damageBonus: string;
	damageDiceNumber: string;
	damageDiceSides: string;
	damageFlat: string;
	enc: string;
	gr: string;
	isTemplateLocked: boolean;
	length: string;
	number: string;
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
}

export interface ItemEditorInstance extends ItemInstance {
	range1?: string;
	range2?: string;
	range3?: string;
}

export interface ItemArguments extends CoreArguments {
	price: string;
	weight: string;
	number: string;
	where: string;
	gr: string;
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
	addpenalties: string;
	template: string;
	isTemplateLocked: boolean;
}

export interface ItemEditorArguments extends ItemArguments {
	range1?: string;
	range2?: string;
	range3?: string;
}

export default class Item extends Core implements ItemInstance {

	addpenalties: string;
	ammunition: string;
	at: string;
	combattechnique: string;
	damageBonus: string;
	damageDiceNumber: string;
	damageDiceSides: string;
	damageFlat: string;
	enc: string;
	gr: string;
	isTemplateLocked: boolean;
	length: string;
	number: string;
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

	static prepareDataForStore(target: ItemEditorArguments): ItemArguments {
		const newTarget = { ...target };
		newTarget.range = [];
		for (const name in newTarget) {
			const value = newTarget[name];
			switch (name) {
				case 'price':
				case 'weight':
					newTarget[name] = value ? (typeof value === 'number' ? value : parseInt(value.replace(',','.'))) : value;
					break;

				case 'number':
					newTarget[name] = value ? (typeof value === 'number' ? value : parseInt(value)) : value;
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
					newTarget[name] = value ? parseInt(value) : value;
					break;

				case 'range1':
					newTarget.range[0] = value;
					break;

				case 'range2':
					newTarget.range[1] = value;
					break;

				case 'range3':
					newTarget.range[2] = value;
					break;

				default:
					newTarget[name] = value;
			}
		}
		delete newTarget.range1;
		delete newTarget.range2;
		delete newTarget.range3;
		return newTarget;
	}

	static prepareDataForEditor(target: ItemInstance): ItemEditorInstance {
		let newTarget: ItemEditorInstance = { ...target };
		newTarget.range1 = newTarget.range[0];
		newTarget.range2 = newTarget.range[1];
		newTarget.range3 = newTarget.range[2];
		delete newTarget.range;
		return newTarget;
	}
}
