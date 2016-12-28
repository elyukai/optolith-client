import Core from './Core';

export default class Item extends Core {
	
	constructor(args) {
		super(args);
		let {
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

	static prepareDataForStore(target) {
		target.range = [];
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
					target.range[0] = value;
					break;

				case 'range2':
					target.range[1] = value;
					break;

				case 'range3':
					target.range[2] = value;
					break;

				default:
					target[name] = value;
			}
		}
		delete target.range1;
		delete target.range2;
		delete target.range3;
		return target;
	}

	static prepareDataForEditor(target) {
		let newTarget = { ...target };
		newTarget.range1 = newTarget.range[0];
		newTarget.range2 = newTarget.range[1];
		newTarget.range3 = newTarget.range[2];
		delete newTarget.range;
		return newTarget;
	}
}
