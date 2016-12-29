import Activatable, { ActivatableArguments, ActivatableInstance } from './Activatable';
import Categories from '../../constants/Categories';

export interface DisadvantageInstance extends ActivatableInstance {
	readonly category: string;
}

export interface DisadvantageArguments extends ActivatableArguments {}

export default class Disadvantage extends Activatable implements DisadvantageInstance {

	readonly category: string = Categories.DISADVANTAGES;
	
	constructor(args: DisadvantageArguments) {
		super(args);
	}
}
