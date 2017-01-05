export interface CoreInstance {
	readonly id: string;
	readonly name: string;
}

export interface CoreArguments {
	id: string;
	name: string;
}

export default class Core implements CoreInstance {

	readonly id: string;
	readonly name: string;

	constructor(args: CoreArguments) {
		const { id, name } = args;
		this.id = id;
		this.name = name;
	}
}
