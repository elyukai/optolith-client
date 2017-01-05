export default <TRaw, TInstance>(rawObject: { [id: string]: TRaw }, DataClass: any) => {
	const byId: { [id: string]: TInstance } = {};
	const allIds: string[] = [];
	for (const id in rawObject) {
		byId[id] = new DataClass(rawObject[id]);
		allIds.push(id);
	}
	return { byId, allIds };
};
