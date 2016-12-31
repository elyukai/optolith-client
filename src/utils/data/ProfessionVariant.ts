import Core, { CoreArguments, CoreInstance } from './Core';
import { fixIDs } from '../DataUtils';
import Categories from '../../constants/Categories';

export interface ProfessionVariantInstance extends CoreInstance {
	readonly name: string | { m: string, f: string };
	readonly ap: number;
	readonly reqs_p: (string | number | boolean)[][];
	readonly reqs: (string | number | boolean)[][];
	readonly sel: (string | string[] | number[])[][];
	readonly specialabilities: (string | number | boolean)[][];
	readonly combattechniques: (string | number)[][];
	readonly talents: (string | number)[][];
}

export interface ProfessionVariantArguments extends CoreArguments {
	ap: number;
	pre_req: (string | number | boolean)[][];
	req: (string | number | boolean)[][];
	sel: (string | string[] | number[])[][];
	sa: (string | number | boolean)[][];
	combattech: (string | number)[][];
	talents: (string | number)[][];
}

export default class ProfessionVariant extends Core implements ProfessionVariantInstance {

	readonly name: string | { m: string, f: string };
	readonly ap: number;
	readonly reqs_p: (string | number | boolean)[][];
	readonly reqs: (string | number | boolean)[][];
	readonly sel: (string | string[] | number[])[][];
	readonly specialabilities: (string | number | boolean)[][];
	readonly combattechniques: (string | number)[][];
	readonly talents: (string | number)[][];
	readonly category: string = Categories.PROFESSION_VARIANTS;
	
	constructor({ ap, pre_req, req, sel, sa, combattech, talents, ...args }: ProfessionVariantArguments) {
		super(args);

		this.ap = ap;

		this.reqs_p = pre_req;
		this.reqs = req;
		this.sel = sel;

		this.specialabilities = fixIDs<number | boolean>(sa, 'SA');
		this.combattechniques = fixIDs<number>(combattech, 'CT');
		this.talents = fixIDs<number>(talents, 'TAL');
	}
}
