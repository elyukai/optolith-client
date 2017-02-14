import Activatable from './Activatable';
import * as Categories from '../constants/Categories';

export default class SpecialAbility extends Activatable implements SpecialAbilityInstance {
	readonly category = Categories.SPECIAL_ABILITIES;

	constructor(args: RawSpecialAbility & { tiers: null; }) {
		super(args);
	}
}
