import R from 'ramda';
import { WikiState } from '../reducers/wikiReducer';
import * as Data from '../types/data.d';
import { getAllEntriesByGroup } from './heroStateUtils';
import { isActive } from './isActive';

type CountActiveStyles =
  (wiki: WikiState, ...groups: number[]) =>
    (state: Data.HeroDependent) => number;

export const countActiveGroupEntries: CountActiveStyles = (wiki, ...groups) => R.pipe(
  state => getAllEntriesByGroup<Data.ActivatableDependent>(
    wiki.specialAbilities,
    ...groups,
  )(state.specialAbilities),
  all => R.filter(e => isActive(e), all),
  active => active.length,
);

type HasActiveStyle =
  (wiki: WikiState, ...groups: number[]) =>
    (state: Data.HeroDependent) => boolean;

export const hasActiveGroupEntry: HasActiveStyle = (wiki, ...groups) => R.pipe(
  state => getAllEntriesByGroup<Data.ActivatableDependent>(
    wiki.specialAbilities,
    ...groups,
  )(state.specialAbilities),
  all => R.find(e => isActive(e), all),
  isObject,
);
