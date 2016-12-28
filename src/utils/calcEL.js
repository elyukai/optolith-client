import ELStore from '../stores/ELStore';

export default ap => {
	const els = ELStore.getAll();
	let ids = [];
	let tiers = [];
	for (let id in els) {
		ids.push(id);
		tiers.push(els[id].ap);
	}

	let index = ids.length - 1;

	tiers.some((e,i) => {
		if (e > ap) {
			index = i - 1;
			return true;
		}
		return false;
	});

	return ids[index];
};
