import Activatable from './Activatable';
import * as Categories from '../constants/Categories';

export default class Advantage extends Activatable implements AdvantageInstance {
	readonly category = Categories.ADVANTAGES;

	constructor(args: RawAdvantage) {
		super(args);
	}
}
