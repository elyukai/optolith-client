import * as Data from '../types/data.d';

export function createAttributeDependent(
  id: string,
  value = 8,
  mod = 0,
  dependencies: Data.AttributeInstanceDependency[] = [],
): Data.AttributeDependent {
  return {
    id,
    value,
    mod,
    dependencies,
  };
}

export function createActivatableDependent(
  id: string,
  active: Data.ActiveObject[] = [],
  dependencies: Data.ActivatableInstanceDependency[] = [],
): Data.ActivatableDependent {
  return {
    id,
    active,
    dependencies,
  };
}

export function createDependentSkill(
  id: string,
  value = 0,
  dependencies: Data.TalentInstanceDependency[] = [],
): Data.SkillDependent {
  return {
    id,
    value,
    dependencies,
  };
}

export function createActivatableDependentSkill(
  id: string,
  value = 0,
  active = false,
  dependencies: Data.SpellInstanceDependency[] = [],
): Data.ActivatableSkillDependent {
  return {
    id,
    value,
    active,
    dependencies,
  };
}
