/**
 * Filter and count `ActivatableSkill` entries.
 *
 * @file src/utils/activatableSkillUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import * as Data from '../../types/data';
import { Maybe, OrderedMap, Record } from '../dataUtils';

export const getActiveSkillEntries = (
  state: Record<Data.HeroDependent>,
  domain: 'spells' | 'liturgicalChants',
): OrderedMap<string, Record<Data.ActivatableSkillDependent>> =>
  Maybe.fromJust (state.lookup (domain))
    .filter (e => e.get ('active'));

export const countActiveSkillEntries = (
  state: Record<Data.HeroDependent>,
  domain: 'spells' | 'liturgicalChants',
): number =>
  getActiveSkillEntries (state, domain).size ();
