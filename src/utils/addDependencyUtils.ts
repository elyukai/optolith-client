import { Categories } from '../constants/Categories';
import * as Data from "../types/data.d";
import { ValueOptionalDependency } from '../types/reusable.d';
import { addToArray } from './collectionUtils';
import * as CreateDependencyObjectUtils from './createDependencyObjectUtils';
import { getHeroStateListItem, setHeroListStateItem } from './heroStateUtils';
import { getCategoryById } from './IDUtils';

const addDependency = (obj: Data.Dependent) => (add: any): Data.Dependent => ({
  ...obj,
  dependencies: addToArray(obj.dependencies, add),
});

export function addAttributeDependency(
  state: Data.HeroDependent,
  id: string,
  value: number,
): Data.HeroDependent {
  const entry = getHeroStateListItem<Data.AttributeDependent>(state, id);

  if (entry) {
    return setHeroListStateItem(
      state,
      id,
      addDependency(entry)(value),
    );
  }

  return setHeroListStateItem(
    state,
    id,
    CreateDependencyObjectUtils.createAttributeDependent(id, 8, 0, [value]),
  );
}

export function addIncreasableDependency(
  state: Data.HeroDependent,
  id: string,
  value: number | ValueOptionalDependency,
): Data.HeroDependent {
  const entry = getHeroStateListItem<Data.ExtendedSkillDependent>(state, id);

  if (entry) {
    return setHeroListStateItem(
      state,
      id,
      addDependency(entry)(value),
    );
  }

  const category = getCategoryById(id);

  if (category === Categories.LITURGIES || category === Categories.SPELLS) {
    return setHeroListStateItem(
      state,
      id,
      CreateDependencyObjectUtils.createActivatableDependentSkill(id, 0, false, [value]),
    );
  }

  return setHeroListStateItem(
    state,
    id,
    CreateDependencyObjectUtils.createDependentSkill(id, 0, [value]),
  );
}

export function addActivatableDependency(
  state: Data.HeroDependent,
  id: string,
  value: Data.ActivatableInstanceDependency,
): Data.HeroDependent {
  const entry = getHeroStateListItem<Data.ActivatableDependent>(state, id);

  if (entry) {
    return setHeroListStateItem(
      state,
      id,
      addDependency(entry)(value),
    );
  }

  return setHeroListStateItem(
    state,
    id,
    CreateDependencyObjectUtils.createActivatableDependent(id, [], [value]),
  );
}
