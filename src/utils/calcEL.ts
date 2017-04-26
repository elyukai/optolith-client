import { ELStore } from '../stores/ELStore';

export function calcElIdNumber(ap: number): number {
	const els = ELStore.getAll();
	const tiers = [];

	for (const id in els) {
		if (els.hasOwnProperty(id)) {
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

	return index + 1;
}

export function calcEL(ap: number): string {
	const els = ELStore.getAll();
	const ids = [];

	for (const id in els) {
		if (els.hasOwnProperty(id)) {
			ids.push(id);
		}
	}

	return ids[calcElIdNumber(ap) - 1];
}
