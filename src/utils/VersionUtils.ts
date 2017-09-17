import { lt } from 'semver';
import { Hero } from '../types/data.d';

export const currentVersion = '0.49.5';

export function convertHero(hero: Hero) {
  const entry = { ...hero };
  if (lt(entry.clientVersion, '0.48.5')) {
    // entry.clientVersion = '0.48.5';
  }
  return entry;
}
