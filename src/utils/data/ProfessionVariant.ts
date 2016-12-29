import Core, { CoreArguments, CoreInstance } from './Core';
import { fixIDs } from '../DataUtils';
import Categories from '../../constants/Categories';

export interface ProfessionVariantInstance extends CoreInstance {
	readonly ap: number;
	readonly languages: number[];
	readonly scripts: number[];
	readonly social: number[];
	readonly typ_prof: string[];
	readonly typ_adv: string[];
	readonly typ_dadv: string[];
	readonly untyp_adv: string[];
	readonly untyp_dadv: string[];
	readonly typ_talents: string[];
	readonly untyp_talents: string[];
	readonly talents: string[];
	readonly category: string;
}

export interface ProfessionVariantArguments extends CoreArguments {
	ap: number;
	lang: number[];
	literacy: number[];
	social: number[];
	typ_prof: string[];
	typ_adv: string[];
	typ_dadv: string[];
	untyp_adv: string[];
	untyp_dadv: string[];
	typ_talents: string[];
	untyp_talents: string[];
	talents: string[];
}

export default class ProfessionVariant extends Core implements ProfessionVariantInstance {
	
	constructor(args: ProfessionVariantArguments) {
		super(args);
		let {
			ap,
			pre_req,
			req,
			sel,
			sa,
			combattech,
			talents
		} = args;

		this.ap = ap;

		this.reqs_p = pre_req;
		this.reqs = req;
		this.sel = sel;

		this.specialabilities = fixIDs(sa, 'SA');
		this.combattechniques = fixIDs(combattech, 'CT');
		this.talents = fixIDs(talents, 'TAL');

		this.category = Categories.PROFESSION_VARIANTS;
	}
}
