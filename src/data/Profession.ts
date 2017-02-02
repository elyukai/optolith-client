/// <reference path="../data.d.ts" />

import { fixIDs } from '../utils/DataUtils';
import * as Categories from '../constants/Categories';

export default class Profession {
	readonly id: string;
	readonly name: string | { m: string, f: string };
	readonly subname: string | { m: string, f: string };
	readonly ap: number;
	readonly reqsPre: (string | number | boolean)[][];
	readonly reqs: (string | number | boolean)[][];
	readonly sel: (string | string[] | number[])[][];
	readonly specialabilities: (string | number | boolean)[][];
	readonly combattechniques: (string | number)[][];
	readonly talents: (string | number)[][];
	readonly spells: (string | number)[][];
	readonly liturgies: (string | number)[][];
	readonly typAdv: string[];
	readonly typDadv: string[];
	readonly untypAdv: string[];
	readonly untypDadv: string[];
	readonly variants: string[];
	readonly category = Categories.PROFESSIONS;

	constructor({ id, name, subname, ap, pre_req, req, sel, sa, combattech, talents, spells, chants, typ_adv, typ_dadv, untyp_adv, untyp_dadv, vars }: RawProfession) {
		this.id = id;
		this.name = name;
		this.subname = subname;
		this.ap = ap;
		this.reqsPre = pre_req;
		this.reqs = req;
		this.sel = sel.map(e => {
			if (e[0] === 'ct') {
				e[3] = e[3].split(',').map(e => `CT_${e}`);
				return e;
			}
			else if (e[0] === 'cantrips' && typeof e[2] === 'string') {
				e[2] = e[2].split(',').map(e => parseInt(e));
				return e;
			}
		});

		this.specialabilities = fixIDs<number | boolean>(sa, 'SA');
		this.combattechniques = fixIDs<number>(combattech, 'CT');
		this.talents = fixIDs<number>(talents, 'TAL');
		this.spells = fixIDs<number>(spells, 'SPELL');
		this.liturgies = fixIDs<number>(chants, 'LITURGY');

		this.typAdv = typ_adv.map(e => `ADV_${e}`);
		this.typDadv = typ_dadv.map(e => `DISADV_${e}`);
		this.untypAdv = untyp_adv.map(e => `ADV_${e}`);
		this.untypDadv = untyp_dadv.map(e => `DISADV_${e}`);

		this.variants = vars.map(e => `PV_${e}`);
	}
}
