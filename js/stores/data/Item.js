import Core from './Core';

export default class Item extends Core {
	constructor(args) {
		super(args);
		let { price, weight } = args;
		this.price = price;
		this.weight = weight;
	}
}
