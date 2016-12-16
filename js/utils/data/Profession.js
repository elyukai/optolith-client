import Core from './Core';
import { fixIDs } from '../DataUtils';
import Categories from '../../constants/Categories';

export default class Profession extends Core {
	
	constructor(args) {
		super(args);
		let {
			subname,
			ap,
			pre_req,
			req,
			sel,
			sa,
			combattech,
			talents,
			spells,
			chants,
			typ_adv,
			typ_dadv,
			untyp_adv,
			untyp_dadv,
			vars
		} = args;

		this.subname = subname;

		this.ap = ap;

		this.reqs_p = pre_req;
		this.reqs = req;
		this.sel = sel.map(e => {
			if (e[0] === 'ct') {
				e[3] = e[3].split(',').map(e => `CT_${e}`);
				return e;
			}
			else if (e[0] === 'cantrips') {
				e[2] = e[2].split(',').map(e => parseInt(e));
				return e;
			}
			return e;
		});

		this.specialabilities = fixIDs(sa, 'SA');
		this.combattechniques = fixIDs(combattech, 'CT');
		this.talents = fixIDs(talents, 'TAL');
		this.spells = fixIDs(spells, 'SPELL');
		this.liturgies = fixIDs(chants, 'LITURGY');
		
		this.typ_adv = typ_adv.map(e => `ADV_${e}`);
		this.typ_dadv = typ_dadv.map(e => `DISADV_${e}`);
		this.untyp_adv = untyp_adv.map(e => `ADV_${e}`);
		this.untyp_dadv = untyp_dadv.map(e => `DISADV_${e}`);

		this.variants = vars.map(e => `PV_${e}`);

		this.category = Categories.PROFESSIONS;
	}
}
