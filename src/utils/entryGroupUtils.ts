import * as Data from '../types/data';
import { WikiAll } from '../types/wiki';
import { List, Record } from './dataUtils';
import { getAllEntriesByGroup } from './heroStateUtils';
import { isActive } from './isActive';

export const getActiveGroupEntries = (
  wiki: Record<WikiAll>,
  state: Record<Data.HeroDependent>,
  ...groups: number[]
): List<Record<Data.ActivatableDependent>> =>
  getAllEntriesByGroup (
    wiki.get ('specialAbilities'),
    state.get ('specialAbilities'),
    ...groups,
  )
    .filter (isActive);

export const countActiveGroupEntries = (
  wiki: Record<WikiAll>,
  state: Record<Data.HeroDependent>,
  ...groups: number[]
): number =>
  getActiveGroupEntries (wiki, state, ...groups).length ();

export const hasActiveGroupEntry = (
  wiki: Record<WikiAll>,
  state: Record<Data.HeroDependent>,
  ...groups: number[]
): boolean =>
  getAllEntriesByGroup (
    wiki.get ('specialAbilities'),
    state.get ('specialAbilities'),
    ...groups,
  )
    .any (isActive);
