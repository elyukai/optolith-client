import Increasable, { IncreasableArguments, IncreasableInstance } from './Increasable';

export interface SkillInstance extends IncreasableInstance {
	ic: number;
	readonly gr: number;
}

export interface SkillArguments extends IncreasableArguments {
	skt: number;
	gr: number;
}

export default class Skill extends Increasable implements SkillInstance {

	ic: number;
	readonly gr: number;
	
	constructor({ skt, gr, ...args }: SkillArguments) {
		super(args);
		this.ic = skt;
		this.gr = gr;
	}
}
