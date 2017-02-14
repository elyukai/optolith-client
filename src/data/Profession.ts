/// <reference path="../data.d.ts" />

import { fixIDs } from '../utils/DataUtils';
import * as Categories from '../constants/Categories';
import Core from './CoreGenderExtended';

export default class Profession extends Core implements ProfessionInstance {
	readonly subname: string | { m: string, f: string };
	readonly ap: number;
	readonly dependencies: (string | number | boolean)[][];
	readonly requires: (string | number | boolean)[][];
	readonly selections: ProfessionSelections;
	readonly specialAbilities: (string | number | boolean)[][];
	readonly combatTechniques: (string | number)[][];
	readonly talents: (string | number)[][];
	readonly spells: (string | number)[][];
	readonly liturgies: (string | number)[][];
	readonly typicalAdvantages: string[];
	readonly typicalDisadvantages: string[];
	readonly untypicalAdvantages: string[];
	readonly untypicalDisadvantages: string[];
	readonly variants: string[];
	readonly category = Categories.PROFESSIONS;

	constructor({ subname, ap, pre_req, req, sel, sa, combattech, talents, spells, chants, typ_adv, typ_dadv, untyp_adv, untyp_dadv, vars, ...other }: RawProfession) {
		super(other);
		this.subname = subname;
		this.ap = ap;
		this.requires = pre_req;
		this.dependencies = req;
		this.selections = sel;

		this.specialAbilities = fixIDs<number | boolean>(sa, 'SA');
		this.combatTechniques = fixIDs<number>(combattech, 'CT');
		this.talents = fixIDs<number>(talents, 'TAL');
		this.spells = fixIDs<number>(spells, 'SPELL');
		this.liturgies = fixIDs<number>(chants, 'LITURGY');

		this.typicalAdvantages = typ_adv.map(e => `ADV_${e}`);
		this.typicalDisadvantages = typ_dadv.map(e => `DISADV_${e}`);
		this.untypicalAdvantages = untyp_adv.map(e => `ADV_${e}`);
		this.untypicalDisadvantages = untyp_dadv.map(e => `DISADV_${e}`);

		this.variants = vars.map(e => `PV_${e}`);
	}
}
