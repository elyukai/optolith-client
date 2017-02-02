import Core from './Core';
import { fixIDs } from '../utils/DataUtils';
import * as Categories from '../constants/Categories';

export default class Culture extends Core {
	static socialstatus = [ 'Unfrei', 'Frei', 'Niederadel', 'Adel', 'Hochadel' ];
	readonly ap: number;
	readonly languages: number[];
	readonly scripts: number[];
	readonly social: number[];
	readonly typProf: string[];
	readonly typAdv: string[];
	readonly typDadv: string[];
	readonly untypAdv: string[];
	readonly untypDadv: string[];
	readonly typTalents: string[];
	readonly untypTalents: string[];
	readonly talents: (string | number)[][];
	readonly category: string = Categories.CULTURES;

	constructor({ ap, lang, literacy, social, typ_prof, typ_adv, typ_dadv, untyp_adv, untyp_dadv, typ_talents, untyp_talents, talents, ...args }: RawCulture) {
		super(args);

		this.ap = ap;

		this.languages = lang;
		this.scripts = literacy;
		this.social = social;

		this.typProf = typ_prof.map(e => `P_${e}`);

		this.typAdv = typ_adv.map(e => `ADV_${e}`);
		this.typDadv = typ_dadv.map(e => `DISADV_${e}`);
		this.untypAdv = untyp_adv.map(e => `ADV_${e}`);
		this.untypDadv = untyp_dadv.map(e => `DISADV_${e}`);

		this.typTalents = typ_talents.map(e => `TAL_${e}`);
		this.untypTalents = untyp_talents.map(e => `TAL_${e}`);
		this.talents = fixIDs<number>(talents, 'TAL');
	}
}
