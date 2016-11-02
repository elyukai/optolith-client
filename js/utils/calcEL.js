import ELStore from '../stores/ELStore';

export default ap => {
	const els = ELStore.getAll();
	let ids = [];
	let tiers = [];
	for (let id in els) {
		ids.push(id);
		tiers.push(els[id].ap);
	}

	for (let i = 0; i < tiers.length; i++) {
		if (ap <= tiers[i])
			return ids[i];
	}
};
