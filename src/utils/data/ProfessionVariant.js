import Core from './Core';
import { fixIDs } from '../DataUtils';
import Categories from '../../constants/Categories';

export default class ProfessionVariant extends Core {
	
	constructor(args) {
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
