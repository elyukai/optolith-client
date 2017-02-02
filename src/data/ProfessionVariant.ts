import { fixIDs } from '../utils/DataUtils';
import * as Categories from '../constants/Categories';

export default class ProfessionVariant {
	readonly id: string;
	readonly name: string | { m: string, f: string };
	readonly ap: number;
	readonly reqsPre: (string | number | boolean)[][];
	readonly reqs: (string | number | boolean)[][];
	readonly sel: (string | string[] | number[])[][];
	readonly specialabilities: (string | number | boolean)[][];
	readonly combattechniques: (string | number)[][];
	readonly talents: (string | number)[][];
	readonly category: string = Categories.PROFESSION_VARIANTS;

	constructor({ id, name, ap, pre_req, req, sel, sa, combattech, talents }: RawProfessionVariant) {
		this.id = id;
		this.name = name;
		this.ap = ap;

		this.reqsPre = pre_req;
		this.reqs = req;
		this.sel = sel;

		this.specialabilities = fixIDs<number | boolean>(sa, 'SA');
		this.combattechniques = fixIDs<number>(combattech, 'CT');
		this.talents = fixIDs<number>(talents, 'TAL');
	}
}
