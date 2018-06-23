import * as Data from '../types/data.d';
import { Record, List } from './dataUtils';

interface AttributeDependentOptions {
  value?: number;
  mod?: number;
  dependencies?: Data.AttributeInstanceDependency[];
}

export function createAttributeDependent(
  id: string,
  options: AttributeDependentOptions = {},
): Record<Data.AttributeDependent> {
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
  active?: List<Record<Data.ActiveObject>>;
  dependencies?: List<Data.ActivatableDependency>;
}

export function createActivatableDependent(
  id: string,
  options: ActivatableDependentOptions = {},
): Record<Data.ActivatableDependent> {
  const {
    active = List.of<Record<Data.ActiveObject>>(),
    dependencies = List.of<Data.ActivatableDependency>(),
  } = options;

  return Record.of<Data.ActivatableDependent>({
    id,
    active,
    dependencies,
  });
}

interface DependentSkillOptions {
  value?: number;
  dependencies?: Data.TalentInstanceDependency[];
}

export function createDependentSkill(
  id: string,
  options: DependentSkillOptions = {},
): Record<Data.SkillDependent> {
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
): Record<Data.ActivatableSkillDependent> {
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
