import Core from './Core';
import { fixIDs } from '../DataUtils';
import Categories from '../../constants/Categories';

export default class Culture extends Core {
	
	constructor(args) {
		super(args);
		let {
			ap,
			lang,
			literacy,
			social,
			typ_prof,
			typ_adv,
			typ_dadv,
			untyp_adv,
			untyp_dadv,
			typ_talents,
			untyp_talents,
			talents
		} = args;

		this.ap = ap;

		this.languages = lang;
		this.scripts = literacy;
		this.social = social;
		
		this.typ_prof = typ_prof.map(e => `P_${e}`);

		this.typ_adv = typ_adv.map(e => `ADV_${e}`);
		this.typ_dadv = typ_dadv.map(e => `DISADV_${e}`);
		this.untyp_adv = untyp_adv.map(e => `ADV_${e}`);
		this.untyp_dadv = untyp_dadv.map(e => `DISADV_${e}`);
		this.untyp_dadv = untyp_dadv.map(e => `DISADV_${e}`);

		this.typ_talents = typ_talents.map(e => `TAL_${e}`);
		this.untyp_talents = untyp_talents.map(e => `TAL_${e}`);
		this.talents = fixIDs(talents, 'TAL');

		this.category = Categories.CULTURES;
	}

	static socialstatus = [ 'Unfrei', 'Frei', 'Niederadel', 'Adel', 'Hochadel' ];
}
