import Core from './Core';
import { fixIDs } from '../DataUtils';
import dice from '../dice';
import Categories from '../../constants/Categories';

export default class Race extends Core {
	
	constructor(args) {
		super(args);
		let {
			ap,
			le,
			sk,
			zk,
			gs,
			attr,
			attr_sel,
			typ_cultures,
			auto_adv,
			imp_adv,
			imp_dadv,
			typ_adv,
			typ_dadv,
			untyp_adv,
			untyp_dadv,
			hair,
			eyes,
			size,
			weight
		} = args;

		this.ap = ap;

		this.lp = le;
		this.spi = sk;
		this.tou = zk;
		this.mov = gs;
		
		this.attr = fixIDs(attr, 'ATTR', 1);
		attr_sel[1] = attr_sel[1].map(k => `ATTR_${k}`);
		this.attr_sel = attr_sel;

		this.typ_cultures = typ_cultures.map(e => `C_${e}`);

		this.auto_adv = fixIDs(auto_adv, 'ADV');
		this.imp_adv = fixIDs(imp_adv, 'ADV');
		this.imp_dadv = fixIDs(imp_dadv, 'DISADV');

		this.typ_adv = typ_adv.map(e => `ADV_${e}`);
		this.typ_dadv = typ_dadv.map(e => `DISADV_${e}`);
		this.untyp_adv = untyp_adv.map(e => `ADV_${e}`);
		this.untyp_dadv = untyp_dadv.map(e => `DISADV_${e}`);

		this.haircolors = hair;
		this.eyecolors = eyes;
		this.size = size;
		this.weight = weight;

		this.category = Categories.RACES;
	}

	static haircolors = [ 'blauschwarz', 'blond', 'braun', 'dunkelblond', 'dunkelbraun', 'goldblond', 'grau', 'hellblond', 'hellbraun', 'kupferrot', 'mittelblond', 'mittelbraun', 'rot', 'rotblond', 'schneeweiß', 'schwarz', 'silbern', 'weißblond', 'dunkelgrau', 'hellgrau', 'salzweiß', 'silberweiß', 'feuerrot' ];

	static rerollHaircolor(current) {
		const result = dice(20);
		return current.haircolors[result - 1];
	}

	static eyecolors = [ 'amethystviolett', 'bernsteinfarben', 'blau', 'braun', 'dunkelbraun', 'dunkelviolett', 'eisgrau', 'goldgesprenkelt', 'grau', 'graublau', 'grün', 'hellbraun', 'rubinrot', 'saphirblau', 'schwarz', 'schwarzbraun', 'silbergrau', 'smaragdgrün' ];

	static rerollEyecolor(current) {
		const result = dice(20);
		return current.eyecolors[result - 1];
	}

	static rerollSize(current) {
		const [ base, ...dices ] = current.size;
		let arr = [];
		dices.forEach(e => {
			let elements = Array.from({ length: e[0] }, () => e[1]);
			arr.push(...elements);
		});
		return base + arr.map(e => dice(e)).reduce((a,b) => a + b, 0);
	}

	static rerollWeight(current, size) {
		const { id, weight } = current;
		const [ base, ...dices ] = weight;
		let arr = [];
		dices.forEach(e => {
			let elements = Array.from({ length: e[0] }, () => e[1]);
			arr.push(...elements);
		});
		size = size || this.rerollSize(current);
		let add = ['R_1','R_2','R_3','R_4','R_5','R_6','R_7'].includes(id) ?
			arr.map(e => {
				let result = dice(Math.abs(e));
				return result % 2 > 0 ? -result : result;
			}) :
			arr.map(e => {
				let result = dice(Math.abs(e));
				return e < 0 ? -result : result;
			});
		return size + base + add.reduce((a,b) => a + b, 0);
	}
}
