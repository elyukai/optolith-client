import Activatable, { ActivatableArguments, ActivatableInstance } from './Activatable';
import Categories from '../../constants/Categories';

export interface SpecialAbilityInstance extends ActivatableInstance {
	readonly category: string;
}

export interface SpecialAbilityArguments extends ActivatableArguments {}

export default class SpecialAbility extends Activatable {

	readonly category: string = Categories.SPECIAL_ABILITIES;
	
	constructor(args) {
		super(args);
	}
}
