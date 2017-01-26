export default (arr: (string | number)[] | [string, string | number][], keepValues: boolean = false) => {
	if (keepValues) {
		const counter = new Map<string, (string | number)[]>();
		(arr as [string, string | number][]).forEach(e => {
			if (!counter.has(e[0])) {
				counter.set(e[0], [e[1]]);
			} else {
				counter.set(e[0], [ ...counter.get(e[0]), e[1]]);
			}
		});
		return counter;
	} else {
		const counter = new Map<string | number, number>();
		(arr as (string | number)[]).forEach(e => {
			if (!counter.has(e)) {
				counter.set(e, 1);
			} else {
				counter.set(e, counter.get(e) + 1);
			}
		});
		return counter;
	}
};
