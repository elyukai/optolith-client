import * as Data from '../types/data.d';
import { Record } from './dataUtils';

export function isAttributeDependentUnused(
  entry: Record<Data.AttributeDependent>
): boolean {
  return entry.get('value') === 8 &&
    entry.get('mod') === 0 &&
    entry.get('dependencies').null();
}

export function isActivatableDependentUnused(
  entry: Record<Data.ActivatableDependent>
): boolean {
  return entry.get('active').null() &&
    entry.get('dependencies').null();
}

export function isDependentSkillUnused(
  entry: Record<Data.SkillDependent>
): boolean {
  return entry.get('value') === 0 &&
    entry.get('dependencies').null();
}

export function isActivatableDependentSkillUnused(
  entry: Record<Data.ActivatableSkillDependent>
): boolean {
  return entry.get('value') === 0 &&
    entry.get('active') === false &&
    entry.get('dependencies').null();
}
