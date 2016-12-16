import Activatable from './Activatable';
import Categories from '../../constants/Categories';

export default class SpecialAbilities extends Activatable {
	
	constructor(args) {
		super(args);
		this.category = Categories.SPECIAL_ABILITIES;
	}
}
