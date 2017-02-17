import Core from './Core';
import { fixIDs } from '../utils/DataUtils';
import * as Categories from '../constants/Categories';

export default class Culture extends Core implements CultureInstance {
	static socialstatus = [ 'Unfrei', 'Frei', 'Niederadel', 'Adel', 'Hochadel' ];
	readonly ap: number;
	readonly languages: number[];
	readonly scripts: number[];
	readonly socialTiers: number[];
	readonly typicalProfessions: string[];
	readonly typicalAdvantages: string[];
	readonly typicalDisadvantages: string[];
	readonly untypicalAdvantages: string[];
	readonly untypicalDisadvantages: string[];
	readonly typicalTalents: string[];
	readonly untypicalTalents: string[];
	readonly talents: [string, number][];
	readonly category = Categories.CULTURES;

	constructor({ ap, lang, literacy, social, typ_prof, typ_adv, typ_dadv, untyp_adv, untyp_dadv, typ_talents, untyp_talents, talents, ...args }: RawCulture) {
		super(args);

		this.ap = ap;

		this.languages = lang;
		this.scripts = literacy;
		this.socialTiers = social;

		this.typicalProfessions = typ_prof.map(e => `P_${e}`);

		this.typicalAdvantages = typ_adv.map(e => `ADV_${e}`);
		this.typicalDisadvantages = typ_dadv.map(e => `DISADV_${e}`);
		this.untypicalAdvantages = untyp_adv.map(e => `ADV_${e}`);
		this.untypicalDisadvantages = untyp_dadv.map(e => `DISADV_${e}`);

		this.typicalTalents = typ_talents.map(e => `TAL_${e}`);
		this.untypicalTalents = untyp_talents.map(e => `TAL_${e}`);
		this.talents = fixIDs<number>(talents, 'TAL') as [string, number][];
	}
}
