import Increasable from './Increasable';

export default class Skill extends Increasable {
	ic: number;
	readonly gr: number;

	constructor({ skt, gr, ...args }: RawLiturgy | RawSpell | RawTalent) {
		super(args);
		this.ic = skt;
		this.gr = gr;
	}
}
