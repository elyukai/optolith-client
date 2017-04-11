import ELStore from '../stores/ELStore';

export default function calcEL(ap: number): string {
	const els = ELStore.getAll();
	const ids = [];
	const tiers = [];

	for (const id in els) {
		if (els.hasOwnProperty(id)) {
			ids.push(id);
			tiers.push(els[id].ap);
		}
	}

	let index = tiers.findIndex(e => e > ap);
	if (index > -1) {
		index -= 1;
	}
	else {
		index = tiers.length;
	}

	return ids[index];
}
