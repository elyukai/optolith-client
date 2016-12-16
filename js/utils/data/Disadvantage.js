import Activatable from './Activatable';
import Categories from '../../constants/Categories';

export default class Disadvantage extends Activatable {
	
	constructor(args) {
		super(args);
		this.category = Categories.DISADVANTAGES;
	}
}
