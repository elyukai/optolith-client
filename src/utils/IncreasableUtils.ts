export function set(obj: IncreasableInstance, value: number): IncreasableInstance {
	return ({ ...obj, value });
}

export function add(obj: IncreasableInstance, value: number): IncreasableInstance {
	return ({ ...obj, value: obj.value + value });
}

export function remove(obj: IncreasableInstance, value: number): IncreasableInstance {
	return ({ ...obj, value: obj.value - value });
}

export function addPoint(obj: IncreasableInstance): IncreasableInstance {
	return ({ ...obj, value: obj.value + 1 });
}

export function removePoint(obj: IncreasableInstance): IncreasableInstance {
	return ({ ...obj, value: obj.value - 1 });
}
