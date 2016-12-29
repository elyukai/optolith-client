import Activatable, { ActivatableArguments, ActivatableInstance } from './Activatable';
import Categories from '../../constants/Categories';

export interface AdvantageInstance extends ActivatableInstance {
	readonly category: string;
}

export interface AdvantageArguments extends ActivatableArguments {}

export default class Advantage extends Activatable {

	readonly category: string = Categories.ADVANTAGES;
	
	constructor(args: AdvantageArguments) {
		super(args);
	}
}
