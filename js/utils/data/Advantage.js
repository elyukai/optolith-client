import Activatable from './Activatable';
import Categories from '../../constants/Categories';

export default class Advantage extends Activatable {
	
	constructor(args) {
		super(args);
		this.category = Categories.ADVANTAGES;
	}
}
