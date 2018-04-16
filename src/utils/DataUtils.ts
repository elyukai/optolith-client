export const fixIDs = <T>(list: Array<Array<T | any>>, prefix: string, index: number = 0): (T | string)[][] => {
	return list.map(e => {
		e[index] = `${prefix}_${e[index]}`;
		return e;
	});
};
