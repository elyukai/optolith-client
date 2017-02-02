import Activatable from './Activatable';
import * as Categories from '../constants/Categories';

export default class Advantage extends Activatable {
	readonly category: string = Categories.ADVANTAGES;

	constructor(args: RawAdvantage) {
		super(args);
	}
}
