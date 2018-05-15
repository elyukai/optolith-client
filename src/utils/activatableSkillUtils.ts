import R from 'ramda';
import * as Data from '../types/data.d';
import { convertMapToValues } from './collectionUtils';

export const getActiveSkillEntries = (
  state: Data.HeroDependent,
  domain: 'spells' | 'liturgicalChants',
): Data.ActivatableSkillDependent[] => R.pipe(
  (state: Data.HeroDependent) => state[domain],
  convertMapToValues,
  all => R.filter(e => e.active, all),
)(state);

export const countActiveSkillEntries = (
  state: Data.HeroDependent,
  domain: 'spells' | 'liturgicalChants',
): number => R.pipe(
  (state: Data.HeroDependent) => getActiveSkillEntries(state, domain),
  active => active.length,
)(state);
