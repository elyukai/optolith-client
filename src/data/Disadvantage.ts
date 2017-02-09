import Activatable from './Activatable';
import * as Categories from '../constants/Categories';

export default class Disadvantage extends Activatable implements DisadvantageInstance {
	readonly category = Categories.DISADVANTAGES;

	constructor(args: RawDisadvantage) {
		super(args);
	}
}
