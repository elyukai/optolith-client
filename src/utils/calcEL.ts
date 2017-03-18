import ELStore from '../stores/ELStore';

export default (ap: number): string => {
	const els = ELStore.getAll();
	const ids = [];
	const tiers = [];

	for (const id in els) {
		if (els.hasOwnProperty(id)) {
			ids.push(id);
			tiers.push(els[id].ap);
		}
	}

	let index = ids.length - 1;

	tiers.some((e, i) => {
		if (e > ap) {
			index = i - 1;
			return true;
		}
		return false;
	});

	return ids[index];
};
