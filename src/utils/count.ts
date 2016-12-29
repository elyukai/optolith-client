export default (arr: string[] | number[], keepValues: boolean = false) => {
	const counter = new Map();
	if (keepValues) {
		arr.forEach(e => {
			if (!counter.has(e[0])) {
				counter.set(e[0], [e[1]]);
			} else {
				counter.set(e[0], counter.get(e[0]).push(e[1]));
			}
		});
	} else {
		arr.forEach(e => {
			if (!counter.has(e[0])) {
				counter.set(e[0], 1);
			} else {
				counter.set(e[0], counter.get(e[0]) + 1);
			}
		});
	}
	return counter;
};
