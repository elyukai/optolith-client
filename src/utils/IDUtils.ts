export function getNewId(keys: string[]) {
	return keys.reduce((n, id) => Math.max(Number.parseInt(id.split('_')[1]), n), 0) + 1;
}
