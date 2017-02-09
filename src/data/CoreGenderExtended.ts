export default class Core {
	readonly id: string;
	readonly name: string | { m: string; f: string; };

	constructor(args: { id: string; name: string | { m: string; f: string; }; }) {
		const { id, name } = args;
		this.id = id;
		this.name = name;
	}
}
