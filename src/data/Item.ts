import Core from './Core';

export default class Item extends Core implements ItemInstance {

	addPenalties: boolean;
	ammunition: string | null;
	at: number;
	combatTechnique: string;
	damageBonus: number;
	damageDiceNumber: number;
	damageDiceSides: number;
	damageFlat: number;
	enc: number;
	gr: number;
	isTemplateLocked: boolean;
	length: number;
	amount: number;
	name: string;
	pa: number;
	price: number;
	pro: number;
	range: [number, number, number];
	reach: number;
	reloadTime: number;
	stp: number;
	template: string;
	weight: number;
	where: string;

	constructor(args: ItemInstance) {
		super(args);
		const {
			price,
			weight,
			amount,
			where,
			gr,
			combatTechnique,
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
			reloadTime,
			ammunition,
			pro,
			enc,
			addPenalties,
			template,
			isTemplateLocked
		} = args;

		this.price = price;
		this.weight = weight;
		this.amount = amount;
		this.gr = gr;

		this.combatTechnique = combatTechnique;
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
		this.reloadTime = reloadTime;
		this.ammunition = ammunition;
		this.pro = pro;
		this.enc = enc;
		this.addPenalties = addPenalties;

		this.where = where;
		this.template = template;
		this.isTemplateLocked = isTemplateLocked || true;
	}

	// static prepareDataForStore(target: ItemEditorInstance): ItemArguments {
	// 	const range = [];
	// 	for (const name in target) {
	// 		const value = target[name];
	// 		switch (name) {
	// 			case 'price':
	// 			case 'weight':
	// 				target[name] = value ? (typeof value === 'number' ? value : parseInt(value.replace(',','.'))) : value;
	// 				break;

	// 			case 'number':
	// 				target[name] = value ? (typeof value === 'number' ? value : parseInt(value)) : value;
	// 				break;

	// 			case 'damageDiceNumber':
	// 			case 'damageFlat':
	// 			case 'damageBonus':
	// 			case 'length':
	// 			case 'at':
	// 			case 'pa':
	// 			case 'stp':
	// 			case 'reloadtime':
	// 			case 'pro':
	// 			case 'enc':
	// 				target[name] = value ? parseInt(value) : value;
	// 				break;

	// 			case 'range1':
	// 				range[0] = value;
	// 				break;

	// 			case 'range2':
	// 				range[1] = value;
	// 				break;

	// 			case 'range3':
	// 				range[2] = value;
	// 				break;

	// 			default:
	// 				target[name] = value;
	// 		}
	// 	}
	// 	delete target.range1;
	// 	delete target.range2;
	// 	delete target.range3;
	// 	return { ...target, range };
	// }

	// static prepareDataForEditor(target: ItemInstance): ItemEditorInstance {
	// 	const newTarget: ItemInstance = { ...target };
	// 	const addTarget = {
	// 		range1: newTarget.range[0],
	// 		range2: newTarget.range[1],
	// 		range3: newTarget.range[2]
	// 	}
	// 	delete newTarget.range;
	// 	return { ...newTarget, ...addTarget };
	// }
}
