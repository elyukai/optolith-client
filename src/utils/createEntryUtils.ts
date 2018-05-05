import * as Data from '../types/data.d';

interface AttributeDependentOptions {
  value?: number;
  mod?: number;
  dependencies?: Data.AttributeInstanceDependency[];
}

export function createAttributeDependent(
  id: string,
  options: AttributeDependentOptions = {},
): Data.AttributeDependent {
  const {
    value = 8,
    mod = 0,
    dependencies = [],
  } = options;

  return {
    id,
    value,
    mod,
    dependencies,
  };
}

interface ActivatableDependentOptions {
  active?: Data.ActiveObject[];
  dependencies?: Data.ActivatableInstanceDependency[];
}

export function createActivatableDependent(
  id: string,
  options: ActivatableDependentOptions = {},
): Data.ActivatableDependent {
  const {
    active = [],
    dependencies = [],
  } = options;

  return {
    id,
    active,
    dependencies,
  };
}

interface DependentSkillOptions {
  value?: number;
  dependencies?: Data.TalentInstanceDependency[];
}

export function createDependentSkill(
  id: string,
  options: DependentSkillOptions = {},
): Data.SkillDependent {
  const {
    value = 0,
    dependencies = [],
  } = options;

  return {
    id,
    value,
    dependencies,
  };
}

interface ActiveActivatableDependentSkillOptions {
  active?: boolean;
  dependencies?: Data.SpellInstanceDependency[];
}

interface ValueActivatableDependentSkillOptions {
  value?: number;
  dependencies?: Data.SpellInstanceDependency[];
}

type ActivatableDependentSkillOptions =
  ActiveActivatableDependentSkillOptions |
  ValueActivatableDependentSkillOptions;

type JoinedActivatableDependentSkillOptions =
  ActiveActivatableDependentSkillOptions &
  ValueActivatableDependentSkillOptions;

export function createActivatableDependentSkill(
  id: string,
  options: ActivatableDependentSkillOptions = {},
): Data.ActivatableSkillDependent {
  const {
    active,
    value = 0,
    dependencies = [],
  } = options as JoinedActivatableDependentSkillOptions;

  if (value > 0) {
    if (active === false) {
      console.warn('createActivatableDependentSkill called with active === false, but value > 0');
    }

    return {
      id,
      value,
      active: true,
      dependencies,
    };
  }
  else {
    const {
      active = false,
    } = options as JoinedActivatableDependentSkillOptions;

    return {
      id,
      value: 0,
      active,
      dependencies,
    };
  }
}
