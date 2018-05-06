import * as Data from '../types/data.d';

export function isAttributeDependentUnused(entry: Data.AttributeDependent): boolean {
  const { value, mod, dependencies } = entry;
  return value === 8 && mod === 0 && dependencies.length === 0;
}

export function isActivatableDependentUnused(entry: Data.ActivatableDependent): boolean {
  const { active, dependencies } = entry;
  return active.length === 0 && dependencies.length === 0;
}

export function isDependentSkillUnused(entry: Data.SkillDependent): boolean {
  const { value, dependencies } = entry;
  return value === 0 && dependencies.length === 0;
}

export function isActivatableDependentSkillUnused(entry: Data.ActivatableSkillDependent): boolean {
  const { value, active, dependencies } = entry;
  return value === 0 && active === false && dependencies.length === 0;
}
