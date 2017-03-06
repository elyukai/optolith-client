export const set = (obj: IncreasableInstance, value: number): IncreasableInstance => ({ ...obj, value });

export const add = (obj: IncreasableInstance, value: number): IncreasableInstance => ({ ...obj, value: obj.value + value });

export const remove = (obj: IncreasableInstance, value: number): IncreasableInstance => ({ ...obj, value: obj.value - value });

export const addPoint = (obj: IncreasableInstance): IncreasableInstance => ({ ...obj, value: obj.value + 1 });

export const removePoint = (obj: IncreasableInstance): IncreasableInstance => ({ ...obj, value: obj.value - 1 });
