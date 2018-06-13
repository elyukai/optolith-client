import * as Data from '../types/data.d';
import { Maybe, OrderedMap, Record } from './dataUtils';

export const getActiveSkillEntries = (
  state: Record<Data.HeroDependent>,
  domain: 'spells' | 'liturgicalChants',
): OrderedMap<string, Record<Data.ActivatableSkillDependent>> =>
  Maybe.fromJust(state.lookup(domain))
    .filter(e => e.get('active'));

export const countActiveSkillEntries = (
  state: Record<Data.HeroDependent>,
  domain: 'spells' | 'liturgicalChants',
): number =>
  getActiveSkillEntries(state, domain).size();
