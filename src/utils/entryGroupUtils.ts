import R from 'ramda';
import { WikiState } from '../reducers/wikiReducer';
import * as Data from '../types/data.d';
import { getAllEntriesByGroup } from './heroStateUtils';
import { isActive } from './isActive';

export const getActiveGroupEntries = (
  wiki: WikiState,
  state: Data.HeroDependent,
  ...groups: number[],
): Data.ActivatableDependent[] => R.pipe(
  (state: Data.HeroDependent) => getAllEntriesByGroup(
    wiki.specialAbilities,
    state.specialAbilities,
    ...groups,
  ),
  all => R.filter(e => isActive(e), all),
)(state);

export const countActiveGroupEntries = (
  wiki: WikiState,
  state: Data.HeroDependent,
  ...groups: number[],
): number => R.pipe(
  (state: Data.HeroDependent) => getActiveGroupEntries(wiki, state, ...groups),
  active => active.length,
)(state);

export const hasActiveGroupEntry = (
  wiki: WikiState,
  state: Data.HeroDependent,
  ...groups: number[],
): boolean => R.pipe(
  (state: Data.HeroDependent) => getAllEntriesByGroup(
    wiki.specialAbilities,
    state.specialAbilities,
    ...groups,
  ),
  all => R.any(e => isActive(e), all),
)(state);
