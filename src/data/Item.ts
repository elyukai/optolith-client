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
		this.isTemplateLocked = typeof isTemplateLocked === 'boolean' ? isTemplateLocked : true;
	}
}
