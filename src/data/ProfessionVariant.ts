import { fixIDs } from '../utils/DataUtils';
import * as Categories from '../constants/Categories';
import Core from './CoreGenderExtended';

export default class ProfessionVariant extends Core implements ProfessionVariantInstance {
	readonly ap: number;
	readonly dependencies: (string | number | boolean)[][];
	readonly requires: (string | number | boolean)[][];
	readonly selections: (string | string[] | number[])[][];
	readonly specialAbilities: (string | number | boolean)[][];
	readonly combatTechniques: (string | number)[][];
	readonly talents: (string | number)[][];
	readonly category = Categories.PROFESSION_VARIANTS;

	constructor({ ap, pre_req, req, sel, sa, combattech, talents, ...other }: RawProfessionVariant) {
		super(other);
		this.ap = ap;

		this.dependencies = pre_req;
		this.requires = req;
		this.selections = sel;

		this.specialAbilities = fixIDs<number | boolean>(sa, 'SA');
		this.combatTechniques = fixIDs<number>(combattech, 'CT');
		this.talents = fixIDs<number>(talents, 'TAL');
	}
}
