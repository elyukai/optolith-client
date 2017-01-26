/// <reference path="../data.d.ts" />

import Core, { CoreArguments, CoreInstance } from './Core';
import { fixIDs } from '../utils/DataUtils';
import * as Categories from '../constants/Categories';

export interface ProfessionArguments extends CoreArguments {
	subname: string | { m: string, f: string };
	ap: number;
	pre_req: (string | number | boolean)[][];
	req: (string | number | boolean)[][];
	sel: [string, number | string, string | number, string][];
	sa: (string | number | boolean)[][];
	combattech: (string | number)[][];
	talents: (string | number)[][];
	spells: (string | number)[][];
	chants: (string | number)[][];
	typ_adv: string[];
	typ_dadv: string[];
	untyp_adv: string[];
	untyp_dadv: string[];
	vars: string[];
}

export default class Profession implements Profession {

	readonly id: string;
	readonly name: string | { m: string, f: string };
	readonly subname: string | { m: string, f: string };
	readonly ap: number;
	readonly reqs_p: (string | number | boolean)[][];
	readonly reqs: (string | number | boolean)[][];
	readonly sel: (string | string[] | number[])[][];
	readonly specialabilities: (string | number | boolean)[][];
	readonly combattechniques: (string | number)[][];
	readonly talents: (string | number)[][];
	readonly spells: (string | number)[][];
	readonly liturgies: (string | number)[][];
	readonly typ_adv: string[];
	readonly typ_dadv: string[];
	readonly untyp_adv: string[];
	readonly untyp_dadv: string[];
	readonly variants: string[];
	readonly category = Categories.PROFESSIONS;

	constructor({ id, name, subname, ap, pre_req, req, sel, sa, combattech, talents, spells, chants, typ_adv, typ_dadv, untyp_adv, untyp_dadv, vars, ...args }: ProfessionArguments) {
		this.id = id;
		this.name = name;
		this.subname = subname;
		this.ap = ap;
		this.reqs_p = pre_req;
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

		this.typ_adv = typ_adv.map(e => `ADV_${e}`);
		this.typ_dadv = typ_dadv.map(e => `DISADV_${e}`);
		this.untyp_adv = untyp_adv.map(e => `ADV_${e}`);
		this.untyp_dadv = untyp_dadv.map(e => `DISADV_${e}`);

		this.variants = vars.map(e => `PV_${e}`);
	}
}
