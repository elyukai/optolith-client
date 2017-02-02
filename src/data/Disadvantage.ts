import Activatable from './Activatable';
import * as Categories from '../constants/Categories';

export default class Disadvantage extends Activatable {
	readonly category: string = Categories.DISADVANTAGES;

	constructor(args: RawDisadvantage) {
		super(args);
	}
}
