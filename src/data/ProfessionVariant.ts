import { fixIDs } from '../utils/DataUtils';
import * as Categories from '../constants/Categories';
import Core from './CoreGenderExtended';

export default class ProfessionVariant extends Core implements ProfessionVariantInstance {
	readonly ap: number;
	readonly dependencies: ProfessionDependencyObject[];
	readonly requires: RequirementObject[];
	readonly selections: ProfessionSelections;
	readonly specialAbilities: RequirementObject[];
	readonly combatTechniques: [string, number][];
	readonly talents: [string, number][];
	readonly category = Categories.PROFESSION_VARIANTS;

	constructor({ ap, pre_req, req, sel, sa, combattech, talents, ...other }: RawProfessionVariant) {
		super(other);
		this.ap = ap;

		this.dependencies = pre_req;
		this.requires = req;
		this.selections = sel;

		this.specialAbilities = sa;
		this.combatTechniques = fixIDs<number>(combattech, 'CT') as [string, number][];
		this.talents = fixIDs<number>(talents, 'TAL') as [string, number][];
	}
}
