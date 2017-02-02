import Activatable from './Activatable';
import * as Categories from '../constants/Categories';

export default class SpecialAbility extends Activatable {
	readonly category: string = Categories.SPECIAL_ABILITIES;

	constructor(args: RawSpecialAbility) {
		super(args);
	}
}
