import Core from './Core';

export default class Item extends Core {
	
	constructor(args) {
		super(args);
		let {
			price,
			weight,
			gr,
			ct,
			ddn,
			dds,
			df,
			db,
			at,
			pa,
			re,
			length,
			stp,
			range,
			rt,
			am,
			pro,
			enc,
			addp
		} = args;

		this.price = price;
		this.weight = weight;
		this.gr = gr;
		
		this.combattechnique = ct;
		this.damageDiceNumber = ddn;
		this.damageDiceSides = dds;
		this.damageFlat = df;
		this.damageBonus = db;
		this.at = at;
		this.pa = pa;
		this.reach = re;
		this.length = length;
		this.stp = stp;
		this.range = range;
		this.reloadtime = rt;
		this.ammunition = am;
		this.pro = pro;
		this.enc = enc;
		this.addpenalties = addp;

		this.number = 1;
		this.where = '';
		this.template = 'ITEMTPL_0';
	}
}
