import { lt } from 'semver';
import { Hero } from '../types/data.d';

export const currentVersion = '0.48.1';

export function convertHero(hero: Hero) {
	const entry = { ...hero };
	// if (lt(entry.clientVersion, '0.48.0')) {
	// 	for (const id in entry.activatable) {
	// 		if (entry.activatable.hasOwnProperty(id)) {

	// 		}
	// 	}
	// 	entry.clientVersion = '0.48.0';
	// }
	return entry;
}
