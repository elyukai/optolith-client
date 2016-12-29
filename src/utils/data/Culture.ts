import Core, { CoreArguments, CoreInstance } from './Core';
import { fixIDs } from '../DataUtils';
import Categories from '../../constants/Categories';

export interface CultureInstance extends CoreInstance {
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
	readonly talents: (string | number)[][];
	readonly category: string;
}

export interface CultureArguments extends CoreArguments {
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
	talents: (string | number)[][];
}

export default class Culture extends Core implements CultureInstance {

	static socialstatus = [ 'Unfrei', 'Frei', 'Niederadel', 'Adel', 'Hochadel' ];
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
	readonly talents: (string | number)[][];
	readonly category: string = Categories.CULTURES;
	
	constructor({ ap, lang, literacy, social, typ_prof, typ_adv, typ_dadv, untyp_adv, untyp_dadv, typ_talents, untyp_talents, talents, ...args }: CultureArguments) {
		super(args);

		this.ap = ap;

		this.languages = lang;
		this.scripts = literacy;
		this.social = social;
		
		this.typ_prof = typ_prof.map(e => `P_${e}`);

		this.typ_adv = typ_adv.map(e => `ADV_${e}`);
		this.typ_dadv = typ_dadv.map(e => `DISADV_${e}`);
		this.untyp_adv = untyp_adv.map(e => `ADV_${e}`);
		this.untyp_dadv = untyp_dadv.map(e => `DISADV_${e}`);

		this.typ_talents = typ_talents.map(e => `TAL_${e}`);
		this.untyp_talents = untyp_talents.map(e => `TAL_${e}`);
		this.talents = fixIDs<number>(talents, 'TAL');
	}
}
