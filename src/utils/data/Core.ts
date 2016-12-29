export interface CoreInstance {
	id: string;
	name: string;
}

export interface CoreArguments {
	id: string;
	name: string;
}

export default class Core implements CoreInstance {

	id: string;
	name: string;

	constructor(args: CoreArguments) {
		const { id, name } = args;
		this.id = id;
		this.name = name;
	}
}
