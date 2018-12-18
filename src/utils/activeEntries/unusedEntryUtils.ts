import * as Data from '../../types/data';
import { Record } from './dataUtils';

export const isAttributeDependentUnused =
  (entry: Record<Data.AttributeDependent>): boolean =>
    entry .get ('value') === 8
    && entry .get ('mod') === 0
    && entry .get ('dependencies') .null ();

export const isActivatableDependentUnused =
  (entry: Record<Data.ActivatableDependent>): boolean =>
    entry .get ('active') .null () && entry .get ('dependencies') .null ();

export const isDependentSkillUnused =
  (entry: Record<Data.SkillDependent>): boolean =>
    entry .get ('value') === 0 && entry .get ('dependencies') .null ();

export const isActivatableDependentSkillUnused =
  (entry: Record<Data.ActivatableSkillDependent>): boolean =>
    entry .get ('value') === 0
    && entry .get ('active') === false
    && entry .get ('dependencies') .null ();
