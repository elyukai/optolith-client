import Increasable from './Increasable';

export default class Skill extends Increasable {
	constructor(args) {
		super(args);
		let { check, skt, gr } = args;
		this.check = check;
		this.ic = skt;
		this.gr = gr;
	}
}
